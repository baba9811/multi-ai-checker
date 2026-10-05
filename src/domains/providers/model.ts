import { z } from 'zod';

export const providerIds = ['chatgpt', 'claude', 'gemini'] as const;
export const ProviderId = z.enum(providerIds);
export type ProviderId = z.infer<typeof ProviderId>;
export const providers = {
  chatgpt: {
    name: 'ChatGPT',
    origin: 'https://chatgpt.com',
    home: 'https://chatgpt.com/',
  },
  claude: {
    name: 'Claude',
    origin: 'https://claude.ai',
    home: 'https://claude.ai/new',
  },
  gemini: {
    name: 'Gemini',
    origin: 'https://gemini.google.com',
    home: 'https://gemini.google.com/app',
  },
} as const;
export function providerForUrl(value: string): ProviderId | undefined {
  try {
    const url = new URL(value);
    if (url.username || url.password) return;
    return providerIds.find((id) => providers[id].origin === url.origin);
  } catch {
    return;
  }
}

export const Binding = z.object({
  provider: ProviderId,
  tabId: z.number().int(),
  documentId: z.string().max(100),
  url: z.string().max(3000),
});
export type Binding = z.infer<typeof Binding>;
