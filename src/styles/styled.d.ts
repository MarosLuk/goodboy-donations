import type { Theme } from './theme';

declare module 'styled-components' {
  // Augmenting DefaultTheme needs an interface, and it carries no members of its own.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
