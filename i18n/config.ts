// Define supported locales
export const locales = ['ja', 'en'] as const;
export type Locale = (typeof locales)[number];

// Default locale is Japanese (Japan-first)
export const defaultLocale: Locale = 'ja';
