import React, { createContext, useContext } from 'react';
import { MantineProvider, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { createFujinTheme, type FujinPreset, type MantineAccentKey } from '../themes/createFujinTheme';
import { scalarVars } from '../dist/tokens.js';
import '@mantine/core/styles.css';

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

  // Scalar vars (spacing, radius, type scale, …) are mode-invariant, so they are
  // injected alongside the mode-dependent semantic vars rather than swapped on
  // toggle. Without them, `var(--fujin-spacing-md)` would resolve to nothing for
  // any consumer who uses the components but never loads dist/tokens.css.
  return (
    <FujinThemeContext.Provider value={{ mode: scheme, toggle: toggleColorScheme, preset }}>
      <div style={{ ...scalarVars, ...vars, minHeight: '100vh' } as React.CSSProperties}>
        {children}
      </div>
    </FujinThemeContext.Provider>
  );
}

export function FujinThemeProvider({
  children,
  preset:      accentKey  = 'violet',
  defaultMode             = 'dark',
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
