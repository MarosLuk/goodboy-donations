import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { ContactDetails } from './ContactDetails';

describe('ContactDetails', () => {
  it('shows the three ways to reach the foundation', () => {
    renderWithProviders(<ContactDetails />);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('heading', { name: 'E-mail' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Adresa' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Telefón' })).toBeInTheDocument();
  });

  it('makes the email and the phone actionable', () => {
    renderWithProviders(<ContactDetails />);

    expect(screen.getByRole('link', { name: 'hello@goodrequest.com' })).toHaveAttribute(
      'href',
      'mailto:hello@goodrequest.com',
    );
    expect(screen.getByRole('link', { name: '+421 911 750 750' })).toHaveAttribute(
      'href',
      'tel:+421911750750',
    );
  });

  it('leaves the address as text, since there is nothing to open', () => {
    renderWithProviders(<ContactDetails />);

    expect(screen.getByText('Obchodná 3D, 010 08 Žilina, Slovakia')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('keeps the supporting sentences in english on the english page', () => {
    renderWithProviders(<ContactDetails />, { locale: 'en' });

    expect(screen.getByText('Our friendly team is here to help.')).toBeInTheDocument();
    expect(screen.getByText('Mon-Fri from 8am to 5pm.')).toBeInTheDocument();
  });

  it('translates the same sentences on the slovak page', () => {
    renderWithProviders(<ContactDetails />);

    expect(screen.getByText('Náš tím je tu pre vás.')).toBeInTheDocument();
    expect(screen.getByText('Po–Pi od 8:00 do 17:00.')).toBeInTheDocument();
  });
});
