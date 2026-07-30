import type { ComponentPropsWithoutRef } from 'react';

// Path from the design export, stroke switched to currentColor.
export function ArrowLeftIcon(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M15 8H1M8 1L1 8L8 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
