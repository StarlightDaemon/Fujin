import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import tokens from '../tokens.json';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextValue {
  mode:    ThemeMode;
  toggle:  () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode:    'dark',
  toggle:  () => {},
  setMode: () => {},
});

export function useFujinTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

function injectVars(mode: ThemeMode): void {
  const t    = tokens.color.themes[mode];
  const root = document.documentElement;

  // Background
  root.style.setProperty('--fujin-bg-base',     t.background.base);
  root.style.setProperty('--fujin-bg-surface',  t.background.surface);
  root.style.setProperty('--fujin-bg-elevated', t.background.elevated);
  root.style.setProperty('--fujin-bg-overlay',  t.background.overlay);

  // Text
  root.style.setProperty('--fujin-text-primary',   t.text.primary);
  root.style.setProperty('--fujin-text-secondary', t.text.secondary);
  root.style.setProperty('--fujin-text-muted',     t.text.muted);
  root.style.setProperty('--fujin-text-inverse',   t.text.inverse);

  // Border
  root.style.setProperty('--fujin-border-subtle',  t.border.subtle);
  root.style.setProperty('--fujin-border-default', t.border.default);
  root.style.setProperty('--fujin-border-strong',  t.border.strong);

  // Interactive
  root.style.setProperty('--fujin-interactive-default',  t.interactive.default);
  root.style.setProperty('--fujin-interactive-hover',    t.interactive.hover);
  root.style.setProperty('--fujin-interactive-active',   t.interactive.active);
  root.style.setProperty('--fujin-interactive-disabled', t.interactive.disabled);

  // Status
  root.style.setProperty('--fujin-status-danger',  t.status.danger);
  root.style.setProperty('--fujin-status-warning', t.status.warning);
  root.style.setProperty('--fujin-status-success', t.status.success);
  root.style.setProperty('--fujin-status-info',    t.status.info);

  // Shadows
  root.style.setProperty('--fujin-shadow-sm', t.shadow.sm);
  root.style.setProperty('--fujin-shadow-md', t.shadow.md);
  root.style.setProperty('--fujin-shadow-lg', t.shadow.lg);

  // Attribute for CSS selector targeting (e.g. [data-fujin-theme="light"])
  root.setAttribute('data-fujin-theme', mode);
}

export interface FujinThemeProviderProps {
  children:     ReactNode;
  defaultMode?: ThemeMode;
}

export function FujinThemeProvider({
  children,
  defaultMode = 'dark',
}: FujinThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);

  useEffect(() => {
    injectVars(mode);
  }, [mode]);

  // Inject on first render — useEffect fires after paint so we also run synchronously
  // on mount to avoid a flash of un-themed content
  useEffect(() => {
    injectVars(defaultMode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle  = () => setModeState((m) => (m === 'dark' ? 'light' : 'dark'));
  const setMode = (m: ThemeMode) => setModeState(m);

  return (
    <ThemeContext.Provider value={{ mode, toggle, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
