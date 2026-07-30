import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
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

  h1,
  h2,
  h3,
  h4 {
    text-wrap: balance;
  }

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
