# Fujin

Design token source and UI toolset for the Citadel fleet. Token-driven,
sharp-edged (radius 0 everywhere), workstation-focused. Targets Mantine v7 on the
web and React Native on native.

The primary deliverable is a **DTCG-format token source** (`tokens.json`) plus
**generated build outputs** — not a single installed component package.

| Output | For |
|---|---|
| `dist/tokens.css` | any web consumer — CSS custom properties (`--fujin-*`) |
| `dist/tokens.js` + `dist/tokens.d.ts` | JS/TS consumers, web and React Native |
| `dist/mantine-theme.js` + `.d.ts` | Mantine v7 consumers |
| `dist/tokens-resolved.json` | non-JS consumers (Python, userscripts) — legacy shape, kept stable |
| `components/`, `native/` | optional component surfaces |

## Install

```bash
npm install github:StarlightDaemon/Fujin#v0.1.0
```

Consumed via a git install pinned to a **tag** — not from a public npm registry.
Never install from a branch.

Full consumer instructions, including which output to pull and how to wire it in:
**[AGENTS.md → Part A](AGENTS.md)**. Adopting Fujin? Add a line to
**[CONSUMERS.md](CONSUMERS.md)**.

## Develop

```bash
npm run verify   # build -> verify:build -> typecheck -> typecheck:native -> verify:native
npm run dev      # Vite harness at dev/
```

`tokens.json` is the only place a design value is defined. `dist/` is generated
and committed; never hand-edit it. See **[AGENTS.md → Part B](AGENTS.md)** and
`.raiden/state/DECISIONS.md`.

## Two version numbers — they are different namespaces

Fujin carries two independent version identifiers. They are **not comparable**,
and neither implies anything about the other:

| Namespace | Value | What it means |
|---|---|---|
| **npm package / git tag** | `0.1.0` | The distributable artifact — `package.json` `version`, git tag `v0.1.0`. **This is what you pin to.** |
| **RAIDEN Edict** | `2.0.0` | Governance control-plane conformance level, recorded in `Raiden-ops/state/FLEET_STATUS.md`. Not a release of this library. |

These had been recorded side by side under the same repo name with no
disambiguation, which is why the note is here. When citing a Fujin version, say
which namespace it is in.

## Docs

- [`AGENTS.md`](AGENTS.md) — consumer contract (Part A) and in-repo agent guide (Part B)
- [`CONSUMERS.md`](CONSUMERS.md) — who consumes Fujin, and what does not count as consumption
- `llms.txt` / `llms-full.txt` — component APIs, token contract, CSS variable reference
- `.raiden/state/DECISIONS.md` — architecture decisions and rationale

## License

MIT — see [LICENSE](LICENSE).
