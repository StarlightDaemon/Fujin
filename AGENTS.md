# Agent Startup — RAIDEN Instance

This repo runs a RAIDEN Instance control plane in `.raiden/`.

## Read First

1. `.raiden/README.md` — control plane navigation
2. `.raiden/state/CURRENT_STATE.md` — active work and current state
3. `.raiden/state/OPEN_LOOPS.md` — pending work
4. `.raiden/writ/AGENTS.md` — full agent guide: tooling surface, write boundaries, naming canon
5. `llms.txt` — quick index of what Fujin is and what component rules apply
6. `llms-full.txt` — full component APIs, token contract, CSS vars, integration notes

## Key Constraints

- **Do not write to `.raiden/writ/`** — it is RAIDEN-managed core
- **No `Co-Authored-By` in commits** — the `commit-msg` hook enforces this; do not bypass it
- **Mainline branch is `main`** — never `master`
- **D-0016**: on any Writ update — update managed core, preserve local overlay, preserve state,
  stop and report on locally modified managed files

## Naming Canon

`RAIDEN` · `Edict` · `RAIDEN Instance` · `Writ` · `payload` — use exactly; no synonyms.

## RAIDEN Tooling

Lives in the central RAIDEN framework repo (path is operator-specific; recorded in
`.raiden/local/README.md`) — not in this repo.
Invoke from there with `--instance <this-repo-path>` or `--target <this-repo-path>`.

---

## Fujin Hard Rules

Fujin is a Mantine v7-based UI component toolset. It is NOT a governance agent.

- All design values come from `tokens.json`. No hardcoded colors, spacing, or radius.
- `borderRadius` is always `tokens.radius.default` (0). No exceptions without approval.
- Do not modify `tokens.json` without explicit operator instruction.
- Do not introduce a Mantine theme override without documenting the reason.
- Read `llms-full.txt` before writing or modifying any component — it is authoritative for
  prop signatures, CSS var names, and composition patterns.
