import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always use locale prefix (ja, en)
  localePrefix: 'always',
});

export const config = {
  // Match only internationalized pathnames
  // Exclude API routes and static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
