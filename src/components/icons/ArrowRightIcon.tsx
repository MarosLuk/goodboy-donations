import type { ComponentPropsWithoutRef } from 'react';

// Path from the design export, stroke switched to currentColor.
export function ArrowRightIcon(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 13.6667 13.6667"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M1 6.83333H12.6667M6.83333 12.6667L12.6667 6.83333L6.83333 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
