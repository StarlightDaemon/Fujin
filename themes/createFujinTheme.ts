import { createTheme, type MantineThemeOverride } from '@mantine/core';
import { resolveDark, resolveLight, type MantineAccentKey } from './palette';
import { createFujinMantineTheme } from '../dist/mantine-theme.js';

export type { MantineAccentKey };

export interface FujinPreset {
  key:     MantineAccentKey;
  dark:    Record<string, string>;
  light:   Record<string, string>;
  mantine: MantineThemeOverride;
}

/**
 * Build a Fujin preset: the two CSS custom-property maps plus the Mantine theme.
 *
 * The Mantine theme is generated from tokens.json rather than assembled here.
 * That matters for more than tidiness: the generated theme carries per-component
 * `defaultProps: { radius: 0 }` for the eleven Mantine components whose radius is
 * hardcoded in @mantine/core's stylesheet and is therefore NOT reached by
 * `defaultRadius` (Avatar, Badge, Chip, ColorSwatch, Indicator, Pill, Slider,
 * RangeSlider, Stepper, Switch, Timeline). The previous hand-written theme set
 * `defaultRadius: 0` only, so those eleven silently rendered fully rounded inside
 * a system whose canonical radius is 0. See `roundedByDefault` in
 * dist/mantine-theme.js and the radius entry in .raiden/state/DECISIONS.md.
 */
export function createFujinTheme(accent: MantineAccentKey): FujinPreset {
  const dark  = resolveDark(accent);
  const light = resolveLight(accent);

  const mantine = createTheme(createFujinMantineTheme(accent) as MantineThemeOverride);

  return { key: accent, dark, light, mantine };
}
