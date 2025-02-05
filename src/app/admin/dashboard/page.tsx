'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

interface User {
    id: string;
    username: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    // Redirect if not admin
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }

    // Fetch users if admin
    if (session?.user?.role === 'ADMIN') {
      const fetchUsers = async () => {
        try {
          const response = await fetch('/api/users');
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error('Failed to fetch users:', error);
          setError('Failed to load users');
        }
      };
      fetchUsers();
    }
  }, [session, status, router]);

  const handleGenerateResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetLink('');

    if (!selectedUser) {
      setError('Please select a user');
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser })
      });

      const data = await response.json();

      if (response.ok) {
        // Construct full reset link with origin
        const fullResetLink = `${window.location.origin}${data.resetLink}`;
        setResetLink(fullResetLink);
      } else {
        setError(data.error || 'Failed to generate reset link');
      }
    } catch (error) {
      console.error('Password reset link generation error:', error);
      setError('An unexpected error occurred');
    }
  };

  const copyResetLink = () => {
    if (resetLink) {
      navigator.clipboard.writeText(resetLink);
      alert('Reset link copied to clipboard');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin inline-block w-16 h-16 border-[4px] border-current border-t-transparent text-indigo-600 rounded-full" role="status">
            <span className="sr-only">{t('loading')}</span>
          </div>
          <p className="mt-4 text-lg text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }
  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Dashboard Header */}
        <div className="bg-white shadow-xl rounded-2xl p-8 flex items-center space-x-6">
          <div className="bg-purple-100 text-purple-600 rounded-full h-20 w-20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{t('adminDashboard')}</h1>
            <p className="text-gray-600">{t('generatePasswordResetLinksForUsers')}</p>
          </div>
        </div>

        {/* User Reset Link Generation */}
        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <form onSubmit={handleGenerateResetLink} className="space-y-4">
            <div>
              <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700 mb-2">
                {t('selectUserForPasswordReset')}
              </label>
              <select 
                id="userSelect"
                value={selectedUser} 
                onChange={(e) => setSelectedUser(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('selectAUser')}</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('generateResetLink')}
            </button>
          </form>

          {/* Error Display */}
          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Reset Link Display */}
          {resetLink && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 space-y-3">
              <h2 className="text-lg font-semibold text-green-800">{t('passwordResetLink')}</h2>
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  value={resetLink} 
                  readOnly 
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md bg-white truncate"
                />
                <button 
                  onClick={copyResetLink}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t('copy')}
                </button>
              </div>
              <p className="text-sm text-gray-600">
                {t('resetLinkExpiration')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}