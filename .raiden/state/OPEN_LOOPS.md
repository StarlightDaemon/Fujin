# Open Loops

## ToolShell Mobile Burger Button
**Status:** Resolved (2026-05-05)
**Detail:** Added a concrete Mobile usage example to `llms-full.txt` under the ToolShell
section. Shows Mantine `Burger` wired to the `header` render prop with `hiddenFrom="sm"`
and `color="var(--fujin-text-muted)"`. Fallback pattern (UnstyledButton + div bars) also
documented. No `.tsx` changes — the existing render prop API was already correct.

## Mantine NavLink Active State Background
**Status:** Resolved (2026-05-05)
**Detail:** Root cause confirmed — Mantine v7's `styles` API does not process CSS selector
strings like `'&[data-active]'`; they are silently ignored. Fixed by replacing `NavLink`
entirely with a custom `UnstyledButton` in the expanded rail state. Active/hover background
now driven by `item.active` and `hoveredLabel` state via inline styles. `NavLink` import
removed. Mirrors the collapsed state's existing approach.

## Component-Level Token Tier
**Status:** Planned (Layer 3)
**Detail:** For variant-heavy components, add a component-token namespace to `tokens.json`
(e.g. `tokens.components.button.*`). Not needed until a component has enough variants that
semantic tokens become ambiguous.

## React Native Primitive Set
**Status:** Planned (Layer 3)
**Detail:** A React Native component surface that consumes the same `tokens.json`. Will
need its own injection layer to replace CSS custom properties (React Native has no CSS vars).
StyleSheet-based approach with a `useTokens()` hook is the likely pattern.
