'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Field } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';
import { TextInput } from '@/components/ui/TextInput';
import type { StepTwoValues } from '../schema/donation';
import { PHONE_PREFIXES } from '../schema/donation';

// Flags as emoji: the design export carries no flag assets and drawing our own was
// ruled out. Windows renders them as the letters SK and CZ, which still reads.
const PREFIX_FLAGS: Record<(typeof PHONE_PREFIXES)[number], string> = {
  '+421': '🇸🇰',
  '+420': '🇨🇿',
};

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[16]};
`;

// 321 + 16 + 321 fills the 658 column of the design; below tablet the two names
// stack rather than squeeze.
const NameRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[16]};
  grid-template-columns: minmax(0, 1fr);

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

// The design notes 80 for the prefix, which fits a flag and a chevron but cuts the dial
// code in half. Measured in the browser until "+421" reads in full beside the flag;
// only the number grows from there.
const PhoneRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[16]};
  grid-template-columns: 116px minmax(0, 1fr);
`;

const PrefixSelect = styled(Select)`
  padding-left: ${({ theme }) => theme.space[12]};
  padding-right: ${({ theme }) => theme.space[32]};
`;

export function DonorFields({ index }: { index: number }) {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext<StepTwoValues>();

  const donorErrors = errors.donors?.[index];
  // Messages are translation keys, so the rule reads the same in both languages.
  const message = (key?: string) => (key ? t(key) : undefined);

  return (
    <Rows>
      <NameRow>
        <Field
          label={t('donation.donor.firstName')}
          error={message(donorErrors?.firstName?.message)}
        >
          {(field) => <TextInput {...field} {...register(`donors.${index}.firstName`)} />}
        </Field>

        <Field label={t('donation.donor.lastName')} error={message(donorErrors?.lastName?.message)}>
          {(field) => <TextInput {...field} {...register(`donors.${index}.lastName`)} />}
        </Field>
      </NameRow>

      <Field label={t('donation.donor.email')} error={message(donorErrors?.email?.message)}>
        {(field) => <TextInput {...field} type="email" {...register(`donors.${index}.email`)} />}
      </Field>

      {/* One field around both controls, so the label sits above the row rather than
          indented to the number, and points at the input a donor types into. */}
      <Field
        label={t('donation.donor.phone')}
        hint={t('common.optional')}
        error={message(donorErrors?.phone?.message)}
      >
        {(field) => (
          <PhoneRow>
            <PrefixSelect
              aria-label={t('donation.donor.phonePrefix')}
              {...register(`donors.${index}.phonePrefix`)}
            >
              {PHONE_PREFIXES.map((prefix) => (
                <option key={prefix} value={prefix}>
                  {PREFIX_FLAGS[prefix]} {prefix}
                </option>
              ))}
            </PrefixSelect>

            <TextInput
              {...field}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              {...register(`donors.${index}.phone`)}
            />
          </PhoneRow>
        )}
      </Field>
    </Rows>
  );
}
