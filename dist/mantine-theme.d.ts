/**
 * mantine-theme.d.ts
 *
 * GENERATED FILE — DO NOT EDIT.
 * Source of truth: tokens.json (DTCG). Regenerate with `npm run build`.
 * Edits here are lost on the next build and will silently diverge from the
 * token source, which is the exact failure mode CONSUMERS.md exists to prevent.
 */

import type { MantineAccentKey } from './tokens';

/**
 * Structural shape of the generated theme. Kept deliberately loose (`unknown`
 * leaves are not used) so it assigns cleanly to Mantine's MantineThemeOverride
 * without this package taking a type dependency on @mantine/core.
 */
export interface FujinMantineTheme {
  primaryColor: MantineAccentKey;
  primaryShade: { light: number; dark: number };
  defaultRadius: number;
  fontFamily: string;
  fontFamilyMonospace: string;
  headings: Record<string, unknown>;
  fontSizes: Record<string, string>;
  spacing: Record<string, string>;
  radius: Record<string, string>;
  lineHeights: Record<string, string>;
  shadows: Record<string, string>;
  breakpoints: Record<string, string>;
  colors: Readonly<Record<MantineAccentKey, readonly string[]>>;
  components: Record<string, { defaultProps: { radius: number } }>;
}

/** Mantine components whose radius is hardcoded upstream and needs an explicit 0. */
export declare const roundedByDefault: readonly string[];

export declare function createFujinMantineTheme(accent?: MantineAccentKey): FujinMantineTheme;

export default createFujinMantineTheme;
