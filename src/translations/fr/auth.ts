export const auth = {
  login: {
    title: 'Connexion',
    fields: {
      username: 'Nom d\'utilisateur',
      password: 'Mot de passe',
      usernamePlaceholder: 'Entrez votre nom d\'utilisateur',
      passwordPlaceholder: 'Entrez votre mot de passe',
    },
    submit: 'Se connecter',
    forgotPassword: 'Mot de passe oublié ?',
    forgotPasswordHelp: 'Veuillez contacter l\'administrateur pour réinitialiser votre mot de passe.',
    noAccount: 'Pas de compte ?',
    register: 'S\'inscrire',
  },
  register: {
    title: 'Inscription',
    fields: {
      username: 'Nom d\'utilisateur',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      usernamePlaceholder: 'Entrez votre nom d\'utilisateur',
      emailPlaceholder: 'Entrez votre email',
      passwordPlaceholder: 'Entrez votre mot de passe',
      confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
    },
    submit: 'Créer un compte',
    registering: 'Inscription en cours...',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    login: 'Se connecter',
  },
  errors: {
    usernameRequired: 'Le nom d\'utilisateur est requis',
    passwordRequired: 'Le mot de passe est requis',
    invalidCredentials: 'Nom d\'utilisateur ou mot de passe invalide',
    usernameValidation: 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
    emailValidation: 'L\'email est invalide',
    passwordValidation: 'Le mot de passe doit contenir au moins 6 caractères',
  },
  logout: 'Déconnexion',
  signIn: 'Se connecter',
  welcome: 'Bienvenue, '
} as const; 