'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import styled from 'styled-components';
import { useFocusOnStepChange } from '../hooks/useFocusOnStepChange';
import { useStepInUrl } from '../hooks/useStepInUrl';
import { DonationDone } from './DonationDone';
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
  gap: ${({ theme }) => theme.space[40]};
`;

export function DonationWizard({
  renderShelterField,
  initialStep = 1,
  onDonated,
}: {
  renderShelterField: (props: ShelterFieldProps) => ReactNode;
  initialStep?: Step;
  /** Called once the gift is recorded, so the app layer can refresh what it shows. */
  onDonated?: () => void;
}) {
  const step = useWizard((state) => state.step);
  const sent = useWizard((state) => state.sent);

  const container = useRef<HTMLDivElement>(null);

  useStepInUrl(initialStep);
  // The confirmation counts as an arrival too, hence sent in the key.
  useFocusOnStepChange(container, sent ? 'done' : step);

  if (sent) {
    return (
      <Wrapper ref={container}>
        <DonationDone />
      </Wrapper>
    );
  }

  return (
    <Wrapper ref={container}>
      <Stepper current={step} />

      {step === 1 ? <StepOne renderShelterField={renderShelterField} /> : null}
      {step === 2 ? <StepTwo /> : null}
      {step === 3 ? <StepThree onDonated={onDonated} /> : null}
    </Wrapper>
  );
}
