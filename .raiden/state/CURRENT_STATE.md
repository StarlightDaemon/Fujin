# Current State

- Fujin is a Mantine v7-based UI component toolset
- 9 components exist: ToolShell, DataCard, WorkflowStepper, FormShell, StatusBadge, ActionMenu, SectionHeader, DataTable, FujinToastProvider
- Token contract: Slate palette, 4px spacing base, Verdana typography, JetBrains Mono monospace, radius 0 everywhere
- Dark and light themes both active — FujinThemeProvider injects CSS custom properties at runtime; toggle with `useFujinTheme().toggle()`
- All components consume `var(--fujin-*)` CSS custom properties for color; non-color tokens (spacing, radius, typography, opacity) remain as raw values from tokens.json
- `tokens.json` now includes `opacity.disabled` (0.5) and `opacity.loading` (0.7) — used across 5 components for disabled/loading state rendering
- Package infrastructure in place: `package.json`, `tsconfig.json`
- Dev harness at `dev/` — run with `npm run dev`; exercises all 8 components with live theme switching
- Layer 2 complete (9 components: ToolShell, DataCard, WorkflowStepper, FormShell, StatusBadge, ActionMenu, SectionHeader, DataTable, FujinToastProvider)

## WSL→macOS Migration
- Migration remediation complete (2026-06-07)
- All `/mnt/e/` paths replaced with `/Users/dante/Citadel/` equivalents across AGENTS.md and 10 prompt files
- node_modules rebuilt clean on darwin-arm64 (rollup, esbuild native variants confirmed)
- commit-msg hook permissions corrected (chmod +x)
- Edict v0.6.1 confirmed clean

## Fujin Orientation

- Read `llms.txt` and `llms-full.txt` as the primary Fujin-specific agent orientation files.
