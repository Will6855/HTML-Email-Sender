export const resetPassword = {
  title: 'Réinitialiser le mot de passe',
  fields: {
    password: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    submit: 'Réinitialiser',
  }, 
  status: {
    success: 'Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
    error: 'Une erreur s\'est produite lors de la réinitialisation du mot de passe. Veuillez réessayer.',
    resetting: 'Réinitialisation du mot de passe...',
  },
  validation: {
    passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',
  },
  errors: {
    invalidToken: 'Jeton de réinitialisation invalide ou expiré',
  },
} as const; 