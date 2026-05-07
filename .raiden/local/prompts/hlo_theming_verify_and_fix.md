# HLO Theming Verification + TypeScript Cleanup Brief

**Repo:** `/mnt/e/HardlinkOrganizer/webapp/frontend`
**Verification command:** `npx tsc --noEmit` from `webapp/frontend/` — target is zero errors
**Do not modify** any files in the Fujin repo at `/mnt/e/Fujin/`

---

## Context

The Fujin UI kit (`/mnt/e/Fujin`) has been updated with two new features:

1. **`ThemeMenu` component** — a gear icon button + popover with Light/Dark mode toggle.
   Lives at `/mnt/e/Fujin/components/ThemeMenu.tsx`, exported from the Fujin index.

2. **`--fujin-layout-content-width` CSS custom property** — fluid responsive max-width
   (`clamp(560px, 78vw, 2400px)`) injected by `FujinThemeProvider`.

HLO's `AppLayout.tsx` and `App.tsx` have been updated to use these. Your job is to verify
those updates are actually in place, complete anything missing, then fix the TypeScript
errors so `npx tsc --noEmit` exits clean.

---

## Step 1 — Verify AppLayout.tsx

Open `src/components/AppLayout.tsx` and confirm ALL of the following are present:

- [ ] `import { ThemeMenu } from '@fujin'` at the top
- [ ] `const STATUSBAR_HEIGHT = 28` constant defined
- [ ] A fixed bottom bar div with `position: 'fixed', bottom: 0, height: STATUSBAR_HEIGHT`
- [ ] The bottom bar contains: health dot + "connected/disconnected" text + `v0.3.0` on the left
- [ ] The bottom bar contains `<ThemeMenu />` on the right
- [ ] The body div uses `marginBottom: STATUSBAR_HEIGHT` (not just `marginTop`)
- [ ] The health dot and version string have been REMOVED from the header (they moved to the status bar)

If any item above is missing, implement it. The full intended AppLayout structure is:

```
[Fixed top header]  — app title left, nav tabs right. No health dot or version here.
[Scrollable body]   — main content + history sidebar side by side
[Fixed bottom bar]  — ● connected/disconnected  v0.3.0          ⚙
```

Header height: 48px. Status bar height: 28px. Sidebar width: 320px.
All colors via `var(--fujin-*)` CSS custom properties. No hex values.

## Step 2 — Verify App.tsx

Open `src/App.tsx` and confirm:

- [ ] The content wrapper div uses `maxWidth: 'var(--fujin-layout-content-width)'`
      (not a hardcoded number like `900`)

If missing, replace whatever fixed `maxWidth` value is there with
`maxWidth: 'var(--fujin-layout-content-width)'`.

---

## Step 3 — Fix tsconfig.json paths (root cause of ~30 TS2307 errors)

Open `webapp/frontend/tsconfig.json`. The `paths` block currently has wrong relative
depths — it uses `../../` but needs `../../../` to reach the sibling Fujin repo.

Replace the paths block with:

```json
"paths": {
  "@fujin":   ["../../../Fujin/components/index.ts"],
  "@fujin/*": ["../../../Fujin/components/*"],
  "@tokens":  ["../../../Fujin/tokens.json"]
}
```

Do not touch any other part of `tsconfig.json`.

---

## Step 4 — Fix unused imports and variables

### Remove unused React imports
The project uses `jsx: "react-jsx"` — explicit React imports are not needed.
Remove `import React from 'react'` from every file that has it as a standalone import.
Check each file individually; do not remove React if it appears on the same line as other
used imports.

Files to check (remove the React import if present):
- `src/App.tsx`
- `src/components/AppLayout.tsx`
- `src/components/VerifyPanel.tsx`
- `src/components/steps/BrowseStep.tsx`
- `src/components/steps/PreviewStep.tsx`
- `src/components/steps/ResultStep.tsx`
- `src/components/steps/SourceStep.tsx`
- `src/state/AppState.tsx`

### Remove two specific unused variables
- `src/components/steps/SourceStep.tsx` — delete the `formatBytes` function entirely.
  It is defined in this file but never called here. Do NOT touch `BrowseStep.tsx` where
  it is used.
- `src/components/steps/DestStep.tsx` — remove `scanning` from the `useAppState()`
  destructure. Keep all other destructured values.

---

## Step 5 — Verify

Run from `webapp/frontend/`:

```
npx tsc --noEmit
```

Expected: zero errors.

If any `TS7006: Parameter 'row' implicitly has an 'any' type` errors remain after Steps 3–4,
add an explicit type to the affected `row` parameter using the correct type from
`src/api/types.ts`. The types are already imported in those files.

---

## Hard rules

- No hex color values — use `var(--fujin-*)` CSS custom properties only
- No `borderRadius` other than `0` — zero everywhere, no exceptions
- No hardcoded `maxWidth` pixel values — use `var(--fujin-layout-content-width)`
- No `@ts-ignore` or `any` casts as workarounds
- Do not modify any file in `/mnt/e/Fujin/`
- Do not modify `vite.config.ts` — it is correct
