// Native token resolver — the React Native equivalent of the web CSS-custom-property
// injection layer. React Native has no CSS variables, so instead of writing
// `var(--fujin-*)` into inline styles, the native surface resolves the same
// `tokens.json` (via the shared `themes/palette` role mapping) into a plain
// object of concrete values that `useTokens()` hands to components.
//
// Parity contract: the color roles below are the exact semantic roles the web
// layer exposes as `--fujin-*` variables, re-keyed from kebab CSS names to
// camelCase. Values are produced by the SAME `resolveDark`/`resolveLight`
// functions the web pipeline uses, so web and native never drift.

import tokens from '../../dist/tokens.js';
import { resolveDark, resolveLight, type MantineAccentKey } from '../../themes/palette';

export type { MantineAccentKey };

export type Mode = 'light' | 'dark';

export type FujinColorRole =
  | 'bgBase'
  | 'bgSurface'
  | 'bgElevated'
  | 'bgOverlay'
  | 'textPrimary'
  | 'textSecondary'
  | 'textMuted'
  | 'textInverse'
  | 'borderSubtle'
  | 'borderDefault'
  | 'borderStrong'
  | 'chromeBg'
  | 'chromeText'
  | 'chromeBorder'
  | 'interactiveDefault'
  | 'interactiveHover'
  | 'interactiveActive'
  | 'interactiveDisabled'
  | 'statusDanger'
  | 'statusWarning'
  | 'statusSuccess'
  | 'statusInfo';

export type FujinColors = Record<FujinColorRole, string>;

type FontWeightValue = '400' | '500' | '600' | '700';

export interface FujinTokens {
  mode: Mode;
  preset: MantineAccentKey;
  /** Resolved semantic color roles for the current mode + accent. */
  colors: FujinColors;
  spacing: typeof tokens.spacing;
  fontFamily: typeof tokens.typography.fontFamily;
  fontSize: typeof tokens.typography.fontSize;
  /** Stringified for React Native `TextStyle.fontWeight` (RN prefers string weights). */
  fontWeight: { regular: FontWeightValue; medium: FontWeightValue; semibold: FontWeightValue; bold: FontWeightValue };
  /**
   * Unitless multipliers, as on web. React Native `lineHeight` is absolute
   * points — multiply by the element's fontSize: `fontSize * lineHeight.tight`.
   */
  lineHeight: typeof tokens.typography.lineHeight;
  /**
   * em factors parsed from the `*.em` token strings. React Native
   * `letterSpacing` is absolute points — multiply by fontSize:
   * `fontSize * letterSpacing.wide`.
   */
  letterSpacing: { tight: number; base: number; wide: number; widest: number };
  radius: typeof tokens.radius;
  opacity: typeof tokens.opacity;
  /** px widths as numbers — React Native `borderWidth` takes points, not strings. */
  border: typeof tokens.border;
}

// Re-key the web CSS-variable map (`--fujin-*`) into camelCase native roles.
// Web-only entries (`--fujin-shadow-*`, `--fujin-layout-content-width`) are
// intentionally dropped: they are CSS box-shadow / clamp() strings with no RN
// equivalent. RN elevation/shadow is a separate concern, deferred until a
// primitive needs it.
function toColors(v: Record<string, string>): FujinColors {
  return {
    bgBase: v['--fujin-bg-base'],
    bgSurface: v['--fujin-bg-surface'],
    bgElevated: v['--fujin-bg-elevated'],
    bgOverlay: v['--fujin-bg-overlay'],
    textPrimary: v['--fujin-text-primary'],
    textSecondary: v['--fujin-text-secondary'],
    textMuted: v['--fujin-text-muted'],
    textInverse: v['--fujin-text-inverse'],
    borderSubtle: v['--fujin-border-subtle'],
    borderDefault: v['--fujin-border-default'],
    borderStrong: v['--fujin-border-strong'],
    chromeBg: v['--fujin-chrome-bg'],
    chromeText: v['--fujin-chrome-text'],
    chromeBorder: v['--fujin-chrome-border'],
    interactiveDefault: v['--fujin-interactive-default'],
    interactiveHover: v['--fujin-interactive-hover'],
    interactiveActive: v['--fujin-interactive-active'],
    interactiveDisabled: v['--fujin-interactive-disabled'],
    statusDanger: v['--fujin-status-danger'],
    statusWarning: v['--fujin-status-warning'],
    statusSuccess: v['--fujin-status-success'],
    statusInfo: v['--fujin-status-info'],
  };
}

const parseEm = (s: string): number => parseFloat(s);

const FONT_WEIGHT: FujinTokens['fontWeight'] = {
  regular: String(tokens.typography.fontWeight.regular) as FontWeightValue,
  medium: String(tokens.typography.fontWeight.medium) as FontWeightValue,
  semibold: String(tokens.typography.fontWeight.semibold) as FontWeightValue,
  bold: String(tokens.typography.fontWeight.bold) as FontWeightValue,
};

const LETTER_SPACING: FujinTokens['letterSpacing'] = {
  tight: parseEm(tokens.typography.letterSpacing.tight),
  base: parseEm(tokens.typography.letterSpacing.base),
  wide: parseEm(tokens.typography.letterSpacing.wide),
  widest: parseEm(tokens.typography.letterSpacing.widest),
};

/** Resolve the full token set for a given color mode and accent preset. */
export function resolveTokens(mode: Mode, preset: MantineAccentKey): FujinTokens {
  const vars = mode === 'dark' ? resolveDark(preset) : resolveLight(preset);
  return {
    mode,
    preset,
    colors: toColors(vars),
    spacing: tokens.spacing,
    fontFamily: tokens.typography.fontFamily,
    fontSize: tokens.typography.fontSize,
    fontWeight: FONT_WEIGHT,
    lineHeight: tokens.typography.lineHeight,
    letterSpacing: LETTER_SPACING,
    radius: tokens.radius,
    opacity: tokens.opacity,
    border: tokens.border,
  };
}
