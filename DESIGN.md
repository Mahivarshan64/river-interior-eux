# Design System — Blue Homes Interiors

## Stack
Static HTML + css/style.css (single stylesheet) + Tailwind CDN for layout utilities
only (hidden/flex/grid breakpoints). All visual styling lives in style.css classes;
avoid inline style attributes except one-off positioning.

## Typography
- Display/headings: "Bricolage Grotesque" (Google Fonts, 400-800, opsz axis).
  Warm flared grotesque; set tight (-0.02 to -0.035em) at display sizes.
- Body/UI: "Hanken Grotesk" (400/500/600/700).
- Scale: fluid clamp() steps, ratio >= 1.25. Display: clamp(44px,7vw,96px).
  Section heads: clamp(30px,4vw,52px). Body 16-17px, line-height 1.7.
- Caps reserved for 11px tracked labels inside the titleblock system only.

## Color (Committed strategy)
- --ink: #0D1B26 (blue-black; dark sections, footer)
- --ink-2: #142736 (raised dark surface)
- --blue: #2E7D9E (brand primary; links, accents, active states)
- --blue-deep: #1E5A7A (hover, pressed)
- --brass: #C9952C (accent on light), --brass-bright: #E8B84B (accent on dark)
- --paper: #FBFCFD (page), --paper-2: #F2F5F7 (alt section)
- --text: #16212B, --text-2: #54646F, --line: #E2E8EC, --line-dark: rgba(255,255,255,0.1)
- No pure #000/#fff. No gradients as section backgrounds. Photography or flat surfaces.

## Section grammar: the titleblock
Architectural drawing title block: index number + hairline + label on one line,
then the heading. `.titleblock` > span.tb-num "01" + rule + span.tb-label "Services".
This is the ONE repeated label system; no other kickers.

## Components
- .navbar: paper frosted; .hero-transparent variant on index (transparent -> scrolled).
- Buttons: .btn-solid (ink bg), .btn-brass (brass bg, ink text), .btn-ghost-white
  (on photos), .link-arrow (underlined text link with arrow).
- .svc-row: editorial alternating image/text rows with .spec-list (label/value
  hairline rows, NOT checkmark bullets).
- .work-card: image + caption BELOW (category · name · locality), hover zoom.
- .quote-feature (ink panel) + .t-card / mini review tiles.
- .value-row: numbered hairline list rows (no card grids).
- Footer: ink, oversized wordmark line, 4 columns, service-area strip.

## Motion
- IntersectionObserver .reveal -> .fade-up children (0.7s, ease-out-quint, 24px rise).
- Hero headline clip-up on load. Image hover: scale 1.04, 0.7s.
- Respect prefers-reduced-motion.

## Imagery
Unsplash interiors only from the verified ID set already shipping in the repo.
Warm, lived-in, natural light. Alt text describes the actual room and locality.
