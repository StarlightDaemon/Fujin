# Work Log

- 2026-05-03: RAIDEN Instance installed from central RAIDEN repo (E:\Raiden); full init → plan → apply → doctor passed cleanly; state files populated from llms.txt and AGENTS.md source material

- 2026-05-05: FujinToastProvider component added — context + React portal + per-toast
  enter animation + auto-dismiss timers + MAX_TOASTS cap; useToast() hook; four status
  types via STATUS_COLOR map; persistent duration support; ARIA live region; wired into
  dev harness with all four status buttons + persistent test; G31P execution, Fujin
  reviewed and accepted.

- 2026-05-05: llms-full.txt agent orientation pass — added CSS Custom Properties
  quick-reference (all 22 vars + descriptions) and Opacity token docs to Section 2;
  added Section 3.5 Page Composition with provider setup example, full page example,
  and spacing ownership rules summary; G31P execution, Fujin reviewed and accepted.

- 2026-05-05: Audit fix pass — 10 changes across 9 files; added tokens.opacity.disabled/
  loading to tokens.json; replaced 5 hardcoded opacity values; added NAV_ITEM_HEIGHT
  constant in ToolShell; Tooltip radius override added; SectionHeader marginBottom removed;
  DataTable type signatures corrected in llms-full.txt; TextInput radius prop added to
  dev harness; G31P execution, Fujin reviewed and accepted.

- 2026-05-05: Mantine NavLink active state open loop resolved — replaced `NavLink` with
  custom `UnstyledButton` in expanded rail; active/hover background now fully inline-style
  driven via `item.active` + `hoveredLabel` state; root cause was Mantine v7 silently
  dropping `'&[data-active]'` selector strings in `styles` prop; G31P execution, Fujin
  reviewed and accepted.

- 2026-05-05: ToolShell mobile burger button open loop resolved — added Mobile usage
  example to `llms-full.txt` (ToolShell section); Mantine `Burger` wired to `header`
  render prop with token-compliant color and `hiddenFrom="sm"`; G31P execution, Fujin
  reviewed and accepted.

- 2026-05-03: Layer 2 completion pass — CSS custom property migration across all 8
  components (ActionMenu, DataCard, DataTable, FormShell, SectionHeader, StatusBadge,
  ToolShell, WorkflowStepper); StatusBadge dynamic color lookup refactored to static
  colorMap; package.json + tsconfig.json added; Vite dev harness created at dev/ with
  mock data for all components and live theme toggle; TypeScript typecheck clean;
  light theme now fully functional via FujinThemeProvider CSS var injection.

### 2026-07-09 — Edict v2.0.0 + state normalization

- **Did:** Ran the Edict v2.0.0 update against this Instance (plan → apply →
  re-plan clean): README.md, OPERATING_RULES.md, WORKSPACE_AUDIT_PROTOCOL.md,
  FORK_REVIEW_PROTOCOL.md, and .raiden/writ/AGENTS.md updated; ROUTING_POLICY.md
  added; MODEL_TIERS.md removed via the managed-file-removal path (expected
  `managed_file_removal` warn on plan); commit-msg hook carried forward
  unchanged. Stamped `state_schema_version: 2` into
  `.raiden/instance/metadata.json`. Replaced the gitignored
  `.raiden/local/MODEL_MAP.md` tier overlay with `.raiden/local/ROUTING.md`
  (R1-R4 ladder + offload pool; the offload-pool rule carries forward Fujin's
  own "G31P Offload Boundary" decision fleet-wide) and dropped the now-dead
  `.raiden/local/.gitignore` entry. Moved the ~55-line root `CLAUDE.md`
  verbatim to `.raiden/local/rules/legacy-claude-guidance.md` (with an origin/
  supersession header) and reduced root `CLAUDE.md` to a 2-line pointer to
  `AGENTS.md`, per the new CLAUDE.md-pointer rule.
- **Result:** Instance at Edict v2.0.0, root AGENTS.md's "Fujin Hard Rules"
  section and `tokens.json` untouched (byte-identical / unmodified) throughout.
- **Relocated (state normalization, Fact-Home Rule):**
  - `.raiden/state/OPEN_LOOPS.md`, WSL→macOS Migration Remediation entry
    (now LOOP-001): removed the sentence "Edict v0.6.1 confirmed clean." —
    the P1-P4 remediation detail itself is unchanged and stays in that entry.
  - `.raiden/state/CURRENT_STATE.md`, "WSL→macOS Migration" section: removed
    the bullet "Edict v1.0.0 confirmed clean (updated 2026-06-12, commit
    a51fd72)" and the rest of that section's restated migration detail
    (already carried by LOOP-001); the section now reads "See LOOP-001."
  - Assigned citable IDs LOOP-001..LOOP-005 to the existing
    `.raiden/state/OPEN_LOOPS.md` entries (previously untitled by ID) so
    CURRENT_STATE.md can cite rather than restate them.
- **Removed (no unique content beyond what git history already carries):**
  the hand-written "Last Updated: 2026-07-08" footer in
  `.raiden/state/CURRENT_STATE.md`.
- **Loops:** Advanced LOOP-001 (id assigned; version-prose trimmed). No loops
  opened or closed by this entry.
- **Next:** Run `doctor` and confirm `claude_md_substantive` and
  `version_prose` are clear on `.raiden/state/CURRENT_STATE.md` and
  `.raiden/state/OPEN_LOOPS.md`; note that this WORK_LOG.md entry itself will
  still trip the mechanical `version_prose` lint (it names "Edict v2.0.0" and
  the relocated "Edict v0.6.1" / "Edict v1.0.0" strings by design, as the
  dated historical record) — that residual WARN is expected and reported at
  acceptance, not a fact-home violation.

### 2026-07-09 — React Native primitive set (LOOP-005)

- **Did:** Built the `native/` surface. Injection layer: `native/theme/tokens.ts`
  resolves the same `tokens.json` into a plain `FujinTokens` object by calling the
  shared `themes/palette` `resolveDark`/`resolveLight` (the exact functions the web
  pipeline and `export-tokens` use), re-keying `--fujin-*` CSS variable names to
  camelCase roles; `native/theme/FujinThemeProvider.tsx` delivers it via context with
  `useFujinTheme()`/`useTokens()` (React Native has no CSS custom properties).
  Primitives StatusBadge, SectionHeader, DataCard mirror their web props with
  `StyleSheet`-based styling; DataCard's overflow expands inline (no RN popover portal).
  Added an optional `react-native` peer dep with a local ambient shim
  (`native/types/react-native.d.ts`), a dedicated `native/tsconfig.json`, and scripts
  `typecheck:native` + `verify:native`.
- **Result:** `typecheck` (web) clean, `typecheck:native` clean, `verify:native`
  passes 11 checks (22 color roles x dark/light, accent divergence, RN unit
  conversions). Docs added as llms-full.txt section 6; llms.txt and CURRENT_STATE.md
  updated. `tokens.json` untouched.
- **Loops:** Closed LOOP-005.

### 2026-07-09 — Component-level token tier evaluation (LOOP-004)

- **Did:** Audited every variant-bearing component across the web set and the new
  `native/` set for the LOOP-004 trigger ("a component has enough variants that
  semantic tokens become ambiguous").
- **Result:** Trigger not met. Every variant (StatusBadge status×size, DataCard
  action states, WorkflowStepper primary/ghost, FormShell loading, ActionMenu
  danger/disabled) resolves 1:1 to an existing semantic token; size variants only
  select from the existing scales. A `tokens.components.*` namespace would only alias
  identical semantic values today. The native set added no new ambiguity.
- **Loops:** LOOP-004 left Planned with a dated assessment note; not closed (trigger
  condition unmet by design).

### 2026-07-09 — Native CardAction icon parity + contrast finding recorded

- **Did:** Verification-probe follow-up. Restored the `icon?: ReactNode` field on the
  native `CardAction` interface (`native/components/DataCard.tsx`) — it had been dropped
  from the web interface the primitives claim to mirror. Icon renders in a row `View`
  with `gap: spacing.base` beside the label, the RN equivalent of the web version's
  `Group gap={tokens.spacing.base}` placement, in both primary and overflow action rows.
  Separately recorded the probe's WorkflowStepper finding as a new loop: the primary nav
  button pairs theme-relative `text-primary` with the theme-invariant
  `interactive-default` accent background, risking low contrast in light mode and on
  mid-lightness presets.
- **Result:** Native `CardAction` now matches web one-to-one, keeping the llms-full.txt
  section 6.3 mirror claim accurate. `typecheck`, `typecheck:native`, and
  `verify:native` all green. Contrast issue is committed truth, not fixed (out of scope).
- **Loops:** Opened LOOP-006 (WorkflowStepper primary button contrast). No loops closed.
