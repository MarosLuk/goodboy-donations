import type { ComponentPropsWithoutRef } from 'react';

// Path from the design export, stroke switched to currentColor.
export function CheckIcon(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      width="10"
      height="8"
      viewBox="0 0 10 7.5"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M9 1L3.5 6.5L1 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
