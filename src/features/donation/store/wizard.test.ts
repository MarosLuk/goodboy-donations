import { beforeEach, describe, expect, it } from 'vitest';
import { emptyDonor } from '../schema/donation';
import { useWizard } from './wizard';

const wizard = () => useWizard.getState();

describe('wizard store', () => {
  beforeEach(() => {
    useWizard.getState().reset();
  });

  it('starts on the first step with nothing filled in', () => {
    expect(wizard().step).toBe(1);
    expect(wizard().furthest).toBe(1);
    expect(wizard().draft.amount).toBe(0);
    expect(wizard().draft.donors).toEqual([emptyDonor]);
  });

  it('keeps what a step handed over and moves on', () => {
    wizard().advance({ amount: 20, helpType: 'foundation' });

    expect(wizard().step).toBe(2);
    expect(wizard().furthest).toBe(2);
    expect(wizard().draft.amount).toBe(20);
  });

  it('refuses to jump past the furthest step reached', () => {
    wizard().goTo(3);

    expect(wizard().step).toBe(1);

    wizard().advance({ amount: 20 });
    wizard().goTo(3);

    // Two steps have been completed, so the third is still out of reach.
    expect(wizard().step).toBe(2);
  });

  it('allows going back to a step already completed', () => {
    wizard().advance({ amount: 20 });
    wizard().advance({ donors: [emptyDonor] });
    expect(wizard().step).toBe(3);

    wizard().goTo(1);
    expect(wizard().step).toBe(1);

    // Coming back forward is allowed, because that ground was covered.
    wizard().goTo(3);
    expect(wizard().step).toBe(3);
  });

  it('remembers the furthest step after stepping back', () => {
    wizard().advance({ amount: 20 });
    wizard().goBack();

    expect(wizard().step).toBe(1);
    expect(wizard().furthest).toBe(2);
  });

  it('does not step back past the first step', () => {
    wizard().goBack();

    expect(wizard().step).toBe(1);
  });

  it('stops at the last step', () => {
    wizard().advance({});
    wizard().advance({});
    wizard().advance({});

    expect(wizard().step).toBe(3);
  });

  it('clears everything on reset', () => {
    wizard().advance({ amount: 50 });
    wizard().reset();

    expect(wizard().step).toBe(1);
    expect(wizard().furthest).toBe(1);
    expect(wizard().draft.amount).toBe(0);
  });
});
