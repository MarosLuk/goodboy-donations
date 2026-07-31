'use client';

import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MailIcon } from '@/components/icons/MailIcon';
import { PhoneIcon } from '@/components/icons/PhoneIcon';
import { PinIcon } from '@/components/icons/PinIcon';

// Taken from the design: the address is text, the other two are things to act on.
const CHANNELS = [
  { key: 'email', Icon: MailIcon, href: 'mailto:hello@goodrequest.com' },
  { key: 'office', Icon: PinIcon, href: null },
  { key: 'phone', Icon: PhoneIcon, href: 'tel:+421911750750' },
] satisfies { key: string; Icon: ComponentType; href: string | null }[];

const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space[48]};
  grid-template-columns: minmax(0, 1fr);

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const Channel = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[20]};
  text-align: center;
`;

const IconTile = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius[12]};
  background: ${({ theme }) => theme.color.action.primary.bg};
  color: ${({ theme }) => theme.color.action.primary.default};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.text.lg.fontSize};
  line-height: ${({ theme }) => theme.text.lg.lineHeight};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.color.content.primary};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  color: ${({ theme }) => theme.color.content.tertiary};
`;

const Value = styled.span`
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.color.action.primary.default};
`;

const ValueLink = styled.a`
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.color.action.primary.default};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.color.action.primary.hover};
    text-decoration: underline;
  }
`;

export function ContactDetails() {
  const { t } = useTranslation();

  return (
    <List>
      {CHANNELS.map(({ key, Icon, href }) => (
        <Channel key={key}>
          <IconTile>
            <Icon />
          </IconTile>

          <Title>{t(`contact.${key}.title`)}</Title>
          <Description>{t(`contact.${key}.description`)}</Description>

          {href ? (
            <ValueLink href={href}>{t(`contact.${key}.value`)}</ValueLink>
          ) : (
            <Value>{t(`contact.${key}.value`)}</Value>
          )}
        </Channel>
      ))}
    </List>
  );
}
