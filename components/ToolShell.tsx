import { AppShell, NavLink, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { ReactNode } from 'react';
import tokens from '../tokens.json';

const RAIL_EXPANDED  = 220;
const RAIL_COLLAPSED = 60;

export interface NavItem {
  icon:     ReactNode;
  label:    string;
  active?:  boolean;
  onClick?: () => void;
}

export interface ToolShellProps {
  navItems:  NavItem[];
  logo?:     ReactNode;
  footer?:   ReactNode;
  children:  ReactNode;
}

export function ToolShell({ navItems, logo, footer, children }: ToolShellProps) {
  const [collapsed,   { toggle: toggleRail }]   = useDisclosure(false);
  const [mobileOpen,  { toggle: toggleMobile }] = useDisclosure(false);

  const railWidth = collapsed ? RAIL_COLLAPSED : RAIL_EXPANDED;

  const rail: React.CSSProperties = {
    background:   tokens.color.semantic.background.surface,
    borderRight:  `1px solid ${tokens.color.semantic.border.subtle}`,
    display:      'flex',
    flexDirection:'column',
    transition:   `width ${tokens.transition.duration.base} ${tokens.transition.easing.default}`,
    overflowX:    'hidden',
  };

  const logoBar: React.CSSProperties = {
    padding:       tokens.spacing.scale.md,
    borderBottom:  `1px solid ${tokens.color.semantic.border.subtle}`,
    display:       'flex',
    alignItems:    'center',
    gap:           tokens.spacing.scale.sm,
    color:         tokens.color.semantic.text.primary,
    cursor:        'pointer',
    userSelect:    'none',
    flexShrink:    0,
  };

  const logoLabel: React.CSSProperties = {
    fontFamily:  tokens.typography.fontFamily.base,
    fontSize:    tokens.typography.fontSize.sm,
    fontWeight:  tokens.typography.fontWeight.semibold,
    whiteSpace:  'nowrap',
    overflow:    'hidden',
  };

  const footerSlot: React.CSSProperties = {
    borderTop: `1px solid ${tokens.color.semantic.border.subtle}`,
    padding:   tokens.spacing.scale.sm,
    flexShrink: 0,
  };

  const main: React.CSSProperties = {
    background: tokens.color.semantic.background.base,
    minHeight:  '100vh',
  };

  return (
    <AppShell
      navbar={{
        width:     railWidth,
        breakpoint:'sm',
        collapsed: { mobile: !mobileOpen },
      }}
      padding={0}
    >
      <AppShell.Navbar style={rail}>

        {/* Logo / collapse toggle */}
        <UnstyledButton onClick={toggleRail} style={logoBar}>
          {logo}
          {!collapsed && <span style={logoLabel}>Menu</span>}
        </UnstyledButton>

        {/* Nav items */}
        <Stack gap={0} style={{ flex: 1, overflowY: 'auto', padding: `${tokens.spacing.scale.xs}px 0` }}>
          {navItems.map((item) =>
            collapsed ? (
              <Tooltip key={item.label} label={item.label} position="right" withArrow={false}>
                <UnstyledButton
                  onClick={item.onClick}
                  style={{
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    height:          40,
                    width:           '100%',
                    color:           item.active
                                       ? tokens.color.semantic.text.primary
                                       : tokens.color.semantic.text.muted,
                    background:      item.active
                                       ? tokens.color.semantic.background.elevated
                                       : 'transparent',
                  }}
                >
                  {item.icon}
                </UnstyledButton>
              </Tooltip>
            ) : (
              <NavLink
                key={item.label}
                label={item.label}
                leftSection={item.icon}
                active={item.active}
                onClick={item.onClick}
                styles={{
                  root: {
                    borderRadius: tokens.radius.default,
                    color: item.active
                             ? tokens.color.semantic.text.primary
                             : tokens.color.semantic.text.secondary,
                  },
                }}
              />
            )
          )}
        </Stack>

        {/* Footer slot — user profile, settings, etc. */}
        {footer && <div style={footerSlot}>{footer}</div>}

      </AppShell.Navbar>

      <AppShell.Main style={main}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
