# Store artwork candidates

Prepared 2026-10-06. These assets are not uploaded or approved store materials.

- `promo.svg` is the editable 440×280 promotional source. `promo-440x280.png` is its opaque browser-rendered export. The check motif follows the existing product icon and bundled Lucide attribution.
- `review-1280x800.png` and `result-1280x800.png` capture the actual React UI in the local synthetic test harness at 1280×800. The question and answers are fixtures, not live account conversations or proof of provider compatibility. No account data appears in them.
- The 128×128 product icon is owned by `public/icons/128.png`; reuse that file rather than maintain a second copy.

Regenerate UI captures after visible changes. Check the exact dimensions, clipping, current wording, and provider-brand permissions before publication. Prefer a native-panel capture with a synthetic conversation once that end-to-end workflow passes; keep private account sidebars and identifiers out of store images.

The official [store image requirements](https://developer.chrome.com/docs/webstore/images) are the source of truth for current upload sizes and slots.
