# Current State

- Fujin is a Mantine v7-based UI component toolset
- 11 components exist: ToolShell, DataCard, WorkflowStepper, FormShell, StatusBadge, ActionMenu, SectionHeader, DataTable, FujinToastProvider, ThemeMenu, FujinThemeProvider
- Token contract: Slate palette, 4px spacing base, Verdana typography, JetBrains Mono monospace, radius 0 everywhere
- Dark and light themes both active — FujinThemeProvider injects CSS custom properties at runtime; toggle with `useFujinTheme().toggle()`
- All components consume `var(--fujin-*)` CSS custom properties for color; non-color tokens (spacing, radius, typography, opacity) remain as raw values from tokens.json
- `tokens.json` now includes `opacity.disabled` (0.5) and `opacity.loading` (0.7) — used across 5 components for disabled/loading state rendering
- Package infrastructure in place: `package.json`, `tsconfig.json`
- Dev harness at `dev/` — run with `npm run dev`; exercises all 11 components with live theme switching
- Layer 2 complete (11 components: ToolShell, DataCard, WorkflowStepper, FormShell, StatusBadge, ActionMenu, SectionHeader, DataTable, FujinToastProvider, ThemeMenu, FujinThemeProvider)
- React Native primitive set at `native/` (LOOP-005): native injection layer (`FujinThemeProvider` + `useTokens()`) resolving the same `tokens.json` via the shared `themes/palette` resolvers — no CSS vars — plus primitives StatusBadge, SectionHeader, DataCard. `react-native` is an optional peer dep with a local ambient shim; gated by `npm run typecheck:native` and `npm run verify:native` (web/native parity). Full API in llms-full.txt section 6.

## WSL→macOS Migration

See LOOP-001.

## Fujin Orientation

- Read `llms.txt` and `llms-full.txt` as the primary Fujin-specific agent orientation files.
