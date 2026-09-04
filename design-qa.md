# LINE CTA interaction-state QA

- Source visual truth: `C:\Users\m0935\AppData\Local\Temp\codex-clipboard-f40fa748-253e-498c-8aef-bfd1093e016a.png`
- Implementation: `http://127.0.0.1:4175/`
- Implementation screenshot: captured in the Codex in-app browser during this QA pass (ephemeral browser capture)
- Viewport: 1441 CSS px wide desktop breakpoint
- Source pixels: 526 × 165
- Implementation component: 185.06 × 45.91 CSS px in the browser; browser capture used its native density
- State: keyboard `focus-visible`, which intentionally shares the same white/red visual treatment as `hover`

## Full-view comparison evidence

The Header remained fixed and retained its existing logo, navigation layout, spacing, and height. No surrounding layout changed.

## Focused region comparison evidence

The source shows a white button surface with a red border, red label, and red LINE icon. The rendered interaction state measured white (`rgb(255, 255, 255)`) for the surface and the existing brand red (`rgb(187, 0, 0)`) for the border, label, and icon. The supplied LINE SVG is used as a mask whose fill follows the CTA's exact `currentColor`. Button bounds do not change between states.

## Findings

- No actionable P0, P1, or P2 mismatch remains for the requested icon-color correction.
- The screenshot is a cropped design example rather than a same-scale full Header mock, so only the requested interaction-state colors and stable geometry were compared.

## Comparison history

1. Earlier implementation: surface, border, and label changed correctly, but the LINE icon stayed white.
2. Initial fix: added an icon color filter, which made the icon red but produced an approximate shade.
3. Final fix: replaced the approximate filter with the original SVG as a `currentColor` mask.
4. Post-fix evidence: build passed; the icon, label, and border each measured exactly `rgb(187, 0, 0)` in the interaction state; focus remained visible; and the browser console contained no warnings or errors.

## Implementation checklist

- [x] White background on hover/focus-visible
- [x] Red border on hover/focus-visible
- [x] Red text on hover/focus-visible
- [x] Red LINE icon on hover/focus-visible
- [x] No layout shift
- [x] Production build passes
- [x] Browser console checked

final result: passed
