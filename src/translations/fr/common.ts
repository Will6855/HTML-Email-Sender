export const common = {
    actions: {
      save: 'Sauvegarder',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      delete: 'Supprimer',
      edit: 'Modifier',
      add: 'Ajouter',
      load: 'Charger',
      remove: 'Supprimer',
      send: 'Envoyer',
      close: 'Fermer',
    },
    language: {
      english: 'Anglais',
      french: 'Français',
    },
    status: {
      loading: 'Chargement...',
      success: 'Succès',
      error: 'Erreur',
      sending: 'Envoi en cours...',
    },
    errors: {
      unexpectedError: 'Une erreur inattendue s\'est produite',
    },
    units: {
      bytes: 'Octets',
      kb: 'Ko',
      mb: 'Mo',
      gb: 'Go',
    }
  } as const; 