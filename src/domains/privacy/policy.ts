/** No URL from model output is ever fetched by the extension. */
export function safeSourceUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return;
    const host = url.hostname.toLowerCase();
    if (
      !host.includes('.') ||
      host.endsWith('.local') ||
      host.endsWith('.localhost') ||
      host.endsWith('.internal') ||
      /^[\d.]+$/.test(host) ||
      host.includes(':')
    )
      return;
    return url.href;
  } catch {
    return;
  }
}
export function sourceUrls(text: string) {
  return [
    ...new Set(
      (text.match(/https:\/\/[^\s<>"\])]+/g) ?? [])
        .map((s) => safeSourceUrl(s.replace(/[.,;]+$/, '')))
        .filter((s): s is string => !!s),
    ),
  ].slice(0, 16);
}
export function sensitiveHints(text: string): string[] {
  return [
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(text) && '개인 키',
    /\b(?:sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{20,})\b/.test(text) && 'API 토큰',
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text) && '이메일 주소',
  ].filter((v): v is string => !!v);
}
