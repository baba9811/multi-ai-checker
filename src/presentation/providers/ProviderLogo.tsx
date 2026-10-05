import openai from './assets/openai.svg';
import claude from './assets/claude.svg';
import gemini from './assets/gemini.svg';
import type { ProviderId } from '../../domains/providers/model';
const logos = { chatgpt: openai, claude, gemini };
/** The adjacent text labels the provider, so the brand image is decorative for AT. */
export function ProviderLogo({ provider }: { provider: ProviderId }) {
  return (
    <img
      className="provider-logo"
      src={logos[provider]}
      alt=""
      aria-hidden="true"
      width="20"
      height="20"
    />
  );
}
