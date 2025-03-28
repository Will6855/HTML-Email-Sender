'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resetToken = searchParams.get('token');
  const { t } = useTranslation();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (newPassword !== confirmPassword) {
      setError(t('resetPassword.validation.passwordsDoNotMatch'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        alert(t('resetPassword.status.success'));
        router.push('/login');
      } else {
        setError(t('resetPassword.status.error'));
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError(t('common.status.error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!resetToken) {
    return <div className="container mx-auto p-4">{t('resetPassword.errors.invalidToken')}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('resetPassword.title')}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('resetPassword.fields.password')}
              </label>
              <input 
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('resetPassword.fields.confirmPassword')}
              </label>
              <input 
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {isLoading ? t('resetPassword.status.resetting') : t('resetPassword.fields.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}