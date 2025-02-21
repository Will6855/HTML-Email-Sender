export const home = {
  hero: {
    title: 'HTML Email Sender',
    subtitle: 'Envoi en Masse Personnalisé Simplifié',
    description: 'Envoyez facilement des emails HTML personnalisés à votre liste de contacts. Parfait pour les newsletters, les campagnes marketing et les communications clients.',
    cta: 'Commencer',
  },

  features: {
    section: {
      title: 'Fonctionnalités',
      mainTitle: 'Tout ce dont vous avez besoin pour vos campagnes email',
    },
    
    items: {
      csv: {
        title: 'Support CSV',
        description: 'Importez votre liste de contacts depuis des fichiers CSV et gérez vos destinataires facilement.',
      },
      templates: {
        title: 'Templates HTML',
        description: 'Créez de beaux emails HTML avec support complet du style et fonctionnalité de prévisualisation.',
      },
      personalization: {
        title: 'Personnalisation',
        description: 'Utilisez des variables dynamiques pour personnaliser chaque email avec les informations du destinataire.',
      },
      attachments: {
        title: 'Pièces Jointes',
        description: 'Joignez plusieurs fichiers à vos emails avec une fonctionnalité glisser-déposer simple.',
      },
    },
  },

  howItWorks: {
    section: {
      title: 'Comment ça marche',
      mainTitle: 'Processus en trois étapes simple',
    },
    
    steps: {
      smtp: {
        title: '1. Configurer SMTP',
        description: 'Configurez les détails de votre serveur SMTP pour activer les capacités d\'envoi d\'emails.',
      },
      contacts: {
        title: '2. Importer les Contacts',
        description: 'Téléchargez votre fichier CSV contenant les informations des destinataires et mappez la colonne email.',
      },
      send: {
        title: '3. Créer & Envoyer',
        description: 'Composez votre email HTML, ajoutez des pièces jointes si nécessaire, et envoyez à votre liste de contacts.',
      },
    },
  },
} as const; 