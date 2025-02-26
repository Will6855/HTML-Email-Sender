'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { redirect } from "next/navigation";
import toast from 'react-hot-toast';
import { useTranslation } from '@/hooks/useTranslation';

interface User {
    id: string;
    username: string;
    role: 'ADMIN' | 'USER' | 'DEMO';
}

export default function AdminDashboard() {
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    }
  });
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedResetUser, setSelectedResetUser] = useState('');
  const [selectedRoleUser, setSelectedRoleUser] = useState('');
  const [selectedUserRole, setSelectedUserRole] = useState('');
  const [resetLink, setResetLink] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    // Redirect if not admin
    if (session?.user?.role !== 'ADMIN') {
      redirect('/');
    }
    
    // Fetch users if admin
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error(t('common.errors.unexpectedError'));
      }
    };

    if (session?.user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [session, status, router, t]);

  const handleGenerateResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLink('');

    if (!selectedResetUser) {
      toast.error(t('admin.passwordReset.errors.noUserSelected'));
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedResetUser })
      });

      const data = await response.json();

      if (response.ok) {
        // Construct full reset link with origin
        const fullResetLink = `${window.location.origin}${data.resetLink}`;
        setResetLink(fullResetLink);
      } else {
        toast.error(t('admin.passwordReset.errors.generateFailed'));
      }
    } catch (error) {
      console.error('Password reset link generation error:', error);
      toast.error(t('common.errors.unexpectedError'));
    }
  };

  const handleChangeUserRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRoleUser || !selectedUserRole) {
      toast.error(t('admin.roleManagement.errors.noUserOrRoleSelected'));
      return;
    }

    try {
      const response = await fetch('/api/users/role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: selectedRoleUser, 
          role: selectedUserRole 
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update local users state to reflect role change
        setUsers(users.map(user => 
          user.id === selectedRoleUser 
            ? { ...user, role: selectedUserRole as User['role'] } 
            : user
        ));
        toast.success(t('admin.roleManagement.success'));
      } else {
        toast.error(t('common.errors.unexpectedError'));
      }
    } catch (error) {
      console.error('User role update error:', error);
      toast.error(t('common.errors.unexpectedError'));
    }
  };

  const copyResetLink = () => {
    if (resetLink) {
      navigator.clipboard.writeText(resetLink);
      toast.success(t('admin.passwordReset.success'));
    }
  };

  if (status === 'loading') {
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
        {/* Dashboard Header */}
        <div className="bg-white shadow-xl rounded-2xl p-8 flex items-center space-x-6">
          <div className="bg-purple-100 text-purple-600 rounded-full h-20 w-20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{t('admin.title')}</h1>
          </div>
        </div>

        {/* Password Reset Link Generation */}
        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <form onSubmit={handleGenerateResetLink} className="space-y-4">
            <div>
              <label htmlFor="resetUserSelect" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.passwordReset.selectUser')}
              </label>
              <select 
                id="resetUserSelect"
                value={selectedResetUser} 
                onChange={(e) => setSelectedResetUser(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('admin.passwordReset.fields.selectUser')}</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} | {user.role}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('admin.passwordReset.generateLink')}
            </button>
          </form>

          {/* Reset Link Display */}
          {resetLink && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 space-y-3">
              <h2 className="text-lg font-semibold text-green-800">{t('admin.passwordReset.link')}</h2>
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
                  {t('admin.passwordReset.copy')}
                </button>
              </div>
              <p className="text-sm text-gray-600">
                {t('admin.passwordReset.expiration')}
              </p>
            </div>
          )}
        </div>

        {/* User Role Management */}
        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <form onSubmit={handleChangeUserRole} className="space-y-4">
            <div>
              <label htmlFor="roleUserSelect" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.roleManagement.selectUser')}
              </label>
              <select 
                id="roleUserSelect"
                value={selectedRoleUser} 
                onChange={(e) => setSelectedRoleUser(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('admin.roleManagement.fields.selectUser')}</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} | {user.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="roleSelect" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.roleManagement.selectRole')}
              </label>
              <select 
                id="roleSelect"
                value={selectedUserRole} 
                onChange={(e) => setSelectedUserRole(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('admin.roleManagement.fields.selectRole')}</option>
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
                <option value="DEMO">DEMO</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('admin.roleManagement.updateRole')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}