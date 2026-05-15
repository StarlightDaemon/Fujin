You are the Fujin Instance agent, operating inside /mnt/e/Fujin (or the repo root wherever Fujin is checked out).

Read first:
- AGENTS.md
- .raiden/README.md
- .raiden/state/CURRENT_STATE.md
- .raiden/writ/WORKSPACE_AUDIT_PROTOCOL.md

Current objective:
Verify and commit the Edict v0.4.0 migration files that RAIDEN central wrote into this Instance on 2026-05-14. Surface one pre-existing anomaly (OPERATING_RULES.md drift) to the operator for a decision. No new writes are needed for the migration itself; your task is verification, anomaly reporting, and commit.

Known constraints:
- Do not modify CURRENT_STATE.md, OPEN_LOOPS.md, DECISIONS.md, or WORK_LOG.md.
- Do not push without explicit operator confirmation.
- No Co-Authored-By or agent attribution lines in the commit message.
- Do not run raiden_updater.cli apply — use plan only.
- Do not attempt to resolve the OPERATING_RULES.md anomaly yourself — surface it and wait for operator direction.

Already true (RAIDEN central wrote these on 2026-05-14):
- .raiden/writ/WORKSPACE_AUDIT_PROTOCOL.md — new file, v0.4.0 content installed.
  SHA-256: 1fa98a0ab068349d71556b142d433fe52462de0cca237d773e4e3dc2ad5bdbb0
- .raiden/instance/baseline.json — WORKSPACE_AUDIT_PROTOCOL.md entry added;
  installed_edict_version bumped 0.2.0 → 0.4.0.
  Note: OPERATING_RULES.md hash preserved as bfb99726... (original install value).
- .raiden/instance/metadata.json — installed_edict_version bumped 0.2.0 → 0.4.0.
- .raiden/README.md — ## Workspace Audit section appended.
- .gitignore — audit-output exclusion block already present; no change.
- This file (.raiden/local/prompts/audit-protocol-install-handoff.md) — written by RAIDEN central.

Prior install context:
- .raiden/ was originally untracked and installed at v0.2.0 in a prior session.
- Check git log to confirm whether .raiden/ and AGENTS.md have been committed before.

Known anomaly (pre-existing — do not fix without operator direction):
- OPERATING_RULES.md in .raiden/writ/ has baseline hash bfb99726340bae89850bc7e15e75d56ec8da6a95e2300d58d104d5489cdbe847,
  which differs from the current v0.4.0 package hash 97004e665c2dee6076b2f3b560097067b7cb88aa0f8f4e4a7cf57b22b45e69ac.
  This predates the v0.4.0 migration — it originated at the original v0.2.0 install.
- .git/hooks/commit-msg is absent. The plan validator will report [add] for this hook.
- Because of these two issues, the plan validator will return Can apply: True instead of
  Already up to date. This is expected — WORKSPACE_AUDIT_PROTOCOL.md itself will show [unchanged].
- Operator decision required: (a) refresh OPERATING_RULES.md to match the current package
  (requires RAIDEN central to overwrite the file and update baseline.json), or (b) accept
  the current content as intentional and leave the hash mismatch recorded. Also decide
  whether to install the commit-msg hook.

Still open:
1. Run `git log --oneline -5` — check whether .raiden/ and AGENTS.md appear in recent commits.
2. Run `git status --porcelain` — confirm only the migration files (and possibly .raiden/ +
   AGENTS.md if previously untracked) appear. Any unexpected files: stop and surface to operator.
3. Run `grep installed_edict_version .raiden/instance/metadata.json`
   → expected: "0.4.0"
4. Run from /mnt/e/Raiden/toolkit/updater/ (RAIDEN central):
     python3 -m raiden_updater.cli plan \
       --instance /mnt/e/Fujin \
       --package /mnt/e/Raiden/toolkit/updater/fixtures/sample_package
   → WORKSPACE_AUDIT_PROTOCOL.md must show [unchanged].
   → OPERATING_RULES.md will show [update] and hooks/commit-msg will show [add] — expected.
   → Do NOT treat Can apply: True as a migration failure. It reflects the pre-existing drift.
5. Surface the anomaly to the operator:
   "OPERATING_RULES.md in .raiden/writ/ differs from the current package. The baseline hash
   bfb99726... does not match the package hash 97004e66.... Also, .git/hooks/commit-msg is
   absent. WORKSPACE_AUDIT_PROTOCOL.md is correctly installed. Please decide: (a) refresh
   OPERATING_RULES.md via RAIDEN central, or (b) accept the current content. Decision is
   required before this Instance can achieve full plan-validator alignment."
6. Proceed to commit without waiting for the operator decision on the anomaly:
   Stage and commit the migration files. Files to include:
   If .raiden/ not yet in git history:
     AGENTS.md
     .raiden/  (entire directory)
   If .raiden/ already committed, include only:
     .raiden/writ/WORKSPACE_AUDIT_PROTOCOL.md
     .raiden/instance/baseline.json
     .raiden/instance/metadata.json
     .raiden/README.md
     .raiden/local/prompts/audit-protocol-install-handoff.md
   Suggested commit message (first-time .raiden/ commit):
     "install: RAIDEN Edict v0.4.0 — initial .raiden/ install and WORKSPACE_AUDIT_PROTOCOL"
   Suggested commit message (update only):
     "install: RAIDEN Edict v0.2.0 → v0.4.0 (WORKSPACE_AUDIT_PROTOCOL install)"
7. Run `git status --porcelain` after commit — confirm clean.

Do not:
- Modify any managed file in .raiden/writ/ without explicit operator direction
- Attempt to fix the OPERATING_RULES.md or hook anomaly independently
- Reopen settled naming or architecture
- Treat review artifacts as canon unless adopted
- Broaden the task beyond committing the files listed above
- Run the workspace audit itself

Close out with:
- result: commit SHA
- evidence checked: git log check, git diff output, plan validator WORKSPACE_AUDIT_PROTOCOL.md line, version grep result
- remaining risks: OPERATING_RULES.md drift and missing commit-msg hook — operator decision pending
