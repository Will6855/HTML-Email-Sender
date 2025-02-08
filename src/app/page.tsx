'use client';

import { useTranslation } from '@/hooks/useTranslation';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">{t('heroTitle')}</span>
                  <span className="block text-indigo-600 mt-3">{t('heroSubtitle')}</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  {t('heroDescription')}
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a
                      href="/send-mail"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      {t('getStarted')}
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">{t('features')}</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {t('featuresTitle')}
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="text-lg leading-6 font-medium text-gray-900">{t('csvSupport')}</div>
                <p className="mt-2 text-base text-gray-500">
                  {t('csvDescription')}
                </p>
              </div>

              <div className="relative">
                <div className="text-lg leading-6 font-medium text-gray-900">{t('htmlTemplates')}</div>
                <p className="mt-2 text-base text-gray-500">
                  {t('htmlTemplatesDescription')}
                </p>
              </div>

              <div className="relative">
                <div className="text-lg leading-6 font-medium text-gray-900">{t('personalization')}</div>
                <p className="mt-2 text-base text-gray-500">
                  {t('personalizationDescription')}
                </p>
              </div>

              <div className="relative">
                <div className="text-lg leading-6 font-medium text-gray-900">{t('fileAttachments')}</div>
                <p className="mt-2 text-base text-gray-500">
                  {t('fileAttachmentsDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">{t('howItWorks')}</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {t('howItWorksTitle')}
            </p>
          </div>

          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            <div className="relative">
              <div className="text-lg leading-6 font-medium text-gray-900">{t('step1Title')}</div>
              <p className="mt-2 text-base text-gray-500">
                {t('step1Description')}
              </p>
            </div>

            <div className="relative">
              <div className="text-lg leading-6 font-medium text-gray-900">{t('step2Title')}</div>
              <p className="mt-2 text-base text-gray-500">
                {t('step2Description')}
              </p>
            </div>

            <div className="relative">
              <div className="text-lg leading-6 font-medium text-gray-900">{t('step3Title')}</div>
              <p className="mt-2 text-base text-gray-500">
                {t('step3Description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;