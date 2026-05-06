# Decisions

## CSS Custom Properties for Theming (not Mantine theme override)
**Decision:** All theme-aware color values are delivered via CSS custom properties
(`var(--fujin-*)`) injected by `FujinThemeProvider`. Mantine's built-in theme/color system
is not used for Fujin token colors.
**Why:** Mantine's color system is opinionated around its own palette format and would
require translating the Slate token contract into Mantine's structure. CSS vars are
framework-agnostic, switch at runtime without React re-renders, and will extend cleanly
to React Native (which will have its own injection layer consuming the same tokens.json).

## Inline Style Props Over CSS Classes
**Decision:** Components use React inline `style` props for all styling. No external
CSS files or CSS modules.
**Why:** Token values are numbers and strings from a JSON file. Inline styles are the
natural bridge — no build pipeline needed for styles, and all values remain traceable
to tokens.json without indirection.

## No Mantine Theme Override
**Decision:** `MantineProvider` is used with no `theme` prop. No Mantine theme overrides.
**Why:** Mantine's default theme would conflict with Fujin's Slate palette. Overriding it
would require ongoing maintenance as Mantine updates. Components style themselves entirely
via inline styles and CSS vars, making the Mantine theme irrelevant for Fujin values.
If a specific Mantine internal (e.g. focus ring) causes friction, document it and address
it as a targeted override — not a global theme.

## Progressive Disclosure Rules
**Decision:** Cards with >2 actions overflow into ActionMenu. Workflows with >3 steps
use WorkflowStepper. Cards with secondary detail use DataCard's `detail` prop + Collapse.
**Why:** Keeps UI density workstation-appropriate. Forces callers to think about information
hierarchy rather than dumping all actions at the surface level.

## Callers Own Layout Spacing
**Decision:** No component sets external margins or `marginBottom`. All inter-component
spacing is the caller's responsibility.
**Why:** Prevents components from fighting each other when composed. Layout is context-
dependent; components cannot know their context.

## G31P Offload Boundary
**Decision:** Mechanical, clearly-scoped, boilerplate tasks → brief to G31P with Fujin
review before acceptance. Judgment-heavy work (disclosure logic, layout shells, workflow
behavior, architectural decisions) → Fujin only.
**Why:** Preserves design integrity on decisions that require understanding of the full
token contract and component system, while offloading repetitive transcription work.

## Dev Harness as Vite App (Not Storybook)
**Decision:** Visual development and verification is done via a minimal Vite + React app
at `dev/`. No Storybook.
**Why:** Storybook adds significant overhead (config, addons, MDX) that isn't needed for
a component library at this stage. The harness only needs to render components with
realistic mock data and verify theme switching works.
