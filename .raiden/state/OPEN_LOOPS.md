# Open Loops

## LOOP-001 — WSL→macOS Migration Remediation
**Status:** Resolved (2026-06-07)
**Detail:** Four findings executed:
- P1: `.git/hooks/commit-msg` permissions corrected from 666 to 755.
- P2: `AGENTS.md` line 28 — `/mnt/e/Raiden/` replaced with `/Users/dante/Citadel/Raiden/`.
- P3: `node_modules` deleted and rebuilt on darwin-arm64; typecheck clean; 2 moderate dev-only vuln (esbuild CORS, vite dep — breaking fix deferred).
- P4: 10 prompt files in `.raiden/local/prompts/` updated; zero `/mnt/e/` references remain.

## LOOP-002 — ToolShell Mobile Burger Button
**Status:** Resolved (2026-05-05)
**Detail:** Added a concrete Mobile usage example to `llms-full.txt` under the ToolShell
section. Shows Mantine `Burger` wired to the `header` render prop with `hiddenFrom="sm"`
and `color="var(--fujin-text-muted)"`. Fallback pattern (UnstyledButton + div bars) also
documented. No `.tsx` changes — the existing render prop API was already correct.

## LOOP-003 — Mantine NavLink Active State Background
**Status:** Resolved (2026-05-05)
**Detail:** Root cause confirmed — Mantine v7's `styles` API does not process CSS selector
strings like `'&[data-active]'`; they are silently ignored. Fixed by replacing `NavLink`
entirely with a custom `UnstyledButton` in the expanded rail state. Active/hover background
now driven by `item.active` and `hoveredLabel` state via inline styles. `NavLink` import
removed. Mirrors the collapsed state's existing approach.

## LOOP-004 — Component-Level Token Tier
**Status:** Planned (Layer 3)
- Gate: trigger not met — a component with variants whose styling cannot be expressed by a single existing semantic token
**Assessment (2026-07-09):** Audited every variant-bearing component across web and the
new `native/` set (StatusBadge status×size, DataCard action states, WorkflowStepper
navBtn primary/ghost, FormShell submit loading, ActionMenu danger/disabled). In each,
every variant maps 1:1 to one existing semantic token (`interactive.*`, `status.*`,
`text.*`, `border.*`); size variants only pick from the existing spacing/fontSize scales.
No ambiguity exists. A `tokens.components.button.*` namespace would today only alias
identical semantic values — premature indirection, which this loop explicitly defers.
The native set introduced no new ambiguity (it mirrors the same variant→semantic mappings).
Verdict: trigger not met; leave Planned. Revisit when a variant needs a value no single
semantic token expresses (e.g. a primary button on a chrome bar needing a background
distinct from `interactive.default`).
**Detail:** For variant-heavy components, add a component-token namespace to `tokens.json`
(e.g. `tokens.components.button.*`). Not needed until a component has enough variants that
semantic tokens become ambiguous.

## LOOP-005 — React Native Primitive Set
**Status:** Closed (2026-07-09)
**Closure:** Built `native/` — token injection layer (`FujinThemeProvider` + `useTokens()`
resolving the same `tokens.json` via the shared `themes/palette` resolvers) plus primitives
StatusBadge, SectionHeader, DataCard. `typecheck:native` clean; `verify:native` asserts
web/native parity. Docs in llms-full.txt section 6.
**Detail:** A React Native component surface that consumes the same `tokens.json`. Will
need its own injection layer to replace CSS custom properties (React Native has no CSS vars).
StyleSheet-based approach with a `useTokens()` hook is the likely pattern.
