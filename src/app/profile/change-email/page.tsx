'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';

export default function ChangeEmailPage() {
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { t } = useTranslation();

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail, currentPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Email change failed');
      }
      
      setSuccess(t('profile.changeEmail.success'));
      setTimeout(() => router.push('/profile'), 2000);
    } catch (err) {
      setError(t('common.errors.unexpectedError'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('profile.changeEmail.title')}</h1>
          </div>

          <form onSubmit={handleChangeEmail} className="space-y-4">
            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-2">
                {t('profile.changeEmail.fields.newEmail')}
              </label>
              <input
                type="email"
                id="newEmail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                placeholder={t('profile.changeEmail.fields.newEmailPlaceholder')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('profile.changeEmail.fields.currentPassword')}
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder={t('profile.changeEmail.fields.currentPasswordPlaceholder')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-600 text-sm text-center">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('profile.changeEmail.submit')}
            </button>
          </form>

          <div className="text-center">
            <Link 
              href="/profile" 
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              {t('profile.changeEmail.backToProfile')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}