import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { locales } from '@/i18n/config';
import DynamicProviderWrapper from '../components/providers/DynamicProviderWrapper';
import '../globals.css';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return {
    title: (messages as any).metadata?.title || 'Kesmemento | ケセメメント',
    description: (messages as any).metadata?.description || '3D地図で巡る気仙沼の記憶と体験。',
    keywords: ['気仙沼', 'Kesennuma', '3D地図', 'デジタルアーカイブ', '震災の記憶', '漁業'],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Fetch messages for the locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <DynamicProviderWrapper>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </DynamicProviderWrapper>
      </body>
    </html>
  );
}
