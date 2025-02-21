export const admin = {
  title: 'Tableau de bord Admin',
  passwordReset: {
    generateLink: 'Générer un lien de réinitialisation',
    selectUser: 'Sélectionner un utilisateur pour la réinitialisation du mot de passe',
    fields: {
      selectUser: 'Sélectionner un utilisateur',
    },
    link: 'Lien de réinitialisation du mot de passe',
    expiration: 'Ce lien expirera dans 1 heure. Partagez-le de manière sécurisée avec l\'utilisateur.',
    copy: 'Copier',
    success: 'Lien de réinitialisation du mot de passe copié avec succès',
    errors: {
      failedToLoad: 'Impossible de charger les utilisateurs',
      noUserSelected: 'Veuillez sélectionner un utilisateur',
      generateFailed: 'Échec de la génération du lien de réinitialisation',
    },
  },
  roleManagement: {
    updateRole: 'Mettre à jour le rôle de l\'utilisateur',
    selectUser: 'Veuillez sélectionner un utilisateur pour changer son rôle',
    selectRole: 'Veuillez sélectionner un nouveau rôle',
    fields: {
      selectUser: 'Sélectionner un utilisateur',
      selectRole: 'Sélectionner un nouveau rôle',
    },
    errors: {
      noUserOrRoleSelected: 'Veuillez sélectionner un utilisateur et un nouveau rôle',
    },
    success: 'Rôle de l\'utilisateur mis à jour avec succès',
  }
} as const; 