# HLO Commit — Mantine theming provider update

**Repo:** `/mnt/e/HardlinkOrganizer`
**Task:** Stage and commit pending changes. Nothing else — no edits, no analysis.

---

## Context

The Fujin theming kit was upgraded. `FujinThemeProvider` now absorbs `MantineProvider`
internally and accepts a `preset` prop. One file in HLO needed updating to match:

- `webapp/frontend/src/main.tsx` — removed standalone `MantineProvider` wrapper and
  redundant `import '@mantine/core/styles.css'` (now owned by FujinThemeProvider).
  Changed `<FujinThemeProvider defaultMode="dark">` to
  `<FujinThemeProvider preset="violet" defaultMode="dark">`.

---

## Exact commands to run

```
cd /mnt/e/HardlinkOrganizer
git add webapp/frontend/src/main.tsx
git commit -m "chore: update FujinThemeProvider usage for preset-based theming kit

Remove standalone MantineProvider and redundant styles.css import.
FujinThemeProvider now absorbs MantineProvider internally.
Add preset=\"violet\" prop to wire the violet Open Color theme."
git log --oneline -3
git status
```

---

## Authorship
Commit as the repo's git user. Do not alter git config.
