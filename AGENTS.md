Read `.raiden/README.md` before doing repo-local work.

# Agent Startup

## Required Reading
1. Read `llms.txt` for a quick index of what this repo is and what rules apply.
2. Read `llms-full.txt` for full component APIs, token contract, and integration notes.
3. Read `.raiden/README.md` before any structural or file-system changes (Raiden's domain).

## What This Repo Is
Fujin is a Mantine v7-based UI component toolset. It is NOT a governance agent.
It provides components, tokens, and implementation guides for web and native UI projects.

## Hard Rules
- All design values come from `tokens.json`. No hardcoded colors, spacing, or radius.
- `borderRadius` is always `tokens.radius.default` (0). No exceptions without approval.
- Do not modify `tokens.json` without Fujin oversight.
- Do not introduce a Mantine theme override without documenting the reason.
