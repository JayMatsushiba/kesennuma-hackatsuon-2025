import { getTranslations } from 'next-intl/server';

export default async function PlatformExplanation() {
  const t = await getTranslations('platform');

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main explanation with ample whitespace (余白) */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            {t('title')}
          </h2>
          <div className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed text-slate-700">
            <p>
              {t('intro1')}
              <strong className="text-slate-900">{t('intro1Bold')}</strong>{t('intro1End')}
            </p>
            <p>
              {t('intro2')}
              <strong className="text-slate-900">{t('intro2Bold')}</strong>{t('intro2End')}
            </p>
          </div>
        </div>

        {/* How it works - 3 pillars */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-16">
          {/* Pillar 1: Discover */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 text-blue-600 mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{t('pillar1Title')}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t('pillar1Desc')}
            </p>
          </div>

          {/* Pillar 2: Share */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-600 mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{t('pillar2Title')}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t('pillar2Desc')}
            </p>
          </div>

          {/* Pillar 3: Connect */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-50 text-purple-600 mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{t('pillar3Title')}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t('pillar3Desc')}
            </p>
          </div>
        </div>

        {/* Trust-building features */}
        <div className="bg-slate-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            {t('trust.title')}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">{t('trust.community')}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t('trust.communityDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">{t('trust.privacy')}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t('trust.privacyDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">{t('trust.support')}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t('trust.supportDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">{t('trust.improvement')}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t('trust.improvementDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
