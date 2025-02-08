'use client';

import '@/app/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/app/components/Header';
import { LanguageProvider } from '@/context/LanguageContext';
import { SessionProvider } from "next-auth/react";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>HTML Email Sender</title>
        <meta name="description" content="Send personalized HTML emails with ease" />
      </head>
      <body className={inter.className}>
        <SessionProvider refetchInterval={60 * 60} refetchOnWindowFocus={true}>
          <LanguageProvider>
            <Header />
            <main className="min-h-screen bg-gray-100">
              {children}
            </main>
            <Toaster />
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}