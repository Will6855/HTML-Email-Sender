'use client';

import { useState, useEffect } from 'react';
import AccountModal from './AccountModal';

interface Account {
  email: string;
  password: string;
  name: string;
  smtpServer: string;
  smtpPort: number;
}

interface AccountManagementProps {
  selectedAccount?: Account | null;
  onSelectAccount: (account: Account) => void;
  accounts: Account[];
}

const AccountManagement = ({ selectedAccount, onSelectAccount, accounts }: AccountManagementProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddAccount = (newAccount: Account) => {
    const updatedAccounts = [...accounts, newAccount];
    localStorage.setItem('emailAccounts', JSON.stringify(updatedAccounts));
    if (updatedAccounts.length === 1) {
      onSelectAccount(newAccount);
    }
  };

  const handleRemoveAccount = (email: string) => {
    const updatedAccounts = accounts.filter(account => account.email !== email);
    localStorage.setItem('emailAccounts', JSON.stringify(updatedAccounts));
    if (selectedAccount?.email === email) {
      onSelectAccount(updatedAccounts[0] || null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">👥 Account Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Account
        </button>
      </div>

      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddAccount}
      />

      <div className="space-y-4">
        {accounts.map((account) => (
          <div 
            key={account.email} 
            className={`flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm cursor-pointer hover:border-indigo-500 transition-colors ${
              selectedAccount?.email === account.email ? 'border-indigo-500 ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => onSelectAccount(account)}
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveAccount(account.email);
              }}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        {accounts.length === 0 && (
          <p className="text-gray-500 text-center">No accounts added yet</p>
        )}
      </div>
    </div>
  );
};

export default AccountManagement;
