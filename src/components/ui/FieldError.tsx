'use client';

import styled from 'styled-components';

export const FieldError = styled.p`
  font-size: ${({ theme }) => theme.text.sm.fontSize};
  line-height: ${({ theme }) => theme.text.sm.lineHeight};
  color: ${({ theme }) => theme.color.state.error.fg};
`;
