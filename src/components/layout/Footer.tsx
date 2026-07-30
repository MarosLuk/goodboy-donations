'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FacebookIcon } from '@/components/icons/FacebookIcon';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { defaultLocale } from '@/i18n/settings';
import { Logo } from './Logo';

const socials = [
  { key: 'facebook', href: 'https://www.facebook.com/goodrequest', Icon: FacebookIcon },
  { key: 'instagram', href: 'https://www.instagram.com/goodrequest', Icon: InstagramIcon },
];

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

const Socials = styled.ul`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[16]};
`;

const SocialLink = styled.a`
  display: block;
  color: ${({ theme }) => theme.color.content.tertiary};

  &:hover {
    color: ${({ theme }) => theme.color.content.primary};
  }
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
        <Socials>
          {socials.map(({ key, href, Icon }) => (
            <li key={key}>
              <SocialLink
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={t(`footer.${key}`)}
              >
                <Icon width={20} height={20} />
              </SocialLink>
            </li>
          ))}
        </Socials>

        <Nav aria-label={t('footer.links')}>
          <NavLink href={`/${locale}/contact`}>{t('footer.contact')}</NavLink>
          <NavLink href={`/${locale}/about`}>{t('footer.about')}</NavLink>
        </Nav>
      </Side>
    </Wrapper>
  );
}
