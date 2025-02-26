import { error } from "console";

const general = {
  title: 'Email Campaign Manager',
  description: 'Send personalized HTML emails to your contact list',
} as const;

const accounts = {
  title: 'Email Accounts', 
  noAccounts: 'No accounts available',
  confirmRemoveAccount: 'Are you sure you want to remove the account',
  modal: {
    titleAddAccount: 'Add Account',
    titleEditAccount: 'Edit Account',
    fields: {
      name: 'Name',
      email: 'Email',
      password: 'Password',
      smtpServer: 'SMTP Server',
      smtpPort: 'SMTP Port',
      namePlaceholder: 'John Smith',
      emailPlaceholder: 'john.smith@example.com',
      passwordPlaceholder: '********',
      smtpServerPlaceholder: 'smtp.gmail.com',
      smtpPortPlaceholder: '587',
    },
    submitAddAccount: 'Add',
    submitEditAccount: 'Edit',
    successAddAccount: 'Account added successfully',
    successEditAccount: 'Account edited successfully',
  },
  errors: {
    failedToLoadAccounts: 'Failed to load accounts',
    failedToAddAccount: 'Failed to add account',
    failedToEditAccount: 'Failed to edit account',
    failedToDeleteAccount: 'Failed to delete account',
    emailRequired: 'Email required',
    smtpServerRequired: 'SMTP server required',
    smtpPortRequired: 'SMTP port required',
    smtpPortInvalid: 'Invalid SMTP port',
    passwordRequired: 'Password required',
    passwordTooShort: 'Password too short',
    nameRequired: 'Name required',
    invalidEmail: 'Invalid email',
  },
} as const;

const form = {
  title: 'Create Email',
  senderName: 'Sender Name',
  senderNamePlaceholder: 'John Smith',
  subject: 'Subject Line',
  subjectPlaceholder: 'Your email subject',
  content: 'Email Content',
  personalizationTip: 'Tip: Use {{columnName}} to insert custom data from your CSV file.',
  attachments: 'Attachments',
  errors: {
    demoRoleCannotSendEmails: 'Users with DEMO role cannot send emails',
    noAccount: 'Please select an account',
    noCsvData: 'No CSV data loaded',
    selectEmailColumnError: 'Please select an email column',
  },
  actions: {
    sending: 'Sending...',
    sendEmails: 'Send Emails',
  },
} as const;

const csv = {
  title: 'CSV Management',
  import: 'Import CSV',
  export: 'Export CSV',
  advancedFilters: 'Advanced Filters',
  filters: {
    contains: 'Contains',
    equals: 'Equals',
    startsWith: 'Starts with',
    endsWith: 'Ends with',
    greaterThan: 'Greater than',
    lessThan: 'Less than',
    filterValuePlaceholder: 'Filter value',
    addFilterRule: 'Add filter rule',
    resetFilters: 'Reset filters',
    applyFilters: 'Apply filters',
  },
  emailColumnLabel: 'Email column',
  addRow: 'Add',
  removeRow: 'Remove',
  noRows: 'No rows available',
  addColumn: 'Add',
  removeColumn: 'Remove',
} as const;

const templates = {
  title: 'Manage Templates',
  templateNamePlaceholder: 'Template name',
  noTemplatesSaved: 'No templates available',
  errors: {
    errorSavingTemplate: 'Failed to save template. Please try again.'
  }
} as const;

const filedropzone = {
  dragAndDrop: 'Drop files here...',
  dropFiles: 'Drag and drop files here or click to select',
  // attachments: 'Attachments',
} as const;

const sending = {
  progress: {
    preparing: 'Preparing to send...',
    sending: 'Sending emails...',
    complete: 'Sending complete!',
  },
  status: {
    success: 'All emails sent successfully! {0} emails sent.',
    partial: '{0} emails sent successfully, {1} failed',
  },
} as const;

// Group all translations
export const emailCampaign = {
  ...general,
  accounts,
  form,
  csv,
  templates,
  filedropzone,
  sending,
} as const;