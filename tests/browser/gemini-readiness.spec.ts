import { installCollectorFixture } from '../fixtures/chrome/collector';
import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { readGeminiClientCapability } from '../../src/infrastructure/providers/gemini/client-capability';
import {
  geminiHeaderObservationPage,
  geminiReadinessPage,
  geminiClientReadinessPage,
} from '../fixtures/providers/gemini-readiness';

async function command(
  page: Page,
  message: object,
  sender = 'chrome-extension://fixture/sidepanel.html',
) {
  return page.evaluate(
    ({ message, sender }) =>
      new Promise<{ ok: boolean; data?: any; error?: string }>((resolve) => {
        if ((message as any).type === 'send')
          (window as any).__fixtureConnectCollector((message as any).id);
        (window as any).__bridgeHandler(message, { id: 'fixture', url: sender }, resolve);
        if (sender !== 'chrome-extension://fixture/sidepanel.html')
          setTimeout(() => resolve({ ok: false }), 50);
      }),
    { message, sender },
  );
}
async function setup(page: Page, protection: boolean | undefined) {
  await page.route('https://gemini.google.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: geminiReadinessPage(protection) }),
  );
  await page.goto('https://gemini.google.com/app');
  await page.evaluate(() => {
    (window as any).chrome = {
      runtime: {
        id: 'fixture',
        getURL: (s: string) => `chrome-extension://fixture/${s}`,
        onMessage: {
          addListener: (h: unknown) => {
            (window as any).__bridgeHandler = h;
          },
        },
      },
    };
  });
  await page.evaluate(installCollectorFixture);
  const bridge = await page.addScriptTag({ path: path.resolve('.output/chrome-mv3/bridge.js') });
  // Production ISOLATED injection leaves no provider DOM script node.
  await bridge.evaluate((element) => element.parentNode?.removeChild(element));
  const snap = (await command(page, { type: 'snapshot' })).data;
  return { documentId: snap.documentId, url: snap.url };
}
test('Gemini bridge reads only the model before a pure page projection, without generation or credential output', async ({
  page,
  context,
}) => {
  const target = await setup(page, true);
  const other = await context.newPage();
  await other.goto('about:blank');
  await other.bringToFront();
  expect(
    (await command(page, { type: 'startGeminiReadiness', id: 'readiness', ...target })).ok,
  ).toBe(true);
  await expect
    .poll(
      async () =>
        (await command(page, { type: 'pollGeminiReadiness', id: 'readiness' })).data?.result?.model,
    )
    .toBe('Automatic fixture');
  const result = await command(page, { type: 'pollGeminiReadiness', id: 'readiness' });
  expect(result.data.result).toEqual({
    model: 'Automatic fixture',
  });
  expect(
    (await command(page, { type: 'finishGeminiReadiness', id: 'readiness', ...target })).ok,
  ).toBe(true);
  expect((await command(page, { type: 'pollGeminiReadiness', id: 'readiness' })).data.status).toBe(
    'done',
  );
  expect(JSON.stringify(result)).not.toMatch(/SYNTHETIC_PRIVATE|fixture-mode-key/);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
  expect(await page.locator('[role="menu"]').count()).toBe(0);
  expect(await other.evaluate(() => document.hasFocus())).toBe(true);
  expect(
    (await command(page, { type: 'startGeminiReadiness', id: 'readiness', ...target })).ok,
  ).toBe(false);
});
test('Gemini readiness rejects foreign senders, stale documents, drafts and proxy fields without network', async ({
  page,
}) => {
  const target = await setup(page, true);
  expect(
    (
      await command(
        page,
        { type: 'startGeminiReadiness', id: 'foreign', ...target },
        'https://gemini.google.com/app',
      )
    ).ok,
  ).toBe(false);
  expect(
    (
      await command(page, {
        type: 'startGeminiReadiness',
        id: 'stale',
        ...target,
        documentId: 'wrong',
      })
    ).ok,
  ).toBe(false);
  expect(
    (
      await command(page, {
        type: 'startGeminiReadiness',
        id: 'proxy',
        ...target,
        headers: { at: 'SYNTHETIC_PRIVATE_MARKER' },
      })
    ).ok,
  ).toBe(false);
  await page.locator('.ql-editor').fill('Existing user draft');
  expect((await command(page, { type: 'startGeminiReadiness', id: 'draft', ...target })).ok).toBe(
    true,
  );
  await expect
    .poll(
      async () => (await command(page, { type: 'pollGeminiReadiness', id: 'draft' })).data?.status,
    )
    .toBe('error');
  expect(await page.locator('.ql-editor').innerText()).toBe('Existing user draft');
  expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
});

test('readiness reports an absent required Gemini model trigger without sending', async ({
  page,
}) => {
  const target = await setup(page, true);
  await page
    .locator('[data-test-id="bard-mode-menu-button"]')
    .evaluate((button) => button.remove());
  expect((await command(page, { type: 'snapshot' })).data.composer).toBe(true);
  expect(
    (await command(page, { type: 'startGeminiReadiness', id: 'absent-trigger', ...target })).ok,
  ).toBe(true);
  await expect
    .poll(
      async () =>
        (await command(page, { type: 'pollGeminiReadiness', id: 'absent-trigger' })).data?.status,
    )
    .toBe('error');
  const progress = (await command(page, { type: 'pollGeminiReadiness', id: 'absent-trigger' }))
    .data;
  expect(progress.reason).toBe('model-trigger');
  expect(progress.result).toBeUndefined();
  const catalog = await command(page, { type: 'models', ...target });
  expect(catalog.ok).toBe(true);
  expect(catalog.data.options).toEqual([]);
  expect(await page.locator('[role="menu"]').count()).toBe(0);
  expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
});

for (const stage of ['initial', 'finish'] as const) {
  test(`readiness waits for a delayed Gemini model trigger during ${stage} capture`, async ({
    page,
  }) => {
    const target = await setup(page, true);
    expect((await command(page, { type: 'snapshot' })).data.composer).toBe(true);
    if (stage === 'finish') {
      await command(page, { type: 'startGeminiReadiness', id: 'delayed-trigger', ...target });
      await expect
        .poll(
          async () =>
            (await command(page, { type: 'pollGeminiReadiness', id: 'delayed-trigger' })).data
              ?.result,
        )
        .toBeDefined();
    }
    const result = await page.evaluate(
      ({ target, stage }) => {
        const button = document.querySelector<HTMLButtonElement>(
          '[data-test-id="bard-mode-menu-button"]',
        )!;
        const parent = button.parentElement!;
        button.remove();
        setTimeout(() => parent.append(button), 150);
        return new Promise<{ ok: boolean }>((resolve) => {
          (window as any).__bridgeHandler(
            {
              type: stage === 'initial' ? 'startGeminiReadiness' : 'finishGeminiReadiness',
              id: 'delayed-trigger',
              ...target,
            },
            { id: 'fixture', url: 'chrome-extension://fixture/sidepanel.html' },
            resolve,
          );
        });
      },
      { target, stage },
    );
    expect(result.ok).toBe(true);
    if (stage === 'initial') {
      await expect
        .poll(
          async () =>
            (await command(page, { type: 'pollGeminiReadiness', id: 'delayed-trigger' })).data
              ?.result?.model,
        )
        .toBe('Automatic fixture');
      expect(
        (await command(page, { type: 'pollGeminiReadiness', id: 'delayed-trigger' })).data.status,
      ).toBe('pending');
      expect(
        (await command(page, { type: 'finishGeminiReadiness', id: 'delayed-trigger', ...target }))
          .ok,
      ).toBe(true);
    }
    expect(
      (await command(page, { type: 'pollGeminiReadiness', id: 'delayed-trigger' })).data.status,
    ).toBe('done');
    expect(await page.locator('[role="menu"]').count()).toBe(0);
    expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  });
}

test('cancelled trigger wait never opens the restored Gemini picker', async ({ page }) => {
  const target = await setup(page, true);
  await page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>(
      '[data-test-id="bard-mode-menu-button"]',
    )!;
    const click = button.onclick!;
    (window as any).fixturePickerOpens = 0;
    button.onclick = (event) => {
      (window as any).fixturePickerOpens++;
      click.call(button, event);
    };
    button.hidden = true;
  });
  expect(
    (await command(page, { type: 'startGeminiReadiness', id: 'cancelled-wait', ...target })).ok,
  ).toBe(true);
  await expect
    .poll(
      async () =>
        (await command(page, { type: 'pollGeminiReadiness', id: 'cancelled-wait' })).data?.reason,
    )
    .toBe('model');
  await command(page, { type: 'cancelGeminiReadiness', id: 'cancelled-wait' });
  await page
    .locator('[data-test-id="bard-mode-menu-button"]')
    .evaluate((button) => button.removeAttribute('hidden'));
  // A used ID proves the lock released without starting another picker operation.
  await expect
    .poll(
      async () =>
        (await command(page, { type: 'startGeminiReadiness', id: 'cancelled-wait', ...target }))
          .error,
    )
    .toBe('이미 시도한 요청입니다. 중복 전송하지 않습니다.');
  expect(await page.evaluate(() => (window as any).fixturePickerOpens)).toBe(0);
  expect(
    (await command(page, { type: 'pollGeminiReadiness', id: 'cancelled-wait' })).data.status,
  ).toBe('error');
  expect(await page.locator('[role="menu"]').count()).toBe(0);
  expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
});

test('readiness holds the model lock until the bound receipt is explicitly finished', async ({
  page,
}) => {
  const target = await setup(page, true);
  await command(page, { type: 'startGeminiReadiness', id: 'projection', ...target });
  await expect
    .poll(
      async () =>
        (await command(page, { type: 'pollGeminiReadiness', id: 'projection' })).data?.result,
    )
    .toBeDefined();
  const progress = (await command(page, { type: 'pollGeminiReadiness', id: 'projection' })).data;
  expect(progress.status).toBe('pending');
  expect(progress.result).toEqual({ model: 'Automatic fixture' });
  expect((await command(page, { type: 'models', ...target })).ok).toBe(false);
  expect(
    (
      await command(page, {
        type: 'finishGeminiReadiness',
        id: 'projection',
        ...target,
        documentId: 'foreign',
      })
    ).ok,
  ).toBe(false);
  expect(
    (await command(page, { type: 'finishGeminiReadiness', id: 'projection', ...target })).ok,
  ).toBe(true);
  expect((await command(page, { type: 'pollGeminiReadiness', id: 'projection' })).data.status).toBe(
    'done',
  );
  expect((await command(page, { type: 'models', ...target })).ok).toBe(true);
  expect(
    (await command(page, { type: 'finishGeminiReadiness', id: 'projection', ...target })).ok,
  ).toBe(false);
  expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
});

test('page input during projection invalidates the pending readiness receipt without sending', async ({
  page,
}) => {
  const target = await setup(page, true);
  await command(page, { type: 'startGeminiReadiness', id: 'input-projection', ...target });
  await expect
    .poll(
      async () =>
        (await command(page, { type: 'pollGeminiReadiness', id: 'input-projection' })).data?.result,
    )
    .toBeDefined();
  await page.locator('.ql-editor').fill('User draft during metadata read');
  expect(
    (await command(page, { type: 'finishGeminiReadiness', id: 'input-projection', ...target })).ok,
  ).toBe(false);
  expect(
    (await command(page, { type: 'pollGeminiReadiness', id: 'input-projection' })).data.status,
  ).toBe('error');
  expect(await page.locator('.ql-editor').innerText()).toBe('User draft during metadata read');
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
});

test('a changed private model key invalidates readiness even when the label stays the same', async ({
  page,
}) => {
  const target = await setup(page, true);
  await command(page, { type: 'startGeminiReadiness', id: 'changed-mode', ...target });
  await expect
    .poll(
      async () =>
        (await command(page, { type: 'pollGeminiReadiness', id: 'changed-mode' })).data?.result,
    )
    .toBeDefined();
  await page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>(
      '[data-test-id="bard-mode-menu-button"]',
    )!;
    const click = button.onclick!;
    button.onclick = (event) => {
      click.call(button, event);
      document
        .querySelector('gem-menu-item[data-mode-id]')!
        .setAttribute('data-mode-id', 'changed-private-mode');
    };
  });
  expect(
    (await command(page, { type: 'finishGeminiReadiness', id: 'changed-mode', ...target })).ok,
  ).toBe(false);
  expect(
    (await command(page, { type: 'pollGeminiReadiness', id: 'changed-mode' })).data,
  ).toMatchObject({ status: 'error', reason: 'model-confirmation' });
  expect((await command(page, { type: 'models', ...target })).ok).toBe(true);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
});

test('cancelled finish retains the model lock until cleanup and rejects a competing finish', async ({
  page,
}) => {
  const target = await setup(page, true);
  await command(page, { type: 'startGeminiReadiness', id: 'finish-cleanup', ...target });
  await expect
    .poll(
      async () =>
        (await command(page, { type: 'pollGeminiReadiness', id: 'finish-cleanup' })).data?.result,
    )
    .toBeDefined();
  await page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>(
      '[data-test-id="bard-mode-menu-button"]',
    )!;
    const click = button.onclick!;
    button.onclick = (event) => {
      click.call(button, event);
      const menu = document.getElementById('fixture-mode-menu')!;
      menu.onkeydown = (event) => {
        if (event.key === 'Escape')
          setTimeout(() => {
            menu.remove();
            button.setAttribute('aria-expanded', 'false');
          }, 500);
      };
    };
  });
  const finishing = command(page, {
    type: 'finishGeminiReadiness',
    id: 'finish-cleanup',
    ...target,
  });
  await expect(page.locator('[role="menu"]')).toBeVisible();
  expect(
    (await command(page, { type: 'finishGeminiReadiness', id: 'finish-cleanup', ...target })).ok,
  ).toBe(false);
  await command(page, { type: 'cancelGeminiReadiness', id: 'finish-cleanup' });
  expect((await command(page, { type: 'models', ...target })).ok).toBe(false);
  expect((await finishing).ok).toBe(false);
  await expect(page.locator('[role="menu"]')).toHaveCount(0);
  expect((await command(page, { type: 'models', ...target })).ok).toBe(true);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
});

for (const interaction of ['click', 'keyboard'] as const) {
  test(`a trusted mode ${interaction} during finish cleanup invalidates readiness`, async ({
    page,
  }) => {
    const target = await setup(page, true);
    await command(page, { type: 'startGeminiReadiness', id: 'user-mode', ...target });
    await expect
      .poll(
        async () =>
          (await command(page, { type: 'pollGeminiReadiness', id: 'user-mode' })).data?.result,
      )
      .toBeDefined();
    await page.evaluate(() => {
      const button = document.querySelector<HTMLButtonElement>(
        '[data-test-id="bard-mode-menu-button"]',
      )!;
      const click = button.onclick!;
      button.onclick = (event) => {
        click.call(button, event);
        const menu = document.getElementById('fixture-mode-menu')!;
        const original = menu.querySelector<HTMLElement>('[data-mode-id]')!;
        const other = original.cloneNode(true) as HTMLElement;
        other.classList.remove('selected');
        other.setAttribute('data-mode-id', 'different-fixture-mode');
        other.querySelector('.label')!.textContent = 'Different fixture';
        other.style.cssText = 'display:block;min-height:40px;width:300px';
        other.onclick = (event) => {
          (window as any).fixtureModeInteractionTrusted ||= event.isTrusted;
          original.classList.remove('selected');
          other.classList.add('selected');
          button.textContent = 'Gemini Different fixture';
          menu.remove();
          button.setAttribute('aria-expanded', 'false');
        };
        other.onkeydown = (event) => {
          if (event.key === 'Enter') {
            (window as any).fixtureModeInteractionTrusted = event.isTrusted;
            other.click();
          }
        };
        menu.append(other);
        // Leave closure pending until the real user selects the other mode.
        menu.onkeydown = () => {};
      };
    });
    const finishing = command(page, { type: 'finishGeminiReadiness', id: 'user-mode', ...target });
    const other = page.locator('[data-mode-id="different-fixture-mode"]');
    await expect(other).toBeVisible();
    if (interaction === 'click') await other.click();
    else {
      await other.focus();
      await other.press('Enter');
    }
    expect(await page.evaluate(() => (window as any).fixtureModeInteractionTrusted)).toBe(true);
    expect((await finishing).ok).toBe(false);
    const progress = (await command(page, { type: 'pollGeminiReadiness', id: 'user-mode' })).data;
    expect(progress.status).toBe('error');
    expect(progress.result).toBeUndefined();
    await expect(page.locator('[role="menu"]')).toHaveCount(0);
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  });
}

for (const cancel of [false, true]) {
  test(`failed finish cleanup retains the mutation lock${cancel ? ' after cancellation' : ''}`, async ({
    page,
  }) => {
    const target = await setup(page, true);
    await command(page, { type: 'startGeminiReadiness', id: 'stuck-finish', ...target });
    await expect
      .poll(
        async () =>
          (await command(page, { type: 'pollGeminiReadiness', id: 'stuck-finish' })).data?.result,
      )
      .toBeDefined();
    await page.evaluate(() => {
      const button = document.querySelector<HTMLButtonElement>(
        '[data-test-id="bard-mode-menu-button"]',
      )!;
      const click = button.onclick!;
      button.onclick = (event) => {
        if (document.getElementById('fixture-mode-menu')) return;
        click.call(button, event);
        document.getElementById('fixture-mode-menu')!.onkeydown = () => {};
      };
    });
    const finishing = command(page, {
      type: 'finishGeminiReadiness',
      id: 'stuck-finish',
      ...target,
    });
    await expect(page.locator('[role="menu"]')).toBeVisible();
    if (cancel) await command(page, { type: 'cancelGeminiReadiness', id: 'stuck-finish' });
    expect((await finishing).ok).toBe(false);
    expect(
      (await command(page, { type: 'pollGeminiReadiness', id: 'stuck-finish' })).data.status,
    ).toBe('error');
    await expect(page.locator('[role="menu"]')).toBeVisible();
    expect(
      (
        await command(page, {
          type: 'send',
          id: 'send-after-stuck-finish',
          ...target,
          prompt: 'Must not send after failed cleanup',
        })
      ).ok,
    ).toBe(false);
    expect((await command(page, { type: 'models', ...target })).ok).toBe(false);
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  });
}

test('failed ordinary model cleanup retains the mutation lock', async ({ page }) => {
  const target = await setup(page, true);
  await page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>(
      '[data-test-id="bard-mode-menu-button"]',
    )!;
    const click = button.onclick!;
    button.onclick = (event) => {
      if (document.getElementById('fixture-mode-menu')) return;
      click.call(button, event);
      document.getElementById('fixture-mode-menu')!.onkeydown = () => {};
    };
  });
  expect((await command(page, { type: 'models', ...target })).ok).toBe(false);
  await expect(page.locator('[role="menu"]')).toBeVisible();
  expect(
    (
      await command(page, {
        type: 'send',
        id: 'send-after-stuck-models',
        ...target,
        prompt: 'Must not send after failed cleanup',
      })
    ).ok,
  ).toBe(false);
  expect((await command(page, { type: 'models', ...target })).ok).toBe(false);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
});

for (const stage of ['initial', 'finish', 'models'] as const) {
  test(`a trigger exception during ${stage} cleanup retains the mutation lock`, async ({
    page,
  }) => {
    const target = await setup(page, true);
    if (stage === 'finish') {
      await command(page, { type: 'startGeminiReadiness', id: 'cleanup-trigger', ...target });
      await expect
        .poll(
          async () =>
            (await command(page, { type: 'pollGeminiReadiness', id: 'cleanup-trigger' })).data
              ?.result,
        )
        .toBeDefined();
    }
    await page.evaluate(() => {
      const button = document.querySelector<HTMLButtonElement>(
        '[data-test-id="bard-mode-menu-button"]',
      )!;
      const owner = document.createElement('bard-mode-switcher');
      owner.setAttribute('data-test-id', 'bard-mode-switcher');
      const host = document.createElement('gem-button');
      host.setAttribute('data-test-id', 'bard-mode-menu-button');
      button.removeAttribute('data-test-id');
      button.replaceWith(owner);
      owner.append(host);
      host.append(button);
      const click = button.onclick!;
      button.onclick = (event) => {
        click.call(button, event);
        document.getElementById('fixture-mode-menu')!.onkeydown = (event) => {
          if (event.key !== 'Escape') return;
          const duplicate = document.createElement('button');
          duplicate.textContent = 'Ambiguous fixture control';
          host.append(duplicate);
        };
      };
    });
    if (stage === 'models')
      expect((await command(page, { type: 'models', ...target })).ok).toBe(false);
    else {
      const result = await command(page, {
        type: stage === 'initial' ? 'startGeminiReadiness' : 'finishGeminiReadiness',
        id: 'cleanup-trigger',
        ...target,
      });
      expect(result.ok).toBe(stage === 'initial');
      await expect
        .poll(
          async () =>
            (await command(page, { type: 'pollGeminiReadiness', id: 'cleanup-trigger' })).data
              ?.status,
        )
        .toBe('error');
      expect(
        (await command(page, { type: 'pollGeminiReadiness', id: 'cleanup-trigger' })).data.reason,
      ).toBe('model-cleanup');
    }
    await expect(page.locator('[role="menu"]')).toBeVisible();
    expect(
      (
        await command(page, {
          type: 'send',
          id: 'send-after-cleanup-trigger',
          ...target,
          prompt: 'Must not send after failed cleanup',
        })
      ).ok,
    ).toBe(false);
    expect((await command(page, { type: 'models', ...target })).ok).toBe(false);
    expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
    expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  });
}

test('Gemini readiness UI separates preparation from response success', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await expect(page.getByText('Gemini 준비 확인', { exact: true })).toBeVisible({ timeout: 1000 });
  await page.getByText('Gemini 준비 확인', { exact: true }).click();
  await expect(
    page.getByText('요청을 보내거나 응답을 받은 시험은 아닙니다.', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Gemini 준비 상태 확인', exact: true }).click();
  await expect(
    page.getByText(
      '페이지 설정에 추가 보안 검사가 켜져 있습니다. 백그라운드 전송은 아직 준비되지 않았습니다.',
      { exact: true },
    ),
  ).toBeVisible();
  expect(await page.evaluate(() => window.harness.sends)).toEqual([]);
  await page.reload();
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await page.getByText('Gemini 준비 확인', { exact: true }).click();
  await expect(
    page.getByText('지난 준비 확인은 완료됐습니다. 응답 성공을 확인한 상태는 아닙니다.', {
      exact: true,
    }),
  ).toBeVisible();
});

test('cancelled Gemini readiness keeps the picker lock until delayed cleanup finishes', async ({
  page,
}) => {
  const target = await setup(page, true);
  await page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>(
      '[data-test-id="bard-mode-menu-button"]',
    )!;
    const click = button.onclick!;
    button.onclick = (event) => {
      click.call(button, event);
      const menu = document.getElementById('fixture-mode-menu')!;
      menu.onkeydown = (event) => {
        if (event.key === 'Escape')
          setTimeout(() => {
            menu.remove();
            button.setAttribute('aria-expanded', 'false');
          }, 500);
      };
    };
  });
  expect((await command(page, { type: 'startGeminiReadiness', id: 'cleanup', ...target })).ok).toBe(
    true,
  );
  await expect(page.locator('[role="menu"]')).toBeVisible();
  await command(page, { type: 'cancelGeminiReadiness', id: 'cleanup' });
  expect(
    (
      await command(page, {
        type: 'send',
        id: 'racing-send',
        ...target,
        prompt: 'Must not send during cleanup',
      })
    ).ok,
  ).toBe(false);
  await expect(page.locator('[role="menu"]')).toHaveCount(0);
  expect((await command(page, { type: 'models', ...target })).ok).toBe(true);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
});

test('readiness UI explains only the fixed failed stage without rendering raw provider errors', async ({
  page,
}) => {
  await page.goto('/?readiness=model-error');
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await page.getByText('Gemini 준비 확인', { exact: true }).click();
  await page.getByRole('button', { name: 'Gemini 준비 상태 확인', exact: true }).click();
  await expect(
    page.getByText(
      'Gemini 모델 메뉴를 읽지 못했습니다. 사이트에서 모델을 확인하세요. 요청은 보내지 않았습니다.',
      { exact: true },
    ),
  ).toBeVisible({ timeout: 1000 });
  await expect(page.getByText('SYNTHETIC_PRIVATE_MARKER', { exact: true })).toHaveCount(0);
});

test('client prerequisite evidence does not claim a send or response and is not restored', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await page.getByText('Gemini 준비 확인', { exact: true }).click();
  await page.getByRole('button', { name: 'Gemini 준비 상태 확인', exact: true }).click();
  await expect(
    page.getByText(
      '웹 클라이언트의 준비 조건을 확인했습니다. 요청·응답은 아직 검증하지 않았습니다.',
      { exact: true },
    ),
  ).toBeVisible();
  expect(await page.evaluate(() => window.harness.sends)).toEqual([]);
  await page.reload();
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await page.getByText('Gemini 준비 확인', { exact: true }).click();
  await expect(page.getByText(/웹 클라이언트의 준비 조건을 확인했습니다/)).toHaveCount(0);
});

test('unsupported cached client explains the fixed boundary without dispatch', async ({ page }) => {
  await page.goto('/?client=prewarm');
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await page.getByText('Gemini 준비 확인', { exact: true }).click();
  await page.getByRole('button', { name: 'Gemini 준비 상태 확인', exact: true }).click();
  await expect(
    page.getByText('이 시험에서 웹 클라이언트의 전송 조건을 확인하지 못했습니다.', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('이 시험에 필요한 새 전송 연결 상태를 확인하지 못했습니다.', {
      exact: true,
    }),
  ).toBeVisible();
  expect(await page.evaluate(() => window.harness.sends)).toEqual([]);
});

for (const [stage, code] of [
  ['registry', 'V1'],
  ['missing', 'V2'],
  ['shape', 'V3'],
  ['id', 'V4'],
  ['metadata', 'V5'],
  ['flags', 'V6'],
] as const) {
  test(`readiness explains the fixed root-view ${stage} stage without sending or restoring it`, async ({
    page,
  }) => {
    await page.goto(`/?client=owner-view-${stage}`);
    await page.getByRole('button', { name: '연결', exact: true }).click();
    await page.getByText('Gemini 준비 확인', { exact: true }).click();
    await page.getByRole('button', { name: 'Gemini 준비 상태 확인', exact: true }).click();
    await expect(
      page.getByText(`모델 영역의 현재 연결을 확인하지 못했습니다. 확인 코드 ${code}.`, {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(/SYNTHETIC_PRIVATE_MARKER|웹 클라이언트의 준비 조건을 확인했습니다/),
    ).toHaveCount(0);
    expect(await page.evaluate(() => window.harness.sends)).toEqual([]);
    expect(await page.evaluate(() => sessionStorage.getItem('fixture-gemini-readiness'))).toBe(
      'done',
    );
    await page.reload();
    await page.getByRole('button', { name: '연결', exact: true }).click();
    await page.getByText('Gemini 준비 확인', { exact: true }).click();
    await expect(page.getByText(`확인 코드 ${code}.`, { exact: false })).toHaveCount(0);
  });
}

test('readiness preserves the exact failed-close stage from the built model adapter', async ({
  page,
}) => {
  const target = await setup(page, true);
  await page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>(
      '[data-test-id="bard-mode-menu-button"]',
    )!;
    const click = button.onclick!;
    button.onclick = (event) => {
      if (document.getElementById('fixture-mode-menu')) return;
      click.call(button, event);
      document.getElementById('fixture-mode-menu')!.onkeydown = () => {};
    };
  });
  await command(page, { type: 'startGeminiReadiness', id: 'stuck-menu', ...target });
  await expect
    .poll(
      async () =>
        (await command(page, { type: 'pollGeminiReadiness', id: 'stuck-menu' })).data?.status,
    )
    .toBe('error');
  expect(
    (await command(page, { type: 'pollGeminiReadiness', id: 'stuck-menu' })).data,
  ).toMatchObject({ status: 'error', reason: 'model-cleanup' });
  expect(
    (
      await command(page, {
        type: 'send',
        id: 'send-after-stuck-initial',
        ...target,
        prompt: 'Must not send after failed cleanup',
      })
    ).ok,
  ).toBe(false);
  expect((await command(page, { type: 'models', ...target })).ok).toBe(false);
  expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
});

test('readiness explains final model confirmation failure with no raw error', async ({ page }) => {
  await page.goto('/?readiness=confirmation-error');
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await page.getByText('Gemini 준비 확인', { exact: true }).click();
  await page.getByRole('button', { name: 'Gemini 준비 상태 확인', exact: true }).click();
  await expect(
    page.getByText('마무리 단계에서 Gemini 모델 재확인이 실패했습니다. 요청은 보내지 않았습니다.', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText('SYNTHETIC_PRIVATE_MARKER', { exact: true })).toHaveCount(0);
});

test('stopping readiness is a neutral explicit stop instead of a provider fault', async ({
  page,
}) => {
  await page.goto('/?readiness=hold');
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await page.getByText('Gemini 준비 확인', { exact: true }).click();
  await page.getByRole('button', { name: 'Gemini 준비 상태 확인', exact: true }).click();
  await page.getByRole('button', { name: '확인 중단', exact: true }).click();
  await expect(
    page.getByText('Gemini 준비 확인을 중단했습니다. 요청은 보내지 않았습니다.', { exact: true }),
  ).toBeVisible({ timeout: 1000 });
  await expect(page.locator('.error')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Gemini 준비 상태 확인', exact: true }),
  ).toBeEnabled();
  expect(await page.evaluate(() => window.harness.sends)).toEqual([]);
});

for (const [reason, explanation] of [
  ['bootstrap-missing', '페이지 초기 설정을 찾지 못했습니다.'],
  ['bootstrap-format', '페이지 초기 설정 형식을 지원하지 않습니다.'],
  ['bootstrap-limit', '페이지 초기 설정이 읽기 한도를 초과했습니다.'],
  ['configuration-format', '보안 설정의 데이터 형식을 지원하지 않습니다.'],
  ['flag-missing', '필요한 보안 설정이 명시돼 있지 않습니다.'],
  ['flag-ambiguous', '필요한 보안 설정이 중복되어 구분할 수 없습니다.'],
  ['flag-format', '필요한 보안 설정 값을 확인할 수 없습니다.'],
]) {
  test(`readiness explains fixed protection reason ${reason} without sending or persisting it`, async ({
    page,
  }) => {
    await page.goto(`/?readiness=${reason}`);
    await page.getByRole('button', { name: '연결', exact: true }).click();
    await page.getByText('Gemini 준비 확인', { exact: true }).click();
    await page.getByRole('button', { name: 'Gemini 준비 상태 확인', exact: true }).click();
    await expect(page.getByText(explanation!, { exact: true })).toBeVisible({ timeout: 1000 });
    await expect(
      page.getByText('보안 검사 상태를 확인하지 못해 백그라운드 전송을 진행하지 않습니다.', {
        exact: true,
      }),
    ).toBeVisible();
    expect(await page.evaluate(() => window.harness.sends)).toEqual([]);
    expect(await page.evaluate(() => sessionStorage.getItem('fixture-gemini-readiness'))).toBe(
      'done',
    );
    await page.reload();
    await page.getByRole('button', { name: '연결', exact: true }).click();
    await page.getByText('Gemini 준비 확인', { exact: true }).click();
    await expect(page.getByText(explanation!, { exact: true })).toHaveCount(0);
  });
}

function withSdkHeaderProjection(page: string) {
  return page
    .replace(
      '<bard-mode-switcher',
      '<chat-app-side-nav-menu-button><new-model-picker-glow class="header-model-picker-glow"><div class="glow-content"><bard-mode-switcher',
    )
    .replace(
      '</bard-mode-switcher>',
      '</bard-mode-switcher></div></new-model-picker-glow></chat-app-side-nav-menu-button>',
    );
}

test('canonical cold metadata stays unsupported while the compiled trial refuses missing model bindings', async ({
  page,
}) => {
  await page.route('https://gemini.google.com/**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: withSdkHeaderProjection(geminiClientReadinessPage().replace('{wa:true}', '{wa:false}')),
    }),
  );
  await page.goto('https://gemini.google.com/app');
  expect(
    await page.evaluate(
      (source) => (0, eval)(`(${source})`)(),
      readGeminiClientCapability.toString(),
    ),
  ).toEqual({ status: 'unsupported', reason: 'transport-webchannel' });
  const source = await readFile(
    path.resolve('.output/chrome-mv3/gemini-sdk-fixed-text-trial.js'),
    'utf8',
  );
  const bootstrap = await page.evaluate((source) => (0, eval)(source), source);
  const lease = () =>
    page.evaluate(({ handle, capability }) => (window as any)[handle].lease(capability), bootstrap);
  expect(await lease()).toEqual({ status: 'pending' });
  await expect.poll(lease).toEqual({ status: 'error', reason: 'model-bindings' });
  expect(await lease()).toEqual({ status: 'error', reason: 'model-bindings' });
  expect(await page.evaluate(() => (window as any).fixtureClientCalls)).toBe(0);
  expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  expect(JSON.stringify(await lease())).not.toMatch(
    /SYNTHETIC_PRIVATE|fixture-mode|capability|handle|oa/,
  );
});

test('registered-idle metadata stays unsupported while the compiled trial refuses missing model bindings', async ({
  page,
}) => {
  await page.route('https://gemini.google.com/**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: withSdkHeaderProjection(
        geminiClientReadinessPage(false, { nativeSse: false, enabled: true }),
      ),
    }),
  );
  await page.goto('https://gemini.google.com/app');
  expect(
    await page.evaluate(
      (source) => (0, eval)(`(${source})`)(),
      readGeminiClientCapability.toString(),
    ),
  ).toEqual({ status: 'unsupported', reason: 'transport-webchannel' });
  const source = await readFile(
    path.resolve('.output/chrome-mv3/gemini-sdk-fixed-text-trial.js'),
    'utf8',
  );
  const bootstrap = await page.evaluate((source) => (0, eval)(source), source);
  const lease = () =>
    page.evaluate(({ handle, capability }) => (window as any)[handle].lease(capability), bootstrap);
  expect(await lease()).toEqual({ status: 'pending' });
  await expect.poll(lease).toEqual({ status: 'error', reason: 'model-bindings' });
  expect(await lease()).toEqual({ status: 'error', reason: 'model-bindings' });
  expect(await page.evaluate(() => (window as any).fixtureClientCalls)).toBe(0);
  expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  expect(JSON.stringify(await lease())).not.toMatch(
    /SYNTHETIC_PRIVATE|fixture-mode|capability|handle|Ma|Oa|hb|mb/,
  );
});

test('unsupported WebChannel readiness explains the route without dispatch or accepted answer', async ({
  page,
}) => {
  await page.goto('/?client=transport-webchannel');
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await page.getByText('Gemini 준비 확인', { exact: true }).click();
  await page.getByRole('button', { name: 'Gemini 준비 상태 확인', exact: true }).click();
  await expect(
    page.getByText('웹 채널 경로가 선택돼 있습니다. 이 시험에서는 해당 경로를 지원하지 않습니다.', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/SYNTHETIC_PRIVATE_MARKER|웹 클라이언트의 준비 조건을 확인했습니다/),
  ).toHaveCount(0);
  await expect(page.locator('.gemini-trial-result')).toHaveCount(0);
  expect(await page.evaluate(() => window.harness.sends)).toEqual([]);
  expect(await page.evaluate(() => window.harness.geminiSdkTrialStarts)).toBe(0);
  await page.reload();
  await page.getByRole('button', { name: '연결', exact: true }).click();
  await page.getByText('Gemini 준비 확인', { exact: true }).click();
  await expect(page.getByText(/웹 채널 경로가 선택돼 있습니다/)).toHaveCount(0);
});

// Visibility is an explicit synthetic seam; compiled bridge and real shared inspector execute unchanged.
async function headerSetup(page: Page, delay = 0) {
  await page.route('https://gemini.google.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: geminiHeaderObservationPage(delay) }),
  );
  await page.goto('https://gemini.google.com/app');
  await page.evaluate(() => {
    (window as any).chrome = {
      runtime: {
        id: 'fixture',
        getURL: (s: string) => `chrome-extension://fixture/${s}`,
        onMessage: {
          addListener: (h: unknown) => {
            (window as any).__bridgeHandler = h;
          },
        },
      },
    };
  });
  await page.evaluate(installCollectorFixture);
  const bridge = await page.addScriptTag({ path: path.resolve('.output/chrome-mv3/bridge.js') });
  await bridge.evaluate((element) => element.parentNode?.removeChild(element));
}
test('DOM-only observation reaches the real compiled inspector, stays quarantined and terminal polls are inert', async ({
  page,
}) => {
  await headerSetup(page);
  const start = await command(page, { type: 'startGeminiHeaderObservation', id: 'header' });
  expect(start).toEqual({ ok: true, data: { documentId: expect.any(String) } });
  const bound = { id: 'header', documentId: start.data.documentId };
  expect(await command(page, { type: 'pollGeminiHeaderObservation', ...bound })).toEqual({
    ok: true,
    data: { status: 'done', visibility: 'hidden', outcome: 'ready-early' },
  });
  const reads = await page.evaluate(() => (window as any).fixtureHeader.reads);
  expect(reads).toBeGreaterThan(0);
  for (const type of [
    'models',
    'selectModel',
    'startGeminiReadiness',
    'reserveGeminiSdkTrial',
    'send',
  ])
    expect(
      (
        await command(page, {
          type,
          ...bound,
          id: 'competing',
          url: 'https://gemini.google.com/app',
          ...(type === 'send' ? { prompt: 'never sent' } : {}),
          ...(type === 'selectModel' ? { key: 'forbidden' } : {}),
        })
      ).ok,
    ).toBe(false);
  expect((await command(page, { type: 'startGeminiHeaderObservation', id: 'again' })).ok).toBe(
    false,
  );
  expect(await command(page, { type: 'cancelGeminiHeaderObservation', ...bound })).toEqual({
    ok: true,
    data: { safeToRetire: true },
  });
  expect((await command(page, { type: 'pollGeminiHeaderObservation', ...bound })).data).toEqual({
    status: 'done',
    visibility: 'hidden',
    outcome: 'ready-early',
  });
  expect(await page.evaluate(() => (window as any).fixtureHeader)).toEqual({
    hidden: true,
    reads,
    clicks: 0,
    privateReads: 0,
    started: true,
  });
  expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  expect(await page.locator('[role="menu"]').count()).toBe(0);
});
test('observation rejects foreign senders, stale IDs and unknown/private payload fields', async ({
  page,
}) => {
  await headerSetup(page);
  expect(
    (
      await command(
        page,
        { type: 'startGeminiHeaderObservation', id: 'foreign' },
        'https://gemini.google.com/app',
      )
    ).ok,
  ).toBe(false);
  for (const key of ['url', 'documentId', 'headers', 'selector', 'timeout', 'private'])
    expect(
      (
        await command(page, {
          type: 'startGeminiHeaderObservation',
          id: 'extra',
          [key]: 'forbidden',
        })
      ).ok,
    ).toBe(false);
  const start = await command(page, { type: 'startGeminiHeaderObservation', id: 'bound' });
  for (const type of ['pollGeminiHeaderObservation', 'cancelGeminiHeaderObservation']) {
    expect((await command(page, { type, id: 'bound', documentId: 'stale' })).ok).toBe(false);
    expect((await command(page, { type, id: 'stale', documentId: start.data.documentId })).ok).toBe(
      false,
    );
  }
  expect(await page.evaluate(() => (window as any).fixtureHeader.privateReads)).toBe(0);
});
test('compiled real inspector witnesses late hidden readiness without menu or requests', async ({
  page,
}) => {
  await headerSetup(page, 3200);
  const start = await command(page, { type: 'startGeminiHeaderObservation', id: 'late' });
  const bound = { id: 'late', documentId: start.data.documentId };
  await expect
    .poll(
      async () => (await command(page, { type: 'pollGeminiHeaderObservation', ...bound })).data,
      { timeout: 10000 },
    )
    .toEqual({ status: 'done', visibility: 'hidden', outcome: 'ready-late' });
  expect((await command(page, { type: 'cancelGeminiHeaderObservation', ...bound })).data).toEqual({
    safeToRetire: true,
  });
  expect(await page.evaluate(() => (window as any).fixtureHeader.clicks)).toBe(0);
  expect(await page.evaluate(() => (window as any).fixtureHeader.privateReads)).toBe(0);
  expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
});
test('compiled cancellation while composer preparation waits is final and does not inspect later', async ({
  page,
}) => {
  await headerSetup(page, 3200);
  await page.locator('.ql-editor').evaluate((element) => element.remove());
  const start = await command(page, { type: 'startGeminiHeaderObservation', id: 'prep' });
  const bound = { id: 'prep', documentId: start.data.documentId };
  expect((await command(page, { type: 'cancelGeminiHeaderObservation', ...bound })).data).toEqual({
    safeToRetire: false,
  });
  expect((await command(page, { type: 'pollGeminiHeaderObservation', ...bound })).data).toEqual({
    status: 'done',
    visibility: 'hidden',
    outcome: 'interrupted',
  });
  expect(await page.evaluate(() => (window as any).fixtureHeader.reads)).toBe(0);
});
test('visibilitychange between polls invalidates an ongoing observer even if hidden again', async ({
  page,
}) => {
  await headerSetup(page, 3200);
  const start = await command(page, { type: 'startGeminiHeaderObservation', id: 'hidden' });
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  expect(
    (
      await command(page, {
        type: 'pollGeminiHeaderObservation',
        id: 'hidden',
        documentId: start.data.documentId,
      })
    ).data,
  ).toEqual({ status: 'done', visibility: 'hidden', outcome: 'visibility-changed' });
});

test('terminal evidence stays fixed but typed-then-cleared user input permanently vetoes retirement', async ({
  page,
}) => {
  await headerSetup(page);
  const start = await command(page, { type: 'startGeminiHeaderObservation', id: 'terminal-input' });
  const bound = { id: 'terminal-input', documentId: start.data.documentId };
  expect((await command(page, { type: 'pollGeminiHeaderObservation', ...bound })).data).toEqual({
    status: 'done',
    outcome: 'ready-early',
    visibility: 'hidden',
  });
  const reads = await page.evaluate(() => (window as any).fixtureHeader.reads);
  await page.locator('.ql-editor').fill('synthetic draft');
  await page.locator('.ql-editor').fill('');
  expect((await command(page, { type: 'cancelGeminiHeaderObservation', ...bound })).data).toEqual({
    safeToRetire: false,
  });
  expect((await command(page, { type: 'pollGeminiHeaderObservation', ...bound })).data).toEqual({
    status: 'done',
    outcome: 'ready-early',
    visibility: 'hidden',
  });
  expect(await page.evaluate(() => (window as any).fixtureHeader.reads)).toBe(reads);
});
for (const visible of [false, true]) {
  test(`compiled observer preserves initial ${visible ? 'visible' : 'hidden'} state and refuses either transition direction`, async ({
    page,
  }) => {
    await headerSetup(page, 3200);
    await page.evaluate((value) => {
      (window as any).fixtureHeader.hidden = !value;
    }, visible);
    const start = await command(page, { type: 'startGeminiHeaderObservation', id: 'transition' });
    await page.evaluate((value) => {
      (window as any).fixtureHeader.hidden = value;
    }, visible);
    await expect
      .poll(
        async () =>
          (
            await command(page, {
              type: 'pollGeminiHeaderObservation',
              id: 'transition',
              documentId: start.data.documentId,
            })
          ).data,
      )
      .toEqual({
        status: 'done',
        outcome: 'visibility-changed',
        visibility: visible ? 'visible' : 'hidden',
      });
    expect(
      (
        await command(page, {
          type: 'cancelGeminiHeaderObservation',
          id: 'transition',
          documentId: start.data.documentId,
        })
      ).data,
    ).toEqual({ safeToRetire: false });
  });
}

test('the compiled bridge refuses a pending SDK reservation after the separate observer reserves', async ({
  page,
}) => {
  await headerSetup(page);
  const target = (await command(page, { type: 'snapshot' })).data;
  const results = await page.evaluate((target) => {
    const send = (message: object) =>
      new Promise<{ ok: boolean; data?: any; error?: string }>((resolve) => {
        (window as any).__bridgeHandler(
          message,
          { id: 'fixture', url: 'chrome-extension://fixture/sidepanel.html' },
          resolve,
        );
      });
    // Both handlers enter in one task before the SDK snapshot continuation resumes.
    const sdk = send({
      type: 'reserveGeminiSdkTrial',
      id: 'pending-sdk',
      documentId: target.documentId,
      url: target.url,
    });
    const observation = send({ type: 'startGeminiHeaderObservation', id: 'observer' });
    return Promise.all([sdk, observation]);
  }, target);
  expect(results[1]).toEqual({ ok: true, data: { documentId: target.documentId } });
  expect(results[0]).toEqual({
    ok: false,
    error: 'Gemini 시험 페이지를 다른 작업이 사용 중입니다.',
  });
  const bound = { id: 'observer', documentId: target.documentId };
  const terminal = {
    ok: true,
    data: { status: 'done', visibility: 'hidden', outcome: 'ready-early' },
  };
  expect(await command(page, { type: 'pollGeminiHeaderObservation', ...bound })).toEqual(terminal);
  const reads = await page.evaluate(() => (window as any).fixtureHeader.reads);
  expect(reads).toBeGreaterThan(0);
  expect(await command(page, { type: 'cancelGeminiHeaderObservation', ...bound })).toEqual({
    ok: true,
    data: { safeToRetire: true },
  });
  expect(await command(page, { type: 'pollGeminiHeaderObservation', ...bound })).toEqual(terminal);
  expect(await page.evaluate(() => (window as any).fixtureHeader)).toEqual({
    hidden: true,
    reads,
    clicks: 0,
    privateReads: 0,
    started: true,
  });
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
  expect(await page.locator('[role="menu"]').count()).toBe(0);
});

test('an existing SDK reservation excludes the separate header observer before any inspector read', async ({
  page,
}) => {
  await headerSetup(page);
  const target = (await command(page, { type: 'snapshot' })).data;
  expect(
    (
      await command(page, {
        type: 'reserveGeminiSdkTrial',
        id: 'sdk-first',
        documentId: target.documentId,
        url: target.url,
      })
    ).ok,
  ).toBe(true);
  expect((await command(page, { type: 'startGeminiHeaderObservation', id: 'conflict' })).ok).toBe(
    false,
  );
  expect(await page.evaluate(() => (window as any).fixtureHeader.reads)).toBe(0);
  expect(await page.evaluate(() => (window as any).fixtureSent)).toEqual([]);
  expect(await page.evaluate(() => (window as any).fixtureNetworkCalls)).toBe(0);
});
