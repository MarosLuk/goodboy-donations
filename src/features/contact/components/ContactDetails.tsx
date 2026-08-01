'use client';

import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
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
  gap: ${({ theme }) => theme.space[32]};
  grid-template-columns: minmax(0, 1fr);

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

// The three cards settle in one after another — a short beat apart, not a parade.
const rise = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
`;

const Channel = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[20]};
  text-align: center;
  /* backwards, so a card still waiting for its turn is not visible early. */
  animation: ${rise} 350ms ease-out backwards;

  &:nth-child(2) {
    animation-delay: 70ms;
  }

  &:nth-child(3) {
    animation-delay: 140ms;
  }

  /* The global reset shortens durations but not delays, and a delayed 'backwards'
     animation would hold the card invisible — so here it goes entirely. */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const IconTile = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  /* The kit draws the tile at 10, a step the radius scale does not have. */
  border-radius: 10px;
  background: ${({ theme }) => theme.color.action.primary.bg10};
  color: ${({ theme }) => theme.color.action.primary.default};
`;

// The title sits 8 over its line while the tile and the link keep the 20 of the card.
const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[8]};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.text.xl.fontSize};
  line-height: ${({ theme }) => theme.text.xl.lineHeight};
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
  transition: color 150ms ease;

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

          <TextBlock>
            <Title>{t(`contact.${key}.title`)}</Title>
            <Description>{t(`contact.${key}.description`)}</Description>
          </TextBlock>

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
