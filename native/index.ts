// Fujin React Native primitive set — public surface.
// Consumes the same tokens.json as the web layer via the native injection layer
// (FujinThemeProvider + useTokens). See llms-full.txt section 6 for the full API.

export {
  FujinThemeProvider,
  useFujinTheme,
  useTokens,
  resolveTokens,
} from './theme';
export type {
  FujinThemeProviderProps,
  FujinTokens,
  FujinColors,
  FujinColorRole,
  Mode,
  MantineAccentKey,
} from './theme';

export { StatusBadge, SectionHeader, DataCard } from './components';
export type {
  StatusBadgeProps,
  SectionHeaderProps,
  DataCardProps,
  CardAction,
} from './components';
