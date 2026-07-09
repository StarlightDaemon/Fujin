import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTokens } from '../theme/FujinThemeProvider';

export interface StatusBadgeProps {
  status: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  label: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, label, size = 'sm' }: StatusBadgeProps) {
  const t = useTokens();

  const color = {
    success: t.colors.statusSuccess,
    danger: t.colors.statusDanger,
    warning: t.colors.statusWarning,
    info: t.colors.statusInfo,
    neutral: t.colors.textMuted,
  }[status];

  const fontSize = size === 'sm' ? t.fontSize.xs : t.fontSize.sm;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // alignSelf keeps the badge hugging its content — the RN analogue of
        // the web `<span>`'s inline-flex sizing.
        badge: {
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: color,
          borderRadius: t.radius.default,
          backgroundColor: 'transparent',
          paddingVertical: t.spacing.base,
          paddingHorizontal: size === 'sm' ? t.spacing.scale.xs : t.spacing.scale.sm,
        },
        label: {
          color,
          fontFamily: t.fontFamily.base,
          fontSize,
          fontWeight: t.fontWeight.medium,
          lineHeight: fontSize * t.lineHeight.tight,
          letterSpacing: fontSize * t.letterSpacing.wide,
          textTransform: 'uppercase',
        },
      }),
    [t, color, fontSize, size],
  );

  return (
    <View style={styles.badge}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
