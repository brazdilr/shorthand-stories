# Manipulaci Rebuild - Notes

## Goal
Rebuild the one-page scrollytelling story from Shorthand as a maintainable, standalone site.

## Current State
- Source HTML captured locally: `Manipuláci _ Texty, které nehrají fér _ Průvodce.html`
- Extracted content:
  - `manipulaci-rebuild/src/content/sections.json`
  - `manipulaci-rebuild/src/content/scrollpoints.json`
- CDN assets downloaded to: `manipulaci-rebuild/public/cdn/...`
- Missing asset (404 on CDN):
  - `https://pribehy.shorthandstories.com/texty-ktere-manipuluji/assets/social.jpg`
- Vanilla TS + Vite project created in `manipulaci-rebuild/`
- Section 1 (intro) implemented and tuned (desktop + mobile subtitles, blur-on-scroll)
- Section 3 (text + GIF) implemented and tuned (desktop + mobile order)
- Section 4 (reveal) implemented and tuned (two backgrounds, two text panels, scroll timing)

## Working Approach
We will rebuild the page section by section, keeping code readable and reusable. Each section will have:
- markup in `src/main.ts` (will later be refactored into modules if needed)
- styling in `src/style.css`
- assets referenced from `public/cdn/...`

## Section Map (from source)
1. TitleSection (desktop)
2. TitleSection (mobile)
3. TextSection
4. RevealSection
5. ScrollpointsSection
6. TitleSection
7. TitleSection (mobile)
8. TextSection
9. TextSection
10. RevealSection
11. TextSection
12. RevealSection
13. ScrollpointsSection
14. RevealSection
15. TextSection
16. TextOverMediaSection (video)
17. TextSection

## Next Steps
1. Section 5: first ScrollpointsSection (scroll-driven focus points).
2. Section 6–7: title sections (desktop + mobile variants).
3. Section 8–9: text sections.
4. Section 10: reveal section.
5. Continue sequentially through remaining sections.

## Open Questions
- Should we keep the exact typography and colors from Shorthand, or establish a simplified style system and approximate them?
- Do we want a small component structure (e.g., `src/sections/`) or keep everything in `main.ts` for now?
- Confirm the correct assets for Reveal section top decorative edge on all breakpoints.
