'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Header from './components/Header';
import { LanguageProvider } from '../context/LanguageContext';

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
        <LanguageProvider>
          <Header />
          <main className="min-h-screen bg-gray-100">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}