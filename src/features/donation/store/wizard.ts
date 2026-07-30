'use client';

import { create } from 'zustand';
import type { Step } from '../lib/step';
import { STEPS } from '../lib/step';
import type { Donor, HelpType } from '../schema/donation';
import { emptyDonor } from '../schema/donation';

export type DonationDraft = {
  helpType: HelpType;
  shelter: { id: number; name: string } | null;
  amount: number;
  donors: Donor[];
  consent: boolean;
};

export const initialDraft: DonationDraft = {
  helpType: 'foundation',
  shelter: null,
  amount: 0,
  donors: [emptyDonor],
  consent: false,
};

type WizardStore = {
  step: Step;
  /** The furthest step reached so far, which is as far as a link may jump. */
  furthest: Step;
  draft: DonationDraft;
  goTo: (step: Step) => void;
  advance: (values: Partial<DonationDraft>) => void;
  goBack: () => void;
  reset: () => void;
};

function clamp(step: number, furthest: Step): Step {
  const bounded = Math.min(Math.max(step, 1), furthest);

  return bounded as Step;
}

export const useWizard = create<WizardStore>((set) => ({
  step: 1,
  furthest: 1,
  draft: initialDraft,

  // Anyone can put ?step=3 in the address bar; without the clamp that would skip the
  // validation of the steps in between.
  goTo: (step) => set((state) => ({ step: clamp(step, state.furthest) })),

  // Each step hands over its own values, so going back and forth keeps what was typed
  // without the whole form living in one place.
  advance: (values) =>
    set((state) => {
      const next = Math.min(state.step + 1, STEPS.length) as Step;

      return {
        draft: { ...state.draft, ...values },
        step: next,
        furthest: next > state.furthest ? next : state.furthest,
      };
    }),

  goBack: () => set((state) => ({ step: clamp(state.step - 1, state.furthest) })),

  reset: () => set({ step: 1, furthest: 1, draft: initialDraft }),
}));
