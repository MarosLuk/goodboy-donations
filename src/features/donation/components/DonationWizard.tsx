'use client';

import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useStepInUrl } from '../hooks/useStepInUrl';
import type { Step } from '../lib/step';
import { useWizard } from '../store/wizard';
import type { ShelterFieldProps } from './StepOne';
import { StepOne } from './StepOne';
import { Stepper } from './Stepper';
import { StepThree } from './StepThree';
import { StepTwo } from './StepTwo';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[32]};
`;

export function DonationWizard({
  renderShelterField,
  initialStep = 1,
}: {
  renderShelterField: (props: ShelterFieldProps) => ReactNode;
  initialStep?: Step;
}) {
  const { t } = useTranslation();
  const step = useWizard((state) => state.step);
  const sent = useWizard((state) => state.sent);

  useStepInUrl(initialStep);

  // Plain wording for now; the designed confirmation arrives with the next commit.
  if (sent) {
    return <p role="status">{t('donation.submit.done')}</p>;
  }

  return (
    <Wrapper>
      <Stepper current={step} />

      {step === 1 ? <StepOne renderShelterField={renderShelterField} /> : null}
      {step === 2 ? <StepTwo /> : null}
      {step === 3 ? <StepThree /> : null}
    </Wrapper>
  );
}
