export const admin = {
  title: 'Admin Dashboard',
  passwordReset: {
    generateLink: 'Generate Reset Link',
    selectUser: 'Select User for Password Reset',
    fields: {
      selectUser: 'Select a User',
    },
    link: 'Password Reset Link',
    expiration: 'This link will expire in 1 hour. Share it securely with the user.',
    copy: 'Copy',
    success: 'Password reset link copied successfully',
    errors: {
      failedToLoad: 'Failed to load users',
      noUserSelected: 'Please select a user',
      generateFailed: 'Failed to generate reset link',
    },
  },
  roleManagement: {
    updateRole: 'Update User Role',
    selectUser: 'Please select a user to change their role',
    selectRole: 'Please select a new role',
    fields: {
      selectUser: 'Select a User',
      selectRole: 'Select a New Role',
    },
    errors: {
      noUserOrRoleSelected: 'Please select both a user and a new role',
    },
    success: 'User role updated successfully',
  }
} as const;