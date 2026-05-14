# Migration Remediation Handoff — Fujin — Edict v0.4.0 Pre-Migration

## Prompt ID

`raiden.shared.handoff.v1`

## Purpose

Fujin's RAIDEN v0.2.0 install was previously committed. The v0.4.0 migration (v0.3.0
skipped) was halted because `node_modules/` is untracked and NOT in `.gitignore`. The
RAIDEN central agent cannot safely write into a repo with unexplained untracked content.
Resolving the `node_modules/` gitignore situation will clear the blocker.

## Template

```text
You are continuing a bounded work package inside the current repo.

Read first:
- AGENTS.md (if present)
- .raiden/instance/metadata.json
- .gitignore (if present)

Current objective:
- Add node_modules/ to .gitignore (or confirm intentional omission with the operator)
  so git status --porcelain is empty and the RAIDEN central agent can proceed with
  the Edict v0.4.0 migration (v0.3.0 skipped).

Known constraints:
- Do NOT modify any file under .raiden/writ/ — these are RAIDEN-managed.
- Do NOT run the workspace audit.
- Commit attribution: no Co-Authored-By or agent attribution lines.

Already true (as of step-2 halt, 2026-05-13):
- RAIDEN v0.2.0 install is committed (commit 8c67467, 2026-05-03).
- Dirty tree at halt: ?? node_modules/ (untracked, not in .gitignore).
- Current branch: main.
- installed_edict_version in metadata.json: 0.2.0.

Still open:
1. Confirm with the operator: should node_modules/ be gitignored?
   For a Node.js/frontend project (Fujin is a Vite/React frontend), this is the
   standard answer: yes, add node_modules/ to .gitignore.
   If the operator has a reason to track node_modules/, document that reason and
   commit node_modules/ instead.
2. If gitignoring (standard path):
   - Add node_modules/ to .gitignore. Also add the canonical RAIDEN audit-output
     exclusions if not already present:
       # RAIDEN audit outputs — operational findings, not framework content
       audit-reports/
       .raiden/state/AUDIT_LOG.md
       .raiden/state/last-audit.md
   - Commit .gitignore:
     "chore: add node_modules to .gitignore and RAIDEN audit-output exclusions"
3. Verify git status --porcelain is empty.
4. Signal to the operator: Fujin is ready for the RAIDEN central agent to run the
   v0.4.0 migration prompt from
   /mnt/e/Raiden/toolkit/prompts/audit-protocol-migration-v0.4.0-prompt.md
   targeting --instance /mnt/e/Fujin. (v0.3.0 skipped; v0.4.0 applied directly.)

Additional note: the step-2 session noted that Fujin still has untracked repo files
(components/, tokens.json, llms*.txt, writ/) beyond node_modules/. These are separate
from the RAIDEN migration blocker but should be addressed in a follow-up operator commit.

Do not:
- reopen settled naming or architecture
- treat review artifacts as canon unless adopted
- broaden the task beyond clearing the node_modules/ dirty-tree condition
- run the workspace audit

Close out with:
- result: node_modules/ gitignored (or tracked as directed by operator), working tree
  clean, operator notified RAIDEN central can proceed
- evidence checked: git status --porcelain empty, .gitignore contains node_modules/,
  .raiden/instance/metadata.json shows installed_edict_version 0.2.0
- remaining risks: other untracked non-RAIDEN repo files (components/, tokens.json,
  llms*.txt, writ/) still need a separate operator follow-up commit
```
