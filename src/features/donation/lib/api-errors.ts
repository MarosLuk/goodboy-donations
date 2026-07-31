import type { ApiMessage } from '@/lib/api/errors';
import type { Step } from './step';

const DONOR_FIELDS = ['firstName', 'lastName', 'email', 'phone'] as const;

// body.contributors.0.email -> donors.0.email. The api sends this path on validation
// errors although the spec does not mention it, and it is the only way to put a server
// complaint on the field it belongs to.
export function fieldFromPath(path: string | undefined): string | null {
  if (!path) {
    return null;
  }

  const donor = /^body\.contributors\.(\d+)\.(\w+)$/.exec(path);

  if (donor && DONOR_FIELDS.includes(donor[2] as (typeof DONOR_FIELDS)[number])) {
    return `donors.${donor[1]}.${donor[2]}`;
  }

  if (path === 'body.value') {
    return 'amount';
  }

  if (path === 'body.shelterID') {
    return 'shelter';
  }

  return null;
}

export function stepForField(field: string): Step {
  return field.startsWith('donors.') ? 2 : 1;
}

// The api mixes two kinds of message: validation ones are i18n keys such as
// "joi.body.contributors.0.email", business ones are Slovak sentences. Neither is ever
// shown as it arrives — an English visitor would read "joi.body…" or Slovak.
export function messageKeyForStatus(status: number): string {
  if (status === 404) {
    return 'donation.submit.shelterMissing';
  }

  if (status >= 500) {
    return 'donation.submit.serverError';
  }

  return 'donation.submit.failed';
}

export function fieldErrorsFrom(messages: ApiMessage[]): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const message of messages) {
    const field = fieldFromPath(message.path);

    if (field) {
      errors[field] = 'donation.errors.rejectedByServer';
    }
  }

  return errors;
}
