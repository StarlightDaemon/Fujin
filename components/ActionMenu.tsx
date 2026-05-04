import { Menu, UnstyledButton } from '@mantine/core';
import type { ReactNode } from 'react';
import tokens from '../tokens.json';

export interface ActionMenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
}

export function ActionMenu({ items }: ActionMenuProps) {
  const triggerStyle: React.CSSProperties = {
    fontFamily: tokens.typography.fontFamily.base,
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.color.semantic.text.secondary,
    padding: `${tokens.spacing.base}px ${tokens.spacing.scale.sm}px`,
    cursor: 'pointer',
    border: `1px solid ${tokens.color.semantic.border.subtle}`,
    borderRadius: tokens.radius.default,
    background: 'transparent',
  };

  const dropdownStyle: React.CSSProperties = {
    background: tokens.color.semantic.background.elevated,
    border: `1px solid ${tokens.color.semantic.border.default}`,
    borderRadius: tokens.radius.default,
    padding: `${tokens.spacing.base}px 0`,
  };

  return (
    <Menu position="bottom-end" offset={tokens.spacing.base} radius={tokens.radius.default}>
      <Menu.Target>
        <UnstyledButton style={triggerStyle}>⋯</UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown style={dropdownStyle}>
        {items.map((item) => (
          <Menu.Item
            key={item.label}
            onClick={item.disabled ? undefined : item.onClick}
            disabled={item.disabled}
            leftSection={item.icon}
            style={{
              fontFamily: tokens.typography.fontFamily.base,
              fontSize: tokens.typography.fontSize.xs,
              color: item.danger
                ? tokens.color.semantic.status.danger
                : tokens.color.semantic.text.secondary,
              borderRadius: tokens.radius.default,
              opacity: item.disabled ? 0.5 : 1,
            }}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
