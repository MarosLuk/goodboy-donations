import type { ColorToken } from './palette';

// A role resolves to the CSS variable the live palette wrote, not to a hex value, which is
// how one theme serves both colour schemes. Typed by the palette's own keys, so a token
// that does not exist there fails to compile.
const c = (token: ColorToken) => `var(--c-${token})`;

// The shadow scale keeps its own alphas and takes only the ink from the palette, so the
// same six elevations work on a white page and on a black one.
const ink = (alpha: number) => `rgba(${c('shadow-ink')}, ${alpha})`;

// Only semantic roles are exposed — no component reaches for a raw palette shade,
// so changing a role recolours every place that plays that role.
export const theme = {
  color: {
    action: {
      primary: {
        default: c('action-primary-default'),
        hover: c('action-primary-hover'),
        active: c('action-primary-active'),
        bg: c('action-primary-bg'),
        bg10: c('action-primary-bg10'),
      },
      secondary: {
        default: c('action-secondary-default'),
        hover: c('action-secondary-hover'),
        active: c('action-secondary-active'),
        bg: c('action-secondary-bg'),
      },
      destructive: {
        default: c('action-destructive-default'),
        hover: c('action-destructive-hover'),
        active: c('action-destructive-active'),
        bg: c('action-destructive-bg'),
      },
    },
    content: {
      primary: c('content-primary'),
      secondary: c('content-secondary'),
      tertiary: c('content-tertiary'),
      quaternary: c('content-quaternary'),
      quintary: c('content-quintary'),
      onAction: c('content-on-action'),
    },
    surface: {
      primary: c('surface-primary'),
      secondary: c('surface-secondary'),
      tertiary: c('surface-tertiary'),
      quaternary: c('surface-quaternary'),
      raised: c('surface-raised'),
    },
    state: {
      success: { fg: c('state-success-fg'), bg: c('state-success-bg') },
      warning: { fg: c('state-warning-fg'), bg: c('state-warning-bg') },
      error: { fg: c('state-error-fg'), bg: c('state-error-bg') },
      info: { fg: c('state-info-fg'), bg: c('state-info-bg') },
    },
  },
  space: {
    2: '2px',
    4: '4px',
    6: '6px',
    8: '8px',
    12: '12px',
    16: '16px',
    20: '20px',
    24: '24px',
    32: '32px',
    40: '40px',
    48: '48px',
    64: '64px',
    80: '80px',
    96: '96px',
    128: '128px',
    160: '160px',
    192: '192px',
    224: '224px',
    256: '256px',
  },
  radius: {
    2: '2px',
    4: '4px',
    6: '6px',
    8: '8px',
    12: '12px',
    16: '16px',
    20: '20px',
    24: '24px',
    32: '32px',
    40: '40px',
    48: '48px',
    80: '80px',
    circle: '999px',
  },
  borderWidth: { xs: '1px', sm: '1.5px', md: '2px', lg: '4px' },
  // Named after what changes, not after a t-shirt size: below tablet the page is a
  // single column, and the two-column split only fits once 658 + 80 + 602 does.
  breakpoint: {
    tablet: '768px',
    desktop: '1200px',
  },
  font: {
    family: 'var(--font-inter), system-ui, sans-serif',
    weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  },
  text: {
    xs: { fontSize: '12px', lineHeight: '16px', letterSpacing: '0px' },
    sm: { fontSize: '14px', lineHeight: '20px', letterSpacing: '0px' },
    md: { fontSize: '16px', lineHeight: '24px', letterSpacing: '0px' },
    lg: { fontSize: '18px', lineHeight: '24px', letterSpacing: '0px' },
    xl: { fontSize: '20px', lineHeight: '32px', letterSpacing: '0px' },
  },
  heading: {
    xs: { fontSize: '24px', lineHeight: '32px', letterSpacing: '0px' },
    sm: { fontSize: '32px', lineHeight: '40px', letterSpacing: '-0.3px' },
    md: { fontSize: '36px', lineHeight: '48px', letterSpacing: '-0.3px' },
    lg: { fontSize: '48px', lineHeight: '56px', letterSpacing: '-0.3px' },
    xl: { fontSize: '60px', lineHeight: '72px', letterSpacing: '-0.3px' },
    xxl: { fontSize: '72px', lineHeight: '88px', letterSpacing: '-0.35px' },
  },
  shadow: {
    xs: `0 1px 2px 0 ${ink(0.07)}`,
    sm: `0 1px 3px 0 ${ink(0.1)}, 0 1px 2px 0 ${ink(0.06)}`,
    md: `0 4px 6px -1px ${ink(0.1)}, 0 2px 4px -1px ${ink(0.06)}`,
    lg: `0 10px 15px -3px ${ink(0.1)}, 0 4px 6px -2px ${ink(0.05)}`,
    xl: `0 20px 25px -5px ${ink(0.1)}, 0 10px 10px -5px ${ink(0.04)}`,
    xxl: `0 25px 50px -12px ${ink(0.25)}, 0 15px 30px -6px ${ink(0.04)}`,
    inner: `inset 0 2px 4px 0 ${ink(0.1)}`,
  },
  focusRing: `0 0 0 2px ${c('focus-ring')}`,
} as const;

export type Theme = typeof theme;
