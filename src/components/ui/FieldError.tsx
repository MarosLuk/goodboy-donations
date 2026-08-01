'use client';

import styled, { keyframes } from 'styled-components';

// The complaint eases in under the field instead of snapping into it.
const appear = keyframes`
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
`;

export const FieldError = styled.p`
  font-size: ${({ theme }) => theme.text.sm.fontSize};
  line-height: ${({ theme }) => theme.text.sm.lineHeight};
  color: ${({ theme }) => theme.color.state.error.fg};
  animation: ${appear} 150ms ease-out;
`;
