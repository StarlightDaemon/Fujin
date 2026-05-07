# Fujin UI Toolset — Agent Explainer

## What Fujin Is

Fujin is a **Mantine v7-based UI component library** for building workstation-focused web (and eventually React Native) interfaces. It is not a governance agent, not a backend framework, and not a design system in the full brand-identity sense. It is a practical, opinionated set of building blocks that enforce visual consistency and structural discipline across every project that adopts it.

The central design philosophy: **the UI stays out of the way of data.** Sharp edges, dense information layout, no decorative flourishes, no rounded corners anywhere. Think tool UIs, internal dashboards, and operator workstations — not consumer apps.

---

## The Three Layers of the Toolkit

### 1. Token Contract (`tokens.json`)

This is the **single source of truth** for all design values. Every component reads from it. No hardcoded colors, sizes, spacing values, or font names anywhere in the codebase — ever.

The contract defines:

| Domain | Key Decisions |
|---|---|
| **Color** | Mantine Open Color palette at runtime; accent is configurable (violet default); status colors are fixed (red/yellow/green/blue) |
| **Spacing** | 4px base unit; named scale: `xxs(2) xs(10) sm(12) md(16) lg(20) xl(24) xxl(32)` |
| **Typography** | Verdana → system fallbacks (body); JetBrains Mono (code); sizes 10–32px; weights 400–700 |
| **Radius** | **0 everywhere, no exceptions.** All sizes resolve to 0. |
| **Opacity** | `disabled: 0.5`, `loading: 0.7` — used across components for state rendering |
| **Shadow** | xs=none through xl; dark-biased box shadows |
| **Breakpoints** | xs–xl (576–1408px) |
| **Transitions** | fast(100ms) / base(150ms) / slow(250ms) with named easings |

Token values are numbers or strings (no px suffix on numeric values — callers append `px` for CSS). Import: `import tokens from '../tokens.json'`.

### 2. CSS Custom Properties (`var(--fujin-*)`)

Colors are **never** referenced from `tokens.json` directly in components. Instead, `FujinThemeProvider` injects 22 named CSS custom properties at runtime that switch automatically between dark and light themes without React re-renders.

The semantic variable groups:

- `--fujin-bg-*` — background layers (base, surface, elevated, overlay)
- `--fujin-text-*` — text roles (primary, secondary, muted, inverse)
- `--fujin-border-*` — border strengths (subtle, default, strong)
- `--fujin-interactive-*` — button/action states (default, hover, active, disabled)
- `--fujin-status-*` — semantic status colors (danger, warning, success, info)
- `--fujin-shadow-*` — elevation levels

This is the **only** way to reference color in components. Not hex. Not `tokens.color.*`. Only `var(--fujin-*)`.

### 3. Component Set (9 components, Layer 2 complete)

All components use inline `style` props — no CSS files, no Mantine theme overrides, no CSS modules. The Mantine theme is intentionally left at its default; Fujin's design values are applied entirely through inline styles and CSS vars.

**Layout / Structural:**

- **`ToolShell`** — The top-level app shell. Left rail navigation that collapses to icon-only (60px) / expands to icon+label (220px). Rail toggle is driven by logo click. Mobile support via a `header` render prop that receives `{ toggleMobile, mobileOpen }`. Active nav item is driven by the `active` prop on each `NavItem`. This is where every app starts.

- **`SectionHeader`** — Consistent header for panels and content sections. Title + optional subtitle + optional right-side action slot. Critical rule: **it does not own its own margins** — the caller sets the gap between the header and its content (always `marginTop` on the content, never `marginBottom` on the header).

**Data Display:**

- **`DataCard`** — Card with progressive disclosure. Primary content always visible; `detail` prop triggers a Collapse toggle below. Actions: first 2 are primary buttons; anything beyond 2 overflows into an `ActionMenu`. Badge slot (right of title, for `StatusBadge`). This enforces the progressive disclosure rule without the caller having to think about it.

- **`DataTable`** — Sortable, paginated table. Generic over row type. Client-side sort by default; `onSortChange` callback for server-side. `loading` with no rows shows a centered `Loader`; `loading` with existing rows shows rows at 50% opacity. `rowActions` slot renders per-row (use `ActionMenu` here). Sort indicators: ↕/↑/↓ in column headers.

- **`StatusBadge`** — Inline status indicator. Maps `success | danger | warning | info | neutral` to the `--fujin-status-*` vars. Uppercase, wide letter-spacing, border matching status color. Text only, no icons.

**Actions:**

- **`ActionMenu`** — Standalone overflow action menu triggered by a ⋯ button. `danger` items render in status danger color. `disabled` items have `opacity: 0.5` and swallowed `onClick`. Positioned `bottom-end` with `radius={tokens.radius.default}`. Used inside `DataCard` overflow and as standalone row actions in `DataTable`.

**Forms / Workflows:**

- **`FormShell`** — Form layout wrapper. Does not own form state — caller uses Mantine `useForm`. Provides submit button (right-aligned), optional secondary actions slot (left-aligned), form-level error display (separate from Mantine's field-level errors), and loading state that prevents double-submit. Caller passes form fields as children.

- **`WorkflowStepper`** — Multi-step workflow with per-step validation. Each step has an optional `validate()` that returns `true` (pass) or an error string (block + display). `allowStepClick` permits navigating back to completed steps. Final step shows "Complete" and fires `onComplete`. Triggers whenever a workflow has more than 3 steps.

**Notifications:**

- **`FujinToastProvider`** — Imperative toast system via React context + portal into `document.body`. Wrap at app root (inside `FujinThemeProvider`). Call `useToast().show({ status, title?, message, duration? })` from any component inside the tree. Toasts stack bottom-right, newest at bottom. Max 5 toasts (oldest trimmed). `duration: false` = persistent until dismissed. Left border accent matches status color.

---

## How the Pieces Work Together (Composition Model)

A standard Fujin app is structured as:

```
FujinThemeProvider (theme + CSS vars injection)
  └── FujinToastProvider (toast context + portal)
        └── ToolShell (nav shell)
              └── Box (caller-owned page layout, gap + padding from tokens)
                    ├── SectionHeader + Box (marginTop for content)
                    │     └── DataCard / DataTable / FormShell / WorkflowStepper
                    └── (more sections...)
```

Key compositional rules:
1. **Caller owns all layout spacing.** No component sets its own external margins. The outer `Box` owns `padding`. Sections are separated by `gap`. Content follows `SectionHeader` via `marginTop` on the content wrapper.
2. **Progressive disclosure is automatic.** `DataCard` handles action overflow internally (>2 → `ActionMenu`). `WorkflowStepper` handles step navigation internally.
3. **Color flows one direction.** `tokens.json` → `FujinThemeProvider` → CSS vars → component inline styles.

---

## Agent Boundaries

| Agent | Domain |
|---|---|
| **Fujin** | UI components, token contract, design rules, progressive disclosure logic, layout patterns |
| **Raiden** | File structure, scaffolding, CI/CD, backend integration, `.raiden/` instance management |

Raiden should never modify `tokens.json` or add Mantine theme overrides without Fujin review. Fujin should never touch `.raiden/writ/` (managed core) or project scaffolding.

---

## Layer Roadmap

- **Layer 1 (done):** Core components, token foundation, Slate palette
- **Layer 2 (done):** CSS custom property migration, light/dark themes, `FujinToastProvider`, `DataTable`, dev harness at `dev/` (Vite)
- **Layer 3 (planned):** Component-level token namespace (for variant-heavy components), React Native primitive set (same `tokens.json`, `StyleSheet`-based with `useTokens()` hook)

---

## Critical Non-Negotiables for Any Agent Working in This Repo

1. All design values come from `tokens.json`. Zero exceptions.
2. `borderRadius` is always `tokens.radius.default` which is `0`. Zero exceptions.
3. Color in components uses only `var(--fujin-*)`. Never hex. Never `tokens.color.*` directly.
4. No Mantine theme overrides without documented justification.
5. No component sets its own external margins — callers own spacing.
6. Read `llms-full.txt` before writing any component. It contains the complete token contract, all 22 CSS vars, and page composition patterns.
