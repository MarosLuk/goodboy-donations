import { createGlobalStyle } from 'styled-components';
import { cssVariables, darkPalette, lightPalette } from './palette';

// Not colours, but they belong to the same three blocks: the toggle in the footer offers
// the scheme you are not in, and letting the cascade decide which of its two icons shows
// keeps the server out of a choice only the browser knows.
const schemeIcons = (sun: string, moon: string) => `--icon-sun: ${sun};
    --icon-moon: ${moon};`;

export const GlobalStyle = createGlobalStyle`
  /* The palettes land here as custom properties, which is the whole of the theme switch:
     every role in theme.ts reads one of these, so redefining them under a different
     selector recolours the page without a single component re-rendering.

     color-scheme goes with each of them so the parts the page does not paint — the native
     select popup, scrollbars, the caret — follow along. */
  :root {
    color-scheme: light;
    ${schemeIcons('none', 'block')}
    ${cssVariables(lightPalette)}
  }

  /* The system preference decides, unless someone has picked a side for themselves. */
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme='light']) {
      color-scheme: dark;
      ${schemeIcons('block', 'none')}
      ${cssVariables(darkPalette)}
    }
  }

  /* Same specificity as the rule above, so this wins on source order alone — which is what
     lets a choice override the system in both directions. */
  :root[data-theme='dark'] {
    color-scheme: dark;
    ${schemeIcons('block', 'none')}
    ${cssVariables(darkPalette)}
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
    padding: 0;
  }

  html {
    -webkit-text-size-adjust: 100%;
  }

  body {
    min-height: 100dvh;
    font-family: ${({ theme }) => theme.font.family};
    font-size: ${({ theme }) => theme.text.md.fontSize};
    line-height: ${({ theme }) => theme.text.md.lineHeight};
    color: ${({ theme }) => theme.color.content.primary};
    background: ${({ theme }) => theme.color.surface.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  img,
  picture,
  svg,
  video {
    display: block;
    max-width: 100%;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
    background: none;
    border: none;
  }

  a {
    color: inherit;
  }

  /* No text-wrap: balance on headings. It shortens the first line to even the two out,
     which broke the headline one word earlier than the design does. */

  p {
    text-wrap: pretty;
  }

  ul,
  ol {
    list-style: none;
  }

  :focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.focusRing};
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
