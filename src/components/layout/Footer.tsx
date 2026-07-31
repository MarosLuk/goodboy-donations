'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FacebookIcon } from '@/components/icons/FacebookIcon';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { defaultLocale } from '@/i18n/settings';
import { ColorSchemeToggle } from './ColorSchemeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Logo } from './Logo';

const Wrapper = styled.footer`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[24]};
  /* 24 over the content and none under it: with the 32-tall row that is the frame's
     56. The frame draws its stroke inside, so the border comes out of the 24. */
  padding: ${({ theme }) => `calc(${theme.space[24]} - ${theme.borderWidth.xs}) 0 0`};
  border-top: ${({ theme }) => `${theme.borderWidth.xs} solid ${theme.color.content.quintary}`};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

// Four groups do not fit on one line of a phone, so on a narrow screen the icons and the two
// controls take one row and the links the next. Wrapping rather than a second breakpoint,
// because what decides is whether they fit, not how wide the screen is.
const Side = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => `${theme.space[16]} ${theme.space[24]}`};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    gap: ${({ theme }) => theme.space[32]};
  }
`;

const Socials = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[16]};
  color: ${({ theme }) => theme.color.content.tertiary};
  /* Icons have no text to give back, so they would be crushed instead of the row wrapping. */
  flex-shrink: 0;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[8]};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[24]};
  flex-shrink: 0;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    gap: ${({ theme }) => theme.space[32]};
  }
`;

const NavLink = styled(Link)`
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  color: ${({ theme }) => theme.color.content.tertiary};
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
          <FacebookIcon width={16} height={16} />
          <InstagramIcon width={16} height={16} />
        </Socials>

        {/* The two things a visitor can change about the page itself, kept together and
            apart from the links, which change the page they are on. */}
        <Controls>
          <LocaleSwitcher />
          <ColorSchemeToggle />
        </Controls>

        <Nav aria-label={t('footer.links')}>
          <NavLink href={`/${locale}/contact`}>{t('footer.contact')}</NavLink>
          <NavLink href={`/${locale}/about`}>{t('footer.about')}</NavLink>
        </Nav>
      </Side>
    </Wrapper>
  );
}
