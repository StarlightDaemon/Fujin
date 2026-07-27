/**
 * tokens.js
 *
 * GENERATED FILE — DO NOT EDIT.
 * Source of truth: tokens.json (DTCG). Regenerate with `npm run build`.
 * Edits here are lost on the next build and will silently diverge from the
 * token source, which is the exact failure mode CONSUMERS.md exists to prevent.
 */

/** Primitive palette. Hues red…orange are Open Color; `dark` is Mantine's dark ramp. */
export const palette = Object.freeze({
  dark: ["#c9c9c9","#b8b8b8","#828282","#696969","#424242","#3b3b3b","#2e2e2e","#242424","#1f1f1f","#141414"],
  gray: ["#f8f9fa","#f1f3f5","#e9ecef","#dee2e6","#ced4da","#adb5bd","#868e96","#495057","#343a40","#212529"],
  red: ["#fff5f5","#ffe3e3","#ffc9c9","#ffa8a8","#ff8787","#ff6b6b","#fa5252","#f03e3e","#e03131","#c92a2a"],
  pink: ["#fff0f6","#ffdeeb","#fcc2d7","#faa2c1","#f783ac","#f06595","#e64980","#d6336c","#c2255c","#a61e4d"],
  grape: ["#f8f0fc","#f3d9fa","#eebefa","#e599f7","#da77f2","#cc5de8","#be4bdb","#ae3ec9","#9c36b5","#862e9c"],
  violet: ["#f3f0ff","#e5dbff","#d0bfff","#b197fc","#9775fa","#845ef7","#7950f2","#7048e8","#6741d9","#5f3dc4"],
  indigo: ["#edf2ff","#dbe4ff","#bac8ff","#91a7ff","#748ffc","#5c7cfa","#4c6ef5","#4263eb","#3b5bdb","#364fc7"],
  blue: ["#e7f5ff","#d0ebff","#a5d8ff","#74c0fc","#4dabf7","#339af0","#228be6","#1c7ed6","#1971c2","#1864ab"],
  cyan: ["#e3fafc","#c5f6fa","#99e9f2","#66d9e8","#3bc9db","#22b8cf","#15aabf","#1098ad","#0c8599","#0b7285"],
  teal: ["#e6fcf5","#c3fae8","#96f2d7","#63e6be","#38d9a9","#20c997","#12b886","#0ca678","#099268","#087f5b"],
  green: ["#ebfbee","#d3f9d8","#b2f2bb","#8ce99a","#69db7c","#51cf66","#40c057","#37b24d","#2f9e44","#2b8a3e"],
  lime: ["#f4fce3","#e9fac8","#d8f5a2","#c0eb75","#a9e34b","#94d82d","#82c91e","#74b816","#66a80f","#5c940d"],
  yellow: ["#fff9db","#fff3bf","#ffec99","#ffe066","#ffd43b","#fcc419","#fab005","#f59f00","#f08c00","#e67700"],
  orange: ["#fff4e6","#ffe8cc","#ffd8a8","#ffc078","#ffa94d","#ff922b","#fd7e14","#f76707","#e8590c","#d9480f"],
});

/** Palette entries that are not part of a 10-step ramp. */
export const commonColors = Object.freeze({"white":"#ffffff","black":"#000000"});

/** Accent presets Fujin ships a theme for. */
export const accentOptions = Object.freeze(["violet","indigo","blue","cyan","teal","green","orange"]);

/** Accent applied when a caller does not choose one. */
export const defaultAccent = "violet";

/**
 * Scale tokens — mode- and accent-invariant. px dimensions are numbers (React
 * inline styles and React Native both want numbers); em dimensions stay strings.
 */
export const tokens = Object.freeze({
  "spacing": {
    "base": 4,
    "scale": {
      "xxs": 2,
      "xs": 10,
      "sm": 12,
      "md": 16,
      "lg": 20,
      "xl": 24,
      "xxl": 32
    }
  },
  "radius": {
    "xs": 0,
    "sm": 0,
    "md": 0,
    "lg": 0,
    "xl": 0,
    "default": 0
  },
  "typography": {
    "fontFamily": {
      "base": "\"Verdana\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif",
      "mono": "\"JetBrains Mono\", \"Fira Code\", \"Cascadia Code\", Menlo, Consolas, monospace"
    },
    "fontSize": {
      "xs": 10,
      "sm": 12,
      "md": 14,
      "lg": 16,
      "xl": 20,
      "xxl": 24,
      "h1": 32,
      "h2": 24,
      "h3": 20,
      "h4": 16,
      "h5": 14,
      "h6": 12
    },
    "fontWeight": {
      "regular": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "lineHeight": {
      "none": 1,
      "tight": 1.2,
      "base": 1.5,
      "relaxed": 1.75
    },
    "letterSpacing": {
      "tight": "-0.02em",
      "base": "0em",
      "wide": "0.05em",
      "widest": "0.1em"
    }
  },
  "opacity": {
    "disabled": 0.5,
    "loading": 0.7,
    "muted": 0.6
  },
  "border": {
    "width": {
      "hairline": 1,
      "accent": 4
    }
  },
  "layout": {
    "menuMinWidth": 160
  },
  "breakpoints": {
    "xs": 576,
    "sm": 768,
    "md": 992,
    "lg": 1200,
    "xl": 1408
  },
  "transition": {
    "duration": {
      "fast": "100ms",
      "base": "150ms",
      "slow": "250ms"
    },
    "easing": {
      "default": "ease",
      "in": "ease-in",
      "out": "ease-out",
      "inOut": "ease-in-out"
    }
  }
});

/**
 * Mode- and accent-invariant `--fujin-*` custom properties (spacing, radius,
 * type scale, opacity, borders, breakpoints, transitions). Separate from the
 * semantic maps because these never change with mode or accent — inject them
 * once. FujinThemeProvider spreads this alongside the mode map so that
 * `var(--fujin-spacing-md)` resolves for component consumers who never load
 * tokens.css.
 */
export const scalarVars = Object.freeze({
  "--fujin-spacing-base": "4px",
  "--fujin-spacing-xxs": "2px",
  "--fujin-spacing-xs": "10px",
  "--fujin-spacing-sm": "12px",
  "--fujin-spacing-md": "16px",
  "--fujin-spacing-lg": "20px",
  "--fujin-spacing-xl": "24px",
  "--fujin-spacing-xxl": "32px",
  "--fujin-radius-xs": "0px",
  "--fujin-radius-sm": "0px",
  "--fujin-radius-md": "0px",
  "--fujin-radius-lg": "0px",
  "--fujin-radius-xl": "0px",
  "--fujin-radius-default": "0px",
  "--fujin-font-family-base": "\"Verdana\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif",
  "--fujin-font-family-mono": "\"JetBrains Mono\", \"Fira Code\", \"Cascadia Code\", Menlo, Consolas, monospace",
  "--fujin-font-size-xs": "10px",
  "--fujin-font-size-sm": "12px",
  "--fujin-font-size-md": "14px",
  "--fujin-font-size-lg": "16px",
  "--fujin-font-size-xl": "20px",
  "--fujin-font-size-xxl": "24px",
  "--fujin-font-size-h1": "32px",
  "--fujin-font-size-h2": "24px",
  "--fujin-font-size-h3": "20px",
  "--fujin-font-size-h4": "16px",
  "--fujin-font-size-h5": "14px",
  "--fujin-font-size-h6": "12px",
  "--fujin-font-weight-regular": "400",
  "--fujin-font-weight-medium": "500",
  "--fujin-font-weight-semibold": "600",
  "--fujin-font-weight-bold": "700",
  "--fujin-line-height-none": "1",
  "--fujin-line-height-tight": "1.2",
  "--fujin-line-height-base": "1.5",
  "--fujin-line-height-relaxed": "1.75",
  "--fujin-letter-spacing-tight": "-0.02em",
  "--fujin-letter-spacing-base": "0em",
  "--fujin-letter-spacing-wide": "0.05em",
  "--fujin-letter-spacing-widest": "0.1em",
  "--fujin-opacity-disabled": "0.5",
  "--fujin-opacity-loading": "0.7",
  "--fujin-opacity-muted": "0.6",
  "--fujin-border-width-hairline": "1px",
  "--fujin-border-width-accent": "4px",
  "--fujin-layout-menu-min-width": "160px",
  "--fujin-breakpoint-xs": "576px",
  "--fujin-breakpoint-sm": "768px",
  "--fujin-breakpoint-md": "992px",
  "--fujin-breakpoint-lg": "1200px",
  "--fujin-breakpoint-xl": "1408px",
  "--fujin-duration-fast": "100ms",
  "--fujin-duration-base": "150ms",
  "--fujin-duration-slow": "250ms",
  "--fujin-easing-default": "ease",
  "--fujin-easing-in": "ease-in",
  "--fujin-easing-out": "ease-out",
  "--fujin-easing-in-out": "ease-in-out"
});

/** Which semantic roles track the accent, and at which shade index. */
const ACCENT_SHADES = Object.freeze({
  "--fujin-interactive-default": 6,
  "--fujin-interactive-hover": 7,
  "--fujin-interactive-active": 8,
});

const SEMANTIC_DARK = Object.freeze({
  "--fujin-bg-base": "#1f1f1f",
  "--fujin-bg-surface": "#242424",
  "--fujin-bg-elevated": "#2e2e2e",
  "--fujin-bg-overlay": "#3b3b3b",
  "--fujin-text-primary": "#c9c9c9",
  "--fujin-text-secondary": "#b8b8b8",
  "--fujin-text-muted": "#696969",
  "--fujin-text-inverse": "#1f1f1f",
  "--fujin-text-on-accent": "#ffffff",
  "--fujin-border-subtle": "#2e2e2e",
  "--fujin-border-default": "#3b3b3b",
  "--fujin-border-strong": "#696969",
  "--fujin-chrome-bg": "#242424",
  "--fujin-chrome-text": "#c9c9c9",
  "--fujin-chrome-border": "#2e2e2e",
  "--fujin-interactive-default": "#7950f2",
  "--fujin-interactive-hover": "#7048e8",
  "--fujin-interactive-active": "#6741d9",
  "--fujin-interactive-disabled": "#3b3b3b",
  "--fujin-status-danger": "#fa5252",
  "--fujin-status-warning": "#fab005",
  "--fujin-status-success": "#40c057",
  "--fujin-status-info": "#228be6",
  "--fujin-shadow-xs": "none",
  "--fujin-shadow-sm": "0 1px 2px rgba(0,0,0,0.4)",
  "--fujin-shadow-md": "0 2px 4px rgba(0,0,0,0.5)",
  "--fujin-shadow-lg": "0 4px 8px rgba(0,0,0,0.6)",
  "--fujin-shadow-xl": "0 8px 16px rgba(0,0,0,0.7)",
  "--fujin-layout-content-width": "clamp(560px, 78vw, 2400px)",
});

const SEMANTIC_LIGHT = Object.freeze({
  "--fujin-bg-base": "#dee2e6",
  "--fujin-bg-surface": "#ffffff",
  "--fujin-bg-elevated": "#f1f3f5",
  "--fujin-bg-overlay": "#ffffff",
  "--fujin-text-primary": "#212529",
  "--fujin-text-secondary": "#495057",
  "--fujin-text-muted": "#868e96",
  "--fujin-text-inverse": "#f8f9fa",
  "--fujin-text-on-accent": "#ffffff",
  "--fujin-border-subtle": "#ced4da",
  "--fujin-border-default": "#adb5bd",
  "--fujin-border-strong": "#495057",
  "--fujin-chrome-bg": "#343a40",
  "--fujin-chrome-text": "#f8f9fa",
  "--fujin-chrome-border": "#495057",
  "--fujin-interactive-default": "#7950f2",
  "--fujin-interactive-hover": "#7048e8",
  "--fujin-interactive-active": "#6741d9",
  "--fujin-interactive-disabled": "#dee2e6",
  "--fujin-status-danger": "#fa5252",
  "--fujin-status-warning": "#fab005",
  "--fujin-status-success": "#40c057",
  "--fujin-status-info": "#228be6",
  "--fujin-shadow-xs": "none",
  "--fujin-shadow-sm": "0 1px 2px rgba(0,0,0,0.08)",
  "--fujin-shadow-md": "0 2px 4px rgba(0,0,0,0.12)",
  "--fujin-shadow-lg": "0 4px 8px rgba(0,0,0,0.16)",
  "--fujin-shadow-xl": "0 8px 16px rgba(0,0,0,0.2)",
  "--fujin-layout-content-width": "clamp(560px, 78vw, 2400px)",
});

function withAccent(base, accent) {
  const ramp = palette[accent];
  if (!ramp) throw new Error(`Unknown Fujin accent: ${accent}`);
  const out = { ...base };
  for (const name of Object.keys(ACCENT_SHADES)) out[name] = ramp[ACCENT_SHADES[name]];
  return out;
}

/** Dark-mode `--fujin-*` custom properties for the given accent. */
export function resolveDark(accent = defaultAccent) {
  return withAccent(SEMANTIC_DARK, accent);
}

/** Light-mode `--fujin-*` custom properties for the given accent. */
export function resolveLight(accent = defaultAccent) {
  return withAccent(SEMANTIC_LIGHT, accent);
}

/** Both modes at once, for callers that inject a full stylesheet. */
export function resolveAll(accent = defaultAccent) {
  return { dark: resolveDark(accent), light: resolveLight(accent) };
}

export default tokens;
