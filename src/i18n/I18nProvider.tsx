'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { i18nOptions } from './config';
import type { Locale } from './settings';

function createClientI18n(locale: Locale) {
  const instance = createInstance();

  instance.use(initReactI18next).init(i18nOptions(locale));

  return instance;
}

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  // A fresh instance per mounted tree, built once — inline creation would reset the
  // language on every re-render.
  const [instance] = useState(() => createClientI18n(locale));

  useEffect(() => {
    if (instance.resolvedLanguage !== locale) {
      void instance.changeLanguage(locale);
    }
  }, [instance, locale]);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
