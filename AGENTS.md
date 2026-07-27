# AGENTS.md — Fujin

**Two audiences. Pick one.**

- Working in a repository that wants to **use** Fujin → **Part A** below.
- Working **inside** Fujin itself → **Part B**.

---
---

# Part A — Consuming Fujin

Fujin is a **design token source with generated build outputs**. It is not
primarily a component package. The unit of distribution is a token value in the
format your project can actually consume.

## A1. Install

Fujin is consumed via a **git install pinned to a tag**. It is not on any public
npm registry, and `npm publish` is blocked by a `prepublishOnly` guard.

```bash
npm install github:StarlightDaemon/Fujin#v0.1.0
```

Pin to a tag. **Never** install from a branch — an unpinned install silently
tracks `main`, which reintroduces exactly the drift this setup exists to end.

Not a Node project? Read `tokens.json` (DTCG) or `dist/tokens-resolved.json`
directly from a checkout pinned to the same tag.

## A2. Pick your output

| You are building… | Pull this | Import path |
|---|---|---|
| Any web app, no framework assumption | `dist/tokens.css` | `@fujin/ui/tokens.css` |
| A JS/TS app — need token values in code | `dist/tokens.js` + `.d.ts` | `@fujin/ui` |
| A **Mantine v7** app | `dist/mantine-theme.js` | `@fujin/ui/mantine` |
| A React Native app | `dist/tokens.js` | `@fujin/ui` |
| A non-JS app (Python, userscript, shell) | `dist/tokens-resolved.json` | read the file |
| You want Fujin's actual components | `components/` | `@fujin/ui/components` |

You will usually want **two**: the CSS for global variables, plus either the JS
module or the Mantine theme for code-level values.

## A3. Wire it in

### CSS custom properties — any web consumer

```ts
import '@fujin/ui/tokens.css';
```

Dark is the default. Switch modes and accents with attributes on any container:

```html
<html data-fujin-mode="light" data-fujin-accent="teal">
```

`.fujin-light` / `.fujin-accent-teal` classes work identically. Then use the
variables:

```css
.panel {
  background: var(--fujin-bg-surface);
  color: var(--fujin-text-primary);
  border: var(--fujin-border-width-hairline) solid var(--fujin-border-subtle);
  border-radius: var(--fujin-radius-default);   /* 0 — sharp edges are the system */
  padding: var(--fujin-spacing-md);
  font-family: var(--fujin-font-family-base);
}
```

Available variable groups: `--fujin-bg-*`, `--fujin-text-*`, `--fujin-border-*`,
`--fujin-chrome-*`, `--fujin-interactive-*`, `--fujin-status-*`,
`--fujin-shadow-*`, `--fujin-spacing-*`, `--fujin-radius-*`,
`--fujin-font-{family,size,weight}-*`, `--fujin-line-height-*`,
`--fujin-letter-spacing-*`, `--fujin-opacity-*`, `--fujin-border-width-*`,
`--fujin-breakpoint-*`, `--fujin-duration-*`, `--fujin-easing-*`, and the raw
`--fujin-palette-<hue>-<0-9>` ramps. Read `dist/tokens.css` for the full list —
it is generated, so it is always current.

### JS / TS token module

```ts
import tokens, { resolveDark, resolveLight, palette, accentOptions } from '@fujin/ui';

tokens.spacing.scale.md;               // 16   (number — px stripped)
tokens.radius.default;                 // 0
tokens.typography.fontSize.md;         // 14
tokens.typography.letterSpacing.wide;  // '0.05em'  (string — unit preserved)

resolveDark('teal')['--fujin-interactive-default'];  // '#12b886'
```

px dimensions come back as **numbers** (React inline styles and React Native both
want numbers); `em` dimensions stay **strings** (the unit is meaningful).

### Mantine v7

```tsx
import { MantineProvider } from '@mantine/core';
import { createFujinMantineTheme } from '@fujin/ui/mantine';
import '@fujin/ui/tokens.css';

<MantineProvider theme={createFujinMantineTheme('violet')} defaultColorScheme="dark">
  <App />
</MantineProvider>
```

The generated theme carries the palette, type scale, spacing, radius, shadows,
breakpoints — **and** per-component `radius: 0` defaults for the eleven Mantine
components whose radius is hardcoded upstream and is *not* reached by
`defaultRadius` (Avatar, Badge, Chip, ColorSwatch, Indicator, Pill, RangeSlider,
Slider, Stepper, Switch, Timeline). Do not reimplement that list; import
`roundedByDefault` from `@fujin/ui/mantine` if you need it.

**Note the asymmetry:** loading `tokens.css` alone does *not* fix those eleven.
CSS custom properties cannot reach Mantine's internal component variables. If you
use Mantine, use the Mantine theme.

### Components (optional)

```tsx
import { FujinThemeProvider, DataCard, ToolShell } from '@fujin/ui/components';
```

Components ship as **TypeScript source**, not pre-compiled JS — your bundler
transpiles them. `FujinThemeProvider` wraps `MantineProvider`, applies the
generated theme, and injects every `--fujin-*` variable itself, so you do not
need `tokens.css` on the component path.

### Non-JS consumers

```python
import json
tokens = json.load(open("Fujin/dist/tokens-resolved.json"))
tokens["dark"]["--fujin-bg-base"]     # '#1f1f1f'
```

Shape (`meta` / `tokens` / `dark` / `light`) is a stability contract. Keys may be
added; they will not be renamed or removed without a major version.

## A4. Register in the ledger

Add one line to [`CONSUMERS.md`](CONSUMERS.md) in the same change that adopts the
dependency. Repository, output consumed, tag pinned, date. That is all.

Fujin had **no** record of who consumed it before 2026-07-26, which is exactly how
a stale claim about a downstream consumer survived two months in an audit finding.
One line prevents the next one.

## A5. Do not hand-roll these

Each of these has caused real drift in this fleet. All of them are things the
build already emits.

- ❌ **Do not copy hex values** into your own constants file. `merlins_cloak_v2`'s
  `src/theme/fujin-tokens.ts` is a hand-carried snapshot with nothing keeping it in
  sync. Import the token module.
- ❌ **Do not invent a different CSS variable prefix.** `merlins_cloak` emits
  `--fjn-*` instead of `--fujin-*`; no grep can detect drift across that rename.
  The prefix is `--fujin-`.
- ❌ **Do not hardcode a border radius.** Fujin is 0 at every size. Use
  `tokens.radius.default` or `var(--fujin-radius-default)`. If you are writing
  `borderRadius: 4`, you are outside the system.
- ❌ **Do not rebuild the Mantine theme by hand.** `defaultRadius: 0` is not enough
  (see A3). Use `createFujinMantineTheme`.
- ❌ **Do not edit anything in `dist/`.** Generated. Overwritten by the next build.
  Change `tokens.json` in Fujin and rebuild.
- ❌ **Do not vendor `components/` and call it a dependency.** Vendoring is a
  legitimate choice; calling the result a dependency is not (see A6).

## A6. ⚠️ Anti-pattern: a local `@fujin` alias is not a dependency

**A workspace alias named `@fujin` that resolves to a vendored copy inside the
consuming repository's own tree does not constitute a dependency on Fujin, and
must not be reported as one.**

This is the arrangement in `HardlinkOrganizer`:

```ts
// HardlinkOrganizer/webapp/frontend/vite.config.ts:10
'@fujin': resolve(__dirname, './src/fujin')      // ← inside HLO, not the Fujin repo
```

with matching entries in `vitest.config.ts:13` and `tsconfig.json:20-21`. The
import specifier `@fujin/...` looks exactly like a scoped package. It resolves to
HLO's own files. There is no edge to this repository, and there has not been since
commit `b40cb17` ("fix: vendor Fujin…", 2026-05-10).

This is the single most likely source of a false "yes, it depends on Fujin"
answer fleet-wide, and it is the direct cause of the stale F10 audit finding
(annotated in `.audits/Fujin_AUDIT_2026-07-14.md`, corrected in
`.raiden/state/DECISIONS.md`).

**How to check, in one step:** look at what the alias points at. If the target
path stays inside the repository you are auditing, it is a vendored copy. Grep
cannot tell you this; only the alias target can.

**Real consumption means pulling a generated output from the tagged git install
in A1.** Nothing else counts — not an alias, not a vendored tree, not a copied
JSON, not transcribed hex values.

---
---

# Part B — Working inside Fujin

## B1. Agent startup — RAIDEN Instance

This repo runs a RAIDEN Instance control plane in `.raiden/`.

**Read first:**

1. `.raiden/README.md` — control plane navigation
2. `.raiden/state/CURRENT_STATE.md` — active work and current state
3. `.raiden/state/OPEN_LOOPS.md` — pending work
4. `.raiden/state/DECISIONS.md` — architecture decisions and their rationale
5. `.raiden/writ/AGENTS.md` — full agent guide: tooling surface, write boundaries, naming canon
6. `llms.txt` — quick index of what Fujin is and what component rules apply
7. `llms-full.txt` — full component APIs, token contract, CSS vars, integration notes

**Key constraints:**

- **Do not write to `.raiden/writ/`** — it is RAIDEN-managed core
- **No `Co-Authored-By` in commits** — the `commit-msg` hook enforces this; do not bypass it
- **Mainline branch is `main`** — never `master`
- **D-0016**: on any Writ update — update managed core, preserve local overlay,
  preserve state, stop and report on locally modified managed files

**Naming canon:** `RAIDEN` · `Edict` · `RAIDEN Instance` · `Writ` · `payload` —
use exactly; no synonyms.

**RAIDEN tooling** lives in the central RAIDEN framework repo (path is
operator-specific; recorded in `.raiden/local/README.md`) — not in this repo.
Invoke from there with `--instance <this-repo-path>` or `--target <this-repo-path>`.

## B2. Version namespaces — two different numbers

Fujin carries **two independent version identifiers**. They are different
namespaces, they are not comparable, and neither implies anything about the other:

| Namespace | Value | What it is |
|---|---|---|
| npm package / git tag | **0.1.0** | The distributable artifact. `package.json` `version`; git tag `v0.1.0`. This is what consumers pin to. |
| RAIDEN Edict | **2.0.0** | Governance control-plane conformance level, recorded in `Raiden-ops/state/FLEET_STATUS.md`. Not a release of this library. |

They had been recorded side by side under the same repo name with no
disambiguation. When you write a version anywhere, say which namespace it is in.

## B3. Token pipeline — how a value gets from source to consumer

```
tokens.json  ──(Style Dictionary)──►  dist/tokens.css
 (DTCG,                               dist/tokens.js + tokens.d.ts
  hand-authored,                      dist/mantine-theme.js + .d.ts
  ONLY source of truth)               dist/tokens-resolved.json  (legacy, back-compat)
                                              │
                    themes/palette.ts ◄───────┤  (thin re-export, defines nothing)
                    themes/createFujinTheme.ts┤
                    components/*.tsx ◄────────┤
                    native/theme/tokens.ts ◄──┘
```

- **`tokens.json`** is the only place a design value is defined. Hand-authored.
- **`dist/`** is generated and **committed** — consumers install from a git tag and
  must not need this repo's devDependencies to build it. Never hand-edit.
- **`themes/palette.ts`** re-exports the generated module. It used to hold a second
  hand-maintained copy of all 140 palette hex values; it defines nothing now.

**Adding or changing a token:**

```bash
# 1. edit tokens.json      2. rebuild + verify      3. commit tokens.json AND dist/
npm run verify
```

`npm run verify` = build → `verify:build` → `typecheck` → `typecheck:native` →
`verify:native`. All five must pass.

## B4. Fujin hard rules

Fujin is a Mantine v7-based UI component toolset. It is **not** a governance agent.

- All design values come from `tokens.json`. No hardcoded colors, spacing, radius,
  or type. In components, import from `../dist/tokens.js` — never from
  `../tokens.json` (that is the DTCG source; its leaves are `{$value, $type}`
  objects, not values).
- `borderRadius` is always `tokens.radius.default` (0). No exceptions without
  approval. Note that `defaultRadius: 0` alone does **not** enforce this across
  Mantine — see A3 and the radius entry in `DECISIONS.md`.
- Do not modify `tokens.json` without explicit operator instruction.
- All color in components goes through `var(--fujin-*)`, never a palette value
  directly.
- Do not introduce a Mantine theme override outside the generated theme without
  documenting the reason in `DECISIONS.md`.
- Read `llms-full.txt` before writing or modifying any component — it is
  authoritative for prop signatures, CSS var names, and composition patterns.

## B5. Cutting a release

1. `npm run verify` — all five stages green.
2. Commit `tokens.json` **and** the regenerated `dist/`.
3. Tag: `git tag -a v<x.y.z> -m "<summary>"`.
4. Tell registered consumers in `CONSUMERS.md` if a token value changed.

Tags are the distribution mechanism (Part A1). An untagged commit is not
consumable.
