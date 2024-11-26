'use client';

import React, { useState, useEffect } from 'react';

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
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newTemplateName, setNewTemplateName] = useState('');

  useEffect(() => {
    try {
      const savedTemplates = JSON.parse(localStorage.getItem('emailTemplates') || '[]');
      setTemplates(Array.isArray(savedTemplates) ? savedTemplates : []);
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates([]);
    }
  }, []);

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
        console.error('Error saving template:', error);
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
      console.error('Error deleting template:', error);
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
          <h3 className="text-lg font-medium">Email Templates</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={e => { e.preventDefault(); handleSave(e as any); }} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Template name"
            className="flex-1 border rounded px-2 py-1"
          />
          <button
            onClick={handleSave}
            disabled={!newTemplateName.trim()}
            className="bg-blue-500 text-white px-4 py-1 rounded disabled:bg-blue-300"
            type="submit"
          >
            Save
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
                  Load
                </button>
                <button
                  onClick={(e) => handleDelete(template, e)}
                  className="text-red-500 hover:text-red-700"
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {templates.length === 0 && (
            <p className="text-gray-500 text-center py-4">No templates saved yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
