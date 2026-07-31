import { ImageResponse } from 'next/og';
import { createServerI18n } from '@/i18n/server';
import { defaultLocale, isLocale } from '@/i18n/settings';
import { lightPalette } from '@/styles/palette';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// A static string: the file convention has no way to localise this one, and a crawler
// reads it in whatever language it finds. The picture itself follows the locale.
export const alt = 'GoodBoy Foundation — support Slovak dog shelters';

// The step lives in the query string, which this convention never sees, so the image is
// per language rather than per step. Titles and descriptions do vary by step.
export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { t } = createServerI18n(isLocale(locale) ? locale : defaultLocale);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 24,
        padding: 96,
        // Satori has no cascade to resolve a custom property against, so this reads the
        // palette the theme would have pointed it at. The card is the same either way —
        // a shared image cannot know which scheme the person opening the link uses.
        background: lightPalette['action-primary-default'],
        color: lightPalette['content-on-action'],
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 32, opacity: 0.85 }}>{t('app.brand')}</div>
      <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>{t('app.title')}</div>
      <div style={{ fontSize: 32, opacity: 0.85, lineHeight: 1.3 }}>{t('app.description')}</div>
    </div>,
    size,
  );
}
