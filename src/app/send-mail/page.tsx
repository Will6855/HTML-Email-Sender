'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import AccountManagement from '../components/AccountManagement';
import CSVTableEditor from '../components/CSVTableEditor';
import TemplateModal from '../components/TemplateModal';
import FileDropZone from '../components/FileDropZone';

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

const Home = () => {
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
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  useEffect(() => {
    const savedAccounts = localStorage.getItem('emailAccounts');
    if (savedAccounts) {
      const parsedAccounts = JSON.parse(savedAccounts);
      setAccounts(parsedAccounts);
      if (parsedAccounts.length > 0 && !selectedAccount) {
        handleSelectAccount(parsedAccounts[0]);
      }
    }
  }, []);

  const handleSelectAccount = (account: Account | null) => {
    setSelectedAccount(account);
    setForm((prev) => ({ ...prev, selectedAccount: account }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'htmlContent') {
      updateEmailPreview(value);
    }
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(e.target.files!)],
      }));
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
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

  const handleEmailColumnChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setEmailColumn(e.target.value);
  };

  const handleSendEmails = async () => {
    if (!emailColumn) {
      alert('Please select an email column.');
      return;
    }

    if (!form.selectedAccount) {
      alert('Please select an account.');
      return;
    }

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
      } catch (error) {
        alert(`Failed to send email to ${email}: ${(error as Error).message}`);
        return;
      }
    }

    alert('All emails sent successfully!');
  };

  const updateEmailPreview = (htmlContent: string) => {
    if (!csvData.length || !emailColumn) return;

    const previewData = csvData[0];
    let previewHtml = htmlContent;
    Object.keys(previewData).forEach((key) => {
      previewHtml = previewHtml.replace(new RegExp(`{{${key}}}`, 'g'), previewData[key]);
    });

    setPreviewHtml(previewHtml);
  };

  const handleSaveTemplate = (templateName: string) => {
    const template = {
      subject: form.subject,
      htmlContent: form.htmlContent,
      senderName: form.senderName,
    };
    const templates = JSON.parse(localStorage.getItem('emailTemplates') || '{}');
    templates[templateName] = template;
    localStorage.setItem('emailTemplates', JSON.stringify(templates));
  };

  const handleLoadTemplate = (template: { subject: string; htmlContent: string; senderName: string }) => {
    setForm((prev) => ({
      ...prev,
      subject: template.subject,
      htmlContent: template.htmlContent,
      senderName: template.senderName,
    }));
    updateEmailPreview(template.htmlContent);
  };

  const handleDeleteTemplate = (templateName: string) => {
    const templates = JSON.parse(localStorage.getItem('emailTemplates') || '{}');
    delete templates[templateName];
    localStorage.setItem('emailTemplates', JSON.stringify(templates));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Email Campaign Manager</h1>
          <p className="mt-2 text-sm text-gray-600">Send personalized HTML emails to your contact list</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Management Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <AccountManagement 
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
              Email Content
            </h2>
            <div className="space-x-2">
              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Manage Templates
              </button>
            </div>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="senderName" className="block text-sm font-medium text-gray-700">
                  Sender Name
                </label>
                <input
                  type="text"
                  id="senderName"
                  name="senderName"
                  value={form.senderName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject Line
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Your email subject"
                />
              </div>
            </div>

            <div>
              <label htmlFor="htmlContent" className="block text-sm font-medium text-gray-700">
                HTML Content
              </label>
              <div className="mt-1">
                <textarea
                  id="htmlContent"
                  name="htmlContent"
                  rows={8}
                  value={form.htmlContent}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter your HTML email content here."
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                💡 Tip: Use {'{{columnName}}'} to insert personalized data from your CSV file.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Attachments
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <FileDropZone
                  onFilesDrop={handleFilesDrop}
                  files={form.attachments}
                  onFileRemove={handleFileRemove}
                />
              </div>
            </div>

            {previewHtml && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Preview</h3>
                <div
                  className="p-4 border rounded-md bg-white"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSendEmails}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send Emails
              </button>
            </div>
          </form>
        </div>

        {/* Template Modal */}
        <TemplateModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          onSelect={handleLoadTemplate}
          onDelete={handleDeleteTemplate}
          onSave={handleSaveTemplate}
          currentTemplate={{
            subject: form.subject,
            htmlContent: form.htmlContent,
            senderName: form.senderName,
          }}
        />
      </div>
    </div>
  );
};

export default Home;