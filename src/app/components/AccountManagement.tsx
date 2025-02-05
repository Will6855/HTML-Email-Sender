'use client';

import { useState, useEffect } from 'react';
import AccountModal from './AccountModal';
import { useTranslation } from '@/hooks/useTranslation';

interface Account {
  id?: string;
  email: string;
  password?: string;
  encryptedPassword: string;
  name: string;
  smtpServer: string;
  smtpPort: number;
}

interface AccountManagementProps {
  userId: string;
  selectedAccount?: Account | null;
  onSelectAccount?: (account: Account | null) => void;
  accounts?: Account[];
  onAccountsChange?: React.Dispatch<React.SetStateAction<Account[]>>;
}

const AccountManagement = ({
  userId,
  selectedAccount: initialSelectedAccount,
  onSelectAccount,
  accounts: initialAccounts,
  onAccountsChange,
}: AccountManagementProps) => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts || []);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(
    initialSelectedAccount || null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/emailAccounts');
        if (!response.ok) {
          throw new Error('Failed to fetch accounts');
        }
        const fetchedAccounts = await response.json();
        setAccounts(fetchedAccounts);
        
        if (fetchedAccounts.length > 0) {
          setSelectedAccount(fetchedAccounts[0]);
        }
      } catch (error) {
        console.error('Error loading accounts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, []);

  const handleAddAccount = async (newAccount: Account) => {
    try {
      const response = await fetch('/api/emailAccounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add account');
      }

      const createdAccount = await response.json();

      const updatedAccounts = [...accounts, createdAccount];

      setAccounts(updatedAccounts);
      onAccountsChange?.(updatedAccounts);
      
      if (updatedAccounts.length === 1) {
        setSelectedAccount(createdAccount);
        onSelectAccount?.(createdAccount);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding account:', error);
      alert(error instanceof Error ? error.message : t('errorAddingAccount'));
    }
  };

  const handleEditAccount = async (updatedAccount: Account) => {
    try {
      const response = await fetch('/api/emailAccounts', {
        method: 'PUT',  // Use PUT for updating
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAccount),
      });

      if (!response.ok) {
        throw new Error('Failed to update account');
      }

      const updatedAccounts = accounts.map(account => 
        account.email === updatedAccount.email ? updatedAccount : account
      );

      setAccounts(updatedAccounts);
      setSelectedAccount(updatedAccount);
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingAccount(null);
    } catch (error) {
      console.error('Error editing account:', error);
      alert(t('errorEditingAccount'));
    }
  };

  const handleRemoveAccount = async (email: string) => {
    const confirmRemove = window.confirm(`${t('confirmRemoveAccount')} ${email}`);
    if (!confirmRemove) return;

    try {
      const accountToRemove = accounts.find(account => account.email === email);
      
      if (accountToRemove?.id) {
        await fetch(`/api/emailAccounts?id=${accountToRemove.id}`, {
          method: 'DELETE',
        });
      }

      const updatedAccounts = accounts.filter(account => account.email !== email);
      setAccounts(updatedAccounts);
      
      if (selectedAccount?.email === email) {
        setSelectedAccount(updatedAccounts[0] || null);
      }
    } catch (error) {
      console.error('Error removing account:', error);
      alert(t('errorRemovingAccount'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-16 h-16 border-[4px] border-current border-t-transparent text-indigo-600 rounded-full" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">👥 {t('accountManagement')}</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {t('addAccount')}
        </button>
      </div>

      <AccountModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setEditingAccount(null);
        }}
        onSave={isEditMode ? handleEditAccount : handleAddAccount}
        initialAccount={editingAccount || undefined}
        mode={isEditMode ? 'edit' : 'add'}
      />

      <div className="space-y-4">
        {accounts.map((account) => (
          <div 
            key={account.email} 
            className={`flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm cursor-pointer hover:border-indigo-500 transition-colors ${
              selectedAccount?.email === account.email ? 'border-indigo-500 ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => {
              setSelectedAccount(account);
              onSelectAccount?.(account);
            }}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedAccount?.email === account.email 
                ? 'border-indigo-500 bg-indigo-500' 
                : 'border-gray-300'
              }`}>
                {selectedAccount?.email === account.email && (
                  <div className="w-2 h-2 mx-auto mt-0.5 rounded-full bg-white" />
                )}
              </div>
              <div>
                <p className="font-medium">{account.name}</p>
                <p className="text-sm text-gray-500">{account.email}</p>
                <p className="text-xs text-gray-400">SMTP: {account.smtpServer}:{account.smtpPort}</p>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingAccount(account);
                  setIsModalOpen(true);
                  setIsEditMode(true);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                {t('edit')}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAccount(account.email);
                }}
                className="text-red-600 hover:text-red-800"
              >
                {t('remove')}
              </button>
            </div>
          </div>
        ))}
        {accounts.length === 0 && (
          <p className="text-gray-500 text-center">{t('noAccounts')}</p>
        )}
      </div>
    </div>
  );
};

export default AccountManagement;
