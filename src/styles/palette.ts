// Both palettes come straight from the design token set: the light one from its base
// roles, the dark one from its inverse roles. Flat keys on purpose — the theme builds its
// var() references from these very keys, so a name can never drift between the two.
export const lightPalette = {
  'action-primary-default': '#4f46e5',
  'action-primary-hover': '#4338ca',
  'action-primary-active': '#3730a3',
  'action-primary-bg': '#e0e7ff',

  'action-secondary-default': '#f3f4f6',
  'action-secondary-hover': '#e5e7eb',
  'action-secondary-active': '#d1d5db',
  'action-secondary-bg': '#f9fafb',

  'action-destructive-default': '#e11d48',
  'action-destructive-hover': '#be123c',
  'action-destructive-active': '#9f1239',
  'action-destructive-bg': '#fff1f2',

  'content-primary': '#111827',
  'content-secondary': '#374151',
  'content-tertiary': '#4b5563',
  'content-quaternary': '#9ca3af',
  'content-quintary': '#d1d5db',
  // Not in the token set: what sits on top of a filled action. White reads on indigo.
  'content-on-action': '#ffffff',

  'surface-primary': '#ffffff',
  'surface-secondary': '#f9fafb',
  'surface-tertiary': '#f3f4f6',
  'surface-quaternary': '#e5e7eb',
  // Not in the token set either: what a panel floating over the page sits on. On white a
  // shadow is enough to lift it, which is why the design never needed the distinction.
  'surface-raised': '#ffffff',

  'state-success-fg': '#047857',
  'state-success-bg': '#d1fae5',
  'state-warning-fg': '#b45309',
  'state-warning-bg': '#fef3c7',
  'state-error-fg': '#be123c',
  'state-error-bg': '#ffe4e6',
  'state-info-fg': '#1d4ed8',
  'state-info-bg': '#dbeafe',

  // ring.primary.xs: the active action colour at 24%.
  'focus-ring': 'rgba(55, 48, 163, 0.24)',

  // A triplet, not a colour, because the shadow scale supplies its own alphas and only the
  // ink changes between the two palettes.
  'shadow-ink': '17, 24, 39',
} as const;

export type ColorToken = keyof typeof lightPalette;

export const darkPalette: Record<ColorToken, string> = {
  'action-primary-default': '#818cf8',
  'action-primary-hover': '#a5b4fc',
  'action-primary-active': '#6366f1',
  'action-primary-bg': 'rgba(49, 46, 129, 0.3)',

  'action-secondary-default': '#262626',
  'action-secondary-hover': '#404040',
  'action-secondary-active': '#525252',
  'action-secondary-bg': 'rgba(23, 23, 23, 0.3)',

  'action-destructive-default': '#fb7185',
  'action-destructive-hover': '#fda4af',
  'action-destructive-active': '#f43f5e',
  'action-destructive-bg': 'rgba(136, 19, 55, 0.3)',

  'content-primary': '#fafafa',
  'content-secondary': '#e5e5e5',
  'content-tertiary': '#d4d4d4',
  'content-quaternary': '#737373',
  'content-quintary': '#404040',
  // The dark action is a light indigo, so white on it would fail contrast — 2.2:1 against
  // #818cf8. Dark ink gives 6.5:1. The token set leaves this one open.
  'content-on-action': '#111827',

  'surface-primary': '#0a0a0a',
  'surface-secondary': '#171717',
  'surface-tertiary': '#262626',
  'surface-quaternary': '#404040',
  // Here the shadow has nothing to work with — black on black reads as nothing — so a
  // floating panel is lifted by being lighter than the page instead.
  'surface-raised': '#262626',

  'state-success-fg': '#34d399',
  'state-success-bg': 'rgba(52, 211, 153, 0.2)',
  'state-warning-fg': '#fbbf24',
  'state-warning-bg': 'rgba(251, 191, 36, 0.2)',
  'state-error-fg': '#fb7185',
  'state-error-bg': 'rgba(251, 113, 133, 0.2)',
  'state-info-fg': '#60a5fa',
  'state-info-bg': 'rgba(96, 165, 250, 0.2)',

  // Same rule as light, applied to the inverse active colour.
  'focus-ring': 'rgba(99, 102, 241, 0.24)',

  // Grey ink disappears against a near-black surface, so here the shadow is pure black.
  'shadow-ink': '0, 0, 0',
};

export function cssVariables(palette: Record<ColorToken, string>) {
  return Object.entries(palette)
    .map(([token, value]) => `--c-${token}: ${value};`)
    .join('\n    ');
}
