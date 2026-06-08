# Open Loops

## WSL→macOS Migration Remediation
**Status:** Resolved (2026-06-07)
**Detail:** Edict v0.6.1 confirmed clean. Four findings executed:
- P1: `.git/hooks/commit-msg` permissions corrected from 666 to 755.
- P2: `AGENTS.md` line 28 — `/mnt/e/Raiden/` replaced with `/Users/dante/Citadel/Raiden/`.
- P3: `node_modules` deleted and rebuilt on darwin-arm64; typecheck clean; 2 moderate dev-only vuln (esbuild CORS, vite dep — breaking fix deferred).
- P4: 10 prompt files in `.raiden/local/prompts/` updated; zero `/mnt/e/` references remain.

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
