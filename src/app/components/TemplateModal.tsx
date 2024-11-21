'use client';

import React from 'react';

interface Template {
  subject: string;
  htmlContent: string;
  senderName: string;
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
  onDelete: (templateName: string) => void;
  onSave: (templateName: string, template: Template) => void;
  currentTemplate: Template;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  onDelete,
  onSave,
  currentTemplate
}) => {
  const [templates, setTemplates] = React.useState<Record<string, Template>>({});
  const [newTemplateName, setNewTemplateName] = React.useState('');
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTemplates(JSON.parse(localStorage.getItem('emailTemplates') || '{}'));
      setSelectedTemplate(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Templates</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTemplateName}
            onChange={e => setNewTemplateName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && newTemplateName) {
                onSave(newTemplateName, currentTemplate);
                setTemplates(prev => ({ ...prev, [newTemplateName]: currentTemplate }));
                setNewTemplateName('');
              }
            }}
            placeholder="Template name"
            className="flex-1 px-3 py-2 border rounded"
          />
          {newTemplateName && (
            <button
              onClick={() => {
                onSave(newTemplateName, currentTemplate);
                setTemplates(prev => ({ ...prev, [newTemplateName]: currentTemplate }));
                setNewTemplateName('');
              }}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          )}
        </div>

        <div className="overflow-y-auto flex-1 mb-4">
          {Object.entries(templates).map(([name, template]) => (
            <div 
              key={name} 
              className={`border rounded mb-2 p-3 cursor-pointer ${
                selectedTemplate === name ? 'border-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedTemplate(name)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{name}</div>
                  <div className="text-sm text-gray-500 truncate">{template.subject}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this template?')) {
                      onDelete(name);
                      setTemplates(prev => {
                        const newTemplates = { ...prev };
                        delete newTemplates[name];
                        return newTemplates;
                      });
                      if (selectedTemplate === name) {
                        setSelectedTemplate(null);
                      }
                    }
                  }}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {Object.keys(templates).length === 0 && (
            <div className="text-gray-500 text-center py-4">No templates saved</div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600"
          >
            Cancel
          </button>
          {selectedTemplate && (
            <button
              onClick={() => {
                onSelect(templates[selectedTemplate]);
                onClose();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Load Template
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
