# Fujin Consumers

A ledger of repositories that consume a **real generated output** of Fujin.

## Why this file exists

Before 2026-07-26, Fujin had no outbound record of who consumed it — none. No
`CONSUMERS.md`, no consumer section in `README.md` / `AGENTS.md` / `llms.txt` /
`llms-full.txt`, nothing in `.raiden/state/`. The single place Fujin acknowledged
a downstream consumer was audit finding
[`F10`](.audits/Fujin_AUDIT_2026-07-14.md), which sourced that claim from operator
task briefs in `.raiden/local/prompts/` rather than from any dependency record —
and was, by then, stale by two months.

That is the failure this file prevents. Without a ledger, the only evidence
available to an auditor is scratch files, and a wrong answer is the predictable
result rather than the surprising one.

## How to register

Adopting a real generated output? Add **one line** to the table below and commit
it in the same change that adopts it. That is the whole obligation.

| Repository | Output consumed | Pinned to | Adopted | Contact / notes |
|---|---|---|---|---|
| _(none yet)_ | | | | |

Column meanings:

- **Output consumed** — which artifact, by name: `dist/tokens.css`,
  `dist/tokens.js`, `dist/mantine-theme.js`, `dist/tokens-resolved.json`, or
  `components/`.
- **Pinned to** — the git tag you installed, e.g. `v0.1.0`. Not a branch. If this
  column says `main`, that is a bug in your setup, not a valid entry.
- **Adopted** — ISO date the dependency landed.

## What does *not* belong in this table

Registering is for **real consumption**: an install from a tagged git ref that
pulls a generated output. The following are **not** dependencies on Fujin and must
not be listed here, or reported as consumers anywhere else:

- **A vendored copy.** A `src/fujin/` directory inside your own repository is your
  code. It was copied from Fujin once and has been free to drift ever since.
- **A local workspace alias named `@fujin`.** If your `vite.config.ts` /
  `tsconfig.json` maps `@fujin` to a path *inside your own tree*, the import
  specifier looks like a package but resolves to your own files. This is the exact
  arrangement in `HardlinkOrganizer`
  (`vite.config.ts:10`, `vitest.config.ts:13`, `tsconfig.json:20-21` →
  `./src/fujin`), and it is the single most likely source of a false
  "yes, it depends on Fujin" answer fleet-wide. Grep cannot tell the difference.
  You can: **check the alias target**. If it stays inside your repository, it is
  not a dependency.
- **Hand-copied token values.** Transcribing hex values into your own constants
  file is not consumption — it is a snapshot that will silently diverge.
- **A copied token JSON.** Committing a copy of `tokens-resolved.json` into your
  repo is a snapshot too, even if the filename matches.

None of these are *wrong* to have — vendoring is a legitimate choice, and
`audiobookshelf-now-playing`'s copied token JSON was a reasonable answer to a
package that could not be installed. They are simply not dependencies, and
recording them as such is what produced the stale F10 finding.

## Fleet-wide status as of 2026-07-26

Zero repositories in the fleet declare a real dependency on Fujin. Eight carry a
naming-or-convention-only reference (BIND, HardlinkOrganizer,
audiobookshelf-now-playing, merlins_cloak, merlins_cloak_v2, StarlightDaemonDev,
Raiden, Raiden-ops); twelve carry no reference at all.

The authoritative source for that classification, with per-repo file-and-line
evidence, is
**`Raiden-ops/reports/FUJIN_CONSUMPTION_AUDIT_2026-07-26.md`**. Do not re-derive
it — cite it.

## Version namespaces

Two different version numbers attach to Fujin. They are not comparable:

- **`0.1.0`** — the npm package / git tag version. What you pin to.
- **`2.0.0`** — the RAIDEN Edict version, a governance conformance level recorded
  in `Raiden-ops/state/FLEET_STATUS.md`. Not a release of this library.

Pin to the former. The latter never appears in a dependency specifier.
