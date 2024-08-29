'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

interface SmtpSettings {
  smtpServer: string;
  port: string;
  email: string;
  password: string;
}

const SmtpSettingsForm = () => {
  const [settings, setSettings] = useState<SmtpSettings>({
    smtpServer: '',
    port: '',
    email: '',
    password: '',
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('smtpSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  // Save settings to localStorage
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem('smtpSettings', JSON.stringify(settings));
    alert('SMTP settings saved successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-fit">
        <label className="mb-2 flex justify-between items-center">
            SMTP Server:
            <input
            type="text"
            name="smtpServer"
            className="rounded-md border-0 ml-5 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={settings.smtpServer}
            onChange={handleChange}
            required
            />
        </label>

        <label className="mb-2 flex justify-between items-center">
            Port:
            <input
            type="number"
            name="port"
            className="rounded-md border-0 ml-auto p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={settings.port}
            onChange={handleChange}
            required
            />
        </label>

        <label className="mb-2 flex justify-between items-center">
            Email:
            <input
            type="email"
            name="email"
            className="rounded-md border-0 ml-auto p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={settings.email}
            onChange={handleChange}
            required
            />
        </label>

        <label className="mb-2 flex justify-between items-center">
            Password:
            <input
            type="password"
            name="password"
            className="rounded-md border-0 ml-auto p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={settings.password}
            onChange={handleChange}
            required
            />
        </label>

        <button
            type="submit"
            className="items-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            Save SMTP Settings
        </button>
        </form>
  );
};

export default SmtpSettingsForm;
