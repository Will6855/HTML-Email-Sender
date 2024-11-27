'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../translations';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'preferred_language';

const getBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  
  // Get browser language
  const browserLang = navigator.language.toLowerCase();
  
  // Check if it starts with any of our supported languages
  if (browserLang.startsWith('fr')) return 'fr';
  
  // Default to English
  return 'en';
};

const getSavedLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  
  const saved = localStorage.getItem(LANGUAGE_KEY);
  if (saved === 'en' || saved === 'fr') return saved;
  
  // If no saved preference, use browser language
  return getBrowserLanguage();
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en'); // Default to 'en' initially

  useEffect(() => {
    // Set the initial language from localStorage or browser preference
    const initialLang = getSavedLanguage();
    setLanguage(initialLang);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    // Save to localStorage
    localStorage.setItem(LANGUAGE_KEY, lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

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
