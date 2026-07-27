// Token build entry point. Run with `npm run build`.
//
// Replaces the former scripts/export-tokens.ts, which hand-assembled a single
// resolved JSON file from themes/palette.ts. Values now come from tokens.json
// (DTCG) via Style Dictionary, and palette.ts is a thin re-export of the
// generated module rather than a second place design values are defined.

import StyleDictionary from 'style-dictionary';
import config from '../style-dictionary.config.mjs';
import { formats } from './fujin-formats.mjs';

for (const f of formats) {
  StyleDictionary.registerFormat(f);
}

// One timestamp for the whole run, so every emitted file agrees.
const generatedAt = new Date().toISOString();
for (const platform of Object.values(config.platforms)) {
  platform.options = { ...platform.options, generatedAt };
}

const sd = new StyleDictionary(config);
await sd.buildAllPlatforms();

console.log(`\nFujin tokens built (v${config.platforms.css.options.version}) -> dist/`);
