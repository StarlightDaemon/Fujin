import tokens from '../tokens.json';

export interface StatusBadgeProps {
  status: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  label: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, label, size = 'sm' }: StatusBadgeProps) {
  const color =
    status === 'neutral'
      ? tokens.color.semantic.text.muted
      : tokens.color.semantic.status[status];

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${color}`,
    color: color,
    borderRadius: tokens.radius.default,
    padding:
      size === 'sm'
        ? `${tokens.spacing.base}px ${tokens.spacing.scale.xs}px`
        : `${tokens.spacing.base}px ${tokens.spacing.scale.sm}px`,
    fontFamily: tokens.typography.fontFamily.base,
    fontSize:
      size === 'sm'
        ? tokens.typography.fontSize.xs
        : tokens.typography.fontSize.sm,
    fontWeight: tokens.typography.fontWeight.medium,
    lineHeight: tokens.typography.lineHeight.tight,
    background: 'transparent',
    textTransform: 'uppercase',
    letterSpacing: tokens.typography.letterSpacing.wide,
  };

  return <span style={badgeStyle}>{label}</span>;
}
