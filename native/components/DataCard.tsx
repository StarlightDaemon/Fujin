import React, { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTokens } from '../theme/FujinThemeProvider';
import type { FujinTokens } from '../theme/tokens';

export interface CardAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface DataCardProps {
  title: string;
  badge?: ReactNode;
  children: ReactNode;
  detail?: ReactNode;
  actions?: CardAction[];
  defaultOpen?: boolean;
}

const PRIMARY_ACTION_LIMIT = 2;

export function DataCard({
  title,
  badge,
  children,
  detail,
  actions = [],
  defaultOpen = false,
}: DataCardProps) {
  const t = useTokens();
  const [open, setOpen] = useState(defaultOpen);
  const [overflowOpen, setOverflowOpen] = useState(false);

  const primaryActions = actions.slice(0, PRIMARY_ACTION_LIMIT);
  const overflow = actions.slice(PRIMARY_ACTION_LIMIT);
  const hasDetail = Boolean(detail);

  const styles = useMemo(() => makeStyles(t), [t]);

  const actionColor = (a: CardAction): string =>
    a.disabled
      ? t.colors.interactiveDisabled
      : a.danger
        ? t.colors.statusDanger
        : t.colors.textSecondary;

  // Web renders icon + label inside a Group gap={tokens.spacing.base};
  // the row View below is the RN equivalent.
  const renderAction = (a: CardAction) => (
    <Pressable
      key={a.label}
      onPress={a.disabled ? undefined : a.onClick}
      disabled={a.disabled}
      style={[styles.actionBtn, a.disabled ? styles.actionBtnDisabled : null]}
    >
      <View style={styles.actionContent}>
        {a.icon ? <View>{a.icon}</View> : null}
        <Text style={[styles.actionLabel, { color: actionColor(a) }]}>{a.label}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {badge ? <View>{badge}</View> : null}
      </View>

      {/* Primary content */}
      <View style={styles.body}>{children}</View>

      {/* Disclosure toggle */}
      {hasDetail ? (
        <Pressable style={styles.disclosureToggle} onPress={() => setOpen((o) => !o)}>
          <Text style={styles.disclosureText}>{open ? '▲ Less' : '▼ More detail'}</Text>
        </Pressable>
      ) : null}

      {/* Disclosed content — the toggle already provides the divider */}
      {hasDetail && open ? <View style={styles.detailPanel}>{detail}</View> : null}

      {/* Actions footer — first 2 primary, rest overflow inline */}
      {actions.length > 0 ? (
        <View style={styles.footer}>
          {primaryActions.map(renderAction)}
          {overflow.length > 0 ? (
            <Pressable style={styles.actionBtn} onPress={() => setOverflowOpen((o) => !o)}>
              <Text style={[styles.actionLabel, { color: t.colors.textSecondary }]}>
                {overflowOpen ? 'Less ▴' : 'More ▾'}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {/* Overflow panel — RN has no popover portal; overflow actions stack
          below the footer when expanded, preserving progressive disclosure. */}
      {overflow.length > 0 && overflowOpen ? (
        <View style={styles.overflowPanel}>{overflow.map(renderAction)}</View>
      ) : null}
    </View>
  );
}

function makeStyles(t: FujinTokens) {
  return StyleSheet.create({
    card: {
      backgroundColor: t.colors.bgSurface,
      borderWidth: t.border.width.hairline,
      borderColor: t.colors.borderSubtle,
      borderRadius: t.radius.default,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: t.spacing.scale.sm,
      paddingVertical: t.spacing.scale.sm,
      paddingHorizontal: t.spacing.scale.md,
      borderBottomWidth: 1,
      borderBottomColor: t.colors.borderSubtle,
    },
    title: {
      fontFamily: t.fontFamily.base,
      fontSize: t.fontSize.sm,
      fontWeight: t.fontWeight.semibold,
      color: t.colors.textPrimary,
      letterSpacing: t.fontSize.sm * t.letterSpacing.wide,
      textTransform: 'uppercase',
      flexShrink: 1,
    },
    body: {
      padding: t.spacing.scale.md,
    },
    disclosureToggle: {
      paddingVertical: t.spacing.scale.xs,
      paddingHorizontal: t.spacing.scale.md,
      borderTopWidth: 1,
      borderTopColor: t.colors.borderSubtle,
    },
    disclosureText: {
      fontFamily: t.fontFamily.base,
      fontSize: t.fontSize.xs,
      color: t.colors.textMuted,
    },
    detailPanel: {
      padding: t.spacing.scale.md,
      backgroundColor: t.colors.bgBase,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: t.spacing.scale.sm,
      paddingVertical: t.spacing.scale.xs,
      paddingHorizontal: t.spacing.scale.md,
      borderTopWidth: 1,
      borderTopColor: t.colors.borderSubtle,
    },
    overflowPanel: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: t.spacing.base,
      paddingVertical: t.spacing.scale.xs,
      paddingHorizontal: t.spacing.scale.md,
      borderTopWidth: 1,
      borderTopColor: t.colors.borderSubtle,
      backgroundColor: t.colors.bgBase,
    },
    actionBtn: {
      borderWidth: t.border.width.hairline,
      borderColor: t.colors.borderSubtle,
      borderRadius: t.radius.default,
      backgroundColor: 'transparent',
      paddingVertical: t.spacing.base,
      paddingHorizontal: t.spacing.scale.sm,
    },
    actionBtnDisabled: {
      opacity: t.opacity.disabled,
    },
    actionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.base,
    },
    actionLabel: {
      fontFamily: t.fontFamily.base,
      fontSize: t.fontSize.xs,
      fontWeight: t.fontWeight.medium,
    },
  });
}
