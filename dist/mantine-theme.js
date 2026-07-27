/**
 * mantine-theme.js
 *
 * GENERATED FILE — DO NOT EDIT.
 * Source of truth: tokens.json (DTCG). Regenerate with `npm run build`.
 * Edits here are lost on the next build and will silently diverge from the
 * token source, which is the exact failure mode CONSUMERS.md exists to prevent.
 */

/**
 * Mantine theme object built from tokens.json. Deliberately imports nothing from
 * @mantine/core — @mantine/core is an optional peer dependency, so this module
 * must be loadable by a native-only or CSS-only consumer. Pass the result
 * straight to `<MantineProvider theme={...}>`; it satisfies MantineThemeOverride
 * structurally.
 */

import { palette, defaultAccent } from './tokens.js';

/**
 * Mantine components whose radius is hardcoded in @mantine/core's stylesheet and
 * therefore NOT covered by `defaultRadius`. Each defaults to a fully-round
 * value; without the defaultProps below, a Fujin-themed app renders pill-shaped
 * Badges and circular Avatars inside a canonical zero-radius system.
 */
export const roundedByDefault = Object.freeze(["Avatar","Badge","Chip","ColorSwatch","Indicator","Pill","RangeSlider","Slider","Stepper","Switch","Timeline"]);

const BASE = Object.freeze({
  fontFamily: "\"Verdana\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif",
  fontFamilyMonospace: "\"JetBrains Mono\", \"Fira Code\", \"Cascadia Code\", Menlo, Consolas, monospace",
  headings: {
    fontFamily: "\"Verdana\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif",
    fontWeight: "600",
    sizes: {
      h1: { fontSize: "32px", lineHeight: "1.2" },
      h2: { fontSize: "24px", lineHeight: "1.2" },
      h3: { fontSize: "20px", lineHeight: "1.2" },
      h4: { fontSize: "16px", lineHeight: "1.5" },
      h5: { fontSize: "14px", lineHeight: "1.5" },
      h6: { fontSize: "12px", lineHeight: "1.5" },
    },
  },
  fontSizes: {
  "xs": "10px",
  "sm": "12px",
  "md": "14px",
  "lg": "16px",
  "xl": "20px"
},
  spacing: {
  "xxs": "2px",
  "xs": "10px",
  "sm": "12px",
  "md": "16px",
  "lg": "20px",
  "xl": "24px",
  "xxl": "32px"
},
  radius: {
  "xs": "0px",
  "sm": "0px",
  "md": "0px",
  "lg": "0px",
  "xl": "0px"
},
  defaultRadius: 0,
  lineHeights: {
  "xs": "1.2",
  "sm": "1.2",
  "md": "1.5",
  "lg": "1.5",
  "xl": "1.75"
},
  shadows: {
  "xs": "none",
  "sm": "0 1px 2px rgba(0,0,0,0.4)",
  "md": "0 2px 4px rgba(0,0,0,0.5)",
  "lg": "0 4px 8px rgba(0,0,0,0.6)",
  "xl": "0 8px 16px rgba(0,0,0,0.7)"
},
  breakpoints: {
  "xs": "36em",
  "sm": "48em",
  "md": "62em",
  "lg": "75em",
  "xl": "88em"
},
  colors: palette,
  primaryShade: { light: 6, dark: 6 },
  components: {
  "Avatar": {
    "defaultProps": {
      "radius": 0
    }
  },
  "Badge": {
    "defaultProps": {
      "radius": 0
    }
  },
  "Chip": {
    "defaultProps": {
      "radius": 0
    }
  },
  "ColorSwatch": {
    "defaultProps": {
      "radius": 0
    }
  },
  "Indicator": {
    "defaultProps": {
      "radius": 0
    }
  },
  "Pill": {
    "defaultProps": {
      "radius": 0
    }
  },
  "RangeSlider": {
    "defaultProps": {
      "radius": 0
    }
  },
  "Slider": {
    "defaultProps": {
      "radius": 0
    }
  },
  "Stepper": {
    "defaultProps": {
      "radius": 0
    }
  },
  "Switch": {
    "defaultProps": {
      "radius": 0
    }
  },
  "Timeline": {
    "defaultProps": {
      "radius": 0
    }
  }
},
});

/**
 * Build the Mantine theme override for one accent.
 *
 * Validated against the full palette rather than `accentOptions`: every hue is
 * present in `theme.colors`, so every hue is a structurally valid Mantine
 * `primaryColor`. `accentOptions` is the *curated* set Fujin ships a preset for
 * (see themes/index.ts) — a narrower recommendation, not a runtime constraint.
 */
export function createFujinMantineTheme(accent = defaultAccent) {
  if (!Object.prototype.hasOwnProperty.call(palette, accent)) {
    throw new Error(
      `Unknown Fujin accent: ${accent}. Expected one of: ${Object.keys(palette).join(', ')}`
    );
  }
  return { ...BASE, primaryColor: accent };
}

export default createFujinMantineTheme;
