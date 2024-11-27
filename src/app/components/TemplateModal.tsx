'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface Template {
  name: string;
  content: string;
}

interface TemplateModalProps {
  onClose: () => void;
  onLoadTemplate: (content: string) => void;
  onSaveTemplate: (name: string, content: string) => void;
  currentTemplate: string;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  onClose,
  onLoadTemplate,
  onSaveTemplate,
  currentTemplate
}) => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newTemplateName, setNewTemplateName] = useState('');

  useEffect(() => {
    try {
      const savedTemplates = JSON.parse(localStorage.getItem('emailTemplates') || '[]');
      setTemplates(Array.isArray(savedTemplates) ? savedTemplates : []);
    } catch (error) {
      console.error(t('errorLoadingTemplates'), error);
      setTemplates([]);
    }
  }, [t]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newTemplateName.trim()) {
      try {
        // Let parent handle the actual saving
        onSaveTemplate(newTemplateName.trim(), currentTemplate);
        
        // Update local state
        const newTemplate = { name: newTemplateName.trim(), content: currentTemplate };
        setTemplates(prev => [...prev, newTemplate]);
        
        // Reset and close
        setNewTemplateName('');
        onClose();
      } catch (error) {
        console.error(t('errorSavingTemplate'), error);
      }
    }
  };

  const handleLoad = (template: Template, e: React.MouseEvent) => {
    e.preventDefault();
    onLoadTemplate(template.content);
    onClose();
  };

  const handleDelete = (templateToDelete: Template, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const updatedTemplates = templates.filter(t => t.name !== templateToDelete.name);
      localStorage.setItem('emailTemplates', JSON.stringify(updatedTemplates));
      setTemplates(updatedTemplates);
    } catch (error) {
      console.error(t('errorDeletingTemplate'), error);
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
        className="bg-white rounded-lg p-6 w-96 max-h-[80vh] flex flex-col"
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

        <form onSubmit={e => { e.preventDefault(); handleSave(e as any); }} className="flex gap-3 mb-4">
          <input
            type="text"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('templateName')}
            className="w-[65%] border rounded px-2 py-1"
          />
          <button
            onClick={handleSave}
            disabled={!newTemplateName.trim()}
            className="w-[35%] bg-blue-500 text-white px-4 py-1 rounded disabled:bg-blue-300 whitespace-nowrap"
            type="submit"
          >
            {t('save')}
          </button>
        </form>

        <div className="flex-1 overflow-y-auto">
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
