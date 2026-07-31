import { describe, expect, it } from 'vitest';
import type { DonationDraft } from '../store/wizard';
import { toContributePayload } from './payload';

const draft: DonationDraft = {
  helpType: 'foundation',
  shelter: null,
  amount: 20,
  donors: [
    {
      firstName: 'Maroš',
      lastName: 'Lukáč',
      email: 'maros@example.com',
      phonePrefix: '+421',
      phone: '900000000',
    },
  ],
  consent: true,
};

describe('toContributePayload', () => {
  it('joins the prefix and the number into one e164 string', () => {
    expect(toContributePayload(draft).contributors[0].phone).toBe('+421900000000');
  });

  it('keeps a czech prefix', () => {
    const payload = toContributePayload({
      ...draft,
      donors: [{ ...draft.donors[0], phonePrefix: '+420', phone: '600000000' }],
    });

    expect(payload.contributors[0].phone).toBe('+420600000000');
  });

  it('leaves the phone out entirely when none was given', () => {
    const payload = toContributePayload({
      ...draft,
      donors: [{ ...draft.donors[0], phone: '' }],
    });

    expect(payload.contributors[0]).not.toHaveProperty('phone');
  });

  it('sends no shelter for a gift to the foundation, even if one was picked', () => {
    const payload = toContributePayload({
      ...draft,
      helpType: 'foundation',
      shelter: { id: 3, name: 'HAFKÁČI' },
    });

    expect(payload.shelterID).toBeNull();
  });

  it('sends the shelter id when one shelter is the point of the gift', () => {
    const payload = toContributePayload({
      ...draft,
      helpType: 'shelter',
      shelter: { id: 3, name: 'HAFKÁČI' },
    });

    expect(payload.shelterID).toBe(3);
  });

  it('trims what was typed', () => {
    const payload = toContributePayload({
      ...draft,
      donors: [{ ...draft.donors[0], firstName: '  Maroš ', email: ' maros@example.com ' }],
    });

    expect(payload.contributors[0].firstName).toBe('Maroš');
    expect(payload.contributors[0].email).toBe('maros@example.com');
  });

  it('carries one amount for the whole contribution, whatever the number of donors', () => {
    const payload = toContributePayload({
      ...draft,
      amount: 30,
      donors: [draft.donors[0], { ...draft.donors[0], email: 'druhy@example.com' }],
    });

    expect(payload.value).toBe(30);
    expect(payload.contributors).toHaveLength(2);
  });
});
