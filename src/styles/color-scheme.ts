export const colorSchemes = ['light', 'dark'] as const;

export type ColorScheme = (typeof colorSchemes)[number];

export const COLOR_SCHEME_KEY = 'goodboy:color-scheme';

// The attribute the stylesheet keys its override off. Nothing else writes it.
export const COLOR_SCHEME_ATTRIBUTE = 'data-theme';

function isColorScheme(value: unknown): value is ColorScheme {
  return colorSchemes.some((scheme) => scheme === value);
}

export function readStoredScheme(): ColorScheme | null {
  // Private browsing can refuse the read outright, and there is nothing to recover from
  // that beyond falling back to the system preference.
  try {
    const stored = window.localStorage.getItem(COLOR_SCHEME_KEY);

    return isColorScheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function storeScheme(scheme: ColorScheme) {
  try {
    window.localStorage.setItem(COLOR_SCHEME_KEY, scheme);
  } catch {
    // A choice that cannot be remembered still applies to this page.
  }
}

export function systemScheme(): ColorScheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyScheme(scheme: ColorScheme) {
  document.documentElement.setAttribute(COLOR_SCHEME_ATTRIBUTE, scheme);
}

// The attribute is only there once someone has chosen, so its absence means the system
// preference is still in charge.
export function currentScheme(): ColorScheme {
  const attribute = document.documentElement.getAttribute(COLOR_SCHEME_ATTRIBUTE);

  return isColorScheme(attribute) ? attribute : systemScheme();
}

// Runs before the first paint, which is the whole point of it: the page is rendered on the
// server, so the markup cannot carry a choice only this browser knows about. Without it the
// page would paint light and then jump.
export const colorSchemeScript = `try{var s=localStorage.getItem('${COLOR_SCHEME_KEY}');if(s==='light'||s==='dark')document.documentElement.setAttribute('${COLOR_SCHEME_ATTRIBUTE}',s)}catch(e){}`;
