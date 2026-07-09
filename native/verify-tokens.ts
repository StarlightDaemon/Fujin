// Runtime verification for the native token resolver — the native analogue of
// `scripts/export-tokens.ts`. Run with `npm run verify:native` (tsx). It imports
// only the pure resolver (no `react-native`), so it needs no RN toolchain.
//
// Asserts web/native parity and the RN-specific value conversions.

import { resolveTokens, type FujinColorRole } from './theme/tokens';

const ROLES: FujinColorRole[] = [
  'bgBase', 'bgSurface', 'bgElevated', 'bgOverlay',
  'textPrimary', 'textSecondary', 'textMuted', 'textInverse',
  'borderSubtle', 'borderDefault', 'borderStrong',
  'chromeBg', 'chromeText', 'chromeBorder',
  'interactiveDefault', 'interactiveHover', 'interactiveActive', 'interactiveDisabled',
  'statusDanger', 'statusWarning', 'statusSuccess', 'statusInfo',
];

let failures = 0;
function check(name: string, cond: boolean): void {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures++;
    console.error(`  FAIL ${name}`);
  }
}

const dark = resolveTokens('dark', 'violet');
const light = resolveTokens('light', 'violet');
const tealDark = resolveTokens('dark', 'teal');

const isHex = (s: string): boolean => /^#[0-9a-fA-F]{3,8}$/.test(s);

check(`${ROLES.length} dark color roles resolve to hex`, ROLES.every((r) => isHex(dark.colors[r])));
check(`${ROLES.length} light color roles resolve to hex`, ROLES.every((r) => isHex(light.colors[r])));
check('dark and light diverge (bgBase)', dark.colors.bgBase !== light.colors.bgBase);
check('accent preset drives interactiveDefault', dark.colors.interactiveDefault !== tealDark.colors.interactiveDefault);
check('status colors are preset-invariant', dark.colors.statusSuccess === tealDark.colors.statusSuccess);
check('radius.default is 0 (sharp-edge mandate)', dark.radius.default === 0);
check('letterSpacing.wide parsed em -> 0.05', dark.letterSpacing.wide === 0.05);
check('lineHeight.tight unitless 1.2', dark.lineHeight.tight === 1.2);
check('fontWeight.semibold stringified to "600"', dark.fontWeight.semibold === '600');
check('spacing.scale.md is 16', dark.spacing.scale.md === 16);
check('opacity.disabled is 0.5', dark.opacity.disabled === 0.5);

if (failures > 0) {
  console.error(`\n${failures} native token check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll native token checks passed (${ROLES.length} color roles x dark/light + accent parity).`);
