# G31P Task Brief — Fujin Layer 2 Completion
> Prepare this prompt carefully. All output is reviewed by Fujin before acceptance.
> Produce clean, complete file outputs — no placeholders, no ellipsis, no "etc."

---

## 1. CONTEXT

You are working on **Fujin**, a Mantine v7 React component library.

**Repo root:** `/mnt/e/Fujin/`

**File layout:**
```
tokens.json                 ← single source of truth for all design values
components/
  ActionMenu.tsx
  DataCard.tsx
  DataTable.tsx
  FormShell.tsx
  FujinThemeProvider.tsx
  SectionHeader.tsx
  StatusBadge.tsx
  ToolShell.tsx
  WorkflowStepper.tsx
  index.ts
```

**How the theme system works:**
`FujinThemeProvider` runs `injectVars(mode)` which sets CSS custom properties on `:root`
(e.g. `--fujin-bg-surface`, `--fujin-text-primary`). It supports both `dark` and `light`
modes, and `tokens.json` contains full token values for both themes.

**The bug:** Every component imports `tokens from '../tokens.json'` and reads color values
directly (e.g. `tokens.color.semantic.background.surface`). These are hardcoded dark hex
strings. The CSS custom properties injected by `FujinThemeProvider` are never consumed,
so light theme switching is broken. **Non-color tokens** (spacing, radius, typography,
transitions) are fine as raw values — they do not change per theme.

---

## 2. COMPLETE CSS VARIABLE SUBSTITUTION MAP

Replace every `tokens.color.*` reference with the corresponding CSS var string.
All other `tokens.*` references (spacing, radius, typography, transition) are **unchanged**.

| `tokens.color.semantic.*` reference              | Replace with                         |
|--------------------------------------------------|--------------------------------------|
| `tokens.color.semantic.background.base`          | `'var(--fujin-bg-base)'`             |
| `tokens.color.semantic.background.surface`       | `'var(--fujin-bg-surface)'`          |
| `tokens.color.semantic.background.elevated`      | `'var(--fujin-bg-elevated)'`         |
| `tokens.color.semantic.background.overlay`       | `'var(--fujin-bg-overlay)'`          |
| `tokens.color.semantic.text.primary`             | `'var(--fujin-text-primary)'`        |
| `tokens.color.semantic.text.secondary`           | `'var(--fujin-text-secondary)'`      |
| `tokens.color.semantic.text.muted`               | `'var(--fujin-text-muted)'`          |
| `tokens.color.semantic.text.inverse`             | `'var(--fujin-text-inverse)'`        |
| `tokens.color.semantic.border.subtle`            | `'var(--fujin-border-subtle)'`       |
| `tokens.color.semantic.border.default`           | `'var(--fujin-border-default)'`      |
| `tokens.color.semantic.border.strong`            | `'var(--fujin-border-strong)'`       |
| `tokens.color.semantic.interactive.default`      | `'var(--fujin-interactive-default)'` |
| `tokens.color.semantic.interactive.hover`        | `'var(--fujin-interactive-hover)'`   |
| `tokens.color.semantic.interactive.active`       | `'var(--fujin-interactive-active)'`  |
| `tokens.color.semantic.interactive.disabled`     | `'var(--fujin-interactive-disabled)'`|
| `tokens.color.semantic.status.danger`            | `'var(--fujin-status-danger)'`       |
| `tokens.color.semantic.status.warning`           | `'var(--fujin-status-warning)'`      |
| `tokens.color.semantic.status.success`           | `'var(--fujin-status-success)'`      |
| `tokens.color.semantic.status.info`              | `'var(--fujin-status-info)'`         |

**Special case — StatusBadge dynamic lookup:**
The current code does:
```ts
const color = status === 'neutral'
  ? tokens.color.semantic.text.muted
  : tokens.color.semantic.status[status];
```
Replace with a static map (dynamic property access can't use CSS vars):
```ts
const colorMap: Record<StatusBadgeProps['status'], string> = {
  success: 'var(--fujin-status-success)',
  danger:  'var(--fujin-status-danger)',
  warning: 'var(--fujin-status-warning)',
  info:    'var(--fujin-status-info)',
  neutral: 'var(--fujin-text-muted)',
};
const color = colorMap[status];
```

**After migration:** The `import tokens from '../tokens.json'` line stays in every
component — it's still needed for spacing, radius, and typography values.

---

## 3. TASK 1 — Package Infrastructure

Create these two files at repo root.

### `/mnt/e/Fujin/package.json`
```json
{
  "name": "@fujin/ui",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev --config dev/vite.config.ts",
    "typecheck": "tsc --noEmit"
  },
  "peerDependencies": {
    "@mantine/core": "^7.0.0",
    "@mantine/hooks": "^7.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@mantine/core": "^7.0.0",
    "@mantine/hooks": "^7.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  },
  "resolveJsonModule": true
}
```

### `/mnt/e/Fujin/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["components", "dev"]
}
```

---

## 4. TASK 2 — CSS Variable Migration

Apply the substitution map from Section 2 to every file listed below.
Produce each complete file as output. Do not truncate.

Files to migrate:
- `components/ActionMenu.tsx`
- `components/DataCard.tsx`
- `components/DataTable.tsx`
- `components/FormShell.tsx`
- `components/SectionHeader.tsx`
- `components/StatusBadge.tsx`
- `components/ToolShell.tsx`
- `components/WorkflowStepper.tsx`

`components/FujinThemeProvider.tsx` and `components/index.ts` are **not modified**.

**Rules:**
- Only color references change. Spacing, radius, typography, transition values are untouched.
- No new imports. No new abstractions. No helper functions. Pure substitution.
- Template literals stay template literals — e.g. `` `1px solid ${tokens.color.semantic.border.subtle}` `` becomes `` `1px solid var(--fujin-border-subtle)` `` (drop the interpolation, inline the string).
- The `import tokens from '../tokens.json'` line stays in every file.

---

## 5. TASK 3 — Visual Dev Harness

Create a minimal Vite + React dev app to visually test all components and verify theme switching.

**Do not use Storybook.** This is a single-page harness, not a docs site.

### Files to create:

#### `dev/vite.config.ts`
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'dev',
});
```

#### `dev/index.html`
Standard Vite HTML entry point that loads `main.tsx`.

#### `dev/main.tsx`
Mount `<App />` into `#root` with `@mantine/core` `MantineProvider` (no theme overrides)
wrapping `FujinThemeProvider` (defaultMode `'dark'`).

Include the Mantine CSS import:
```ts
import '@mantine/core/styles.css';
```

#### `dev/App.tsx`
A single-page layout that renders all 8 components with realistic mock data.
Wire a theme-toggle button in the top-right that calls `toggle()` from `useFujinTheme`.

**Component mock requirements:**

- **ToolShell**: 3 nav items (Dashboard, Reports, Settings) with placeholder icons (text chars are fine: `'⊞'`, `'≡'`, `'⚙'`). Main area content is the rest of the page.

- **SectionHeader**: Title `"Active Jobs"`, description `"Showing last 24h"`, action is a plain text button `"+ New"`.

- **DataCard**: Title `"Job #1042"`, badge is `<StatusBadge status="success" label="Running" />`, primary content is 2 lines of key/value text, detail content is a paragraph of secondary info, 4 actions (to trigger ActionMenu overflow).

- **StatusBadge**: Render all 5 variants side by side: success, danger, warning, info, neutral.

- **ActionMenu**: Standalone, 3 items (Edit, Duplicate, Delete as danger).

- **WorkflowStepper**: 3 steps. Step 1 has a `validate()` that checks a boolean state toggled by a button (so you can test the error path). Step 3 is the final step.

- **FormShell**: A `useForm` form with a single `TextInput` for "Job Name". Submit triggers a 1.5s `loading` state (use `setTimeout`). Show a mock server error after submit.

- **DataTable**: 5 columns (ID, Name, Status, Duration, Created). 8 mock rows. `pageSize={5}`. Status column uses `StatusBadge`. `rowActions` uses `ActionMenu`.

**Layout**: Use `ToolShell` as the outer shell. Inside `AppShell.Main`, render sections separated by `SectionHeader`. Group components logically — don't just dump them in a list.

---

## 6. NON-NEGOTIABLE RULES (apply to all output)

1. **No hardcoded color hex values** — ever. All colors via CSS var strings.
2. **`borderRadius` is always `tokens.radius.default`** — which equals `0`. No exceptions.
3. **All spacing from `tokens.spacing.*`** — no bare pixel numbers.
4. **No new abstractions** — no helper functions, no new hooks, no shared style objects beyond what exists.
5. **No comments** unless the behavior would surprise a reader.
6. **Mantine `color` prop note**: In Mantine v7, passing `"var(--fujin-text-muted)"` to a `color` prop is valid. Use it where needed (e.g. `<Loader color="var(--fujin-text-muted)" />`).

---

## 7. OUTPUT FORMAT

For each file, output:

```
### FILE: <relative path from repo root>
```
followed by the complete file contents in a fenced code block.

Output all files. Do not summarize. Do not truncate with "rest unchanged" or "...".
