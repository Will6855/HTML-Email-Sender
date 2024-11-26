'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import grapesjs from 'grapesjs';
import gjsNewsletter from 'grapesjs-preset-newsletter';
import 'grapesjs/dist/css/grapes.min.css';

interface GrapeJSEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

export interface GrapeJSEditorRef {
  loadTemplate: (html: string) => void;
  getTemplate: () => string;
}

const GrapeJSEditor = forwardRef<GrapeJSEditorRef, GrapeJSEditorProps>(({ initialContent, onChange }, ref) => {
  const editorRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    loadTemplate: (html: string) => {
      if (editorRef.current) {
        try {
          if (html.includes('<!DOCTYPE html>')) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const bodyContent = doc.body.innerHTML;
            const styles = Array.from(doc.querySelectorAll('style')).map(style => style.textContent).join('\n');
            
            editorRef.current.setComponents(bodyContent);
            if (styles) {
              editorRef.current.setStyle(styles);
            }
          } else {
            editorRef.current.setComponents(html);
          }
        } catch (error) {
          console.error('Error loading template:', error);
          editorRef.current.setComponents(html);
        }
      }
    },
    getTemplate: () => {
      if (editorRef.current) {
        try {
          const html = editorRef.current.getHtml();
          const css = editorRef.current.getCss();
          const doctype = '<!DOCTYPE html>';
          const head = '<head><meta charset="utf-8"><style>' + css + '</style></head>';
          return `${doctype}\n<html lang="fr">\n${head}\n<body>${html}</body>\n</html>`;
        } catch (error) {
          console.error('Error getting template:', error);
          return '';
        }
      }
      return '';
    }
  }));

  useEffect(() => {
    if (!editorRef.current) {
      try {
        const editor = grapesjs.init({
          container: '#gjs',
          height: '500px',
          width: 'auto',
          plugins: [gjsNewsletter],
          pluginsOpts: {
            gjsNewsletter: {
              modalTitleImport: 'Import template',
              modalBtnImport: 'Import',
              modalLabelImport: 'Paste your HTML template here',
              importPlaceholder: '<!DOCTYPE html>...',
              cellStyle: {
                'font-size': '12px',
                padding: '10px',
                'text-align': 'center',
                color: '#333'
              },
            }
          },
          storageManager: {
            type: 'none',
          },
          canvas: {
            styles: [
              'https://fonts.googleapis.com/css2?family=Arial:wght@400;700&display=swap'
            ]
          },
          assetManager: {
            custom: true,
            autoAdd: false,
            showUrlInput: true,
            dropzone: false,
            embedAsBase64: false,
            assets: [],
            handleAdd: (url: string) => {
              if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) {
                const imageComponent = editor.DomComponents.addComponent({
                  type: 'image',
                  attributes: { src: url }
                });
                editor.Modal.close();
                return imageComponent;
              } else {
                alert('Please enter a valid image URL (must start with http:// or https://)');
                return null;
              }
            }
          },
          deviceManager: {
            devices: [
              {
                name: 'Desktop',
                width: '900px',
              },
              {
                name: 'Tablet',
                width: '600px',
              },
              {
                name: 'Mobile',
                width: '320px',
              },
            ],
          },
        });

        // Customize image component
        editor.DomComponents.addType('image', {
          model: {
            defaults: {
              traits: [
                {
                  type: 'text',
                  name: 'src',
                  label: 'Image URL',
                  placeholder: 'https://example.com/image.jpg',
                },
                {
                  type: 'text',
                  name: 'alt',
                  label: 'Alt Text'
                }
              ]
            },
            init() {
              this.on('change:attributes:src', this.handleSrcChange);
            },
            handleSrcChange() {
              const src = this.getAttributes().src;
              if (src && typeof src === 'string' && !(src.startsWith('http://') || src.startsWith('https://'))) {
                this.setAttributes({ src: '' });
                alert('Please enter a valid image URL (must start with http:// or https://)');
              }
            }
          }
        });

        // Custom image add command
        editor.Commands.add('open-assets', {
          run: (editor) => {
            const modal = editor.Modal;
            modal.setTitle('Insert Image URL');
            
            const container = document.createElement('div');
            container.style.padding = '20px';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'https://example.com/image.jpg';
            input.style.cssText = 'width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px;';
            
            const button = document.createElement('button');
            button.textContent = 'Add Image';
            button.className = 'gjs-btn-prim';
            button.style.cssText = 'width: 100%; padding: 8px;';
            
            const handleAdd = () => {
              const url = input.value.trim();
              if (url.startsWith('http://') || url.startsWith('https://')) {
                const selected = editor.getSelected();
                if (!selected) {
                  alert('Please select an image frame first');
                  return;
                }

                if (selected.get('type') !== 'image') {
                  alert('Please select an image frame');
                  return;
                }

                selected.set('attributes', { ...selected.get('attributes'), src: url });
                modal.close();
              } else {
                alert('Please enter a valid image URL (must start with http:// or https://)');
              }
            };
            
            button.onclick = handleAdd;
            input.onkeypress = (e) => {
              if (e.key === 'Enter') {
                handleAdd();
              }
            };
            
            container.appendChild(input);
            container.appendChild(button);
            modal.setContent(container);
            modal.open();
            
            // Focus input after modal is shown
            setTimeout(() => input.focus(), 0);
          }
        });

        // Add custom email container block
        editor.BlockManager.add('email-container', {
          label: 'Email Container',
          category: 'Basic',
          content: {
            type: 'email-container',
            components: [
              {
                tagName: 'div',
                classes: ['email-inner'],
                droppable: true,
                style: {
                  'max-width': '600px',
                  'margin': 'auto',
                  'background-color': '#ffffff',
                  'padding': '20px',
                  'border-radius': '8px',
                  'box-shadow': '0 0 10px rgba(0,0,0,0.1)'
                }
              }
            ],
            style: {
              'font-family': 'Arial, sans-serif',
              'line-height': '1.6',
              'color': '#333',
              'background-color': '#f4f4f4',
              'padding': '20px'
            }
          },
          attributes: { class: 'fa fa-square' }
        });

        // Add custom component type for email container
        editor.DomComponents.addType('email-container', {
          model: {
            defaults: {
              droppable: true,
              draggable: true,
              copyable: true,
              removable: true,
              traits: [
                {
                  type: 'color',
                  name: 'containerBgColor',
                  label: 'Container Background',
                  default: '#ffffff'
                },
                {
                  type: 'color',
                  name: 'backgroundColor',
                  label: 'Page Background',
                  default: '#f4f4f4'
                },
                {
                  type: 'number',
                  name: 'containerPadding',
                  label: 'Container Padding',
                  default: 20,
                  min: 0,
                  max: 100,
                  unit: 'px'
                },
                {
                  type: 'number',
                  name: 'pagePadding',
                  label: 'Page Padding',
                  default: 20,
                  min: 0,
                  max: 100,
                  unit: 'px'
                },
                {
                  type: 'number',
                  name: 'maxWidth',
                  label: 'Max Width',
                  default: 600,
                  min: 200,
                  max: 1200,
                  unit: 'px'
                },
                {
                  type: 'number',
                  name: 'borderRadius',
                  label: 'Border Radius',
                  default: 8,
                  min: 0,
                  max: 50,
                  unit: 'px'
                }
              ],
              'script-props': ['containerBgColor', 'backgroundColor', 'containerPadding', 'pagePadding', 'maxWidth', 'borderRadius'],
              script: function() {
                const el = this;
                const updateStyles = () => {
                  const outer = el;
                  const inner = el.querySelector('.email-inner');
                  
                  outer.style.backgroundColor = el.getAttribute('backgroundColor');
                  outer.style.padding = el.getAttribute('pagePadding') + 'px';
                  
                  inner.style.backgroundColor = el.getAttribute('containerBgColor');
                  inner.style.padding = el.getAttribute('containerPadding') + 'px';
                  inner.style.maxWidth = el.getAttribute('maxWidth') + 'px';
                  inner.style.borderRadius = el.getAttribute('borderRadius') + 'px';
                };
                updateStyles();
              }
            }
          }
        });

        // Initialize with content
        editor.on('load', () => {
          try {
            if (initialContent.includes('<!DOCTYPE html>')) {
              const parser = new DOMParser();
              const doc = parser.parseFromString(initialContent, 'text/html');
              const bodyContent = doc.body.innerHTML;
              
              // Clear the editor first
              editor.DomComponents.clear();
              
              // Import the content
              editor.setComponents(bodyContent);
              
              // Get the styles from body
              const bodyStyles = doc.body.getAttribute('style');
              if (bodyStyles) {
                const bodyComponent = editor.DomComponents.getWrapper();
                bodyComponent?.setStyle(bodyStyles as any);
              }
            } else {
              editor.setComponents(initialContent);
            }
          } catch (error) {
            console.error('Error loading content:', error);
            editor.setComponents(initialContent);
          }
        });

        // Listen for changes
        editor.on('change:changesCount', () => {
          try {
            const html = editor.getHtml();
            const css = editor.getCss();
            const doctype = '<!DOCTYPE html>';
            const head = '<head><meta charset="utf-8"><style>' + css + '</style></head>';
            const fullHtml = `${doctype}\n<html lang="fr">\n${head}\n<body>${html}</body>\n</html>`;
            onChange(fullHtml);
          } catch (error) {
            console.error('Error handling changes:', error);
          }
        });

        editorRef.current = editor;
      } catch (error) {
        console.error('Error initializing editor:', error);
      }
    }

    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
        } catch (error) {
          console.error('Error destroying editor:', error);
        }
      }
    };
  }, []);

  return <div id="gjs" />;
});

GrapeJSEditor.displayName = 'GrapeJSEditor';

export default GrapeJSEditor;
