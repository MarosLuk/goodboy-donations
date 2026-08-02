'use client';

import styled from 'styled-components';

// The rhythm the confirmation screen uses, which is the other screen the design does not draw:
// a heading, one line saying what happened, and the way on out of it.
export const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[24]};
  /* The other screens fill the window and let the footer hold the bottom edge. Three lines
     cannot fill anything, so they take the room instead and sit in the middle of it. On a phone
     the column is only as tall as its content, and this does nothing. */
  flex: 1;
  justify-content: center;
`;

export const Text = styled.p`
  font-size: ${({ theme }) => theme.text.lg.fontSize};
  line-height: ${({ theme }) => theme.text.lg.lineHeight};
  color: ${({ theme }) => theme.color.content.tertiary};
`;
