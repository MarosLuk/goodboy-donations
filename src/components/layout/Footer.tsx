'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FacebookIcon } from '@/components/icons/FacebookIcon';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { defaultLocale } from '@/i18n/settings';
import { Logo } from './Logo';

const Wrapper = styled.footer`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[24]};
  padding: ${({ theme }) => `${theme.space[24]} 0`};
  border-top: ${({ theme }) => `${theme.borderWidth.xs} solid ${theme.color.surface.quaternary}`};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Side = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[32]};
`;

const Socials = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[16]};
  color: ${({ theme }) => theme.color.content.tertiary};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[32]};
`;

const NavLink = styled(Link)`
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  color: ${({ theme }) => theme.color.content.secondary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.color.content.primary};
  }
`;

export function Footer() {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? defaultLocale;

  return (
    <Wrapper>
      <Logo />

      <Side>
        {/* The foundation's profiles have no addresses, so these stay pictures
            instead of links to nowhere. aria-hidden keeps a screen reader from
            announcing something that cannot be acted on. */}
        <Socials aria-hidden="true">
          <FacebookIcon width={20} height={20} />
          <InstagramIcon width={20} height={20} />
        </Socials>

        <Nav aria-label={t('footer.links')}>
          <NavLink href={`/${locale}/contact`}>{t('footer.contact')}</NavLink>
        </Nav>
      </Side>
    </Wrapper>
  );
}
