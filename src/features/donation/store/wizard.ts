'use client';

import { create } from 'zustand';
import { stepForField } from '../lib/api-errors';
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
  sent: boolean;
  /** Server complaints keyed by form field, waiting for the step that owns them. */
  serverErrors: Record<string, string>;
  goTo: (step: Step) => void;
  /** Keeps the draft level with what is on screen, without moving off the step. */
  keepDraft: (values: Partial<DonationDraft>) => void;
  advance: (values: Partial<DonationDraft>) => void;
  goBack: () => void;
  markSent: () => void;
  /** Takes the donor back to the step holding the first rejected field. */
  setServerErrors: (errors: Record<string, string>) => void;
  clearServerErrors: () => void;
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
  sent: false,
  serverErrors: {},

  // Anyone can put ?step=3 in the address bar; without the clamp that would skip the
  // validation of the steps in between.
  goTo: (step) => set((state) => ({ step: clamp(step, state.furthest) })),

  // What is half typed is worth as much as what was submitted. A step remounts for reasons
  // that have nothing to do with the form — changing the language is one — and the draft is
  // what it is rebuilt from, so it has to know about the typing as it happens.
  keepDraft: (values) => set((state) => ({ draft: { ...state.draft, ...values } })),

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

  markSent: () => set({ sent: true }),

  // The rejected field may live on an earlier step, and a message on a field nobody can
  // see is no message at all.
  setServerErrors: (errors) =>
    set((state) => {
      const first = Object.keys(errors)[0];

      return {
        serverErrors: errors,
        step: first ? clamp(stepForField(first), state.furthest) : state.step,
      };
    }),

  clearServerErrors: () => set({ serverErrors: {} }),

  reset: () => set({ step: 1, furthest: 1, draft: initialDraft, sent: false, serverErrors: {} }),
}));
