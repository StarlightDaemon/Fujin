# Work Log

- 2026-05-03: RAIDEN Instance installed from central RAIDEN repo (E:\Raiden); full init → plan → apply → doctor passed cleanly; state files populated from llms.txt and AGENTS.md source material

- 2026-05-05: FujinToastProvider component added — context + React portal + per-toast
  enter animation + auto-dismiss timers + MAX_TOASTS cap; useToast() hook; four status
  types via STATUS_COLOR map; persistent duration support; ARIA live region; wired into
  dev harness with all four status buttons + persistent test; G31P execution, Fujin
  reviewed and accepted.

- 2026-05-05: llms-full.txt agent orientation pass — added CSS Custom Properties
  quick-reference (all 22 vars + descriptions) and Opacity token docs to Section 2;
  added Section 3.5 Page Composition with provider setup example, full page example,
  and spacing ownership rules summary; G31P execution, Fujin reviewed and accepted.

- 2026-05-05: Audit fix pass — 10 changes across 9 files; added tokens.opacity.disabled/
  loading to tokens.json; replaced 5 hardcoded opacity values; added NAV_ITEM_HEIGHT
  constant in ToolShell; Tooltip radius override added; SectionHeader marginBottom removed;
  DataTable type signatures corrected in llms-full.txt; TextInput radius prop added to
  dev harness; G31P execution, Fujin reviewed and accepted.

- 2026-05-05: Mantine NavLink active state open loop resolved — replaced `NavLink` with
  custom `UnstyledButton` in expanded rail; active/hover background now fully inline-style
  driven via `item.active` + `hoveredLabel` state; root cause was Mantine v7 silently
  dropping `'&[data-active]'` selector strings in `styles` prop; G31P execution, Fujin
  reviewed and accepted.

- 2026-05-05: ToolShell mobile burger button open loop resolved — added Mobile usage
  example to `llms-full.txt` (ToolShell section); Mantine `Burger` wired to `header`
  render prop with token-compliant color and `hiddenFrom="sm"`; G31P execution, Fujin
  reviewed and accepted.

- 2026-05-03: Layer 2 completion pass — CSS custom property migration across all 8
  components (ActionMenu, DataCard, DataTable, FormShell, SectionHeader, StatusBadge,
  ToolShell, WorkflowStepper); StatusBadge dynamic color lookup refactored to static
  colorMap; package.json + tsconfig.json added; Vite dev harness created at dev/ with
  mock data for all components and live theme toggle; TypeScript typecheck clean;
  light theme now fully functional via FujinThemeProvider CSS var injection.
