import type { DonationDraft } from '../store/wizard';

export type ContributePayload = {
  contributors: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }[];
  shelterID: number | null;
  value: number;
};

export function toContributePayload(draft: DonationDraft): ContributePayload {
  return {
    contributors: draft.donors.map((donor) => ({
      firstName: donor.firstName.trim(),
      lastName: donor.lastName.trim(),
      email: donor.email.trim(),
      // E.164, so the number is unambiguous and can be read back. The api documents
      // "0900 000 000" as an example but validates nothing, which leaves the choice
      // of format to us.
      ...(donor.phone ? { phone: `${donor.phonePrefix}${donor.phone}` } : {}),
    })),
    // A gift to the foundation carries no shelter even when one was picked earlier, so
    // the money cannot quietly land somewhere the donor did not choose.
    shelterID: draft.helpType === 'shelter' ? (draft.shelter?.id ?? null) : null,
    value: draft.amount,
  };
}
