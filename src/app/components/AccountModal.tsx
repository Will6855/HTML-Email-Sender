'use client';

import { useState, useEffect } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useTranslation } from '@/hooks/useTranslation';
import { encryptPassword, decryptPassword } from '../api/emailAccounts/route';

interface Account {
  email: string;
  password?: string;
  encryptedPassword: string;
  name: string;
  smtpServer: string;
  smtpPort: number;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Account) => void;
  initialAccount?: Account;
  mode?: 'add' | 'edit';
}

const AccountModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialAccount, 
  mode = 'add' 
}: AccountModalProps) => {
  const [newAccount, setNewAccount] = useState<Account>(initialAccount || {
    email: '',
    password: '',
    encryptedPassword: '',
    name: '',
    smtpServer: '',
    smtpPort: 587,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Account, string>>>({});
  const [password, setPassword] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      const initializeAccount = async () => {
        const accountToSet = initialAccount || {
          email: '',
          encryptedPassword: '',
          name: '',
          smtpServer: '',
          smtpPort: 587,
        };

        if (mode === 'edit' && accountToSet.password) {
          try {
            const decryptedPassword = await decryptPassword(accountToSet.password);
            console.log('Account password:', accountToSet.password);
            console.log('Decrypted password:', decryptedPassword);
            setPassword(decryptedPassword);
          } catch (error) {
            console.error('Failed to decrypt password:', error);
          }
        }
        else {
          setPassword('');
        }

        setNewAccount(accountToSet);
        setErrors({});
      };

      initializeAccount();
    }
  }, [isOpen, initialAccount, mode]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Account, string>> = {};

    if (!newAccount.email) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(newAccount.email)) {
      newErrors.email = t('invalidEmail');
    }

    if (mode === 'add' && (!password || password.length < 6)) {
      newErrors.encryptedPassword = mode === 'add' 
        ? t('passwordRequired') 
        : t('passwordTooShort');
    }

    if (!newAccount.name) {
      newErrors.name = t('nameRequired');
    }

    if (!newAccount.smtpServer) {
      newErrors.smtpServer = t('smtpServerRequired');
    }

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
      const encryptedPassword = await encryptPassword(password);
      const accountToSave = {
        ...newAccount,
        password: encryptedPassword,
      };

      onSave(accountToSave);
      
      setNewAccount({
        email: '',
        password: '',
        encryptedPassword: '',
        name: '',
        smtpServer: '',
        smtpPort: 587,
      });
      setErrors({});
      setPassword('');
      onClose();
    }
  };

  const handleInputChange = (field: keyof Account, value: string | number) => {
    setNewAccount(prev => ({ ...prev, [field]: value }));
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
            <h3 className="text-lg font-medium">{mode === 'add' ? t('addAccount') : t('editAccount')}</h3>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.encryptedPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
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
            {errors.encryptedPassword && <p className="text-red-500 text-xs mt-1">{errors.encryptedPassword}</p>}
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
            {mode === 'add' ? t('addAccount') : t('saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
