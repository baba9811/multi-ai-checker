# Third-party notices

Directly used packages (exact versions and transitive dependencies in `package-lock.json`):

- WXT / @wxt-dev/module-react — MIT — https://github.com/wxt-dev/wxt
- React / React DOM — MIT — https://github.com/facebook/react
- Zod — MIT — https://github.com/colinhacks/zod
- Lucide React icons — ISC — https://github.com/lucide-icons/lucide
- TypeScript — Apache-2.0 — https://github.com/microsoft/TypeScript
- Vite / Vitest — MIT — https://github.com/vitejs/vite / https://github.com/vitest-dev/vitest
- Playwright — Apache-2.0 — https://github.com/microsoft/playwright
- Type definitions — see individual package licenses in node_modules.

ChatHub (GPL-3.0), ChatALL (Apache-2.0), LLM Council (no license file found in reviewed snapshot), and promptfoo (MIT) were reviewed for design context. No source code or prompt text was copied from these projects. Review snapshots and decisions are recorded in `docs/research/references.md`.

The extension build bundles React, Zod and Lucide code. A generated license inventory is supplied with the distributable; dependency licenses remain applicable in addition to this project's MIT license.

WXT's npm tarball did not contain a license text file. `licenses/wxt-LICENSE.txt` preserves the official MIT license reviewed at wxt-dev/wxt commit `0d9c34b59e3f21840c471dec3fd4d9b0cb3b013a`. The packaging script includes this text.

Brand SVG assets are copied unchanged from `@lobehub/icons-static-svg@1.95.1` (OpenAI, Claude color, Gemini color), MIT. Upstream: https://github.com/lobehub/lobe-icons. The upstream license is preserved in `licenses/lobe-icons-LICENSE.txt` and included in the extension package. Brand marks belong to their respective owners; the project is not affiliated with or endorsed by those companies.
