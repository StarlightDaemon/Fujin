# Fujin Theming Kit — G3.1P Build Brief

**Repo:** `/mnt/e/Fujin`
**Governance:** `/mnt/e/Fujin/llms-full.txt` (read for context, you will be modifying it)
**Task:** Implement a Mantine-native color theming system for Fujin. No new features — this
replaces the existing hardcoded slate palette with Mantine's Open Color system + a preset factory.

---

## 0. Core architecture decision

`FujinThemeProvider` will absorb `MantineProvider`. Apps no longer import `MantineProvider`
directly — `FujinThemeProvider` handles it internally. It accepts a `preset` prop (an accent
color key) and `defaultMode` prop. It wraps `MantineProvider` with the correct Mantine theme,
then injects `--fujin-*` CSS vars derived from that theme into a child div.

The inner var-injector uses `useComputedColorScheme()` from `@mantine/core` (must be called
inside `MantineProvider`) so that Fujin's vars always match the active Mantine color scheme.

---

## 1. Full Mantine Open Color palette

Embed this exactly in `themes/createFujinTheme.ts` as the `PALETTE` constant.

```ts
const PALETTE = {
  dark:   ['#C9C9C9','#b8b8b8','#828282','#696969','#424242','#3b3b3b','#2e2e2e','#242424','#1f1f1f','#141414'],
  gray:   ['#f8f9fa','#f1f3f5','#e9ecef','#dee2e6','#ced4da','#adb5bd','#868e96','#495057','#343a40','#212529'],
  red:    ['#fff5f5','#ffe3e3','#ffc9c9','#ffa8a8','#ff8787','#ff6b6b','#fa5252','#f03e3e','#e03131','#c92a2a'],
  pink:   ['#fff0f6','#ffdeeb','#fcc2d7','#faa2c1','#f783ac','#f06595','#e64980','#d6336c','#c2255c','#a61e4d'],
  grape:  ['#f8f0fc','#f3d9fa','#eebefa','#e599f7','#da77f2','#cc5de8','#be4bdb','#ae3ec9','#9c36b5','#862e9c'],
  violet: ['#f3f0ff','#e5dbff','#d0bfff','#b197fc','#9775fa','#845ef7','#7950f2','#7048e8','#6741d9','#5f3dc4'],
  indigo: ['#edf2ff','#dbe4ff','#bac8ff','#91a7ff','#748ffc','#5c7cfa','#4c6ef5','#4263eb','#3b5bdb','#364fc7'],
  blue:   ['#e7f5ff','#d0ebff','#a5d8ff','#74c0fc','#4dabf7','#339af0','#228be6','#1c7ed6','#1971c2','#1864ab'],
  cyan:   ['#e3fafc','#c5f6fa','#99e9f2','#66d9e8','#3bc9db','#22b8cf','#15aabf','#1098ad','#0c8599','#0b7285'],
  teal:   ['#e6fcf5','#c3fae8','#96f2d7','#63e6be','#38d9a9','#20c997','#12b886','#0ca678','#099268','#087f5b'],
  green:  ['#ebfbee','#d3f9d8','#b2f2bb','#8ce99a','#69db7c','#51cf66','#40c057','#37b24d','#2f9e44','#2b8a3e'],
  lime:   ['#f4fce3','#e9fac8','#d8f5a2','#c0eb75','#a9e34b','#94d82d','#82c91e','#74b816','#66a80f','#5c940d'],
  yellow: ['#fff9db','#fff3bf','#ffec99','#ffe066','#ffd43b','#fcc419','#fab005','#f59f00','#f08c00','#e67700'],
  orange: ['#fff4e6','#ffe8cc','#ffd8a8','#ffc078','#ffa94d','#ff922b','#fd7e14','#f76707','#e8590c','#d9480f'],
} as const;

export type MantineAccentKey = keyof typeof PALETTE;
```

---

## 2. Shade-to-semantic mapping

Used inside `createFujinTheme` to build the `dark` and `light` CSS var maps.

Dark mode mapping:
  --fujin-bg-base              dark[8]    #1f1f1f
  --fujin-bg-surface           dark[7]    #242424
  --fujin-bg-elevated          dark[6]    #2e2e2e
  --fujin-bg-overlay           dark[5]    #3b3b3b
  --fujin-text-primary         dark[0]    #C9C9C9
  --fujin-text-secondary       dark[1]    #b8b8b8
  --fujin-text-muted           dark[3]    #696969
  --fujin-text-inverse         dark[8]    #1f1f1f
  --fujin-border-subtle        dark[6]    #2e2e2e
  --fujin-border-default       dark[5]    #3b3b3b
  --fujin-border-strong        dark[3]    #696969
  --fujin-interactive-default  accent[6]
  --fujin-interactive-hover    accent[7]
  --fujin-interactive-active   accent[8]
  --fujin-interactive-disabled dark[5]    #3b3b3b
  --fujin-status-danger        red[6]     #fa5252
  --fujin-status-warning       yellow[6]  #fab005
  --fujin-status-success       green[6]   #40c057
  --fujin-status-info          blue[6]    #228be6
  --fujin-shadow-sm            0 1px 2px rgba(0,0,0,0.4)
  --fujin-shadow-md            0 2px 4px rgba(0,0,0,0.5)
  --fujin-shadow-lg            0 4px 8px rgba(0,0,0,0.6)

Light mode mapping:
  --fujin-bg-base              gray[0]    #f8f9fa
  --fujin-bg-surface           #ffffff
  --fujin-bg-elevated          gray[1]    #f1f3f5
  --fujin-bg-overlay           gray[2]    #e9ecef
  --fujin-text-primary         gray[9]    #212529
  --fujin-text-secondary       gray[7]    #495057
  --fujin-text-muted           gray[5]    #adb5bd
  --fujin-text-inverse         gray[0]    #f8f9fa
  --fujin-border-subtle        gray[2]    #e9ecef
  --fujin-border-default       gray[3]    #dee2e6
  --fujin-border-strong        gray[6]    #868e96
  --fujin-interactive-default  accent[6]
  --fujin-interactive-hover    accent[7]
  --fujin-interactive-active   accent[8]
  --fujin-interactive-disabled gray[3]    #dee2e6
  --fujin-status-danger        red[6]     #fa5252
  --fujin-status-warning       yellow[6]  #fab005
  --fujin-status-success       green[6]   #40c057
  --fujin-status-info          blue[6]    #228be6
  --fujin-shadow-sm            0 1px 2px rgba(0,0,0,0.08)
  --fujin-shadow-md            0 2px 4px rgba(0,0,0,0.12)
  --fujin-shadow-lg            0 4px 8px rgba(0,0,0,0.16)

---

## 3. Files to create

### `themes/createFujinTheme.ts`

```ts
import { createTheme, type MantineThemeOverride } from '@mantine/core';
import tokens from '../tokens.json';

// PALETTE constant here (Section 1 above)

export interface FujinPreset {
  key:     MantineAccentKey;
  dark:    Record<string, string>;
  light:   Record<string, string>;
  mantine: MantineThemeOverride;
}

export function createFujinTheme(accent: MantineAccentKey): FujinPreset {
  const a = PALETTE[accent];

  const dark: Record<string, string> = {
    '--fujin-bg-base':              PALETTE.dark[8],
    '--fujin-bg-surface':           PALETTE.dark[7],
    '--fujin-bg-elevated':          PALETTE.dark[6],
    '--fujin-bg-overlay':           PALETTE.dark[5],
    '--fujin-text-primary':         PALETTE.dark[0],
    '--fujin-text-secondary':       PALETTE.dark[1],
    '--fujin-text-muted':           PALETTE.dark[3],
    '--fujin-text-inverse':         PALETTE.dark[8],
    '--fujin-border-subtle':        PALETTE.dark[6],
    '--fujin-border-default':       PALETTE.dark[5],
    '--fujin-border-strong':        PALETTE.dark[3],
    '--fujin-interactive-default':  a[6],
    '--fujin-interactive-hover':    a[7],
    '--fujin-interactive-active':   a[8],
    '--fujin-interactive-disabled': PALETTE.dark[5],
    '--fujin-status-danger':        PALETTE.red[6],
    '--fujin-status-warning':       PALETTE.yellow[6],
    '--fujin-status-success':       PALETTE.green[6],
    '--fujin-status-info':          PALETTE.blue[6],
    '--fujin-shadow-sm':            '0 1px 2px rgba(0,0,0,0.4)',
    '--fujin-shadow-md':            '0 2px 4px rgba(0,0,0,0.5)',
    '--fujin-shadow-lg':            '0 4px 8px rgba(0,0,0,0.6)',
  };

  const light: Record<string, string> = {
    '--fujin-bg-base':              PALETTE.gray[0],
    '--fujin-bg-surface':           '#ffffff',
    '--fujin-bg-elevated':          PALETTE.gray[1],
    '--fujin-bg-overlay':           PALETTE.gray[2],
    '--fujin-text-primary':         PALETTE.gray[9],
    '--fujin-text-secondary':       PALETTE.gray[7],
    '--fujin-text-muted':           PALETTE.gray[5],
    '--fujin-text-inverse':         PALETTE.gray[0],
    '--fujin-border-subtle':        PALETTE.gray[2],
    '--fujin-border-default':       PALETTE.gray[3],
    '--fujin-border-strong':        PALETTE.gray[6],
    '--fujin-interactive-default':  a[6],
    '--fujin-interactive-hover':    a[7],
    '--fujin-interactive-active':   a[8],
    '--fujin-interactive-disabled': PALETTE.gray[3],
    '--fujin-status-danger':        PALETTE.red[6],
    '--fujin-status-warning':       PALETTE.yellow[6],
    '--fujin-status-success':       PALETTE.green[6],
    '--fujin-status-info':          PALETTE.blue[6],
    '--fujin-shadow-sm':            '0 1px 2px rgba(0,0,0,0.08)',
    '--fujin-shadow-md':            '0 2px 4px rgba(0,0,0,0.12)',
    '--fujin-shadow-lg':            '0 4px 8px rgba(0,0,0,0.16)',
  };

  const mantine = createTheme({
    primaryColor:        accent,
    defaultRadius:       0,
    fontFamily:          tokens.typography.fontFamily.base,
    fontFamilyMonospace: tokens.typography.fontFamily.mono,
  });

  return { key: accent, dark, light, mantine };
}
```

### `themes/index.ts`

```ts
export { createFujinTheme, type FujinPreset, type MantineAccentKey } from './createFujinTheme';
export const violet = createFujinTheme('violet');
export const indigo = createFujinTheme('indigo');
export const blue   = createFujinTheme('blue');
export const cyan   = createFujinTheme('cyan');
export const teal   = createFujinTheme('teal');
export const green  = createFujinTheme('green');
export const orange = createFujinTheme('orange');
```

---

## 4. Files to modify

### `components/FujinThemeProvider.tsx`

Replace the existing implementation entirely:

```tsx
import React, { createContext, useContext } from 'react';
import { MantineProvider, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { createFujinTheme, type FujinPreset, type MantineAccentKey } from '../themes/createFujinTheme';

interface FujinThemeContextValue {
  mode:   'light' | 'dark';
  toggle: () => void;
  preset: FujinPreset;
}

const FujinThemeContext = createContext<FujinThemeContextValue | null>(null);

export function useFujinTheme(): FujinThemeContextValue {
  const ctx = useContext(FujinThemeContext);
  if (!ctx) throw new Error('useFujinTheme must be used inside FujinThemeProvider');
  return ctx;
}

export interface FujinThemeProviderProps {
  children:     React.ReactNode;
  preset?:      MantineAccentKey;
  defaultMode?: 'light' | 'dark';
}

function FujinVarInjector({ preset, children }: { preset: FujinPreset; children: React.ReactNode }) {
  const scheme = useComputedColorScheme('dark');
  const { toggleColorScheme } = useMantineColorScheme();
  const vars = scheme === 'dark' ? preset.dark : preset.light;

  return (
    <FujinThemeContext.Provider value={{ mode: scheme, toggle: toggleColorScheme, preset }}>
      <div style={{ ...vars, minHeight: '100vh' } as React.CSSProperties}>
        {children}
      </div>
    </FujinThemeContext.Provider>
  );
}

export function FujinThemeProvider({
  children,
  preset: accentKey = 'violet',
  defaultMode = 'dark',
}: FujinThemeProviderProps) {
  const theme = createFujinTheme(accentKey);
  return (
    <MantineProvider theme={theme.mantine} defaultColorScheme={defaultMode}>
      <FujinVarInjector preset={theme}>
        {children}
      </FujinVarInjector>
    </MantineProvider>
  );
}
```

Move `import '@mantine/core/styles.css'` into this file if it was previously in main.tsx.
Remove: all hardcoded hex injection, old useState for mode, old FujinThemeMode type.

### `components/index.ts`

Add at the bottom:
```ts
export * as themes from '../themes';
export { createFujinTheme, type FujinPreset, type MantineAccentKey } from '../themes/createFujinTheme';
```

### `tokens.json`

Replace the entire `"color"` block with:
```json
"color": {
  "source": "mantine-open-color",
  "note": "All color values are derived from Mantine Open Color at runtime via the FujinThemeProvider preset. See themes/createFujinTheme.ts for the shade-to-semantic-role mapping.",
  "accentOptions": ["violet","indigo","blue","cyan","teal","green","orange"],
  "status": {
    "danger":  "red[6]",
    "warning": "yellow[6]",
    "success": "green[6]",
    "info":    "blue[6]"
  }
},
```

Remove: `color.palette`, `color.semantic`, `color.themes`.

### `llms-full.txt` — Section 2 TOKEN CONTRACT

Replace `### Color Palette — Slate` and `### Semantic Colors` with:

```
### Color System — Mantine Open Color

Colors come from Mantine's built-in Open Color palette at runtime. Do not hardcode hex
values. Use `var(--fujin-*)` CSS custom properties injected by `FujinThemeProvider`.

Neutral scales:
  dark[0] #C9C9C9  dark[1] #b8b8b8  dark[2] #828282  dark[3] #696969
  dark[4] #424242  dark[5] #3b3b3b  dark[6] #2e2e2e  dark[7] #242424
  dark[8] #1f1f1f  dark[9] #141414

  gray[0] #f8f9fa  gray[1] #f1f3f5  gray[2] #e9ecef  gray[3] #dee2e6
  gray[4] #ced4da  gray[5] #adb5bd  gray[6] #868e96  gray[7] #495057
  gray[8] #343a40  gray[9] #212529

Accent options (shades 6/7/8 used for interactive states):
  violet  [6]#7950f2  [7]#7048e8  [8]#6741d9
  indigo  [6]#4c6ef5  [7]#4263eb  [8]#3b5bdb
  blue    [6]#228be6  [7]#1c7ed6  [8]#1971c2
  cyan    [6]#15aabf  [7]#1098ad  [8]#0c8599
  teal    [6]#12b886  [7]#0ca678  [8]#099268
  green   [6]#40c057  [7]#37b24d  [8]#2f9e44
  orange  [6]#fd7e14  [7]#f76707  [8]#e8590c

Status colors (fixed across all presets):
  red[6]    #fa5252   -> --fujin-status-danger
  yellow[6] #fab005   -> --fujin-status-warning
  green[6]  #40c057   -> --fujin-status-success
  blue[6]   #228be6   -> --fujin-status-info
```

Also update the FujinThemeProvider entry in Section 3 to show the new API:

```
### FujinThemeProvider

Wraps the entire app. Absorbs MantineProvider — do not add a separate MantineProvider.

Props:
  preset?:      MantineAccentKey   — accent color key; default 'violet'
  defaultMode?: 'dark' | 'light'  — default 'dark'

Usage:
  <FujinThemeProvider preset="violet" defaultMode="dark">
    <FujinToastProvider>
      <App />
    </FujinToastProvider>
  </FujinThemeProvider>

useFujinTheme() returns { mode: 'dark'|'light', toggle: () => void, preset: FujinPreset }
```

---

## 5. HLO main.tsx (`/mnt/e/HardlinkOrganizer/webapp/frontend/src/main.tsx`)

Replace:
```tsx
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { FujinThemeProvider, FujinToastProvider } from '@fujin';

<MantineProvider>
  <FujinThemeProvider defaultMode="dark">
    <FujinToastProvider>
      <App />
    </FujinToastProvider>
  </FujinThemeProvider>
</MantineProvider>
```

With:
```tsx
import '@mantine/core/styles.css';
import { FujinThemeProvider, FujinToastProvider } from '@fujin';

<FujinThemeProvider preset="violet" defaultMode="dark">
  <FujinToastProvider>
    <App />
  </FujinToastProvider>
</FujinThemeProvider>
```

---

## 6. What NOT to change

- All other component files (DataTable, FormShell, DataCard, etc.) use `var(--fujin-*)` vars
  which still resolve correctly. Zero changes needed in those files.
- tokens.json non-color sections (spacing, typography, radius, opacity, shadow, breakpoints,
  transition) — leave untouched.
- llms-full.txt sections other than Section 2 and the FujinThemeProvider entry — leave untouched.
- FujinToastProvider.tsx — leave untouched.
- All HLO component files under webapp/frontend/src/components/ — leave untouched.

---

## 7. Acceptance checks

Before finishing, verify:
1. themes/createFujinTheme.ts compiles — exports PALETTE, createFujinTheme, FujinPreset, MantineAccentKey
2. themes/index.ts exports 7 named presets + the factory + types
3. FujinThemeProvider contains no hardcoded hex values anywhere
4. FujinVarInjector uses useComputedColorScheme and useMantineColorScheme from @mantine/core
5. tokens.json color block contains no hex values — only the source declaration
6. HLO main.tsx has no MantineProvider import
7. llms-full.txt Section 2 shows Open Color values, not slate
8. Run: grep -r "#0f172a\|#1e293b\|#334155\|#f8fafc" /mnt/e/Fujin/components/ — should return nothing
