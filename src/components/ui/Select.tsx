'use client';

import type { ComponentPropsWithoutRef } from 'react';
import styled from 'styled-components';
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon';
import { controlStyles } from './control-styles';

const Wrapper = styled.div`
  position: relative;
  display: flex;
`;

const StyledSelect = styled.select`
  ${controlStyles}
  appearance: none;
  cursor: pointer;
  /* Room for the chevron, which sits on top of the control. */
  padding-right: ${({ theme }) => theme.space[40]};
`;

const Chevron = styled(ChevronDownIcon)`
  position: absolute;
  top: 50%;
  right: ${({ theme }) => theme.space[16]};
  transform: translateY(-50%);
  color: ${({ theme }) => theme.color.content.tertiary};
  /* Clicks belong to the select underneath. */
  pointer-events: none;
`;

// A native select on purpose: short option lists get the platform popup, keyboard
// handling and mobile wheel for free, and no custom widget can match that.
export function Select({ children, ...props }: ComponentPropsWithoutRef<'select'>) {
  return (
    <Wrapper>
      <StyledSelect {...props}>{children}</StyledSelect>
      <Chevron />
    </Wrapper>
  );
}
