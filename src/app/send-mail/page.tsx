'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import SmtpSettingsForm from '../components/SmtpSettingsForm';
import CSVUploader from '../components/CSVUploader';
import CSVTableEditor from '../components/CSVTableEditor';

interface SmtpSettings {
  smtpServer: string;
  port: string;
  email: string;
  password: string;
}

interface FormData extends SmtpSettings {
  senderName: string;
  to: string;
  subject: string;
  htmlContent: string;
  attachments: File[];
}

const Home = () => {
  const [form, setForm] = useState<FormData>({
    smtpServer: '',
    port: '',
    email: '',
    password: '',
    senderName: '',
    to: '',
    subject: '',
    htmlContent: '',
    attachments: [],
  });

  const [csvData, setCsvData] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [emailColumn, setEmailColumn] = useState<string>('');
  const [previewHtml, setPreviewHtml] = useState<string>('');

  useEffect(() => {
    const savedSettings = localStorage.getItem('smtpSettings');
    if (savedSettings) {
      const smtpSettings: SmtpSettings = JSON.parse(savedSettings);
      setForm((prev) => ({ ...prev, ...smtpSettings }));
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'htmlContent') {
      updateEmailPreview(value);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev) => ({ 
        ...prev, 
        attachments: [...prev.attachments, ...Array.from(e.target.files!)]
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

    for (const row of csvData) {
      const email = row[emailColumn];
      if (!email) continue;

      let htmlContent = form.htmlContent;
      Object.keys(row).forEach((key) => {
        htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, 'g'), row[key]);
      });

      const formData = new FormData();
      formData.append('smtpServer', form.smtpServer);
      formData.append('port', form.port);
      formData.append('email', form.email);
      formData.append('password', form.password);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Email Campaign Manager</h1>
          <p className="mt-2 text-sm text-gray-600">Send personalized HTML emails to your contact list</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SMTP Settings Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <span className="mr-2">⚙️</span>
              SMTP Settings
            </h2>
            <SmtpSettingsForm />
          </div>

          {/* CSV Management Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <span className="mr-2">📊</span>
              Contact List Management
            </h2>
            <div className="space-y-6">
              <CSVUploader onDataLoaded={handleCsvDataLoaded} />
              
              {headers.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Email Column
                  </label>
                  <select 
                    value={emailColumn} 
                    onChange={handleEmailColumnChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select column...</option>
                    {headers.map((header) => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
              )}

              <CSVTableEditor data={csvData} onDataChange={handleCsvDataLoaded} />
            </div>
          </div>
        </div>

        {/* Email Content Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <span className="mr-2">✉️</span>
            Email Content
          </h2>
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
              <p className="mt-2 text-sm text-gray-500">
                Use {'{{columnName}}'} to insert personalized data from your CSV file.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Attachments
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span>Add Files</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  {form.attachments.map((file, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100"
                    >
                      {file.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
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
      </div>
    </div>
  );
};

export default Home;