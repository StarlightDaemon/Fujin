// Assertions over the generated build outputs. Run with `npm run verify:build`
// (and as part of `npm run verify`).
//
// The native analogue is native/verify-tokens.ts, which checks the token *values*
// reaching React Native. This file checks the things that broke silently before
// the pipeline existed: the zero-radius mandate leaking through Mantine's
// hardcoded component radii, and the CSS custom-property contract that downstream
// repositories consume by name.

import { readFileSync } from 'node:fs';
import { palette, accentOptions, defaultAccent, tokens, resolveDark, resolveLight } from '../dist/tokens.js';
import { createFujinMantineTheme, roundedByDefault } from '../dist/mantine-theme.js';

let failures = 0;
const check = (name, cond) => {
  if (cond) console.log(`  ok   ${name}`);
  else { failures++; console.error(`  FAIL ${name}`); }
};

const css = readFileSync(new URL('../dist/tokens.css', import.meta.url), 'utf8');
const theme = createFujinMantineTheme(defaultAccent);

// --- the zero-radius mandate -------------------------------------------------

check('tokens.radius.default is 0', tokens.radius.default === 0);
check(
  'every radius size is 0',
  Object.values(tokens.radius).every((v) => v === 0)
);
check('Mantine theme defaultRadius is 0', theme.defaultRadius === 0);
check(
  'Mantine theme radius scale is all 0px',
  Object.values(theme.radius).every((v) => v === '0px')
);
// The regression this pipeline exists to prevent: `defaultRadius: 0` does NOT
// reach the components below, because @mantine/core hardcodes their radius to a
// fully-round value in its stylesheet rather than deriving it from
// --mantine-radius-default. Without an explicit per-component defaultProps, a
// Fujin-themed app renders pill-shaped Badges inside a zero-radius system.
check(
  `all ${roundedByDefault.length} upstream-rounded Mantine components pinned to radius 0`,
  roundedByDefault.every((c) => theme.components?.[c]?.defaultProps?.radius === 0)
);
check(
  'no component override sets a non-zero radius',
  Object.values(theme.components).every((c) => c.defaultProps.radius === 0)
);

// --- CSS custom-property contract -------------------------------------------

// These names are consumed by name in other repositories. Renaming one is a
// breaking change to every consumer, and grep cannot detect the breakage.
const CONTRACT_VARS = [
  '--fujin-bg-base', '--fujin-bg-surface', '--fujin-bg-elevated', '--fujin-bg-overlay',
  '--fujin-text-primary', '--fujin-text-secondary', '--fujin-text-muted', '--fujin-text-inverse',
  '--fujin-border-subtle', '--fujin-border-default', '--fujin-border-strong',
  '--fujin-chrome-bg', '--fujin-chrome-text', '--fujin-chrome-border',
  '--fujin-interactive-default', '--fujin-interactive-hover', '--fujin-interactive-active',
  '--fujin-interactive-disabled',
  '--fujin-status-danger', '--fujin-status-warning', '--fujin-status-success', '--fujin-status-info',
  '--fujin-shadow-sm', '--fujin-shadow-md', '--fujin-shadow-lg',
  '--fujin-layout-content-width',
];

const dark = resolveDark(defaultAccent);
const light = resolveLight(defaultAccent);
check(
  `${CONTRACT_VARS.length} contract vars present in dark`,
  CONTRACT_VARS.every((v) => typeof dark[v] === 'string' && dark[v].length > 0)
);
check(
  `${CONTRACT_VARS.length} contract vars present in light`,
  CONTRACT_VARS.every((v) => typeof light[v] === 'string' && light[v].length > 0)
);
check('contract vars all emitted to tokens.css', CONTRACT_VARS.every((v) => css.includes(`${v}:`)));
check(
  'no --fjn-* prefix leaked into the CSS output',
  !css.includes('--fjn-')
);

// --- accent presets ----------------------------------------------------------

check('default accent is one of the accent options', accentOptions.includes(defaultAccent));
check(
  'every accent option has a full 10-step ramp',
  accentOptions.every((a) => Array.isArray(palette[a]) && palette[a].length === 10)
);
check(
  'each non-default accent has a CSS override block',
  accentOptions.filter((a) => a !== defaultAccent).every((a) => css.includes(`[data-fujin-accent="${a}"]`))
);
check(
  'accent changes interactive.default but not status.success',
  resolveDark('teal')['--fujin-interactive-default'] !== dark['--fujin-interactive-default'] &&
    resolveDark('teal')['--fujin-status-success'] === dark['--fujin-status-success']
);
check(
  'unknown accent is rejected rather than silently resolved',
  (() => {
    try { createFujinMantineTheme('chartreuse'); return false; } catch { return true; }
  })()
);

// --- generated-file discipline ----------------------------------------------

check('tokens.css carries the do-not-edit banner', css.includes('GENERATED FILE — DO NOT EDIT'));

if (failures > 0) {
  console.error(`\n${failures} build check(s) failed.`);
  process.exit(1);
}
console.log('\nAll build output checks passed.');
