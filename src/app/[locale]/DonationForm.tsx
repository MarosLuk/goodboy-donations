'use client';

import { useQueryClient } from '@tanstack/react-query';
import { DonationWizard } from '@/features/donation/components/DonationWizard';
import type { Step } from '@/features/donation/lib/step';
import { resultKeys } from '@/features/results/api/useResults';
import { ShelterPicker } from '@/features/shelters/components/ShelterPicker';

// The composition root for the two features. It lives in the app layer because
// neither feature is allowed to import the other, and something has to know both.
export function DonationForm({ initialStep }: { initialStep: Step }) {
  const queryClient = useQueryClient();

  return (
    <DonationWizard
      initialStep={initialStep}
      renderShelterField={(props) => <ShelterPicker {...props} />}
      // A recorded gift changes the collected total, and the donation feature is not
      // allowed to know the results feature exists. Here it is.
      onDonated={() => queryClient.invalidateQueries({ queryKey: resultKeys.all })}
    />
  );
}
