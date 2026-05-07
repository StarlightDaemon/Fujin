# CLAUDE.md — Fujin Session Anchor

Persistent context for any Claude Code session in this repo. Read this first.

---

## What Fujin Is

Fujin is a **Mantine v7-based UI component library** for workstation-focused web interfaces.
It is not a governance agent and not a backend framework. It provides 9 components, a design
token contract, and CSS custom property theming. Central design rule: **the UI stays out of
the way of data.** No decorative flourishes. No rounded corners. Anywhere.

The only running process is the dev harness (`npm run dev` from repo root). Everything else
is component source, tokens, and governance docs.

---

## Session Startup — Read Order

Stop when you have what the task requires.

1. **`CLAUDE.md`** (this file) — orientation
2. **`llms.txt`** — quick index: what this repo is, what rules apply, where things live
3. **`llms-full.txt`** — full component APIs, token contract, CSS vars, integration notes
4. **`AGENTS.md`** — agent startup rules and hard constraints
5. **`.raiden/README.md`** — RAIDEN Instance control plane read order
6. **`.raiden/state/CURRENT_STATE.md`** — what layer is active, what is done, what is next
7. **`.raiden/state/OPEN_LOOPS.md`** — pending work and unresolved items
8. **`.raiden/state/DECISIONS.md`** — durable decision record
9. **`.raiden/local/`** — local overlay: prompts, rules, context

Read `llms-full.txt` before writing or modifying any component. It is the authoritative
source for prop signatures, CSS var names, and composition patterns.

---

## Inviolable Rules

1. All design values come from `tokens.json`. No hardcoded colors, spacing, radius, or
   font names. Zero exceptions.
2. `borderRadius` is always `tokens.radius.default` — which is `0`. Zero exceptions.
3. Color in components uses only `var(--fujin-*)` CSS custom properties. Never hex. Never
   `tokens.color.*` directly.
4. No Mantine theme overrides without documented justification.
5. No component sets its own external margins. Callers own all layout spacing.
6. Do not modify `tokens.json` without explicit operator instruction.

---

## RAIDEN / Fujin Boundary

Fujin owns: UI components, `tokens.json`, design rules, CSS vars, progressive disclosure
logic, layout patterns.

RAIDEN owns: `.raiden/` control plane, scaffolding, CI/CD, backend integration.

RAIDEN must not modify `tokens.json` or add Mantine theme overrides without Fujin review.
Fujin must not touch `.raiden/writ/` (managed core) or project scaffolding.

---

## Tool Surface

```
npm run dev        # Vite dev harness — exercises all 9 components with live theme toggle
npm run typecheck  # tsc --noEmit
```

No test suite is configured. Run typecheck after component changes.

---

## Layer Status

| Layer | Status | Scope |
|---|---|---|
| Layer 1 | Done | Core components, token foundation, Slate palette |
| Layer 2 | Done | CSS custom property migration, light/dark themes, `FujinToastProvider`, `DataTable`, dev harness |
| Layer 3 | Planned | Component-level token namespace, React Native primitive set (`useTokens()` hook, `StyleSheet`-based) |
