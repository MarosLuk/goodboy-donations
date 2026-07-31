import type { ComponentPropsWithoutRef } from 'react';

// Drawn rather than exported, for the same reason as its counterpart. The crescent is one
// arc subtracted from another so the shape stays a single stroked path.
export function MoonIcon(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M16.5 12.65A7.25 7.25 0 0 1 7.35 3.5a7.5 7.5 0 1 0 9.15 9.15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
