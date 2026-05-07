# HLO TypeScript Error Cleanup Brief

**Repo:** `/mnt/e/HardlinkOrganizer/webapp/frontend`
**Run after changes:** `npx tsc --noEmit` from `webapp/frontend/` — target is zero errors
**Do not modify** any files outside `webapp/frontend/src/` and `webapp/frontend/tsconfig.json`

---

## Context

`npx tsc --noEmit` currently reports ~48 errors across three root causes. One root cause (a
DataTable generic constraint bug in the Fujin repo) has already been fixed upstream. The
remaining work is entirely in `tsconfig.json` and the HLO source files.

---

## Error Class 1 — Wrong path depth in tsconfig.json (causes all TS2307 errors)

**File:** `webapp/frontend/tsconfig.json`

The `paths` block uses `../../` to reach the sibling Fujin repo, but the tsconfig lives at
`webapp/frontend/`, so it needs `../../../` (three levels up) to reach `/mnt/e/Fujin/`.

**Fix — replace the entire `paths` block:**

```json
"paths": {
  "@fujin":   ["../../../Fujin/components/index.ts"],
  "@fujin/*": ["../../../Fujin/components/*"],
  "@tokens":  ["../../../Fujin/tokens.json"]
}
```

This fixes every `TS2307: Cannot find module '@fujin'` and `Cannot find module '@tokens'`
error — roughly 30 of the 48 total errors.

---

## Error Class 2 — Unused React imports (TS6133)

Files that import `React` explicitly don't need to — the project uses `jsx: "react-jsx"` in
tsconfig, which injects the JSX transform automatically.

**Remove** `import React from 'react'` from every file that has it. Do NOT remove other
imports from the same line if they exist (check each import statement individually).

Affected files (one import per file, all at line 1 or 2):

- `src/App.tsx`
- `src/components/VerifyPanel.tsx`
- `src/components/steps/BrowseStep.tsx`
- `src/components/steps/PreviewStep.tsx`
- `src/components/steps/ResultStep.tsx`
- `src/components/steps/SourceStep.tsx`
- `src/state/AppState.tsx`

---

## Error Class 3 — Unused variables (TS6133 / noUnusedLocals)

Two specific unused items, fix separately:

### 3a. `formatBytes` in SourceStep.tsx
`src/components/steps/SourceStep.tsx` defines a `formatBytes` helper function that is never
called within that file (it's used in `BrowseStep.tsx` but was copy-pasted here
unnecessarily). Delete the entire `formatBytes` function from `SourceStep.tsx` only.
Do NOT touch `BrowseStep.tsx` — `formatBytes` is still used there and must stay.

### 3b. `scanning` in DestStep.tsx
`src/components/steps/DestStep.tsx` destructures `scanning` from `useAppState()` but never
uses it. Remove `scanning` from the destructure. If it's the only unused item in that
destructure, just delete the variable name; if other variables in the same destructure ARE
used, keep those and remove only `scanning`.

---

## Verification

After all changes, run:

```
cd /mnt/e/HardlinkOrganizer/webapp/frontend
npx tsc --noEmit
```

Expected: zero errors. If any `TS7006: Parameter 'row' implicitly has an 'any' type` errors
remain after fixing Class 1, add an explicit type annotation to the affected `row` parameter
using the correct interface from `src/api/types.ts` (e.g. `(row: InventoryEntry) =>`).
Those types are already imported in the files that use them.

---

## What NOT to change

- Do not modify any component logic, JSX, or API calls
- Do not add new imports
- Do not add `@ts-ignore` or `any` casts as workarounds
- Do not touch `vite.config.ts` — it is already correct
- Do not touch any files in the Fujin repo
