'use client';

import type { ComponentPropsWithoutRef } from 'react';
import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant;
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

const StyledButton = styled.button<{ $variant: ButtonVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* Labels sit next to an icon in the design, so the gap belongs here instead of
     to every caller. */
  gap: ${({ theme }) => theme.space[8]};
  padding: ${({ theme }) => `${theme.space[12]} ${theme.space[24]}`};
  border-radius: ${({ theme }) => theme.radius[12]};
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  white-space: nowrap;
  transition: background-color 150ms ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $variant }) => variantStyles[$variant]}
`;

// type defaults to button: a primitive dropped into a form must not submit it by
// accident — the one button that submits says so explicitly.
export function Button({ variant = 'primary', type = 'button', ...props }: ButtonProps) {
  return <StyledButton $variant={variant} type={type} {...props} />;
}
