import React, { useMemo } from 'react';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTokens } from '../theme/FujinThemeProvider';

export interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  const t = useTokens();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: t.spacing.scale.sm,
          borderBottomWidth: 1,
          borderBottomColor: t.colors.borderSubtle,
        },
        textGroup: {
          flexDirection: 'column',
          gap: t.spacing.base,
          flexShrink: 1,
        },
        title: {
          fontFamily: t.fontFamily.base,
          fontSize: t.fontSize.sm,
          fontWeight: t.fontWeight.semibold,
          color: t.colors.textPrimary,
          letterSpacing: t.fontSize.sm * t.letterSpacing.wide,
          textTransform: 'uppercase',
        },
        description: {
          fontFamily: t.fontFamily.base,
          fontSize: t.fontSize.xs,
          color: t.colors.textMuted,
        },
      }),
    [t],
  );

  return (
    <View style={styles.container}>
      <View style={styles.textGroup}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {action ? <View>{action}</View> : null}
    </View>
  );
}
