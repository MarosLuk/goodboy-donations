'use client';

import styled from 'styled-components';

// The prose runs the full width of the page, left aligned, in the frame's full ink.
export const Prose = styled.p`
  color: ${({ theme }) => theme.color.content.primary};
`;

// The summary draws its own rules and owns the air inside them, so this only exists to let
// the metrics sit apart from the paragraphs around them.
export const Numbers = styled.div`
  align-self: stretch;
`;
