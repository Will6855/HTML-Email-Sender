export const profile = {
  joined: 'Inscrit le',
  emailAccounts: 'Comptes Email',
  noEmailAccountsFound: 'Aucun compte email trouvé',
  accountManagement: 'Gestion du compte',
  changePassword: {
    title: 'Changer le mot de passe',
    success: 'Mot de passe changé avec succès',
    fields: {
      currentPassword: 'Mot de passe actuel',
      newPassword: 'Nouveau mot de passe',
      confirmPassword: 'Confirmer le nouveau mot de passe',
      currentPasswordPlaceholder: 'Entrez votre mot de passe actuel',
      newPasswordPlaceholder: 'Entrez votre nouveau mot de passe',
      confirmPasswordPlaceholder: 'Confirmez votre nouveau mot de passe',
    },
    errors: {
      mismatch: 'Les mots de passe ne correspondent pas',
    },
    submit: 'Changer le mot de passe',
    backToProfile: 'Retour au profil',
  },
  changeEmail: {
    title: 'Changer l\'email',
    fields: {
      newEmail: 'Nouvelle adresse email',
      newEmailPlaceholder: 'Entrez votre nouvelle adresse email',
      currentPassword: 'Mot de passe actuel',
      currentPasswordPlaceholder: 'Entrez votre mot de passe actuel',
    },
    submit: 'Changer l\'email',
    success: 'Email changé avec succès',
    backToProfile: 'Retour au profil',
  },
  deleteAccount: {
    title: 'Supprimer le compte',
    warning: 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
    confirm: 'Confirmer la suppression',
    cancel: 'Annuler',
  }
} as const; 