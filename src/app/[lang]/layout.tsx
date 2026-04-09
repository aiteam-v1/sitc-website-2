import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { defaultLocale, getDirection, getTranslation, locales } from '@/lib/i18n'

export function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  if (!hasLocale(locales, lang)) {
    notFound()
  }

  const messages = await getTranslation(lang)
  const direction = getDirection(lang)

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      <div lang={lang} dir={direction} data-locale={lang} data-default-locale={defaultLocale}>
        {children}
      </div>
    </NextIntlClientProvider>
  )
}
