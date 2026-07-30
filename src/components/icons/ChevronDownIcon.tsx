import type { ComponentPropsWithoutRef } from 'react';

// Path taken from the design export. The stroke is currentColor instead of the
// exported #4b5563 so the icon follows the colour of whatever contains it.
export function ChevronDownIcon(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      width="12"
      height="7"
      viewBox="0 0 12 7"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M1 1L6 6L11 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
