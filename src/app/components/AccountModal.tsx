'use client';

import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useTranslation } from '@/hooks/useTranslation';
import bcrypt from 'bcryptjs';

interface Account {
  email: string;
  password: string;
  name: string;
  smtpServer: string;
  smtpPort: number;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Account) => void;
}

const AccountModal = ({ isOpen, onClose, onSave }: AccountModalProps) => {
  const [newAccount, setNewAccount] = useState<Account>({
    email: '',
    password: '',
    name: '',
    smtpServer: '',
    smtpPort: 587,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Account, string>>>({});
  const { t } = useTranslation();

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Account, string>> = {};

    // Email validation
    if (!newAccount.email) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(newAccount.email)) {
      newErrors.email = t('invalidEmail');
    }

    // Password validation
    if (!newAccount.password) {
      newErrors.password = t('passwordRequired');
    } else if (newAccount.password.length < 6) {
      newErrors.password = t('passwordTooShort');
    }

    // Name validation
    if (!newAccount.name) {
      newErrors.name = t('nameRequired');
    }

    // SMTP Server validation
    if (!newAccount.smtpServer) {
      newErrors.smtpServer = t('smtpServerRequired');
    }

    // SMTP Port validation
    if (!newAccount.smtpPort) {
      newErrors.smtpPort = t('smtpPortRequired');
    } else if (newAccount.smtpPort < 1 || newAccount.smtpPort > 65535) {
      newErrors.smtpPort = t('invalidSmtpPort');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(newAccount.password, 10);
      const accountToSave = {
        ...newAccount,
        password: hashedPassword
      };

      onSave(accountToSave);
      // Reset form after successful submission
      setNewAccount({
        email: '',
        password: '',
        name: '',
        smtpServer: '',
        smtpPort: 587,
      });
      setErrors({});
      onClose();
    }
  };

  const handleInputChange = (field: keyof Account, value: string | number) => {
    setNewAccount(prev => ({ ...prev, [field]: value }));
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{t('addAccount')}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              ✕
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
            <input
              type="text"
              value={newAccount.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder={t('senderNamePlaceholder')}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('email')}</label>
            <input
              type="email"
              value={newAccount.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('password')}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newAccount.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <FiEyeOff className="h-5 w-5 text-gray-400" /> : <FiEye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('smtpServer')}</label>
            <input
              type="text"
              value={newAccount.smtpServer}
              onChange={(e) => handleInputChange('smtpServer', e.target.value)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.smtpServer ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="smtp.gmail.com"
            />
            {errors.smtpServer && <p className="text-red-500 text-xs mt-1">{errors.smtpServer}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('smtpPort')}</label>
            <input
              type="number"
              value={newAccount.smtpPort}
              onChange={(e) => handleInputChange('smtpPort', Number(e.target.value))}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.smtpPort ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="587"
              min="1"
              max="65535"
            />
            {errors.smtpPort && <p className="text-red-500 text-xs mt-1">{errors.smtpPort}</p>}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {t('addAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
