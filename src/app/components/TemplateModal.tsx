'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface Template {
  name: string;
  content: string;
  subject: string;
  senderName: string;
}

interface TemplateModalProps {
  onClose: () => void;
  onLoadTemplate: (content: string, subject?: string, senderName?: string) => void;
  onSaveTemplate: (name: string, content: string) => void;
  onDeleteTemplate?: (name: string) => void;
  currentTemplate: string;
  templates?: Template[];
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  onClose,
  onLoadTemplate,
  onSaveTemplate,
  onDeleteTemplate,
  currentTemplate,
  templates = []
}) => {
  const { t } = useTranslation();
  const [newTemplateName, setNewTemplateName] = useState('');

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newTemplateName.trim()) {
      try {
        onSaveTemplate(newTemplateName.trim(), currentTemplate);
        setNewTemplateName('');
        onClose();
      } catch (error) {
        console.error(t('errorSavingTemplate'), error);
      }
    }
  };

  const handleLoad = (template: Template, e: React.MouseEvent) => {
    e.preventDefault();
    onLoadTemplate(template.content, template.subject, template.senderName);
    onClose();
  };

  const handleDelete = (templateToDelete: Template, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteTemplate) {
      onDeleteTemplate(templateToDelete.name);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTemplateName.trim()) {
      handleSave(e as any);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{t('emailTemplates')}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            type="button"
            aria-label={t('close')}
          >
            ✕
          </button>
        </div>

        <div className="flex mb-4 space-x-2">
          <input 
            type="text" 
            placeholder={t('templateName')}
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="p-2 border rounded"
          />
          <button 
            onClick={handleSave}
            disabled={!newTemplateName.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 flex-shrink-0"
            type="submit"
          >
            {t('save')}
          </button>
        </div>

        <div className="overflow-y-auto">
        {templates.map((template) => (
            <div
              key={template.name}
              className="border-b p-3 flex justify-between items-center hover:bg-gray-50"
            >
              <span className="flex-1">{template.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={(e) => handleLoad(template, e)}
                  className="text-blue-500 hover:text-blue-700"
                  type="button"
                >
                  {t('load')}
                </button>
                <button
                  onClick={(e) => handleDelete(template, e)}
                  className="text-red-500 hover:text-red-700"
                  type="button"
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}
          {templates.length === 0 && (
            <p className="text-gray-500 text-center py-4">{t('noTemplatesSaved')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
