import { Box, Loader, Text, UnstyledButton } from '@mantine/core';
import type { FormEvent, ReactNode } from 'react';
import tokens from '../tokens.json';

export interface FormShellProps {
  onSubmit:      (e: FormEvent<HTMLFormElement>) => void;
  children:      ReactNode;
  submitLabel?:  string;
  loading?:      boolean;
  error?:        string;
  actions?:      ReactNode;
}

export function FormShell({
  onSubmit,
  children,
  submitLabel = 'Submit',
  loading     = false,
  error,
  actions,
}: FormShellProps) {

  const shell: React.CSSProperties = {
    background:   tokens.color.semantic.background.surface,
    border:       `1px solid ${tokens.color.semantic.border.subtle}`,
    borderRadius: tokens.radius.default,
  };

  const fieldArea: React.CSSProperties = {
    padding:    tokens.spacing.scale.md,
    display:    'flex',
    flexDirection: 'column',
    gap:        tokens.spacing.scale.md,
  };

  const footer: React.CSSProperties = {
    padding:        `${tokens.spacing.scale.sm}px ${tokens.spacing.scale.md}px`,
    borderTop:      `1px solid ${tokens.color.semantic.border.subtle}`,
    display:        'flex',
    alignItems:     'center',
    justifyContent: actions ? 'space-between' : 'flex-end',
    gap:            tokens.spacing.scale.sm,
  };

  const submitBtn: React.CSSProperties = {
    fontFamily:   tokens.typography.fontFamily.base,
    fontSize:     tokens.typography.fontSize.sm,
    fontWeight:   tokens.typography.fontWeight.medium,
    color:        loading
                    ? tokens.color.semantic.interactive.disabled
                    : tokens.color.semantic.text.primary,
    padding:      `${tokens.spacing.scale.xs}px ${tokens.spacing.scale.md}px`,
    borderRadius: tokens.radius.default,
    border:       `1px solid ${
                    loading
                      ? tokens.color.semantic.border.subtle
                      : tokens.color.semantic.interactive.default
                  }`,
    background:   loading
                    ? tokens.color.semantic.background.elevated
                    : tokens.color.semantic.interactive.default,
    cursor:       loading ? 'not-allowed' : 'pointer',
    display:      'flex',
    alignItems:   'center',
    gap:          tokens.spacing.base,
    opacity:      loading ? 0.7 : 1,
  };

  return (
    <Box style={shell}>
      <form onSubmit={loading ? (e) => e.preventDefault() : onSubmit} noValidate>

        {/* Fields */}
        <div style={fieldArea}>
          {children}
        </div>

        {/* Form-level error */}
        {error && (
          <Box style={{ padding: `0 ${tokens.spacing.scale.md}px ${tokens.spacing.scale.sm}px` }}>
            <Text
              style={{
                fontFamily: tokens.typography.fontFamily.base,
                fontSize:   tokens.typography.fontSize.xs,
                color:      tokens.color.semantic.status.danger,
              }}
            >
              {error}
            </Text>
          </Box>
        )}

        {/* Footer — secondary actions left, submit right */}
        <div style={footer}>
          {actions && <div>{actions}</div>}
          <UnstyledButton type="submit" disabled={loading} style={submitBtn}>
            {loading && <Loader size={12} color={tokens.color.semantic.text.muted} />}
            {submitLabel}
          </UnstyledButton>
        </div>

      </form>
    </Box>
  );
}
