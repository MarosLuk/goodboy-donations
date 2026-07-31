import { describe, expect, it } from 'vitest';
import { cssVariables, darkPalette, lightPalette } from './palette';
import { theme } from './theme';

// TypeScript already keeps the two palettes on the same set of keys, and the helper in the
// theme only accepts those keys. What it cannot see is a custom property written out by
// hand — that would resolve to nothing and paint an invisible element. So the names are
// collected from both sides and compared.

function customProperties(value: unknown, found = new Set<string>()) {
  if (typeof value === 'string') {
    for (const [, name] of value.matchAll(/var\((--c-[a-z0-9-]+)\)/g)) found.add(name);
  } else if (typeof value === 'object' && value !== null) {
    for (const nested of Object.values(value)) customProperties(nested, found);
  }

  return found;
}

function declaredIn(palette: Parameters<typeof cssVariables>[0]) {
  const names = cssVariables(palette).matchAll(/(--c-[a-z0-9-]+):/g);

  return new Set(Array.from(names, ([, name]) => name));
}

describe('the theme', () => {
  const referenced = customProperties(theme);

  it('reads its colours from custom properties rather than from fixed values', () => {
    expect(referenced.size).toBeGreaterThan(0);
    expect(JSON.stringify(theme.color)).not.toMatch(/#[0-9a-f]{3}/i);
  });

  it.each([
    ['light', lightPalette],
    ['dark', darkPalette],
  ])('resolves against the %s palette', (_name, palette) => {
    const declared = declaredIn(palette);

    expect(Array.from(referenced).filter((name) => !declared.has(name))).toEqual([]);
  });
});
