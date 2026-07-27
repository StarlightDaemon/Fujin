# Fujin Integration Guide

This is the full walkthrough for consuming Fujin from another repository. It
assumes nothing about who is consuming it — a React app, a static page, a
browser-extension content script, or a service in a completely different
language are all covered below. If you are working *inside* Fujin itself,
this is not your document; see `AGENTS.md` Part B instead.

---

## 1. Orientation

Fujin is a **DTCG (Design Tokens Community Group) token source with a
generated build pipeline**. `tokens.json` is hand-authored and is the only
place a design value — a color, a spacing step, a radius, a type scale — is
defined. A Style Dictionary build (`npm run build`) turns that one source
into several generated, per-format outputs under `dist/`: CSS custom
properties, a JS/TS token module, a Mantine v7 theme object, and a
backward-compatible resolved JSON. Nothing under `dist/` is hand-edited;
regenerating it from `tokens.json` is the only way its contents change.

Fujin was not always shaped this way. It used to be closer to a directly
installed component package, and the shift to a token-source-plus-generated-
outputs model was a deliberate architecture decision, recorded in
`.raiden/state/DECISIONS.md` ("Primary Deliverable: DTCG Token Source +
Generated Build Outputs"). The short version: a single component package
cannot serve every kind of consumer a design system fleet actually has — a
Python service cannot import a React component, a userscript cannot run a
bundler — but a token value, emitted in whatever format each consumer's
runtime can read, can. This guide does not re-litigate that decision; it
exists to make it usable in practice.

If you only take one thing from this document: **install from a tagged git
ref (Section 3) and pull the specific generated output your stack needs
(Sections 4–6).** Everything else — the anti-pattern warning, the consumer
ledger, the gotchas — exists to keep that one path the only path.

---

## 2. Architecture overview

```
tokens.json  ──(Style Dictionary, `npm run build`)──►  dist/tokens.css
 (DTCG,                                                dist/tokens.js + dist/tokens.d.ts
  hand-authored,                                       dist/mantine-theme.js + dist/mantine-theme.d.ts
  ONLY source of truth)                                dist/tokens-resolved.json  (legacy, back-compat)
```

| Stage / output | What it is | Who it's for |
|---|---|---|
| `tokens.json` | The DTCG token source. Every color, spacing step, radius, type-scale value, breakpoint, duration, and easing curve in Fujin is defined here, once. | Not a consumption target — read it if you want to see a value's provenance, not to import it into a build. |
| `dist/tokens.css` | Generated CSS custom properties (`--fujin-*`), scoped by selector for mode (`dark`/`light`) and accent. Framework-agnostic. | Any web consumer — with or without a JS build step. |
| `dist/tokens.js` + `dist/tokens.d.ts` | A typed ESM module exporting the same values as plain JS: numbers for px dimensions, strings for values whose unit matters (`em`, durations), plus helper functions to resolve mode/accent-scoped CSS variable maps at runtime. | JS/TS consumers — web or React Native — that need token values in code, not just in a stylesheet. |
| `dist/mantine-theme.js` + `dist/mantine-theme.d.ts` | A generated Mantine v7 `MantineThemeOverride`-shaped object, built from the same source. | Consumers using `@mantine/core`. |
| `dist/tokens-resolved.json` | A flat, pre-resolved `meta` / `tokens` / `dark` / `light` JSON snapshot. Retained specifically for non-JS consumers. Its shape is a stability contract — keys may be added, never renamed or removed without a major version. | Non-JS consumers: Python, shell, userscripts, anything that can read a JSON file but not an ES module. |

`dist/` is **generated and committed to the repository**. That is what makes
Section 3 possible without asking every consumer to run Fujin's own build
toolchain.

---

## 3. Installation

Fujin is not published to a public npm registry — `npm publish` is actively
blocked by a `prepublishOnly` guard (`scripts/no-registry-publish.mjs`) that
exists specifically to keep this the one supported path. Fujin is consumed
via a **git install pinned to a tag**:

```bash
npm install github:StarlightDaemon/Fujin#v0.1.0
```

Which, in `package.json`, is the same as adding:

```json
{
  "dependencies": {
    "@fujin/ui": "github:StarlightDaemon/Fujin#v0.1.0"
  }
}
```

**Pin to a tag. Never install from a branch.** An unpinned install (e.g.
`github:StarlightDaemon/Fujin` with no `#v0.1.0`) silently tracks `main`,
which reintroduces exactly the drift this whole distribution model exists to
end — you would have no record of which version of a token value you're
actually running.

Because `dist/` is committed in the Fujin repository itself, installing the
tag is enough on its own. **You do not need to run Fujin's build, and you do
not need Fujin's devDependencies (Style Dictionary, etc.) to use it** — `npm
install` from the tag hands you the already-generated `dist/tokens.css`,
`dist/tokens.js`, `dist/mantine-theme.js`, and `dist/tokens-resolved.json`
directly.

Once installed, the package exposes these subpaths (from Fujin's `exports`
map):

| Import specifier | Resolves to |
|---|---|
| `@fujin/ui` | `dist/tokens.js` (+ `dist/tokens.d.ts` types) |
| `@fujin/ui/mantine` | `dist/mantine-theme.js` (+ `dist/mantine-theme.d.ts` types) |
| `@fujin/ui/tokens.css` | `dist/tokens.css` |
| `@fujin/ui/tokens.json` | `tokens.json` (the raw DTCG source) |
| `@fujin/ui/tokens-resolved.json` | `dist/tokens-resolved.json` |
| `@fujin/ui/components` | `components/index.ts` (source, not pre-compiled) |
| `@fujin/ui/themes` | `themes/index.ts` |
| `@fujin/ui/native` | `native/index.ts` |

If your stack isn't a Node project at all — no `npm install` in the
picture — check out the tag directly (`git clone` + `git checkout v0.1.0`,
or a sparse/shallow checkout of the same ref) and read `tokens.json` or
`dist/tokens-resolved.json` from the filesystem. Section 6 covers that path
in detail.

React and Mantine are **optional peer dependencies**
(`@mantine/core`, `@mantine/hooks`, `react`, `react-dom` at `^18.0.0 ||
^19.0.0`, `react-native` at `>=0.72.0`). A CSS-only or non-JS consumer never
needs to install any of them.

---

## 4. Consumption pattern one — React and Mantine

Use `@fujin/ui/mantine` for the theme object, and `@fujin/ui/tokens.css` for
the CSS custom properties that Mantine's own theme system can't reach (see
Section 8). Both together is the normal setup:

```tsx
import { MantineProvider } from '@mantine/core';
import { createFujinMantineTheme } from '@fujin/ui/mantine';
import '@fujin/ui/tokens.css';

export function App() {
  return (
    <MantineProvider
      theme={createFujinMantineTheme('violet')}
      defaultColorScheme="dark"
    >
      {/* your app */}
    </MantineProvider>
  );
}
```

`createFujinMantineTheme(accent?)` takes any key from the generated
`palette` object (`"dark" | "gray" | "red" | "pink" | "grape" | "violet" |
"indigo" | "blue" | "cyan" | "teal" | "green" | "lime" | "yellow" |
"orange"`), defaults to `"violet"` if omitted, and throws if you pass a key
that isn't in the palette. It returns an object that is structurally a
Mantine `MantineThemeOverride` — pass it straight to the `theme` prop. It
already carries the palette, type scale, spacing, radius, shadows, and
breakpoints from `tokens.json`; you do not need to hand-assemble any of
that.

If you need token values in code rather than through the theme prop — for a
custom style, a chart color, a computed layout — pull them from the base
module:

```ts
import tokens, { resolveDark, resolveLight, palette, accentOptions } from '@fujin/ui';

tokens.spacing.scale.md;               // 16   (number — px unit stripped)
tokens.radius.default;                 // 0
tokens.typography.letterSpacing.wide;  // '0.05em'  (string — unit preserved)

resolveDark('teal')['--fujin-interactive-default'];  // '#12b886'
```

px-based dimensions come back as plain numbers (React inline styles and
React Native both want numbers there); values whose unit is meaningful
(`em`, durations) stay as strings.

---

## 5. Consumption pattern two — framework-free and Shadow DOM

### Plain page, no build step

Reference the generated CSS directly:

```html
<link rel="stylesheet" href="node_modules/@fujin/ui/dist/tokens.css">
```

or, in a bundler-based project without React:

```ts
import '@fujin/ui/tokens.css';
```

Dark is the default. Switch mode and accent with attributes (or the
equivalent classes) on any container — `<html>`, or any element further
down the tree:

```html
<html data-fujin-mode="light" data-fujin-accent="teal">
```

Then consume the variables in your own CSS:

```css
.panel {
  background: var(--fujin-bg-surface);
  color: var(--fujin-text-primary);
  border: var(--fujin-border-width-hairline) solid var(--fujin-border-subtle);
  border-radius: var(--fujin-radius-default); /* 0 — sharp edges are the system */
}
```

### Shadow DOM — inheritance across the boundary

`dist/tokens.css` declares its scale tokens on a bare `:root` selector, and
its mode-scoped semantic roles on `:root, [data-fujin-mode="dark"],
.fujin-dark` / `[data-fujin-mode="light"], .fujin-light`. `:root` always
means the *document's* root element — it never matches a shadow root, no
matter how deep the shadow tree is nested.

That does not mean the variables stop working inside a shadow tree. CSS
custom properties are **inherited properties**: a shadow host element
computes its own `--fujin-*` values from wherever it sits in the light DOM
(ultimately from `:root`, if that's where `tokens.css` is loaded), and a
shadow tree inherits computed values from its host by default. So if your
own page already loads `tokens.css` at the top level and then renders part
of its own UI inside a shadow root for encapsulation, `var(--fujin-bg-
surface)` resolves correctly inside that shadow tree with no extra work —
you do not need to re-declare anything inside the shadow root.

### Shadow DOM — when to scope tokens to your own host instead

That inheritance path assumes you trust the page above your shadow root to
either define Fujin's variables correctly, or to define none of them at
all (so nothing overrides your expectations). That assumption does not hold
for a browser-extension content script, or any other case where you are
injecting a shadow root into a page you do not control and did not write:

- The host page almost certainly does not load `tokens.css`, so the
  variables resolve to nothing (`var()` falls back to its default, or to
  the property's initial value) rather than to Fujin's values.
- Even if the host page happens to define a custom property with the same
  name — accidentally or adversarially — inheriting it means an unknown,
  untrusted page is choosing your colors.

In that situation, scope the tokens to your own shadow host instead of
relying on inheritance. The cleanest way is to set them directly on the
host element via the JS module, using `:host`-equivalent inline custom
properties rather than trying to adapt the generated stylesheet's `:root`
selectors:

```ts
import { scalarVars, resolveDark } from '@fujin/ui';

function applyFujinTokens(hostElement, accent) {
  const vars = { ...scalarVars, ...resolveDark(accent) };
  for (const [name, value] of Object.entries(vars)) {
    hostElement.style.setProperty(name, value);
  }
}

const host = document.createElement('div');
document.body.appendChild(host);
const shadowRoot = host.attachShadow({ mode: 'open' });
applyFujinTokens(host, 'teal');

// shadowRoot's contents now resolve var(--fujin-*) from the host's own
// inline declarations, independent of whatever the surrounding page does.
```

`scalarVars` carries the mode/accent-invariant tokens (spacing, radius, type
scale, breakpoints, durations); `resolveDark` / `resolveLight` carry the
mode-scoped semantic roles for a given accent, and `resolveAll` returns both
modes at once if your shadow root needs to switch between them at runtime.
Because these are set as inline styles directly on the element you control,
they hold regardless of what the surrounding page does — including a page
that never loads `tokens.css`, or one that defines conflicting variables of
its own.

---

## 6. Consumption pattern three — non-JavaScript consumers

For a consumer in a language with no npm and no CSS engine — a Python
service is the case already in real use elsewhere in this fleet — read
`dist/tokens-resolved.json` directly from a checkout pinned to the same
tag your other consumption paths use:

```python
import json

with open("path/to/Fujin/dist/tokens-resolved.json") as f:
    tokens = json.load(f)

tokens["meta"]["version"]           # "0.1.0"
tokens["dark"]["--fujin-bg-base"]   # "#1f1f1f"
tokens["light"]["--fujin-text-primary"]  # "#212529"
```

The file's shape is:

```json
{
  "meta": { "version": "0.1.0", "defaultAccent": "violet", "generated": "...", "description": "..." },
  "tokens": { "fontFamily": "...", "fontFamilyMono": "..." },
  "dark": { "--fujin-bg-base": "#1f1f1f", "...": "..." },
  "light": { "--fujin-bg-base": "#dee2e6", "...": "..." }
}
```

This shape — `meta` / `tokens` / `dark` / `light` — is a **stability
contract**, kept specifically so a non-JS consumer has something durable to
parse. Keys may be added over time; they will not be renamed or removed
without a major version bump. **This guarantee is scoped to this one legacy
file only — it is not evidence of a package-wide semantic-versioning policy.**
No such broader policy exists yet; see Section 9 for the honest state of
that. Note that `tokens-resolved.json` is generated
against the **default accent (`violet`)** only — it does not carry the
per-accent overrides that `resolveDark`/`resolveLight` in the JS module do.
If your non-JS consumer needs a different accent, you currently need to
compute it from `tokens.json`'s palette yourself; there is no generated
resolved-JSON-per-accent output today.

Getting the file onto disk is the same git-tag install as any other
consumption path — clone (or sparse-checkout) the repository at the tag you
want, and read the file from that checkout. There is no separate
distribution mechanism for non-JS consumers.

---

## 7. ⚠️ The alias anti-pattern

**A local workspace alias, or a vendored copy of Fujin's source inside your
own repository's tree, is not consumption of Fujin — no matter how closely
the import specifier resembles a real package name.**

A concrete shape this takes: a `vite.config.ts` (or `tsconfig.json`,
`webpack.config.js`, etc.) that maps an alias like `@fujin` to a path
*inside your own repository*, e.g. `resolve(__dirname, './src/fujin')`. The
import statements in your code — `import { X } from '@fujin/...'` — look
exactly like they're pulling from a real dependency. They are not. They
resolve to your own vendored files, which were copied from Fujin once and
have been free to drift ever since, with nothing in either repository able
to detect that drift.

This matters beyond correctness of your own build:

- **You will not receive updates.** A token value changing in Fujin's
  `tokens.json` has no path to reach a vendored copy. You are maintaining a
  fork, whether you intended to or not.
- **It will misrepresent your repository's status in any future fleet
  audit.** An alias target that stays inside your own tree, or a
  hand-copied file, is indistinguishable from a real dependency by grepping
  for the import specifier alone — the only way to tell the difference is
  to check what the alias actually points at. A repository that reports
  itself (or gets reported) as "depending on Fujin" on the strength of a
  vendored copy is exactly the failure mode `CONSUMERS.md` exists to catch
  and prevent from recurring.

None of this means vendoring is never a reasonable choice — it can be, for
example, if Fujin genuinely cannot be installed in your environment. What
it must never be is *called* a dependency, or registered as one. If you
find yourself vendoring, say so plainly in your own repository's
documentation, and do not add an entry to Fujin's `CONSUMERS.md` for it.

**The only supported path is Section 3** — a git install pinned to a tag,
pulling one of the real generated outputs in Sections 4–6. Nothing else
counts, including a vendored tree, a hand-copied token JSON, or
transcribed hex values in your own constants file.

---

## 8. Registering as a consumer

Fujin's `CONSUMERS.md` is a ledger of repositories that consume a real
generated output — install method, output consumed, tag pinned, and date
adopted. It exists because Fujin previously had no outbound record of who
depended on it at all, which let a stale consumer claim survive undetected
for months in an audit.

If your repository adopts a real generated output from Section 3 (a git
install pinned to a tag, pulling `dist/tokens.css`, `dist/tokens.js`,
`dist/mantine-theme.js`, `dist/tokens-resolved.json`, or `components/`), add
one line to the table in `CONSUMERS.md`, in the same change that adopts the
dependency. Repository name, output consumed, tag pinned, adoption date, and
optionally a contact — that's the entire obligation. Do not register a
vendored copy, an alias, or a hand-copied value (Section 7) — those are
explicitly excluded from that table.

---

## 9. Versioning and current state

Fujin is at **`v0.1.0`** — a single git tag. Be direct with yourself about
what that means: this is an early, single-tag state. There is currently
**no established semantic-versioning policy or stability guarantee** beyond
what's stated explicitly in this guide (the `dist/tokens-resolved.json`
shape contract in Section 6, and the intent — not yet exercised — that a
breaking rename or removal would be a major version bump). Do not assume
SemVer discipline, a deprecation window, or a changelog format that hasn't
actually been established yet; none of those exist today. If you need one
of them, that's worth raising as its own decision rather than assuming it's
already in place.

Separately, and unrelated to the number above: Fujin's repository also
carries a **RAIDEN Edict** version (currently `2.0.0`), recorded in that
control plane's own fleet status file. That is a governance
conformance level for the repository's control-plane setup, not a release
of this library, and it is not comparable to the `0.1.0` package version in
any way. If you ever see both numbers next to each other, they are
answering different questions.

---

## 10. Known gotchas

### Mantine's hardcoded component radii

Fujin's canonical radius is **0, at every size, with no exceptions** — this
is a hard rule of the token system, not a stylistic default. The obvious way
to express that in Mantine is `defaultRadius: 0` on the theme, and the
generated theme does set that. But `@mantine/core` does not derive every
component's radius from `defaultRadius`: eleven components — **Avatar,
Badge, Chip, ColorSwatch, Indicator, Pill, RangeSlider, Slider, Stepper,
Switch, Timeline** — each hardcode their own radius CSS variable internally
to a fully-round value, and `defaultRadius` never reaches them.

The generated Mantine theme already works around this: it carries an
explicit `components.<Name>.defaultProps.radius = 0` for each of those
eleven components (exported as `roundedByDefault` from `@fujin/ui/mantine`
if you need the list). **If you're using `createFujinMantineTheme`, you get
this for free and should not add your own override for it** — doing so
would just be redundant with what the theme already sets, and risks
drifting from the canonical list if Mantine's own set of hardcoded-radius
components ever changes.

The asymmetry to watch for: this fix lives in the **Mantine theme**, not in
`tokens.css`. A consumer using only CSS custom properties — no Mantine theme
— does not get it, because CSS custom properties cannot reach into
Mantine's internal per-component style variables. If you use Mantine, you
need the generated theme from Section 4, not just the CSS file from
Section 5, to get sharp edges on all eleven of those components.
