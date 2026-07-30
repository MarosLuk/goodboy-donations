import { css } from 'styled-components';

// The shared look of anything the user types into or picks from: input, select and
// the combobox field. Kept in one place so the three cannot drift apart.
export const controlStyles = css`
  width: 100%;
  padding: ${({ theme }) => `${theme.space[12]} ${theme.space[16]}`};
  border-radius: ${({ theme }) => theme.radius[12]};
  background: ${({ theme }) => theme.color.surface.tertiary};
  color: ${({ theme }) => theme.color.content.primary};
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  /* A transparent border keeps the box the same size once an error paints it. */
  border: ${({ theme }) => theme.borderWidth.xs} solid transparent;

  &::placeholder {
    color: ${({ theme }) => theme.color.content.quaternary};
  }

  /* The error look hangs off aria-invalid, so what is shown and what a screen
     reader announces cannot drift apart. */
  &[aria-invalid='true'] {
    border-color: ${({ theme }) => theme.color.state.error.fg};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
