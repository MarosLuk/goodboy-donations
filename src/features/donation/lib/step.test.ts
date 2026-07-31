import { describe, expect, it } from 'vitest';
import { parseStep } from './step';

describe('parseStep', () => {
  it('takes a step that exists', () => {
    expect(parseStep('2')).toBe(2);
    expect(parseStep('3')).toBe(3);
  });

  it('falls back to the first step for anything else', () => {
    expect(parseStep(undefined)).toBe(1);
    expect(parseStep('')).toBe(1);
    expect(parseStep('0')).toBe(1);
    expect(parseStep('4')).toBe(1);
    expect(parseStep('-1')).toBe(1);
    expect(parseStep('two')).toBe(1);
    expect(parseStep('2.5')).toBe(1);
  });

  it('reads the first value when the parameter is repeated', () => {
    expect(parseStep(['3', '1'])).toBe(3);
    expect(parseStep([])).toBe(1);
  });
});
