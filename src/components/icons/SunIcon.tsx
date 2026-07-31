import type { ComponentPropsWithoutRef } from 'react';

// Drawn rather than exported: the design has no dark mode, so it has no icon for one. The
// geometry follows the set it sits next to — 20 square, a 2 stroke, round ends.
export function SunIcon(props: ComponentPropsWithoutRef<'svg'>) {
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
      <circle cx="10" cy="10" r="3.75" stroke="currentColor" strokeWidth="2" />
      <path
        d="M10 1.5V2.75M10 17.25V18.5M1.5 10H2.75M17.25 10H18.5M3.99 3.99L4.87 4.87M15.13 15.13L16.01 16.01M3.99 16.01L4.87 15.13M15.13 4.87L16.01 3.99"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
