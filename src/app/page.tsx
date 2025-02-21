'use client';

import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';


const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              {/* Left content */}
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:col-span-6 lg:mt-20 lg:px-8 xl:mt-28">
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
                      <Link
                        href="/send-mail"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                      >
                        {t('getStarted')}
                      </Link>
                    </div>
                  </div>
                </div>
              </main>
              
              {/* Right content - Illustration */}
              <div className="hidden lg:block lg:col-span-6">
                <div className="relative h-full flex items-center justify-center">
                  <div className="w-[70%] h-64 bg-white rounded-lg shadow-lg transform rotate-3">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-32 h-32 text-indigo-600 transform transition-transform hover:scale-105 duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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