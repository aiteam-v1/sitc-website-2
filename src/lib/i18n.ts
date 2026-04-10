export const locales = ['en', 'ur', 'sd'] as const

export type AppLocale = (typeof locales)[number]

export const defaultLocale: AppLocale = 'en'

export const rtlLocales = new Set<AppLocale>(['ur', 'sd'])

export const localeCookieName = 'sitc-locale'

export function isValidLocale(locale: string): locale is AppLocale {
  return locales.includes(locale as AppLocale)
}

export function getDirection(locale: AppLocale): 'ltr' | 'rtl' {
  return rtlLocales.has(locale) ? 'rtl' : 'ltr'
}

export async function getTranslation(locale: AppLocale) {
  return (await import(`../../translations/${locale}.json`)).default as Record<string, string>
}
