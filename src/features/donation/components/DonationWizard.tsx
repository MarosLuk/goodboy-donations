'use client';

import type { ReactNode } from 'react';
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
  const step = useWizard((state) => state.step);

  useStepInUrl(initialStep);

  return (
    <Wrapper>
      <Stepper current={step} />

      {step === 1 ? <StepOne renderShelterField={renderShelterField} /> : null}
      {step === 2 ? <StepTwo /> : null}
      {step === 3 ? <StepThree /> : null}
    </Wrapper>
  );
}
