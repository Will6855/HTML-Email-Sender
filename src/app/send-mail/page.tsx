"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, ChangeEvent, useEffect, useRef, useCallback } from 'react';
import AccountManagement from '../components/AccountManagement';
import CSVTableEditor from '../components/CSVTableEditor';
import TemplateModal from '../components/TemplateModal';
import NotificationModal from '../components/NotificationModal';
import FileDropZone from '../components/FileDropZone';
import GrapeJSEditor, { GrapeJSEditorRef } from '../components/GrapeJSEditor';
import { useTranslation } from '@/hooks/useTranslation';

interface Account {
  email: string;
  password: string;
  name: string;
  smtpServer: string;
  smtpPort: number;
}

interface FormData {
  selectedAccount: Account | null;
  senderName: string;
  to: string;
  subject: string;
  htmlContent: string;
  attachments: File[];
}

interface Notification {
  type: 'success' | 'error';
  message: string;
}

export default function SendMailPage() {
  const { t } = useTranslation();
  
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    }
  });

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin inline-block w-16 h-16 border-[4px] border-current border-t-transparent text-indigo-600 rounded-full" role="status">
            <span className="sr-only">{t('loading')}</span>
          </div>
          <p className="mt-4 text-lg text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <Home />
  );
}

const Home = () => {
  const { t } = useTranslation();
  const { status, data: session } = useSession();
  const [form, setForm] = useState<FormData>({
    selectedAccount: null,
    senderName: '',
    to: '',
    subject: '',
    htmlContent: '',
    attachments: [],
  });

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [csvData, setCsvData] = useState<Record<string, string>[]>([{ email: '' }]);
  const [headers, setHeaders] = useState<string[]>(['email']);
  const [emailColumn, setEmailColumn] = useState<string>('email');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [templates, setTemplates] = useState<{ 
    name: string; 
    content: string;
    subject: string;
    senderName: string;
  }[]>([]);
  const editorRef = useRef<GrapeJSEditorRef>(null);

  const loadTemplates = useCallback(async () => {
    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const loadedTemplates = await response.json();
        setTemplates(loadedTemplates);
      } else {
        console.error('Error loading templates:', await response.text());
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleSelectAccount = (account: Account | null) => {
    setSelectedAccount(account);
    setForm((prev) => ({ ...prev, selectedAccount: account }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilesDrop = (files: File[]) => {
    setForm((prev) => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...files],
    }));
  };

  const handleFileRemove = (index: number) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleCsvDataLoaded = (data: Record<string, string>[]) => {
    setCsvData(data);
    const newHeaders = Object.keys(data[0] || {});
    setHeaders(newHeaders);
    if (!emailColumn || !newHeaders.includes(emailColumn)) {
      setEmailColumn(newHeaders[0] || '');
    }
  };

  const handleSendEmails = async () => {
    if (!emailColumn) {
      setNotification({ type: 'error', message: t('selectEmailColumn') });
      setShowNotificationModal(true);
      return;
    }

    if (!form.selectedAccount) {
      setNotification({ type: 'error', message: t('selectAccount') });
      setShowNotificationModal(true);
      return;
    }

    setIsLoading(true);
    setNotification(null);
    let successCount = 0;
    let errorCount = 0;

    for (const row of csvData) {
      const email = row[emailColumn];
      if (!email) continue;

      let htmlContent = form.htmlContent;
      Object.keys(row).forEach((key) => {
        htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, 'g'), row[key]);
      });

      const formData = new FormData();
      formData.append('email', form.selectedAccount.email);
      formData.append('password', form.selectedAccount.password);
      formData.append('smtpServer', form.selectedAccount.smtpServer);
      formData.append('smtpPort', form.selectedAccount.smtpPort.toString());
      formData.append('senderName', form.senderName);
      formData.append('to', email);
      formData.append('subject', form.subject);
      formData.append('htmlContent', htmlContent);
      form.attachments.forEach((file) => {
        formData.append('attachments', file);
      });

      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to send email');
        }
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`Error sending email to ${email}:`, error);
      }
    }

    setIsLoading(false);
    if (errorCount === 0) {
      setNotification({ type: 'success', message: t('emailSendSuccess') });
    } else {
      setNotification({ type: 'error', message: `${successCount} emails sent successfully, ${errorCount} failed.` });
    }
    setShowNotificationModal(true);
  };

  const handleLoadTemplate = (content: string, subject?: string, senderName?: string) => {
    if (editorRef.current) {
      editorRef.current.loadTemplate(content);
    }
    setForm((prev) => ({ 
      ...prev, 
      htmlContent: content, 
      subject: subject || '', 
      senderName: senderName || '' 
    }));
  };

  const handleSaveTemplate = async (name: string, content: string) => {
    try {
      let senderName = form.senderName || '';
      let subject = form.subject || '';

      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          content,
          senderName,
          subject
        }),
      });

      if (response.ok) {
        await loadTemplates(); // Refresh templates after saving
        setIsTemplateModalOpen(false);
      } else {
        const errorData = await response.json();
        console.error('Error saving template:', errorData);
      }
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleDeleteTemplate = async (name: string) => {
    if (status !== 'authenticated' || !session?.user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const response = await fetch(`/api/templates?name=${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadTemplates(); // Refresh templates after deleting
      } else {
        const errorData = await response.json();
        console.error('Error deleting template:', errorData);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('emailCampaignManager')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('emailCampaignDescription')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Management Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <AccountManagement 
              userId={session?.user?.id || ''}
              selectedAccount={selectedAccount}
              onSelectAccount={handleSelectAccount}
              accounts={accounts}
              onAccountsChange={setAccounts}
            />
          </div>

          {/* CSV Management Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <CSVTableEditor 
              data={csvData} 
              headers={headers}
              onDataChange={handleCsvDataLoaded}
              emailColumn={emailColumn}
              onEmailColumnChange={(value) => setEmailColumn(value)}
            />
          </div>
        </div>

        {/* Email Content Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              <span className="mr-2">✉️</span>
              {t('emailContent')}
            </h2>
            <div className="space-x-2">
              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                {t('manageTemplates')}
              </button>
            </div>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="senderName" className="block text-sm font-medium text-gray-700">
                  {t('senderName')}
                </label>
                <input
                  type="text"
                  id="senderName"
                  name="senderName"
                  value={form.senderName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder={t('senderNamePlaceholder')}
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  {t('subjectLine')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder={t('subjectPlaceholder')}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t('emailContent')}
              </label>
              <div className="border rounded-lg overflow-hidden">
                <GrapeJSEditor
                  ref={editorRef}
                  initialContent={form.htmlContent}
                  onChange={(content) => {
                    setForm((prev) => ({
                      ...prev,
                      htmlContent: content,
                    }));
                  }}
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                💡 {t('personalizationTip')}
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('attachments')}
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <FileDropZone
                  onFilesDrop={handleFilesDrop}
                  files={form.attachments}
                  onFileRemove={handleFileRemove}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleSendEmails}
                disabled={isLoading}
                className={`px-6 py-3 rounded-md text-white font-medium ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('sending')}
                  </span>
                ) : t('sendEmails')}
              </button>
            </div>
          </form>
        </div>

        {/* Template Modal */}
        {isTemplateModalOpen && (
          <TemplateModal
            onClose={() => setIsTemplateModalOpen(false)}
            onLoadTemplate={handleLoadTemplate}
            onSaveTemplate={handleSaveTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            currentTemplate={form.htmlContent}
            templates={templates}
          />
        )}

        {/* Notification Modal */}
        {notification && (
          <NotificationModal
            isOpen={showNotificationModal}
            onClose={() => setShowNotificationModal(false)}
            type={notification.type}
            message={notification.message}
          />
        )}
      </div>
    </div>
  );
};