import { common as commonEn } from './en/common';
import { common as commonFr } from './fr/common';
import { emailCampaign as emailCampaignEn } from './en/emailCampaign';
import { emailCampaign as emailCampaignFr } from './fr/emailCampaign';
import { auth as authEn } from './en/auth';
import { auth as authFr } from './fr/auth';
import { profile as profileEn } from './en/profile';
import { profile as profileFr } from './fr/profile';
import { admin as adminEn } from './en/admin';
import { admin as adminFr } from './fr/admin';
import { navigation as navigationEn } from './en/navigation';
import { navigation as navigationFr } from './fr/navigation';
import { home as homeEn } from './en/home';
import { home as homeFr } from './fr/home';
import { resetPassword as resetPasswordEn } from './en/resetPassword';
import { resetPassword as resetPasswordFr } from './fr/resetPassword';

export const translations = {
  en: {
    common: commonEn,
    emailCampaign: emailCampaignEn,
    auth: authEn,
    profile: profileEn,
    admin: adminEn,
    navigation: navigationEn,
    home: homeEn,
    resetPassword: resetPasswordEn,
  },
  fr: {
    common: commonFr,
    emailCampaign: emailCampaignFr,
    auth: authFr,
    profile: profileFr,
    admin: adminFr,
    navigation: navigationFr,
    home: homeFr,
    resetPassword: resetPasswordFr,
  }
} as const;

type RecursiveDot<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? RecursiveDot<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

export type TranslationKey = RecursiveDot<typeof translations.en>;