'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import type { StepTwoValues } from '../schema/donation';
import { emptyDonor } from '../schema/donation';
import { DonorFields } from './DonorFields';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[24]};
  align-items: flex-start;
`;

const Donor = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[12]};
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[16]};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.color.content.primary};
`;

const Note = styled.p`
  font-size: ${({ theme }) => theme.text.sm.fontSize};
  line-height: ${({ theme }) => theme.text.sm.lineHeight};
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export function DonorList() {
  const { t } = useTranslation();
  const { control } = useFormContext<StepTwoValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'donors' });

  return (
    <Wrapper>
      {fields.map((field, index) => (
        // The id from useFieldArray rather than the index: keying by index makes
        // React reuse the wrong inputs once a donor in the middle is removed.
        <Donor key={field.id}>
          {fields.length > 1 ? (
            <Header>
              <Title>{t('donation.donors.title', { number: index + 1 })}</Title>
              <Button
                variant="secondary"
                onClick={() => remove(index)}
                aria-label={t('donation.donors.removeLabel', { number: index + 1 })}
              >
                {t('donation.donors.remove')}
              </Button>
            </Header>
          ) : null}

          <DonorFields index={index} />
        </Donor>
      ))}

      <Button variant="secondary" onClick={() => append(emptyDonor)}>
        {t('donation.donors.add')}
      </Button>

      {/* A post with two donors and a value of 2 raised the total by 2, so the
          amount is per contribution. Saying so beats letting anyone guess. */}
      <Note>{t('donation.donors.sharedAmount')}</Note>
    </Wrapper>
  );
}
