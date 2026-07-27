// Style Dictionary configuration for Fujin.
//
// One DTCG source (tokens.json), three consumer-facing build targets:
//
//   dist/tokens.css          CSS custom properties  — for any web consumer, framework-agnostic
//   dist/tokens.js + .d.ts   ESM token module       — for JS/TS consumers (web and React Native)
//   dist/mantine-theme.js    Mantine theme object   — for Mantine v7 consumers
//
// plus dist/tokens-resolved.json, a pre-existing artifact retained for
// backward compatibility (see scripts/fujin-formats.mjs for why).
//
// `transforms: ['name/kebab']` is deliberately the only transform on every
// platform. Style Dictionary's stock value transforms would rewrite what we
// emit (px -> rem, hex -> rgb) and its stock naming would rename every CSS
// custom property; Fujin's emitted names and values are a published contract,
// so the formats in scripts/fujin-formats.mjs own that rendering end to end.
// `name/kebab` is included solely because Style Dictionary's default token name
// is the last path segment, which makes `color.palette.*.0` collide across all
// fourteen hues and emits a collision warning on every build. The formats do not
// read `token.name`, so this transform affects nothing but that warning.
// What we want from Style Dictionary is DTCG parsing, `{alias}` resolution, and
// reference-graph validation — all of which happen before transforms run.
//
// DTCG syntax ($value/$type) is auto-detected; `usesDtcg` is set explicitly so a
// future non-DTCG token file fails loudly instead of being silently accepted.

import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

/** Shared by every platform. `generatedAt` is injected by scripts/build-tokens.mjs. */
const options = {
  version: pkg.version,
  generatedAt: null,
};

export default {
  source: ['tokens.json'],
  usesDtcg: true,
  platforms: {
    css: {
      transforms: ['name/kebab'],
      buildPath: 'dist/',
      options,
      files: [{ destination: 'tokens.css', format: 'fujin/css' }],
    },
    js: {
      transforms: ['name/kebab'],
      buildPath: 'dist/',
      options,
      files: [
        { destination: 'tokens.js', format: 'fujin/js' },
        { destination: 'tokens.d.ts', format: 'fujin/dts' },
      ],
    },
    mantine: {
      transforms: ['name/kebab'],
      buildPath: 'dist/',
      options,
      files: [
        { destination: 'mantine-theme.js', format: 'fujin/mantine' },
        { destination: 'mantine-theme.d.ts', format: 'fujin/mantine-dts' },
      ],
    },
    legacy: {
      transforms: ['name/kebab'],
      buildPath: 'dist/',
      options,
      files: [{ destination: 'tokens-resolved.json', format: 'fujin/resolved' }],
    },
  },
};
