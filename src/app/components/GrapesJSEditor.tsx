'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import grapesjs from 'grapesjs';
import gjsNewsletter from 'grapesjs-preset-newsletter';
import 'grapesjs/dist/css/grapes.min.css';
import { useLanguage } from '@/context/LanguageContext';

const fr = require('grapesjs/locale/fr').default;
const en = require('grapesjs/locale/en').default;

const messages = {
  fr: { 
    ...fr,
    blockManager: {
      ...fr.blockManager,
      categories: {
        ...fr.blockManager.categories,
        'Basic': 'Éléments de base'
      }
    },
    styleManager: {
      ...fr.styleManager,
      properties: {
        ...fr.styleManager.properties,
        'min-height': 'Hauteur minimale',
        'margin-top-sub': 'Haut',
        'margin-right-sub': 'Droite',
        'margin-left-sub': 'Gauche',
        'margin-bottom-sub': 'Bas',
        'padding-top-sub': 'Haut',
        'padding-right-sub': 'Droite',
        'padding-left-sub': 'Gauche',
        'padding-bottom-sub': 'Bas',
        'text-decoration': 'Texte',
        'font-style': 'Style de police',
        'vertical-align': 'Alignement vertical',
        'border-collapse': 'Coller les bordures',
        'border-top-left-radius-sub': 'Supérieur gauche',
        'border-top-right-radius-sub': 'Supérieur droit',
        'border-bottom-right-radius-sub': 'Inférieur droit',
        'border-bottom-left-radius-sub': 'Inférieur gauche',
        'border-width-sub': 'Largeur',
        'border-style-sub': 'Style',
        'border-color-sub': 'Couleur'
      },
      options: {
        'text-align': {
          left: '<i class="fa fa-align-left"></i>',
          center: '<i class="fa fa-align-center"></i>',
          right: '<i class="fa fa-align-right"></i>',
          justify: '<i class="fa fa-align-justify"></i>'
        },
        'vertical-align': {
          baseline: 'Défaut',
          top: 'Haut',
          middle: 'Milieu',
          bottom: 'Bas'
        },
        'border-collapse': {
          separate: 'Non',
          collapse: 'Oui'
        },
        'border-style-sub': {
          none: 'Aucun',
          solid: 'Solide',
          dashed: 'Désoxydé',
          dotted: 'Pointé',
          double: 'Double',
          groove: 'Cannelure',
          ridge: 'Arête',
          inset: 'Enfoncé',
          outset: 'Saufé'
        }
      }
    }
  },
  en: en
}

interface GrapesJSEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

export interface GrapesJSEditorRef {
  loadTemplate: (html: string) => void;
  getTemplate: () => string;
}

const GrapesJSEditor = forwardRef<GrapesJSEditorRef, GrapesJSEditorProps>(({ initialContent, onChange }, ref) => {
  const editorRef = useRef<any>(null);
  const { language } = useLanguage();

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
        console.log(language, messages[language]);
        const editor = grapesjs.init({
          i18n: {
            locale: language,
            localeFallback: 'en',
            messages: {
              [language]: messages[language] || messages['en']
            }
          },
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
            embedAsBase64: true,
            dropzone: true,
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
            }
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

        // Store editor reference
        editorRef.current = editor;

        editor.on('load', () => {
          if (initialContent) {
            try {
              if (initialContent.includes('<!DOCTYPE html>')) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(initialContent, 'text/html');
                const bodyContent = doc.body.innerHTML;
                const styles = Array.from(doc.querySelectorAll('style')).map(style => style.textContent).join('\n');
                
                editor.setComponents(bodyContent);
                if (styles) {
                  editor.setStyle(styles);
                }
              } else {
                editor.setComponents(initialContent);
              }
            } catch (error) {
              console.error('Error loading initial content:', error);
              editor.setComponents(initialContent);
            }
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
  }, [language]); // Add language to dependency array

  return <div id="gjs" />;
});

GrapesJSEditor.displayName = 'GrapeJSEditor';

export default GrapesJSEditor;
