'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
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

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    flex: 1;
    min-height: 0;
  }
`;

// Only the donors scroll. The button that adds one and the note under it stay where they
// are, because a control that scrolls out of reach the moment it is used is worse than
// no room at all.
const Scroller = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[24]};
  align-self: stretch;

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    /* The gutter is held whether or not a bar is showing, so adding the donor that first
       needs one does not shift every field left. The negative margin gives a focus ring
       room to sit outside its field without the overflow clipping it. */
    scrollbar-gutter: stable;
    padding: ${({ theme }) => theme.space[4]};
    margin: ${({ theme }) => `-${theme.space[4]}`};
  }
`;

const Donor = styled(motion.div)`
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

// Full width on a phone, where a button floating at 212 of 382 reads like a mistake.
const AddSlot = styled.div`
  width: 100%;

  > button {
    width: 100%;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    width: auto;

    > button {
      width: auto;
    }
  }
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

  const list = useRef<HTMLDivElement>(null);
  const addButton = useRef<HTMLButtonElement>(null);
  const previousCount = useRef(fields.length);
  // Donors present when the step arrives came with it and stay put; only one added
  // by hand eases in. Captured once, so later ids are the added ones.
  const [openingIds] = useState(() => new Set(fields.map((field) => field.id)));

  // A new donor appears below the button that was just pressed, so focus follows it to
  // the field that now wants typing. Removing one leaves focus nowhere, so it goes to
  // the button that is still there.
  useEffect(() => {
    if (fields.length > previousCount.current) {
      const names = list.current?.querySelectorAll<HTMLInputElement>('input[name$=".firstName"]');

      names?.[names.length - 1]?.focus();
    } else if (fields.length < previousCount.current) {
      addButton.current?.focus();
    }

    previousCount.current = fields.length;
  }, [fields.length]);

  return (
    <Wrapper>
      <Scroller ref={list}>
        {fields.map((field, index) => (
          // The id from useFieldArray rather than the index: keying by index makes
          // React reuse the wrong inputs once a donor in the middle is removed.
          <Donor
            key={field.id}
            initial={openingIds.has(field.id) ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
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
      </Scroller>

      <AddSlot>
        <Button ref={addButton} variant="secondary" onClick={() => append(emptyDonor)}>
          {t('donation.donors.add')}
        </Button>
      </AddSlot>

      {/* A post with two donors and a value of 2 raised the total by 2, so the
          amount is per contribution. Saying so beats letting anyone guess. */}
      <Note>{t('donation.donors.sharedAmount')}</Note>
    </Wrapper>
  );
}
