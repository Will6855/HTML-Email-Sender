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
    <div className="container mx-auto px-4 py-8">
      
      <div className="flex gap-8">
        <section className="flex-none lg:w-1/3 mb-8">
          <h2 className="text-2xl font-semibold mb-4">SMTP Settings</h2>
          <SmtpSettingsForm />
        </section>

        <section className="w-full mb-8">
          <h2 className="text-2xl font-semibold mb-4">CSV Upload and Management</h2>
          <CSVUploader onDataLoaded={handleCsvDataLoaded} />
          <CSVTableEditor data={csvData} onDataChange={handleCsvDataLoaded} />
          <div>
            <label>Email Column</label>
            {headers.length > 0 && (
              <select 
                value={emailColumn} 
                onChange={handleEmailColumnChange}
                className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            )}
          </div>
        </section>
      </div>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Email Content</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label htmlFor="senderName" className="block text-sm font-medium text-gray-700">Sender Name</label>
            <input 
              type="text" 
              id="senderName" 
              name="senderName" 
              value={form.senderName}  // Added senderName input
              onChange={handleChange} 
              required 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input 
              type="text" 
              id="subject" 
              name="subject" 
              value={form.subject} 
              onChange={handleChange} 
              required 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="htmlContent" className="block text-sm font-medium text-gray-700">HTML Content</label>
            <textarea 
              id="htmlContent" 
              name="htmlContent" 
              value={form.htmlContent} 
              onChange={handleChange} 
              rows={10} 
              required 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Use {{column_name}} to insert dynamic data"
            />
          </div>
          <div>
            <label htmlFor="attachments" className="block text-sm font-medium text-gray-700">Attachments</label>
            <input 
              type="file" 
              id="attachments" 
              onChange={handleFileChange} 
              multiple 
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
            {form.attachments.length > 0 && (
              <ul className="mt-2 space-y-2">
                {form.attachments.map((file, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{file.name}</span>
                    <button 
                      onClick={() => handleRemoveAttachment(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button 
            type="button" 
            onClick={handleSendEmails}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Send Emails
          </button>
        </form>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Email Preview</h2>
        <div
          dangerouslySetInnerHTML={{ __html: previewHtml }}
          className="border border-gray-300 p-4 rounded-md"
        />
      </section>
    </div>
  );
};

export default Home;