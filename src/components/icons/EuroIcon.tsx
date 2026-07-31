import type { ComponentPropsWithoutRef } from 'react';

// Path from the design export, stroke switched to currentColor.
export function EuroIcon(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M17 3.01903C15.5176 1.75973 13.5975 1 11.5 1C6.80558 1 3 4.80558 3 9.5C3 14.1944 6.80558 18 11.5 18C13.5975 18 15.5176 17.2403 17 15.981M1 11.5H11M1 7.5H11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
