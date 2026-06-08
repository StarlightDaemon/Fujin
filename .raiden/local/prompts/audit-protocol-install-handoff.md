You are the Fujin Instance agent, operating inside /Users/dante/Citadel/Fujin (or wherever Fujin is checked out).

Read first:
- AGENTS.md
- .raiden/README.md
- .raiden/state/CURRENT_STATE.md
- .raiden/writ/WORKSPACE_AUDIT_PROTOCOL.md

Current objective:
Verify and commit the Edict v0.4.0 migration files that RAIDEN central wrote into this Instance on 2026-05-14. No new writes are needed — RAIDEN central completed all file operations and all anomalies are resolved; your task is verification and commit only.

Known constraints:
- Do not modify CURRENT_STATE.md, OPEN_LOOPS.md, DECISIONS.md, or WORK_LOG.md.
- Do not push without explicit operator confirmation.
- No Co-Authored-By or agent attribution lines in the commit message.
- Do not run raiden_updater.cli apply — use plan only.

Already true (RAIDEN central wrote these on 2026-05-14; baseline corrected 2026-05-15):
- .raiden/writ/WORKSPACE_AUDIT_PROTOCOL.md — new file, v0.4.0 content.
  SHA-256: 1fa98a0ab068349d71556b142d433fe52462de0cca237d773e4e3dc2ad5bdbb0
- .raiden/instance/baseline.json — WORKSPACE_AUDIT_PROTOCOL.md entry added;
  installed_edict_version bumped 0.2.0 → 0.4.0; OPERATING_RULES.md hash corrected
  to 97004e66... (canonical package hash — prior anomaly resolved).
- .raiden/instance/metadata.json — installed_edict_version bumped 0.2.0 → 0.4.0.
- .raiden/README.md — ## Workspace Audit section appended.
- .gitignore — audit-output exclusion block already present; no change.
- plan validator confirms: Block reason: Already up to date — no changes needed.
  (No anomalies, no conflicts — fully clean.)

Prior install context:
- .raiden/ was originally untracked. Check git log to confirm whether .raiden/ and
  AGENTS.md have been committed before. If not: include them in the commit.

Still open:
1. Run `git log --oneline -5` — confirm whether .raiden/ and AGENTS.md are already tracked.
2. Run `git status --porcelain` — confirm expected files only; stop if unexpected.
3. Run `grep installed_edict_version .raiden/instance/metadata.json` → expect "0.4.0"
4. Run from /Users/dante/Citadel/Raiden/toolkit/updater/:
     python3 -m raiden_updater.cli plan \
       --instance /Users/dante/Citadel/Fujin \
       --package /Users/dante/Citadel/Raiden/toolkit/updater/fixtures/sample_package
   → expect: Block reason: Already up to date — no changes needed
5. Commit. If .raiden/ not yet in git history: commit AGENTS.md + .raiden/ (entire dir).
   If already committed, include only:
     .raiden/writ/WORKSPACE_AUDIT_PROTOCOL.md
     .raiden/instance/baseline.json
     .raiden/instance/metadata.json
     .raiden/README.md
     .raiden/local/prompts/audit-protocol-install-handoff.md
   Message (first-time): "install: RAIDEN Edict v0.4.0 — initial .raiden/ install and WORKSPACE_AUDIT_PROTOCOL"
   Message (update): "install: RAIDEN Edict v0.2.0 → v0.4.0 (WORKSPACE_AUDIT_PROTOCOL install)"
6. Run `git status --porcelain` after commit — confirm clean.

Do not:
- Modify any managed file in .raiden/writ/
- Reopen settled naming or architecture
- Treat review artifacts as canon unless adopted
- Broaden the task beyond committing the files listed above
- Run the workspace audit

Close out with:
- result: commit SHA
- evidence checked: git log check, git diff output, plan validator output, version grep
- remaining risks: none
