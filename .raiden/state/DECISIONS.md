# Decisions

## Primary Deliverable: DTCG Token Source + Generated Build Outputs (2026-07-26)

**Decision:** Fujin's primary deliverable is a **DTCG-format token source**
(`tokens.json`) plus **generated build outputs**, not a single installed npm
package. The build (Style Dictionary, `npm run build`) emits three consumer-facing
targets from that one source:

| Output | Consumer |
|---|---|
| `dist/tokens.css` | Any web consumer. CSS custom properties (`--fujin-*`), framework-agnostic. |
| `dist/tokens.js` + `dist/tokens.d.ts` | JS/TS consumers, web and React Native. |
| `dist/mantine-theme.js` + `.d.ts` | Mantine v7 consumers. Theme object for `<MantineProvider theme={...}>`. |

`dist/tokens-resolved.json` is also emitted and retained for backward
compatibility — `audiobookshelf-now-playing/app/fujin_tokens.py` reads it by path.
Its `meta` / `tokens` / `dark` / `light` shape is a compatibility contract; adding
keys is safe, renaming or removing one is not.

**Why:** The fleet consumption audit
(`Raiden-ops/reports/FUJIN_CONSUMPTION_AUDIT_2026-07-26.md`) established that
**zero** repositories in the fleet declare a real dependency on Fujin. Every
apparent consumer had reached for something other than an installed package: a
vendored component tree (BIND, HardlinkOrganizer), a copied token JSON
(audiobookshelf-now-playing), or hand-transcribed values (merlins_cloak,
merlins_cloak_v2). Three divergence paths, one design system, and nothing capable
of detecting drift between them.

A single installed package was never going to serve that spread. A Python app
cannot import a React component; a userscript cannot install from npm. What every
one of those consumers actually needed was a *value* in a format they could
consume — which is what a token source with per-format build outputs provides, and
what a component package does not. Consumers who do want components can still get
them; components are simply no longer the unit of distribution.

**Consequences:**
- `tokens.json` is authored by hand and is the only place a design value is defined.
- `themes/palette.ts` no longer defines the palette; it re-exports the generated
  module. It previously held a second hand-maintained copy of all 140 palette hex
  values with nothing keeping the two in sync.
- `dist/` is committed (see `.gitignore` for why) so a git-tag install needs no
  build step at the consumer.
- Downstream repositories register in `CONSUMERS.md`. Fujin previously had no
  outbound record of who consumed it at all — see the F10 correction below.

---

## Distribution: Git-Tag Install, Not a Registry Publish (2026-07-26)

**Decision:** Fujin is consumed via a git install pinned to a tag:
`npm install github:StarlightDaemon/Fujin#v0.1.0`. It is not published to a public
npm registry. `private: true` has been removed from `package.json` and replaced
with a `prepublishOnly` guard (`scripts/no-registry-publish.mjs`) that fails
`npm publish` while leaving git installs working.

**Why:** `private: true` plus a missing `exports` map made Fujin *structurally*
non-consumable — npm will not resolve subpaths, tooling treats the package as
un-installable, and a git dependency cannot be prepared. That, not any consumer's
choice, is the root cause of the vendoring the audit found: consumers vendored
because installing was not an option. Removing `private` is what makes Fujin
installable at all; the `prepublishOnly` guard preserves the flag's actual intent
("do not push this to a registry") without the collateral damage.

A tag also gives Fujin something it has never had: a way to date a release. The
repository had zero git tags before v0.1.0.

**Consequences:**
- Consumers pin to a tag, never to a branch. An unpinned git install silently
  tracks `main` and reintroduces the drift this is meant to end.
- Cutting a tag is now a release action: build, run `npm run verify`, commit the
  regenerated `dist/`, then tag.
- The `react` / `react-dom` peer ranges were widened to `^18.0.0 || ^19.0.0`.
  The previous `^18.0.0` made installation *fail outright* with `ERESOLVE` for any
  consumer on React 19, which Mantine v7 itself supports — a second structural
  install blocker, found by actually installing the packed tarball rather than by
  reading the manifest.
- `react` and `react-dom` are now optional peers. A CSS-only or Python consumer
  pulls token values and never touches React; requiring it of them was wrong.

---

## Mantine's Hardcoded Component Radii Defeat `defaultRadius` (2026-07-26)

**Decision:** The generated Mantine theme carries explicit
`components.<Name>.defaultProps.radius = 0` for the eleven Mantine components
whose radius `defaultRadius` does not reach: **Avatar, Badge, Chip, ColorSwatch,
Indicator, Pill, RangeSlider, Slider, Stepper, Switch, Timeline**. The list lives
in `scripts/fujin-formats.mjs` and is exported from the build as
`roundedByDefault`; `scripts/verify-build.mjs` asserts every entry is pinned to 0.

**Why:** Fujin's canonical radius is 0 at every size — a hard rule, not a default.
The previous theme expressed that as `defaultRadius: 0` alone. But `@mantine/core`
does not derive every component's radius from `--mantine-radius-default`: the
eleven above each declare their own `--<component>-radius` hardcoded to a
fully-round value (`62.5rem`, `1000rem`, or `50%`) in `styles.css`. Setting
`defaultRadius` never touches them. A Fujin-themed app was therefore rendering
pill-shaped Badges and circular Avatars inside a zero-radius system, and nothing
in the repo could detect it — the rule was stated in three documents and enforced
in none.

This is also why `components/WorkflowStepper.tsx` carries a
`styles.stepIcon.borderRadius` override: it is a per-component workaround for
exactly this upstream behaviour, applied to the one component that happened to be
noticed. Ten others were not. The theme-level fix generalises it.

**Consequences:** A consumer using the generated Mantine theme gets sharp edges on
all eleven without knowing this quirk exists. A consumer using only
`dist/tokens.css` does not — CSS custom properties cannot reach into Mantine's
internal component variables. That asymmetry is documented in `AGENTS.md`.

---

## Superseded: "No Mantine Theme Override" (2026-07-26)

**Status:** Superseded by the two entries above. Retained for history, not deleted.

The original entry (below, "No Mantine Theme Override") stated that
`MantineProvider` is used with no `theme` prop. That stopped being true before this
change — `createFujinTheme` had already been passing a theme with `primaryColor`,
`defaultRadius`, and font families. It is now further untrue by design: the
generated theme also carries the full palette, type scale, spacing, shadows,
breakpoints, and the eleven radius overrides.

What survives from the original decision is its actual substance, and it still
holds: **theme-aware color is delivered via `var(--fujin-*)` custom properties, not
via Mantine's color system.** The Mantine theme exists to make *Mantine's own
internals* agree with Fujin's tokens — it is not the delivery mechanism for Fujin
colors in Fujin components. `llms.txt` "Core Rule 3" carries the same stale
absolute wording and should be corrected the next time that file is regenerated.

---

## Correction: Audit Finding F10 Is Stale on Its Consumer Claim (2026-07-26)

**Decision:** `.audits/Fujin_AUDIT_2026-07-14.md` finding **F10** has been
annotated in place as superseded. It is **not** deleted — audit history is
preserved, and a finding that was reasonable on the evidence available at the time
is part of that history.

**What was wrong:** F10 reads "No CI configuration at all — typecheck/verify gates
run only by hand despite downstream consumers (HardlinkOrganizer per prompts)". The
consumer justification is stale as of commit **b40cb17** ("fix: vendor Fujin…",
2026-05-10), which deliberately vendored Fujin's components into HardlinkOrganizer's
own tree. Since that commit there is no live edge: HLO cannot break from a Fujin
change. `Raiden-ops/registry/EDGES.md:37-43` records this correctly; the Fujin-side
audit did not.

**What still stands:** the CI gap itself. F10's *finding* survives on its own
merits — only its stated motivation does not. Note the tell: F10 sourced its
consumer claim from `.raiden/local/prompts/` task briefs, not from any dependency
record, because no dependency record existed.

**Root cause, and what fixes it:** Fujin had no outbound record of who consumes it.
The audit confirmed zero hits for consumer/downstream language across `README.md`,
`AGENTS.md`, `llms.txt`, `llms-full.txt`, and `.raiden/state/`. With no ledger, the
only available evidence was operator scratch files, and a stale claim was the
predictable result. `CONSUMERS.md` exists to close that gap.

---

## Correction: Fujin Carries Two Independent Version Identifiers (2026-07-26)

**Decision:** The two version numbers attached to Fujin are recorded as separate
namespaces wherever a version appears (`README.md`, `AGENTS.md`, `CONSUMERS.md`,
and `tokens.json`'s `$extensions` block).

| Namespace | Value | Meaning |
|---|---|---|
| npm package / git tag | `0.1.0` | The distributable artifact. `package.json` `version`, and now the `v0.1.0` git tag. |
| RAIDEN Edict | `2.0.0` | Governance control-plane conformance level, recorded in `Raiden-ops/state/FLEET_STATUS.md`. |

**Why:** These are not comparable and neither implies anything about the other, but
they had been recorded side by side under the same repo name with no
disambiguation — `FLEET_STATUS.md:20` says "2.0.0" while `package.json:3` says
"0.1.0". A reader has no way to tell which is which, and until v0.1.0 was tagged
there were zero git tags, so there was no independent way to date a Fujin release
either. Anyone reconciling the two would reasonably conclude one of them was wrong.

---

## CSS Custom Properties for Theming (not Mantine theme override)
**Decision:** All theme-aware color values are delivered via CSS custom properties
(`var(--fujin-*)`) injected by `FujinThemeProvider`. Mantine's built-in theme/color system
is not used for Fujin token colors.
**Why:** Mantine's color system is opinionated around its own palette format and would
require translating the Slate token contract into Mantine's structure. CSS vars are
framework-agnostic, switch at runtime without React re-renders, and will extend cleanly
to React Native (which will have its own injection layer consuming the same tokens.json).

## Inline Style Props Over CSS Classes
**Decision:** Components use React inline `style` props for all styling. No external
CSS files or CSS modules.
**Why:** Token values are numbers and strings from a JSON file. Inline styles are the
natural bridge — no build pipeline needed for styles, and all values remain traceable
to tokens.json without indirection.

## No Mantine Theme Override
**Decision:** `MantineProvider` is used with no `theme` prop. No Mantine theme overrides.
**Why:** Mantine's default theme would conflict with Fujin's Slate palette. Overriding it
would require ongoing maintenance as Mantine updates. Components style themselves entirely
via inline styles and CSS vars, making the Mantine theme irrelevant for Fujin values.
If a specific Mantine internal (e.g. focus ring) causes friction, document it and address
it as a targeted override — not a global theme.

## Progressive Disclosure Rules
**Decision:** Cards with >2 actions overflow into ActionMenu. Workflows with >3 steps
use WorkflowStepper. Cards with secondary detail use DataCard's `detail` prop + Collapse.
**Why:** Keeps UI density workstation-appropriate. Forces callers to think about information
hierarchy rather than dumping all actions at the surface level.

## Callers Own Layout Spacing
**Decision:** No component sets external margins or `marginBottom`. All inter-component
spacing is the caller's responsibility.
**Why:** Prevents components from fighting each other when composed. Layout is context-
dependent; components cannot know their context.

## G31P Offload Boundary
**Decision:** Mechanical, clearly-scoped, boilerplate tasks → brief to G31P with Fujin
review before acceptance. Judgment-heavy work (disclosure logic, layout shells, workflow
behavior, architectural decisions) → Fujin only.
**Why:** Preserves design integrity on decisions that require understanding of the full
token contract and component system, while offloading repetitive transcription work.

## Dev Harness as Vite App (Not Storybook)
**Decision:** Visual development and verification is done via a minimal Vite + React app
at `dev/`. No Storybook.
**Why:** Storybook adds significant overhead (config, addons, MDX) that isn't needed for
a component library at this stage. The harness only needs to render components with
realistic mock data and verify theme switching works.
