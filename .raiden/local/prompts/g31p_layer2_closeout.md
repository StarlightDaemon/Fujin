# G31P Task Brief — Fujin Layer 2 Closeout
> Mechanical transcription and state update pass. All content is provided below.
> Do not invent content. Write exactly what is specified.
> Produce complete file outputs — no placeholders, no ellipsis, no "etc."

---

## 1. CONTEXT

You are working on **Fujin**, a Mantine v7 React component library.
This pass closes out Layer 2 by updating RAIDEN state files and agent orientation documents
to reflect work completed in this session.

**Repo root:** `/mnt/e/Fujin/`

**What happened in this session (your source of truth for all updates below):**
- CSS custom property migration: all 8 components now consume `var(--fujin-*)` for every
  color reference. No `tokens.color.*` references remain in any component.
- Package infrastructure added: `package.json` and `tsconfig.json` created at repo root.
- Vite dev harness created at `dev/` — runs with `npm run dev`, exercises all 8 components
  with theme toggle wired to `useFujinTheme`.
- TypeScript typecheck passes clean.
- Light theme is now fully functional — `FujinThemeProvider` injects CSS vars at runtime;
  components respond to theme switching without re-render.

---

## 2. FILES TO UPDATE

---

### FILE 1: `.raiden/state/CURRENT_STATE.md`

Replace the entire file with:

```markdown
# Current State

- Fujin is a Mantine v7-based UI component toolset
- 8 components exist: ToolShell, DataCard, WorkflowStepper, FormShell, StatusBadge, ActionMenu, SectionHeader, DataTable
- Token contract: Slate palette, 4px spacing base, Verdana typography, JetBrains Mono monospace, radius 0 everywhere
- Dark and light themes both active — FujinThemeProvider injects CSS custom properties at runtime; toggle with `useFujinTheme().toggle()`
- All components consume `var(--fujin-*)` CSS custom properties for color; non-color tokens (spacing, radius, typography) remain as raw values from tokens.json
- Package infrastructure in place: `package.json`, `tsconfig.json`
- Dev harness at `dev/` — run with `npm run dev`; exercises all 8 components with live theme switching
- Layer 2 complete

## Fujin Orientation

- Read `llms.txt` and `llms-full.txt` as the primary Fujin-specific agent orientation files.
```

---

### FILE 2: `.raiden/state/DECISIONS.md`

Replace the entire file with:

```markdown
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
```

---

### FILE 3: `.raiden/state/OPEN_LOOPS.md`

Replace the entire file with:

```markdown
# Open Loops

## ToolShell Mobile Burger Button
**Status:** Unresolved
**Detail:** `ToolShell` exposes `toggleMobile` internally via `useDisclosure` and collapses
the rail on mobile, but no burger button is provided or documented. The `llms-full.txt`
notes "wire a burger button to internal `toggleMobile`" — this is currently the caller's
responsibility with no example. Needs either a built-in burger button prop or a concrete
usage example in the orientation docs.

## Mantine NavLink Active State Background
**Status:** Unresolved
**Detail:** In `ToolShell`, active NavLink items have their `color` set via CSS var, but
Mantine's internal active background highlight uses Mantine's own color system (may render
as Mantine's default blue tint). The background may not align with `var(--fujin-bg-elevated)`.
Needs visual verification in both dark and light themes and a targeted style override if
the Mantine default shows through.

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
```

---

### FILE 4: `.raiden/state/WORK_LOG.md`

Append the following entry (do not remove the existing entry):

```markdown
- 2026-05-03: Layer 2 completion pass — CSS custom property migration across all 8
  components (ActionMenu, DataCard, DataTable, FormShell, SectionHeader, StatusBadge,
  ToolShell, WorkflowStepper); StatusBadge dynamic color lookup refactored to static
  colorMap; package.json + tsconfig.json added; Vite dev harness created at dev/ with
  mock data for all components and live theme toggle; TypeScript typecheck clean;
  light theme now fully functional via FujinThemeProvider CSS var injection.
```

---

### FILE 5: `llms.txt`

Replace only **line 22** — the themes line in the Token Contract Summary block.

Find:
```
- Themes:     Dark only (light theme not yet defined)
```

Replace with:
```
- Themes:     Dark + Light (CSS custom properties via FujinThemeProvider; toggle with useFujinTheme)
```

No other changes to this file.

---

### FILE 6: `llms-full.txt`

**Change 1** — Update the KNOWN GAPS section at the bottom of the file.

Find:
```
## 5. KNOWN GAPS (Planned)
- ~~Data table~~ Done
- Light theme semantic layer
- Component-level token tier (for variant-heavy components)
- React Native primitive set (consumes same tokens.json)
```

Replace with:
```
## 5. KNOWN GAPS (Planned)
- ~~Data table~~ Done
- ~~Light theme semantic layer~~ Done — CSS custom properties via FujinThemeProvider; both themes active
- Component-level token tier (for variant-heavy components) — Layer 3
- React Native primitive set (consumes same tokens.json) — Layer 3
```

**Change 2** — Update the Token Contract Summary themes line in Section 1.

Find:
```
### Themes
```
> Note: This heading may not exist. Instead find the nearest reference to dark/light theme
> status in Section 1 (DESIGN RULES) or Section 2 (TOKEN CONTRACT). Look for any line
> saying "Dark only" or "light theme not yet defined" and update it to reflect that both
> themes are active via CSS custom properties.

If found, update to reflect: Dark + Light active, CSS custom properties, FujinThemeProvider.
If not found, no change needed for this item — Change 1 above is sufficient.

---

## 3. NON-NEGOTIABLE RULES

1. Do not modify any file not listed above.
2. Do not modify `.raiden/writ/` files — those are RAIDEN-managed core.
3. Do not modify `tokens.json`, any component file, or `components/index.ts`.
4. Preserve all existing content in files you are appending to (WORK_LOG.md).
5. Do not add commentary, headers, or metadata not specified above.

---

## 4. OUTPUT FORMAT

For each file, output:

```
### FILE: <relative path from repo root>
```
followed by the complete file contents in a fenced code block.

Output all 6 files. Do not summarize. Do not truncate.
