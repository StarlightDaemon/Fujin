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

For the full walkthrough — architecture, installation, worked examples for
Mantine, framework-free/Shadow DOM, and non-JS consumers, the alias
anti-pattern, and known gotchas — see
[`docs/INTEGRATION_GUIDE.md`](docs/INTEGRATION_GUIDE.md). This section stays
terse by design; that document is the reference.

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

Fujin is a public GitHub repository (StarlightDaemon/Fujin). Part A above is the consumer guide and ships inside the package; this part is for agents and contributors working in the repo itself.

## B1. Start here

Read in this order and stop when you have what you need:

1. This Part B.
2. `llms.txt`, then `llms-full.txt`: what Fujin is, the component APIs, token contract and CSS variables. **Read `llms-full.txt` before writing or changing any component**; it's authoritative for prop signatures, CSS variable names and composition patterns.
3. `.raiden/state/CURRENT_STATE.md`: components, token contract, what exists.
4. The `## Active` section at the top of `.raiden/state/OPEN_LOOPS.md`: open, deferred and held items (statuses: `open`, `deferred`, `held: <who>`, `no-action`, `accepted`, `closed`).
5. Only when needed: `.raiden/state/DECISIONS.md` (the why, including the radius entry), `WORK_LOG.md`, `CONSUMERS.md` (who depends on which tag).

Current picture: one open item, LOOP-006 (the WorkflowStepper primary button's text colour on the accent fill; fix it at the semantic token layer). One deferred item, LOOP-004 (a component-level token tier), which restarts when a variant needs a value no single semantic token expresses. Everything else is closed.

This Part B and `.raiden/state/` are authoritative. Don't edit `.raiden/writ/` or `.raiden/instance/`; they're historical RAIDEN v2 text kept for the old tooling, and where they or `.raiden/local/` disagree with this file, this file wins. Model-routing notes in `.raiden/local/` are out of date; ignore them.

## B2. Commands

- Install: `npm ci`
- Dev harness: `npm run dev` (Vite; exercises every component with a live theme toggle)
- Full check: `npm run verify` = build → `verify:build` → `typecheck` → `typecheck:native` → `verify:native`. All five must pass. There's no separate unit-test suite.

CI (`.github/workflows/ci.yml`) runs `npm ci`, `npm audit --audit-level=high` and `npm run verify`. A clean build only changes the `generated` timestamp in `dist/tokens-resolved.json`; don't commit that change on its own.

## B3. Version namespaces: two different numbers

| Namespace | Value | What it is |
|---|---|---|
| npm package / git tag | **0.1.0** | The distributable artifact: `package.json` `version` and git tag `v0.1.0`. Consumers pin to this. |
| RAIDEN Edict | **2.0.0** | The governance conformance level recorded in the owner's private fleet records. Not a release of this library. |

They aren't comparable. When you write a version anywhere, say which namespace it's in.

## B4. Token pipeline

```
tokens.json  ──(Style Dictionary)──►  dist/tokens.css, dist/tokens.js + .d.ts,
 (DTCG, hand-authored,                dist/mantine-theme.js + .d.ts,
  the only source of truth)           dist/tokens-resolved.json (legacy)
                                         │
     themes/palette.ts (thin re-export) ◄┤  themes/createFujinTheme.ts ◄┤
     components/*.tsx ◄──────────────────┤  native/theme/tokens.ts ◄────┘
```

- `tokens.json` is the only place a design value is defined.
- `dist/` is generated and **committed**: consumers install from a git tag and must not need this repo's devDependencies. Never hand-edit it.
- To change a token: edit `tokens.json`, run `npm run verify`, commit `tokens.json` **and** `dist/` together.

## B5. Hard rules

- All design values come from `tokens.json`: no hardcoded colours, spacing, radius, type or font names. In components, import from `../dist/tokens.js`, never `../tokens.json` (its leaves are `{$value, $type}` objects).
- `borderRadius` is always `tokens.radius.default` (0). `defaultRadius: 0` alone doesn't enforce this across Mantine (see A3 and `DECISIONS.md`).
- Colour in components goes through `var(--fujin-*)`, never a palette value or hex directly.
- No component sets its own external margins; callers own layout spacing.
- Don't modify `tokens.json` without the owner's explicit instruction.
- No Mantine theme override outside the generated theme without a reason recorded in `DECISIONS.md`.
- `.audits/` is gitignored. If you annotate or correct a file there, also record it as a dated entry in `DECISIONS.md`; that's the durable copy.
- Main branch is `main`. Agent work goes on `<agent>/<task>` branches in their own worktrees.
- No `Co-Authored-By` or other agent attribution lines in commits; the `commit-msg` hook enforces this. Never bypass it.
- Don't commit personal names, absolute local paths or details of the owner's private tooling: this repo is public, and this file ships in the package.

## B6. Releases

Releases are the owner's call; ask before tagging or pushing. A release: `npm run verify` green → commit `tokens.json` and `dist/` → `git tag -a v<x.y.z> -m "<summary>"` → tell the registered consumers in `CONSUMERS.md` if a token value changed. Tags are the distribution mechanism (A1); an untagged commit isn't consumable. `npm publish` is blocked on purpose.

## B7. Working in parallel

One agent per worktree. Before starting, read the Claims section of `../../HANDOFF.md` (the workspace folder two levels above the repo or worktree root, outside Git, so every worktree sees the same file) and `git worktree list`, then add your claim line there; mark it done when you finish. Separate tasks may run in parallel only when both claims are listed there and they don't touch the same files. The owner (or the agent they assign) merges branches and updates `.raiden/state/`. Releases, `tokens.json` changes, the hook and Git config are one-at-a-time work.
