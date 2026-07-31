import { MotionConfig } from 'motion/react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CountUp } from './CountUp';

const plain = (value: number) => String(value);

describe('CountUp', () => {
  it('climbs from nothing to the figure', async () => {
    render(<CountUp value={40} format={plain} />);

    expect(screen.getByText('0')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('40')).toBeInTheDocument(), { timeout: 2500 });
  });

  // A count that ends near an amount rather than on it would be quietly wrong about money.
  it('lands on the exact figure, cents and all', async () => {
    render(<CountUp value={1234.5} format={(value) => value.toFixed(2)} />);

    await waitFor(() => expect(screen.getByText('1234.50')).toBeInTheDocument(), {
      timeout: 2500,
    });
  });

  // The app states the preference once, through the provider, so this is where it can be
  // answered. The bare hook latches the media query the first time anything reads it, which
  // makes a per-test override in the same file impossible.
  it('shows the figure outright when less motion was asked for', () => {
    render(
      <MotionConfig reducedMotion="always">
        <CountUp value={40} format={plain} />
      </MotionConfig>,
    );

    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });
});
