export const auth = {
  login: {
    title: 'Login',
    fields: {
      username: 'Username',
      password: 'Password', 
      usernamePlaceholder: 'Enter your username',
      passwordPlaceholder: 'Enter your password',
    },
    submit: 'Sign in',
    forgotPassword: 'Forgot password?',
    forgotPasswordHelp: 'Please contact an administrator to reset your password.',
    noAccount: 'Don\'t have an account?',
    register: 'Register',
  },
  register: {
    title: 'Register',
    fields: {
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      usernamePlaceholder: 'Enter your username',
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Enter your password',
      confirmPasswordPlaceholder: 'Confirm your password',
    },
    submit: 'Create account',
    registering: 'Registering...',
    alreadyHaveAccount: 'Already have an account?',
    login: 'Login',
  },
  errors: {
    usernameRequired: 'Username is required',
    passwordRequired: 'Password is required',
    invalidCredentials: 'Invalid username or password',
    usernameValidation: 'Username must be at least 3 characters',
    emailValidation: 'Invalid email',
    passwordValidation: 'Password must be at least 6 characters',
  },
  logout: 'Logout',
  signIn: 'Sign in',
  welcome: 'Welcome, '
} as const;