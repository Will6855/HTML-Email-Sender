export const home = {
  hero: {
    title: 'HTML Email Sender',
    subtitle: 'Personalized Mass Emailing Made Simple',
    description: 'Send personalized HTML emails to your contact list with ease. Perfect for newsletters, marketing campaigns, and customer communications.',
    cta: 'Get Started',
  },

  features: {
    section: {
      title: 'Features',
      mainTitle: 'Everything you need for email campaigns',
    },
    
    items: {
      csv: {
        title: 'CSV Support',
        description: 'Import your contact list from CSV files and manage your recipients easily.',
      },
      templates: {
        title: 'HTML Templates',
        description: 'Create beautiful HTML emails with full styling support and preview functionality.',
      },
      personalization: {
        title: 'Personalization',
        description: 'Use dynamic variables to personalize each email with recipient-specific information.',
      },
      attachments: {
        title: 'File Attachments',
        description: 'Attach multiple files to your emails with easy drag-and-drop functionality.',
      },
    },
  },

  howItWorks: {
    section: {
      title: 'How It Works',
      mainTitle: 'Simple three-step process',
    },
    
    steps: {
      smtp: {
        title: '1. Configure SMTP',
        description: 'Set up your SMTP server details to enable email sending capabilities.',
      },
      contacts: {
        title: '2. Import Contacts',
        description: 'Upload your CSV file containing recipient information and map the email column.',
      },
      send: {
        title: '3. Create & Send',
        description: 'Compose your HTML email, add attachments if needed, and send to your contact list.',
      },
    },
  },
} as const; 