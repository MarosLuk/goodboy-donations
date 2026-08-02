import { describe, expect, it } from 'vitest';
import type { DonationForm } from './donation';
import { donationSchema, donorSchema, stepOneSchema } from './donation';

const donor = {
  firstName: 'Maroš',
  lastName: 'Lukáč',
  email: 'maros@example.com',
  phonePrefix: '+421' as const,
  phone: '900000000',
};

const form: DonationForm = {
  helpType: 'foundation',
  shelter: null,
  amount: 20,
  donors: [donor],
  consent: true,
};

function messagesFor(value: unknown) {
  const result = donationSchema.safeParse(value);

  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

function pathsFor(value: unknown) {
  const result = donationSchema.safeParse(value);

  return result.success ? [] : result.error.issues.map((issue) => issue.path.join('.'));
}

describe('donationSchema', () => {
  it('accepts a filled in donation', () => {
    expect(donationSchema.safeParse(form).success).toBe(true);
  });

  it('leaves the phone out of the way when it is empty', () => {
    expect(donorSchema.safeParse({ ...donor, phone: '' }).success).toBe(true);
  });

  it('wants nine digits once a phone is typed', () => {
    expect(donorSchema.safeParse({ ...donor, phone: '90000000' }).success).toBe(false);
    expect(donorSchema.safeParse({ ...donor, phone: '0900 000 000' }).success).toBe(false);
    expect(donorSchema.safeParse({ ...donor, phone: 'abcdefghi' }).success).toBe(false);
    expect(donorSchema.safeParse({ ...donor, phone: '900000000' }).success).toBe(true);
  });

  it('holds the name to two characters even though the api takes one', () => {
    expect(messagesFor({ ...form, donors: [{ ...donor, firstName: 'A' }] })).toEqual([
      'donation.errors.nameLength',
    ]);
    expect(messagesFor({ ...form, donors: [{ ...donor, firstName: 'a'.repeat(21) }] })).toEqual([
      'donation.errors.nameLength',
    ]);
  });

  it("gives the surname the assignment's thirty characters, ten more than the name", () => {
    expect(donorSchema.safeParse({ ...donor, lastName: 'a'.repeat(30) }).success).toBe(true);
    expect(messagesFor({ ...form, donors: [{ ...donor, lastName: 'a'.repeat(31) }] })).toEqual([
      'donation.errors.surnameLength',
    ]);
  });

  it('refuses an empty first name, which the api would reject anyway', () => {
    expect(messagesFor({ ...form, donors: [{ ...donor, firstName: '' }] })).toEqual([
      'donation.errors.nameLength',
    ]);
  });

  it('asks for a real email', () => {
    expect(messagesFor({ ...form, donors: [{ ...donor, email: 'maros@' }] })).toEqual([
      'donation.errors.email',
    ]);
  });

  it('sets the floor at one euro, above the zero the api allows', () => {
    expect(messagesFor({ ...form, amount: 0 })).toEqual(['donation.errors.amountMin']);
    expect(donationSchema.safeParse({ ...form, amount: 1 }).success).toBe(true);
  });

  it('needs the consent ticked', () => {
    expect(messagesFor({ ...form, consent: false })).toEqual(['donation.errors.consent']);
  });

  it('needs at least one donor', () => {
    expect(messagesFor({ ...form, donors: [] })).toEqual(['donation.errors.donorsRequired']);
  });

  it('validates every donor, not only the first', () => {
    expect(pathsFor({ ...form, donors: [donor, { ...donor, email: 'nope' }] })).toEqual([
      'donors.1.email',
    ]);
  });

  it('wants a shelter named once one shelter is the point of the donation', () => {
    expect(messagesFor({ ...form, helpType: 'shelter', shelter: null })).toEqual([
      'donation.errors.shelterRequired',
    ]);
    expect(pathsFor({ ...form, helpType: 'shelter', shelter: null })).toEqual(['shelter']);
  });

  it('lets a foundation donation carry a shelter that was picked earlier', () => {
    const result = donationSchema.safeParse({
      ...form,
      helpType: 'foundation',
      shelter: { id: 3, name: 'HAFKÁČI' },
    });

    expect(result.success).toBe(true);
  });

  it('checks the first step on its own', () => {
    expect(
      stepOneSchema.safeParse({ helpType: 'foundation', shelter: null, amount: 20 }).success,
    ).toBe(true);
    expect(
      stepOneSchema.safeParse({ helpType: 'shelter', shelter: null, amount: 20 }).success,
    ).toBe(false);
  });
});
