'use client';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { LogoMarkIcon } from '@/components/icons/LogoMarkIcon';
import { LogoWordmarkIcon } from '@/components/icons/LogoWordmarkIcon';

// One name for the pair rather than one per picture: together they read as the brand, and
// the mascot on its own has nothing to say.
const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[8]};
  color: ${({ theme }) => theme.color.content.primary};
`;

const Mark = styled(LogoMarkIcon)`
  color: ${({ theme }) => theme.color.action.primary.default};
`;

// The artwork came out of the design with its colours baked in, which left the wordmark
// unreadable the moment the surface went dark. Inlined on currentColor instead, so both
// parts take their shade from a role.
export function Logo() {
  const { t } = useTranslation();

  return (
    <Wrapper role="img" aria-label={t('app.brand')}>
      <Mark />
      <LogoWordmarkIcon />
    </Wrapper>
  );
}
