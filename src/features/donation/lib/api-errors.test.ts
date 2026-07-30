import { describe, expect, it } from 'vitest';
import { fieldErrorsFrom, fieldFromPath, messageKeyForStatus, stepForField } from './api-errors';

describe('fieldFromPath', () => {
  it('turns a donor path into a form field, index and all', () => {
    expect(fieldFromPath('body.contributors.0.email')).toBe('donors.0.email');
    expect(fieldFromPath('body.contributors.2.firstName')).toBe('donors.2.firstName');
  });

  it('maps the amount and the shelter', () => {
    expect(fieldFromPath('body.value')).toBe('amount');
    expect(fieldFromPath('body.shelterID')).toBe('shelter');
  });

  it('gives up on anything it does not recognise', () => {
    expect(fieldFromPath(undefined)).toBeNull();
    expect(fieldFromPath('body.contributors.0.nickname')).toBeNull();
    expect(fieldFromPath('query.search')).toBeNull();
    expect(fieldFromPath('body')).toBeNull();
  });
});

describe('stepForField', () => {
  it('sends donor fields to the second step and the rest to the first', () => {
    expect(stepForField('donors.1.email')).toBe(2);
    expect(stepForField('amount')).toBe(1);
    expect(stepForField('shelter')).toBe(1);
  });
});

describe('messageKeyForStatus', () => {
  it('has its own wording for a missing shelter and for a broken server', () => {
    expect(messageKeyForStatus(404)).toBe('donation.submit.shelterMissing');
    expect(messageKeyForStatus(500)).toBe('donation.submit.serverError');
    expect(messageKeyForStatus(503)).toBe('donation.submit.serverError');
    expect(messageKeyForStatus(400)).toBe('donation.submit.failed');
  });
});

describe('fieldErrorsFrom', () => {
  it('keeps the fields it understands and drops the rest', () => {
    const errors = fieldErrorsFrom([
      {
        type: 'ERROR',
        message: 'joi.body.contributors.0.email',
        path: 'body.contributors.0.email',
      },
      { type: 'ERROR', message: 'joi.body.value', path: 'body.value' },
      { type: 'ERROR', message: 'Útulok sa nenašiel' },
    ]);

    expect(errors).toEqual({
      'donors.0.email': 'donation.errors.rejectedByServer',
      amount: 'donation.errors.rejectedByServer',
    });
  });

  it('never passes the server wording through', () => {
    const errors = fieldErrorsFrom([
      {
        type: 'ERROR',
        message: 'joi.body.contributors.0.email',
        path: 'body.contributors.0.email',
      },
    ]);

    expect(Object.values(errors)).not.toContain('joi.body.contributors.0.email');
  });
});
