'use client';

import type { FocusEvent, KeyboardEvent } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
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
  id?: string;
  'aria-invalid'?: true;
  'aria-describedby'?: string;
};

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

const Chevron = styled(ChevronDownIcon)`
  position: absolute;
  top: 50%;
  right: ${({ theme }) => theme.space[16]};
  transform: translateY(-50%);
  color: ${({ theme }) => theme.color.content.tertiary};
  pointer-events: none;
`;

const panel = css`
  position: absolute;
  z-index: 1;
  top: calc(100% + ${({ theme }) => theme.space[4]});
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.color.surface.primary};
  border-radius: ${({ theme }) => theme.radius[12]};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  overflow-y: auto;
  max-height: 240px;
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

const Option = styled.li<{ $active: boolean; $selected: boolean }>`
  padding: ${({ theme }) => `${theme.space[12]} ${theme.space[16]}`};
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  cursor: pointer;
  background: ${({ theme, $active }) => ($active ? theme.color.surface.tertiary : 'transparent')};
  color: ${({ theme, $selected }) =>
    $selected ? theme.color.action.primary.default : theme.color.content.primary};
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

  function select(option: ComboboxOption) {
    onValueChange(option);
    onSearchChange('');
    close();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;

      if (!open) {
        setOpen(true);
        setActiveIndex(step === 1 ? 0 : Math.max(options.length - 1, 0));
        return;
      }

      if (options.length === 0) {
        return;
      }

      setActiveIndex((current) => {
        const next = current < 0 && step === -1 ? 0 : current + step;
        return (next + options.length) % options.length;
      });
      return;
    }

    if (event.key === 'Enter' && open && activeIndex >= 0) {
      const option = options[activeIndex];

      if (option) {
        event.preventDefault();
        select(option);
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
        <Chevron />
      </Control>

      {open && options.length === 0 ? (
        // role=status so the miss is announced; a disabled option would be read out
        // as something selectable.
        <EmptyPanel id={listboxId} role="status">
          {emptyLabel}
        </EmptyPanel>
      ) : null}

      {open && options.length > 0 ? (
        <Listbox
          id={listboxId}
          role="listbox"
          ref={listRef}
          // Keeps focus in the input, so the click lands before the blur closes it.
          onMouseDown={(event) => event.preventDefault()}
        >
          {options.map((option, index) => (
            <Option
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={option.value === value?.value}
              $active={index === activeIndex}
              $selected={option.value === value?.value}
              onClick={() => select(option)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {option.label}
            </Option>
          ))}
        </Listbox>
      ) : null}
    </Wrapper>
  );
}
