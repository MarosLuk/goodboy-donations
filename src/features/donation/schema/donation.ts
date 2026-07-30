import { z } from 'zod';

export const HELP_TYPES = ['foundation', 'shelter'] as const;
export const PHONE_PREFIXES = ['+421', '+420'] as const;
export const AMOUNT_PRESETS = [5, 10, 20, 30, 50, 100] as const;

export const MIN_AMOUNT = 1;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 20;
export const PHONE_DIGITS = 9;

export type HelpType = (typeof HELP_TYPES)[number];
export type PhonePrefix = (typeof PHONE_PREFIXES)[number];

// The shape is declared here rather than imported from the shelters feature: one
// feature does not reach into another, and what the form holds on to is its own
// state, not the shelter list's.
const chosenShelterSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const nameSchema = z
  .string()
  .trim()
  .min(NAME_MIN_LENGTH, 'donation.errors.nameLength')
  .max(NAME_MAX_LENGTH, 'donation.errors.nameLength');

const phoneSchema = z
  .string()
  .trim()
  // Optional, but valid when filled. The api accepts "abc" and the assignment says
  // nothing about the phone, so this rule is the only validation that exists.
  .refine((value) => value === '' || new RegExp(`^\\d{${PHONE_DIGITS}}$`).test(value), {
    error: 'donation.errors.phone',
  });

export const donorSchema = z.object({
  // Required, although the assignment calls the name optional: the api answers 400
  // for a missing or empty firstName, so an optional field could never be submitted.
  firstName: nameSchema,
  lastName: nameSchema,
  email: z.email({ error: 'donation.errors.email' }),
  phonePrefix: z.enum(PHONE_PREFIXES, { error: 'donation.errors.phonePrefix' }),
  phone: phoneSchema,
});

const stepOneShape = {
  helpType: z.enum(HELP_TYPES, { error: 'donation.errors.helpType' }),
  shelter: chosenShelterSchema.nullable(),
  // One amount for the whole contribution rather than per donor: a post with two
  // donors and a value of 2 raised the total by 2, not by 4.
  amount: z.number('donation.errors.amountInvalid').min(MIN_AMOUNT, 'donation.errors.amountMin'),
};

const stepTwoShape = {
  donors: z.array(donorSchema).min(1, 'donation.errors.donorsRequired'),
};

const stepThreeShape = {
  // Consent lives on the last step, where the design puts the checkbox.
  consent: z.literal(true, { error: 'donation.errors.consent' }),
};

// Choosing to support one shelter and then naming none would quietly send the money
// to the foundation instead, which is the mix-up worth preventing.
function shelterMatchesHelpType(values: { helpType: HelpType; shelter: unknown }) {
  return values.helpType !== 'shelter' || values.shelter !== null;
}

const shelterIssue = {
  error: 'donation.errors.shelterRequired',
  path: ['shelter'],
};

export const stepOneSchema = z.object(stepOneShape).refine(shelterMatchesHelpType, shelterIssue);

export const stepTwoSchema = z.object(stepTwoShape);

export const stepThreeSchema = z.object(stepThreeShape);

export const donationSchema = z
  .object({ ...stepOneShape, ...stepTwoShape, ...stepThreeShape })
  .refine(shelterMatchesHelpType, shelterIssue);

export type Donor = z.infer<typeof donorSchema>;
export type DonationForm = z.infer<typeof donationSchema>;
