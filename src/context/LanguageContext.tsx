'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '@/translations';

// Add this type definition using the keys from your translations
type TranslationKey = keyof typeof translations.en;

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: string[]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'preferred_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    // Mark as client-side and set initial language
    setIsClientSide(true);

    // Attempt to get saved language
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
    
    if (savedLanguage === 'en' || savedLanguage === 'fr') {
      setLanguage(savedLanguage);
    } else if (typeof window !== 'undefined') {
      // Detect browser language if no saved preference
      const browserLang = navigator.language.toLowerCase();
      const detectedLang: Language = browserLang.startsWith('fr') ? 'fr' : 'en';
      setLanguage(detectedLang);
      localStorage.setItem(LANGUAGE_KEY, detectedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_KEY, lang);
    }
  };

  const t = (key: TranslationKey, params?: string[]): string => {
    let translation = translations[language][key] || key;
    
    // Replace placeholders if params are provided
    if (params) {
      params.forEach((param, index) => {
        translation = translation.replace(`{${index}}`, param);
      });
    }
    
    return translation;
  };

  // Only render children when client-side to prevent hydration issues
  if (!isClientSide) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
