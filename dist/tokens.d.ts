/**
 * tokens.d.ts
 *
 * GENERATED FILE — DO NOT EDIT.
 * Source of truth: tokens.json (DTCG). Regenerate with `npm run build`.
 * Edits here are lost on the next build and will silently diverge from the
 * token source, which is the exact failure mode CONSUMERS.md exists to prevent.
 */

/** Every hue in the primitive palette. Matches the pre-pipeline `MantineAccentKey`. */
export type MantineAccentKey = "dark" | "gray" | "red" | "pink" | "grape" | "violet" | "indigo" | "blue" | "cyan" | "teal" | "green" | "lime" | "yellow" | "orange";

/** The subset of hues Fujin ships as a selectable accent preset. */
export type FujinAccent = "violet" | "indigo" | "blue" | "cyan" | "teal" | "green" | "orange";

export type ColorRamp = readonly [
  string, string, string, string, string, string, string, string, string, string
];

export declare const palette: Readonly<Record<MantineAccentKey, ColorRamp>>;
export declare const commonColors: Readonly<{ white: string; black: string }>;
export declare const accentOptions: readonly FujinAccent[];
export declare const defaultAccent: FujinAccent;

export declare const tokens: {
  readonly spacing: {
    readonly base: 4;
    readonly scale: {
      readonly xxs: 2;
      readonly xs: 10;
      readonly sm: 12;
      readonly md: 16;
      readonly lg: 20;
      readonly xl: 24;
      readonly xxl: 32;
    };
  };
  readonly radius: {
    readonly xs: 0;
    readonly sm: 0;
    readonly md: 0;
    readonly lg: 0;
    readonly xl: 0;
    readonly default: 0;
  };
  readonly typography: {
    readonly fontFamily: {
      readonly base: "\"Verdana\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif";
      readonly mono: "\"JetBrains Mono\", \"Fira Code\", \"Cascadia Code\", Menlo, Consolas, monospace";
    };
    readonly fontSize: {
      readonly xs: 10;
      readonly sm: 12;
      readonly md: 14;
      readonly lg: 16;
      readonly xl: 20;
      readonly xxl: 24;
      readonly h1: 32;
      readonly h2: 24;
      readonly h3: 20;
      readonly h4: 16;
      readonly h5: 14;
      readonly h6: 12;
    };
    readonly fontWeight: {
      readonly regular: 400;
      readonly medium: 500;
      readonly semibold: 600;
      readonly bold: 700;
    };
    readonly lineHeight: {
      readonly none: 1;
      readonly tight: 1.2;
      readonly base: 1.5;
      readonly relaxed: 1.75;
    };
    readonly letterSpacing: {
      readonly tight: "-0.02em";
      readonly base: "0em";
      readonly wide: "0.05em";
      readonly widest: "0.1em";
    };
  };
  readonly opacity: {
    readonly disabled: 0.5;
    readonly loading: 0.7;
    readonly muted: 0.6;
  };
  readonly border: {
    readonly width: {
      readonly hairline: 1;
      readonly accent: 4;
    };
  };
  readonly layout: {
    readonly menuMinWidth: 160;
  };
  readonly breakpoints: {
    readonly xs: 576;
    readonly sm: 768;
    readonly md: 992;
    readonly lg: 1200;
    readonly xl: 1408;
  };
  readonly transition: {
    readonly duration: {
      readonly fast: "100ms";
      readonly base: "150ms";
      readonly slow: "250ms";
    };
    readonly easing: {
      readonly default: "ease";
      readonly in: "ease-in";
      readonly out: "ease-out";
      readonly inOut: "ease-in-out";
    };
  };
};

/** Map of `--fujin-*` custom-property name to resolved value. */
export type FujinCssVars = Record<string, string>;

/** Mode- and accent-invariant `--fujin-*` custom properties. */
export declare const scalarVars: FujinCssVars;

export declare function resolveDark(accent?: MantineAccentKey): FujinCssVars;
export declare function resolveLight(accent?: MantineAccentKey): FujinCssVars;
export declare function resolveAll(accent?: MantineAccentKey): {
  dark: FujinCssVars;
  light: FujinCssVars;
};

export default tokens;
