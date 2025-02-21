'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { redirect } from "next/navigation";
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { signOut } from 'next-auth/react';

interface EmailAccount {
  id: string;
  name: string;
  email: string;
}

export default function ProfilePage() {
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    }
  });
  const router = useRouter();
  const { t } = useTranslation();
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    // Fetch email accounts
    const fetchEmailAccounts = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/emailAccounts');
          if (response.ok) {
            const data = await response.json();
            setEmailAccounts(data);
          }
        } catch (error) {
          console.error('Failed to fetch email accounts', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      fetchEmailAccounts();
    }
  }, [session, status, router]);

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await signOut({ redirect: true, callbackUrl: '/' });
      } else {
        const errorData = await response.json();
        console.error('Account deletion failed:', errorData);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const confirmDeleteAccount = () => {
    setShowDeleteConfirmation(true);
  };

  const cancelDeleteAccount = () => {
    setShowDeleteConfirmation(false);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin inline-block w-16 h-16 border-[4px] border-current border-t-transparent text-indigo-600 rounded-full" role="status">
            <span className="sr-only">{t('common.status.loading')}</span>
          </div>
          <p className="mt-4 text-lg text-gray-600">{t('common.status.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* User Information Section */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Profile Header */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
          <div className="bg-blue-100 text-blue-600 rounded-full h-20 w-20 flex items-center justify-center text-4xl font-bold">
            {session?.user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-extrabold text-gray-900">{session?.user?.username}</h1>
              {session?.user?.role && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full uppercase">
                  {session.user.role}
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center space-x-2 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">{session?.user?.email}</p>
            </div>
            <div className="mt-1 text-sm text-gray-500 flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <p> {t('profile.joined')} {new Date(session?.user?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          </div>

          {/* Email Accounts Section */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h2 className="text-xl font-semibold text-gray-800">{t('profile.emailAccounts')}</h2>
            </div>
            {emailAccounts.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                <p>{t('profile.noEmailAccountsFound')}</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {emailAccounts.map((account) => (
                  <li 
                    key={account.id} 
                    className="bg-gray-50 p-4 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{account.name}</p>
                      <p className="text-gray-600 text-sm">{account.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Account Management Section */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">{t('profile.accountManagement')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/profile/change-email" 
              className="bg-blue-50 text-blue-700 p-5 rounded-xl hover:bg-blue-100 transition-colors flex flex-col items-center space-y-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{t('profile.changeEmail.title')}</span>
            </Link>
            <Link 
              href="/profile/change-password" 
              className="bg-green-50 text-green-700 p-5 rounded-xl hover:bg-green-100 transition-colors flex flex-col items-center space-y-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-medium">{t('profile.changePassword.title')}</span>
            </Link>
            {session?.user?.role === 'ADMIN' && (
              <Link 
                href="/admin/dashboard" 
                className="bg-purple-50 text-purple-700 p-5 rounded-xl hover:bg-purple-100 transition-colors flex flex-col items-center space-y-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">{t('admin.title')}</span>
              </Link>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={confirmDeleteAccount}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            {t('profile.deleteAccount.title')}
          </button>

          {showDeleteConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold mb-4">{t('profile.deleteAccount.title')}</h2>
                <p className="mb-4">{t('profile.deleteAccount.warning')}</p>
                <div className="flex justify-between">
                  <button 
                    onClick={cancelDeleteAccount}
                    className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                  >
                    {t('profile.deleteAccount.cancel')}
                  </button>
                  <button 
                    onClick={handleDeleteAccount}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    {t('profile.deleteAccount.confirm')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}