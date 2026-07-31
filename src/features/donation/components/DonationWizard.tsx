'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import { motion } from 'motion/react';
import styled from 'styled-components';
import { useFocusOnStepChange } from '../hooks/useFocusOnStepChange';
import { useStepInUrl } from '../hooks/useStepInUrl';
import { DonationDone } from './DonationDone';
import type { Step } from '../lib/step';
import { useWizard } from '../store/wizard';
import type { ShelterFieldProps } from './StepOne';
import { StepOne } from './StepOne';
import { Stepper } from './Stepper';
import { fills } from './StepActions';
import { StepThree } from './StepThree';
import { StepTwo } from './StepTwo';

const Wrapper = styled.div<{ $fill?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => `var(--rhythm, ${theme.space[40]})`};

  ${({ $fill }) => $fill && fills}
`;

// The step itself, and the two boxes above it, hand the column's height down to whatever
// inside wants to scroll on its own. Off by default: a step that fits has nothing to
// gain from it, and stretching it would only move its actions away from its fields.
const Step = styled(motion.div)<{ $fill?: boolean }>`
  ${({ $fill }) => $fill && fills}
`;

// Step 2 is the one whose height the visitor controls: every donor added is another
// three fields. The rest are as tall as they are.
const GROWS = 2;

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
  // Keyed by the step, so React remounts and the entrance plays on every arrival. No exit
  // animation on purpose: mode="wait" would hold the next step back and delay the focus
  // move with it. The x offset is dropped for anyone who asked for reduced motion —
  // MotionConfig in the style provider takes care of that.
  const entrance = {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.25, ease: 'easeOut' as const },
  };

  useStepInUrl(initialStep);
  // The confirmation counts as an arrival too, hence sent in the key.
  useFocusOnStepChange(container, sent ? 'done' : step);

  if (sent) {
    return (
      <Wrapper ref={container}>
        <motion.div key="done" {...entrance}>
          <DonationDone />
        </motion.div>
      </Wrapper>
    );
  }

  return (
    <Wrapper ref={container} $fill={step === GROWS}>
      <Stepper current={step} />

      <Step key={step} $fill={step === GROWS} {...entrance}>
        {step === 1 ? <StepOne renderShelterField={renderShelterField} /> : null}
        {step === 2 ? <StepTwo /> : null}
        {step === 3 ? <StepThree onDonated={onDonated} /> : null}
      </Step>
    </Wrapper>
  );
}
