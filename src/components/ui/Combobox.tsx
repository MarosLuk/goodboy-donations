'use client';

import type { FocusEvent, KeyboardEvent } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon';
import { controlStyles } from './control-styles';

export type ComboboxOption = {
  value: string;
  label: string;
};

type ComboboxProps = {
  options: ComboboxOption[];
  // The whole option rather than its value: the list is filtered on the server, so
  // a lookup by value would lose the label of the selected item.
  value: ComboboxOption | null;
  onValueChange: (option: ComboboxOption | null) => void;
  search: string;
  onSearchChange: (search: string) => void;
  placeholder?: string;
  emptyLabel: string;
  // Names a row at the top of the unfiltered list that puts the choice back to nothing. Shown
  // only once something is chosen, since that is when there is anything to undo.
  clearLabel?: string;
  id?: string;
  'aria-invalid'?: true;
  'aria-describedby'?: string;
};

// The clearing row is a row of the same list, not a separate control, so one set of arrow
// keys and one activedescendant cover both. Hence rows rather than options everywhere below.
type Row = { kind: 'clear' } | { kind: 'option'; option: ComboboxOption };

const Wrapper = styled.div`
  position: relative;
`;

const Control = styled.div`
  position: relative;
  display: flex;
`;

const Input = styled.input`
  ${controlStyles}
  cursor: pointer;
  padding-right: ${({ theme }) => theme.space[40]};
`;

const Chevron = styled(ChevronDownIcon)<{ $open: boolean }>`
  position: absolute;
  top: 50%;
  right: ${({ theme }) => theme.space[16]};
  transform: ${({ $open }) => `translateY(-50%) rotate(${$open ? 180 : 0}deg)`};
  transition: transform 200ms ease;
  color: ${({ theme }) => theme.color.content.tertiary};
  pointer-events: none;
`;

// The panel does not blink into place: it settles the few pixels it seems to open from.
const rise = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
`;

const panel = css`
  position: absolute;
  z-index: 1;
  top: calc(100% + ${({ theme }) => theme.space[4]});
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.color.surface.raised};
  border-radius: ${({ theme }) => theme.radius[12]};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  overflow-y: auto;
  max-height: 240px;
  animation: ${rise} 140ms ease-out;
`;

const Listbox = styled.ul`
  ${panel}
  padding: ${({ theme }) => theme.space[4]} 0;
`;

const EmptyPanel = styled.div`
  ${panel}
  padding: ${({ theme }) => `${theme.space[12]} ${theme.space[16]}`};
  color: ${({ theme }) => theme.color.content.tertiary};
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
`;

const Option = styled.li<{ $active: boolean; $selected: boolean; $muted?: boolean }>`
  padding: ${({ theme }) => `${theme.space[12]} ${theme.space[16]}`};
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  cursor: pointer;
  transition: background-color 100ms ease;
  background: ${({ theme, $active }) => ($active ? theme.color.surface.tertiary : 'transparent')};
  /* The clearing row names an absence, so it is quieter than the things it clears — unless it
     is the state you are in, where it says so the same way any chosen row does. */
  color: ${({ theme, $selected, $muted }) =>
    $selected
      ? theme.color.action.primary.default
      : $muted
        ? theme.color.content.tertiary
        : theme.color.content.primary};
  font-weight: ${({ theme, $selected }) =>
    $selected ? theme.font.weight.medium : theme.font.weight.regular};
`;

export function Combobox({
  options,
  value,
  onValueChange,
  search,
  onSearchChange,
  placeholder,
  emptyLabel,
  clearLabel,
  id,
  ...aria
}: ComboboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-listbox`;
  const optionId = (index: number) => `${inputId}-option-${index}`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);

  // Three conditions, each for its own reason. Something has to be chosen, or there is
  // nothing to undo. Nothing may be typed, because a filtered list is a set of results and
  // this is not one of them. And there have to be options, since with none the panel must
  // explain why it is empty and a lone clearing row would bury that.
  const clearable = clearLabel !== undefined && value !== null && search === '';

  const rows: Row[] =
    options.length === 0
      ? []
      : [
          ...(clearable ? [{ kind: 'clear' } as const] : []),
          ...options.map((option) => ({ kind: 'option' as const, option })),
        ];

  // Keyboard movement has to drag the viewport along, otherwise the active option
  // walks out of a scrolled list. Indexing children avoids escaping generated ids.
  useEffect(() => {
    if (!open || activeIndex < 0) {
      return;
    }

    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  function close() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function choose(row: Row) {
    onValueChange(row.kind === 'clear' ? null : row.option);
    onSearchChange('');
    close();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;

      if (!open) {
        setOpen(true);
        setActiveIndex(step === 1 ? 0 : Math.max(rows.length - 1, 0));
        return;
      }

      if (rows.length === 0) {
        return;
      }

      setActiveIndex((current) => {
        const next = current < 0 && step === -1 ? 0 : current + step;
        return (next + rows.length) % rows.length;
      });
      return;
    }

    if (event.key === 'Enter' && open && activeIndex >= 0) {
      const row = rows[activeIndex];

      if (row) {
        event.preventDefault();
        choose(row);
      }

      return;
    }

    if (event.key === 'Escape') {
      close();
    }
  }

  // Focus moving anywhere outside the widget closes it — no document listener, and
  // it covers Tab as well as a click elsewhere.
  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      close();
    }
  }

  return (
    <Wrapper onBlur={handleBlur}>
      <Control>
        <Input
          {...aria}
          id={inputId}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          autoComplete="off"
          aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          // What is typed wins; with nothing typed the chosen label stays put, so
          // reopening the list does not blank out the choice already made.
          value={search === '' ? (value?.label ?? '') : search}
          placeholder={placeholder}
          onClick={(event) => {
            setOpen(true);
            // Selecting the text means the first keystroke replaces the label
            // instead of typing onto the end of it.
            event.currentTarget.select();
          }}
          onKeyDown={handleKeyDown}
          onChange={(event) => {
            onSearchChange(event.target.value);
            setOpen(true);
            setActiveIndex(-1);

            // Typing over a chosen shelter means the choice is being redone.
            if (value) {
              onValueChange(null);
            }
          }}
        />
        <Chevron $open={open} />
      </Control>

      {open && rows.length === 0 ? (
        // role=status so the miss is announced; a disabled option would be read out
        // as something selectable.
        <EmptyPanel id={listboxId} role="status">
          {emptyLabel}
        </EmptyPanel>
      ) : null}

      {open && rows.length > 0 ? (
        <Listbox
          id={listboxId}
          role="listbox"
          ref={listRef}
          // Keeps focus in the input, so the click lands before the blur closes it.
          onMouseDown={(event) => event.preventDefault()}
        >
          {rows.map((row, index) => {
            const selected = row.kind === 'option' && row.option.value === value?.value;

            return (
              <Option
                key={row.kind === 'clear' ? 'clear' : row.option.value}
                id={optionId(index)}
                role="option"
                aria-selected={selected}
                $active={index === activeIndex}
                $selected={selected}
                $muted={row.kind === 'clear'}
                onClick={() => choose(row)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {row.kind === 'clear' ? clearLabel : row.option.label}
              </Option>
            );
          })}
        </Listbox>
      ) : null}
    </Wrapper>
  );
}
