export const profile = {
  joined: 'Joined on',
  emailAccounts: 'Email Accounts',
  noEmailAccountsFound: 'No email accounts found',
  accountManagement: 'Account Management',
  changePassword: {
    title: 'Change Password',
    success: 'Password changed successfully',
    fields: {
      currentPassword: 'Current Password',
      newPassword: 'New Password', 
      confirmPassword: 'Confirm New Password',
      currentPasswordPlaceholder: 'Enter your current password',
      newPasswordPlaceholder: 'Enter your new password',
      confirmPasswordPlaceholder: 'Confirm your new password',
    },
    errors: {
      mismatch: 'Passwords do not match',
    },
    submit: 'Change Password',
    backToProfile: 'Back to Profile',
  },
  changeEmail: {
    title: 'Change Email',
    fields: {
      newEmail: 'New Email Address',
      newEmailPlaceholder: 'Enter your new email address',
      currentPassword: 'Current Password',
      currentPasswordPlaceholder: 'Enter your current password',
    },
    submit: 'Change Email',
    success: 'Email changed successfully',
    backToProfile: 'Back to Profile',
  },
  deleteAccount: {
    title: 'Delete Account',
    warning: 'Are you sure you want to delete your account? This action cannot be undone.',
    confirm: 'Confirm Deletion',
    cancel: 'Cancel',
  }
} as const;