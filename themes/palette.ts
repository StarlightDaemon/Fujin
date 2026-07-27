// Compatibility surface over the generated token module.
//
// This file used to *define* the palette and the two semantic-role resolvers by
// hand — a second source of design truth alongside tokens.json, and the reason
// the same hex values existed in two places that nothing could keep in sync.
// Both now come from tokens.json via `npm run build`; this module only re-exports
// them under the names the rest of the repo already imports.
//
// Do not add values here. Add them to tokens.json and rebuild.

export {
  palette as PALETTE,
  commonColors,
  accentOptions,
  defaultAccent,
  resolveDark,
  resolveLight,
  resolveAll,
} from '../dist/tokens.js';

export type { MantineAccentKey, FujinAccent, FujinCssVars, ColorRamp } from '../dist/tokens.js';
