'use client';

import { DonationWizard } from '@/features/donation/components/DonationWizard';
import type { Step } from '@/features/donation/lib/step';
import { ShelterPicker } from '@/features/shelters/components/ShelterPicker';

// The composition root for the two features. It lives in the app layer because
// neither feature is allowed to import the other, and something has to know both.
export function DonationForm({ initialStep }: { initialStep: Step }) {
  return (
    <DonationWizard
      initialStep={initialStep}
      renderShelterField={(props) => <ShelterPicker {...props} />}
    />
  );
}
