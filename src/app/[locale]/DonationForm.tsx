'use client';

import { DonationWizard } from '@/features/donation/components/DonationWizard';
import { ShelterPicker } from '@/features/shelters/components/ShelterPicker';

// The composition root for the two features. It lives in the app layer because
// neither feature is allowed to import the other, and something has to know both.
export function DonationForm() {
  return <DonationWizard renderShelterField={(props) => <ShelterPicker {...props} />} />;
}
