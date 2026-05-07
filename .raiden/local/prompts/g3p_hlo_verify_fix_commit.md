# G3P Brief — HLO: Verify Theming, Fix TypeScript, Commit

**Repo:** `/mnt/e/HardlinkOrganizer`
**Working dir for TS verification:** `/mnt/e/HardlinkOrganizer/webapp/frontend`
**Do NOT modify** any files in `/mnt/e/Fujin/`

---

## What happened

The Fujin UI kit was updated this session. HLO's AppLayout and App.tsx were updated live
during the session. Your job is to verify those edits are in place, apply anything missing,
fix the TypeScript errors, then commit everything clean.

---

## Step 1 — Verify App.tsx

Open `webapp/frontend/src/App.tsx`. Confirm the content wrapper uses:

```tsx
maxWidth: 'var(--fujin-layout-content-width)'
```

Not a hardcoded number like `900`. Fix if wrong.

---

## Step 2 — Verify AppLayout.tsx

Open `webapp/frontend/src/components/AppLayout.tsx`. Confirm ALL of the following:

- [ ] `import { ThemeMenu } from '@fujin'` at the top
- [ ] `const STATUSBAR_HEIGHT = 28` constant defined
- [ ] Fixed bottom bar: `position: 'fixed', bottom: 0, height: STATUSBAR_HEIGHT`
- [ ] Bottom bar LEFT: health dot + "connected" or "disconnected" text + version string
- [ ] Bottom bar RIGHT: `<ThemeMenu />`
- [ ] Body div uses `marginBottom: STATUSBAR_HEIGHT`
- [ ] Health dot and version string are NOT in the header

If anything is missing, implement it. Intended structure:

```
[Fixed header 48px]   — title left, nav tabs right
[Scrollable body]     — content + sidebar (320px)
[Fixed status bar 28px] — ● connected  v0.3.0        ⚙
```

No hex colors. All colors via `var(--fujin-*)`. No borderRadius other than 0.

---

## Step 3 — Fix tsconfig.json path depth

Open `webapp/frontend/tsconfig.json`. The `paths` block uses wrong relative depth.

Replace the entire `paths` block with:

```json
"paths": {
  "@fujin":   ["../../../Fujin/components/index.ts"],
  "@fujin/*": ["../../../Fujin/components/*"],
  "@tokens":  ["../../../Fujin/tokens.json"]
}
```

Do not touch anything else in tsconfig.json.

---

## Step 4 — Remove unused React imports

The project uses `jsx: "react-jsx"` — explicit React imports are unnecessary and cause
TS6133 errors. Remove `import React from 'react'` from each of these files:

- `src/App.tsx`
- `src/components/AppLayout.tsx`
- `src/components/VerifyPanel.tsx`
- `src/components/steps/BrowseStep.tsx`
- `src/components/steps/PreviewStep.tsx`
- `src/components/steps/ResultStep.tsx`
- `src/components/steps/SourceStep.tsx`
- `src/state/AppState.tsx`

Check each file individually. Only remove the React import if it is a standalone line.
Do not remove named imports from `'react'` (e.g. `import { useState } from 'react'`).

---

## Step 5 — Remove two unused variables

### 5a. `formatBytes` in SourceStep.tsx
`src/components/steps/SourceStep.tsx` has a `formatBytes` function that is never called
in that file. Delete the entire function. Do NOT touch `BrowseStep.tsx` — it uses
`formatBytes` and must keep it.

### 5b. `scanning` in DestStep.tsx
`src/components/steps/DestStep.tsx` destructures `scanning` from `useAppState()` but
never uses it. Remove `scanning` from the destructure only. Keep all other variables.

---

## Step 6 — Verify

Run from `webapp/frontend/`:

```bash
npx tsc --noEmit
```

Expected: **zero errors.** If any `TS7006: Parameter 'row' implicitly has an 'any' type`
errors remain, add an explicit type annotation using the correct interface from
`src/api/types.ts` — those types are already imported in the affected files.

Do not add `@ts-ignore` or `any` casts.

---

## Step 7 — Commit

Once `npx tsc --noEmit` exits clean, stage and commit:

```bash
cd /mnt/e/HardlinkOrganizer
git add webapp/frontend/src/ webapp/frontend/tsconfig.json
git commit -m "feat: Fujin theming — ThemeMenu, chrome tokens, fluid layout, TSC clean

- AppLayout: fixed status bar with ThemeMenu gear, chrome vars on header/bar
- App.tsx: fluid maxWidth via --fujin-layout-content-width token
- tsconfig: fix @fujin path depth (../../ -> ../../../)
- Remove unused React imports (react-jsx transform handles injection)
- Remove formatBytes from SourceStep, scanning from DestStep destructure"
git log --oneline -3
git status
```

Commit as the repo's configured git user. Do not alter git config.

---

## Hard rules

- No hex color values — `var(--fujin-*)` only
- No `borderRadius` other than `0`
- No hardcoded `maxWidth` pixel values
- No `@ts-ignore` or `any` casts
- Do not modify anything in `/mnt/e/Fujin/`
- Do not modify `vite.config.ts`
