import { fireEvent, screen, waitFor } from '@testing-library/react';
import { MotionConfig } from 'motion/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { useWizard } from '../store/wizard';
import { DonationWizard } from './DonationWizard';

// reducedMotion="always" stands in for the operating system setting. The provider ships
// "user", which hands the same decision to the machine; what is under test here is that
// the animation has nothing to move when that decision says no.
function renderWizard(reducedMotion: 'never' | 'always') {
  return renderWithProviders(
    <MotionConfig reducedMotion={reducedMotion}>
      <DonationWizard renderShelterField={() => null} />
    </MotionConfig>,
  );
}

function animatedWrapper() {
  return screen.getByRole('heading', { level: 1 }).closest('form')?.parentElement;
}

async function goToSecondStep() {
  fireEvent.change(screen.getByLabelText('Suma, ktorou chcem prispieť'), {
    target: { value: '20' },
  });
  fireEvent.click(screen.getByRole('button', { name: /Pokračovať/ }));

  await waitFor(() => expect(useWizard.getState().step).toBe(2));
}

describe('step transitions', () => {
  beforeEach(() => {
    useWizard.getState().reset();
    window.history.replaceState(null, '', '/sk');
  });

  it('slides the arriving step in when motion is welcome', async () => {
    renderWizard('never');

    await goToSecondStep();

    expect(animatedWrapper()?.getAttribute('style')).toContain('translateX(');
  });

  it('drops the movement when reduced motion is asked for', async () => {
    renderWizard('always');

    await goToSecondStep();

    // The step still arrives, it just does not travel to get there: motion writes the
    // offset out as transform: none and animates the opacity alone.
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Potrebujeme od Vás zopár informácií',
    );
    expect(animatedWrapper()?.getAttribute('style')).toContain('transform: none');
    expect(animatedWrapper()?.getAttribute('style')).not.toContain('translateX(');
  });
});
