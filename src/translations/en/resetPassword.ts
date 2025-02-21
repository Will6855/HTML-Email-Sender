export const resetPassword = {
  title: 'Reset Password',
  fields: {
    password: 'New Password',
    confirmPassword: 'Confirm Password', 
    submit: 'Reset',
  },
  status: {
    success: 'Password reset successfully! You can now login with your new password.',
    error: 'An error occurred while resetting the password. Please try again.',
    resetting: 'Resetting password...',
  },
  validation: {
    passwordsDoNotMatch: 'Passwords do not match',
  },
  errors: {
    invalidToken: 'Invalid or expired reset token',
  },
} as const;