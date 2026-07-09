// Native injection layer. The web `FujinThemeProvider` wraps children in a <div>
// carrying `--fujin-*` CSS variables; React Native has no CSS variables, so the
// native provider resolves the token set once per (mode, preset) and delivers it
// through React context. Components read it via `useTokens()`.

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { resolveTokens, type FujinTokens, type MantineAccentKey, type Mode } from './tokens';

interface FujinThemeContextValue {
  mode: Mode;
  toggle: () => void;
  setMode: (mode: Mode) => void;
  preset: MantineAccentKey;
  setPreset: (preset: MantineAccentKey) => void;
  tokens: FujinTokens;
}

const FujinThemeContext = createContext<FujinThemeContextValue | null>(null);

export function useFujinTheme(): FujinThemeContextValue {
  const ctx = useContext(FujinThemeContext);
  if (!ctx) throw new Error('useFujinTheme must be used inside FujinThemeProvider');
  return ctx;
}

/** Resolved token set for the current mode + accent. The primary component hook. */
export function useTokens(): FujinTokens {
  return useFujinTheme().tokens;
}

export interface FujinThemeProviderProps {
  children: React.ReactNode;
  /** Accent color key. Default 'violet'. Mirrors the web provider's `preset`. */
  preset?: MantineAccentKey;
  /** Initial color mode. Default 'dark'. Ignored while `followSystem` has no override. */
  defaultMode?: Mode;
  /** When true, follow the OS color scheme until the user toggles/sets a mode. */
  followSystem?: boolean;
}

export function FujinThemeProvider({
  children,
  preset: initialPreset = 'violet',
  defaultMode = 'dark',
  followSystem = false,
}: FujinThemeProviderProps) {
  const systemScheme = useColorScheme();
  // `null` override means "defer to the system scheme" (only when followSystem).
  const [override, setOverride] = useState<Mode | null>(followSystem ? null : defaultMode);
  const [preset, setPreset] = useState<MantineAccentKey>(initialPreset);

  const mode: Mode = override ?? (systemScheme === 'light' ? 'light' : 'dark');

  const setMode = useCallback((next: Mode) => setOverride(next), []);
  const toggle = useCallback(() => setOverride(mode === 'dark' ? 'light' : 'dark'), [mode]);

  const resolved = useMemo(() => resolveTokens(mode, preset), [mode, preset]);

  const value = useMemo<FujinThemeContextValue>(
    () => ({ mode, toggle, setMode, preset, setPreset, tokens: resolved }),
    [mode, toggle, setMode, preset, resolved],
  );

  return <FujinThemeContext.Provider value={value}>{children}</FujinThemeContext.Provider>;
}
