import { describe, expect, it } from 'vitest';
import { providerForUrl } from '../../../src/domains/providers/model';
import { safeSourceUrl, sensitiveHints, sourceUrls } from '../../../src/domains/privacy/policy';
describe('trust boundaries', () => {
  it.each([
    'https://chatgpt.com.evil.org',
    'http://chatgpt.com',
    'https://chatgpt.com:8443',
    'https://user:password@claude.ai',
    'https://gemini.google.com.evil.org',
  ])('rejects lookalike/untrusted origins: %s', (url) =>
    expect(providerForUrl(url)).toBeUndefined(),
  );
  it('recognizes only exact supported HTTPS origins', () =>
    expect(providerForUrl('https://gemini.google.com/app/123')).toBe('gemini'));
  it.each([
    'javascript:alert(1)',
    'data:text/html,test',
    'https://localhost/test',
    'https://127.0.0.1',
    'https://[::1]',
    'https://192.168.1.1/',
    'https://internal.local',
    'https://user:pass@example.com',
    'http://example.com',
  ])('never offers unsafe source links: %s', (url) => expect(safeSourceUrl(url)).toBeUndefined());
  it('deduplicates public sources and flags credentials without sending them', () => {
    expect(sourceUrls('https://example.org/a https://example.org/a')).toEqual([
      'https://example.org/a',
    ]);
    expect(sensitiveHints('me@example.org sk-12345678901234567890')).toEqual([
      'API 토큰',
      '이메일 주소',
    ]);
  });
});
