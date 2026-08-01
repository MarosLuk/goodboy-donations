import { css } from 'styled-components';

// The shared look of anything the user types into or picks from: input, select and
// the combobox field. Kept in one place so the three cannot drift apart.
export const controlStyles = css`
  width: 100%;
  /* Exactly 56 tall, as the design select is. The outline is an inset shadow rather
     than a border so it does not add to that height, and an error cannot shift the
     box either. */
  padding: ${({ theme }) => `${theme.space[16]} ${theme.space[16]}`};
  border-radius: ${({ theme }) => theme.radius[8]};
  background: ${({ theme }) => theme.color.surface.tertiary};
  color: ${({ theme }) => theme.color.content.primary};
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  border: none;
  /* The focus ring and the error outline fade in rather than snapping on. */
  transition: box-shadow 150ms ease;

  &::placeholder {
    color: ${({ theme }) => theme.color.content.quaternary};
  }

  /* The error look hangs off aria-invalid, so what is shown and what a screen
     reader announces cannot drift apart. */
  &[aria-invalid='true'] {
    box-shadow: ${({ theme }) => `inset 0 0 0 ${theme.borderWidth.xs} ${theme.color.state.error.fg}`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
