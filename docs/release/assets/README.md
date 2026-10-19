# Store artwork candidates

Prepared for 0.5.0 on 2026-10-19. These assets are not uploaded or approved store materials.

- `promo.svg` is the editable 440×280 promotional source. `promo-440x280.png` is its opaque browser-rendered export. The check motif follows the existing product icon and bundled Lucide attribution.
- `review-1280x800.png` and `result-1280x800.png` capture the actual React UI in the local synthetic test harness at 1280×800. The question and answers are fixtures, not live account conversations or proof of provider compatibility. No account data appears in them.
- These two captures were refreshed against the current readable-review UI and stable foreground default for the 0.5.0 candidate. The optional review settings remain collapsed. A fresh Playwright-managed browser/context used the existing local Vite harness with two synthetic pairs; only its test-only version slot was set to the actual package version before capture. No production UI was altered. The completed capture shows all three synthetic participants and version0.5.0; it is not native-panel or live-service success evidence. Both images were visually inspected for wording/clipping and verified as opaque 1280×800, 8-bit RGB PNGs. The promotional design is retained from the earlier candidate.
- The 128×128 product icon is owned by `public/icons/128.png`; reuse that file rather than maintain a second copy.

Regenerate UI captures after visible changes. Check the exact dimensions, clipping, current wording, and provider-brand permissions before publication. Prefer a native-panel capture with a synthetic conversation once that end-to-end workflow passes; keep private account sidebars and identifiers out of store images.

The official [store image requirements](https://developer.chrome.com/docs/webstore/images) are the source of truth for current upload sizes and slots.
