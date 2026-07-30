'use client';

import type { ComponentProps, ReactNode } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon';

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[8]};
  color: ${({ theme }) => theme.color.action.primary.default};
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.color.action.primary.hover};
  }
`;

type BackLinkProps = {
  href: ComponentProps<typeof Link>['href'];
  children: ReactNode;
};

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <StyledLink href={href}>
      <ArrowLeftIcon />
      {children}
    </StyledLink>
  );
}
