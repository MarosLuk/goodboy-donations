'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ComboboxOption } from '@/components/ui/Combobox';
import { Combobox } from '@/components/ui/Combobox';
import { Field } from '@/components/ui/Field';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';
import type { Shelter } from '../api/shelters';
import { useShelters } from '../api/useShelters';

const SEARCH_DELAY = 300;

// Both directions are lossless, so the picker never has to look a shelter up by id
// in a list the server may have filtered away.
function toOption(shelter: Shelter): ComboboxOption {
  return { value: String(shelter.id), label: shelter.name };
}

function toShelter(option: ComboboxOption): Shelter {
  return { id: Number(option.value), name: option.label };
}

type ShelterPickerProps = {
  value: Shelter | null;
  onChange: (shelter: Shelter | null) => void;
  error?: string;
  // The hint has to follow the form of help: a field that calls itself optional and
  // then blocks the next step would be lying.
  optional?: boolean;
};

export function ShelterPicker({ value, onChange, error, optional = true }: ShelterPickerProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const { data, isError, isFetching } = useShelters(useDebouncedValue(search, SEARCH_DELAY));

  const options = data?.map(toOption) ?? [];

  // An empty panel should say why it is empty.
  const emptyLabel = isError
    ? t('shelters.loadFailed')
    : isFetching
      ? t('common.loading')
      : t('shelters.noResults');

  return (
    <Field
      label={t('shelters.label')}
      hint={optional ? t('common.optional') : undefined}
      error={error}
    >
      {(control) => (
        <Combobox
          {...control}
          options={options}
          value={value ? toOption(value) : null}
          onValueChange={(option) => onChange(option ? toShelter(option) : null)}
          search={search}
          onSearchChange={setSearch}
          placeholder={t('shelters.placeholder')}
          emptyLabel={emptyLabel}
          // Offered whether or not a shelter is required: empty is where a required field
          // starts, so going back there is a state the form already knows how to talk about.
          // Deleting the text did this all along, but nothing said so.
          clearLabel={t('shelters.none')}
        />
      )}
    </Field>
  );
}
