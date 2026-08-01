'use client';

import type { ComponentPropsWithRef } from 'react';
import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary';

// Measured off the design: the buttons that move between steps are 56 tall, the amount
// presets 48. One component, two sizes, rather than two components.
export type ButtonSize = 'md' | 'lg';

// WithRef, not WithoutRef: focus has to be able to land here after a donor is removed,
// and in React 19 a ref is an ordinary prop to pass along.
type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const sizeStyles = {
  md: css`
    padding: ${({ theme }) => `${theme.space[12]} ${theme.space[24]}`};
  `,
  lg: css`
    padding: ${({ theme }) => `${theme.space[16]} ${theme.space[32]}`};
  `,
};

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.color.action.primary.default};
    color: ${({ theme }) => theme.color.content.onAction};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.color.action.primary.hover};
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.color.action.primary.active};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.color.action.secondary.default};
    color: ${({ theme }) => theme.color.content.primary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.color.action.secondary.hover};
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.color.action.secondary.active};
    }
  `,
};

const StyledButton = styled.button<{ $variant: ButtonVariant; $size: ButtonSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* Labels sit next to an icon in the design, so the gap belongs here instead of
     to every caller. */
  gap: ${({ theme }) => theme.space[8]};
  border-radius: ${({ theme }) => theme.radius[8]};
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  white-space: nowrap;
  transition:
    background-color 150ms ease,
    transform 100ms ease;

  /* A press the finger can feel: barely there, and only while held down. */
  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}
`;

// type defaults to button: a primitive dropped into a form must not submit it by
// accident — the one button that submits says so explicitly.
export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return <StyledButton $variant={variant} $size={size} type={type} {...props} />;
}
