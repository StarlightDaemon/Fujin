import { Box, Stepper, Text, UnstyledButton } from '@mantine/core';
import { useState } from 'react';
import type { ReactNode } from 'react';
import tokens from '../tokens.json';

export interface WorkflowStep {
  label:        string;
  description?: string;
  content:      ReactNode;
  validate?:    () => true | string;
}

export interface WorkflowStepperProps {
  steps:           WorkflowStep[];
  onComplete?:     () => void;
  allowStepClick?: boolean;
}

export function WorkflowStepper({
  steps,
  onComplete,
  allowStepClick = false,
}: WorkflowStepperProps) {
  const [active, setActive] = useState(0);
  const [error,  setError]  = useState<string | null>(null);

  const isLast = active === steps.length - 1;
  const isDone = active === steps.length;

  const advance = () => {
    const current = steps[active];
    if (current.validate) {
      const result = current.validate();
      if (result !== true) {
        setError(result);
        return;
      }
    }
    setError(null);
    if (isLast) {
      setActive(steps.length);
      onComplete?.();
    } else {
      setActive((a) => a + 1);
    }
  };

  const back = () => {
    setError(null);
    setActive((a) => Math.max(0, a - 1));
  };

  const handleStepClick = (step: number) => {
    if (!allowStepClick || step >= active) return;
    setError(null);
    setActive(step);
  };

  const navBtn = (variant: 'primary' | 'ghost', disabled = false): React.CSSProperties => ({
    fontFamily:   tokens.typography.fontFamily.base,
    fontSize:     tokens.typography.fontSize.sm,
    fontWeight:   tokens.typography.fontWeight.medium,
    padding:      `${tokens.spacing.scale.xs}px ${tokens.spacing.scale.md}px`,
    borderRadius: tokens.radius.default,
    border:       `1px solid ${
      variant === 'primary'
        ? tokens.color.semantic.interactive.default
        : tokens.color.semantic.border.subtle
    }`,
    background: variant === 'primary'
      ? tokens.color.semantic.interactive.default
      : 'transparent',
    color: variant === 'primary'
      ? tokens.color.semantic.text.primary
      : tokens.color.semantic.text.secondary,
    cursor:  disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
  });

  return (
    <Box
      style={{
        background:   tokens.color.semantic.background.surface,
        border:       `1px solid ${tokens.color.semantic.border.subtle}`,
        borderRadius: tokens.radius.default,
      }}
    >
      <Stepper
        active={active}
        onStepClick={allowStepClick ? handleStepClick : undefined}
        styles={{
          root: {
            padding: tokens.spacing.scale.md,
          },
          stepIcon: {
            borderRadius: tokens.radius.default,
            borderColor:  tokens.color.semantic.border.default,
            background:   tokens.color.semantic.background.surface,
            color:        tokens.color.semantic.text.muted,
            fontFamily:   tokens.typography.fontFamily.base,
            fontSize:     tokens.typography.fontSize.xs,
          },
          stepLabel: {
            fontFamily: tokens.typography.fontFamily.base,
            fontSize:   tokens.typography.fontSize.sm,
            fontWeight: tokens.typography.fontWeight.medium,
            color:      tokens.color.semantic.text.secondary,
          },
          stepDescription: {
            fontFamily: tokens.typography.fontFamily.base,
            fontSize:   tokens.typography.fontSize.xs,
            color:      tokens.color.semantic.text.muted,
          },
          separator: {
            borderColor: tokens.color.semantic.border.subtle,
          },
          content: {
            paddingTop: tokens.spacing.scale.md,
          },
        }}
      >
        {steps.map((step) => (
          <Stepper.Step
            key={step.label}
            label={step.label}
            description={step.description}
          >
            <Box
              style={{
                padding:      tokens.spacing.scale.md,
                background:   tokens.color.semantic.background.base,
                border:       `1px solid ${tokens.color.semantic.border.subtle}`,
                borderRadius: tokens.radius.default,
              }}
            >
              {step.content}
            </Box>
          </Stepper.Step>
        ))}

        <Stepper.Completed>
          <Box
            style={{
              padding:      tokens.spacing.scale.md,
              background:   tokens.color.semantic.background.base,
              border:       `1px solid ${tokens.color.semantic.border.subtle}`,
              borderRadius: tokens.radius.default,
              textAlign:    'center',
            }}
          >
            <Text
              style={{
                fontFamily: tokens.typography.fontFamily.base,
                fontSize:   tokens.typography.fontSize.md,
                color:      tokens.color.semantic.status.success,
              }}
            >
              Workflow complete.
            </Text>
          </Box>
        </Stepper.Completed>
      </Stepper>

      {/* Validation error */}
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

      {/* Navigation — hidden once workflow is complete */}
      {!isDone && (
        <Box
          style={{
            padding:        `${tokens.spacing.scale.sm}px ${tokens.spacing.scale.md}px`,
            borderTop:      `1px solid ${tokens.color.semantic.border.subtle}`,
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
          }}
        >
          <UnstyledButton
            onClick={back}
            disabled={active === 0}
            style={navBtn('ghost', active === 0)}
          >
            ← Back
          </UnstyledButton>

          <UnstyledButton onClick={advance} style={navBtn('primary')}>
            {isLast ? 'Complete' : 'Next →'}
          </UnstyledButton>
        </Box>
      )}
    </Box>
  );
}
