'use client';

import { useLanguage } from '../context/LanguageContext';

export function useTranslation() {
  const { t } = useLanguage();
  return { t };
}
