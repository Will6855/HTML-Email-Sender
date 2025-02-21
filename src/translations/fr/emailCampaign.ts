const general = {
  title: 'Gestionnaire de Campagne Email',
  description: 'Envoyez des emails HTML personnalisés à votre liste de contacts',
} as const;

const accounts = {
  title: 'Comptes Email',
  noAccounts: 'Aucun compte disponible',
  confirmRemoveAccount: 'Êtes-vous sûr de vouloir supprimer le compte',
  modal: {
    titleAddAccount: 'Ajouter un Compte',
    titleEditAccount: 'Modifier le Compte',
    fields: {
      name: 'Nom',
      email: 'Email',
      password: 'Mot de passe',
      smtpServer: 'Serveur SMTP',
      smtpPort: 'Port SMTP',
      namePlaceholder: 'Jean Dupont',
      emailPlaceholder: 'jean.dupont@example.com',
      passwordPlaceholder: '********',
      smtpServerPlaceholder: 'smtp.gmail.com',
      smtpPortPlaceholder: '587',
    },
    submitAddAccount: 'Ajouter',
    submitEditAccount: 'Modifier',
    successAddAccount: 'Compte ajouté avec succès',
    successEditAccount: 'Compte modifié avec succès',
  },
  errors: {
    failedToLoadAccounts: 'Impossible de charger les comptes',
    failedToAddAccount: 'Impossible d\'ajouter le compte',
    failedToEditAccount: 'Impossible de modifier le compte',
    failedToDeleteAccount: 'Impossible de supprimer le compte',
    emailRequired: 'Email requis',
    smtpServerRequired: 'Serveur SMTP requis',
    smtpPortRequired: 'Port SMTP requis',
    smtpPortInvalid: 'Port SMTP invalide',
    passwordRequired: 'Mot de passe requis',
    passwordTooShort: 'Mot de passe trop court',
    nameRequired: 'Nom requis',
    invalidEmail: 'Email invalide',
  },
} as const;

const form = {
  title: 'Création de l\'email',
  senderName: 'Nom de l\'expéditeur',
  senderNamePlaceholder: 'Jean Dupont',
  subject: 'Ligne d\'objet',
  subjectPlaceholder: 'Votre sujet d\'email',
  content: 'Contenu de l\'email',
  personalizationTip: 'Astuce : Utilisez {{nomColonne}} pour insérer des données personnalisées de votre fichier CSV.',
  attachments: 'Pièces jointes',
  errors: {
    demoRoleCannotSendEmails: 'Les utilisateurs avec le rôle DEMO ne peuvent pas envoyer des emails',
    noAccount: 'Veuillez sélectionner un compte',
    noCsvData: 'Aucune donnée CSV chargée',
    selectEmailColumnError: 'Veuillez sélectionner une colonne email',
  },
  actions: {
    sending: 'Envoi en cours...',
    sendEmails: 'Envoyer les emails',
  },
} as const;

const csv = {
  title: 'Gestion CSV',
  import: 'Importer CSV',
  export: 'Exporter CSV',
  advancedFilters: 'Filtres Avancés',
  filters: {
    contains: 'Contient',
    equals: 'Égal à',
    startsWith: 'Commence par',
    endsWith: 'Finit par',
    greaterThan: 'Plus grand que',
    lessThan: 'Plus petit que',
    filterValuePlaceholder: 'Valeur du filtre',
    addFilterRule: 'Ajouter une règle de filtre',
    resetFilters: 'Réinitialiser les filtres',
    applyFilters: 'Appliquer les filtres',
  },
  emailColumnLabel: 'Colonne email',
  addRow: 'Ajouter',
  removeRow: 'Supprimer',
  noRows: 'Aucune ligne disponible',
  addColumn: 'Ajouter',
  removeColumn: 'Supprimer',
} as const;

const templates = {
  title: 'Gérer les modèles',
  templateNamePlaceholder: 'Nom du modèle',
  noTemplatesSaved: 'Aucun modèle disponible',
} as const;

const filedropzone = {
  dragAndDrop: 'Déposez les fichiers ici...',
  dropFiles: 'Glissez et déposez les fichiers ici ou cliquez pour sélectionner',
  // attachments: 'Pièces jointes',
} as const;

const sending = {
  progress: {
    preparing: 'Préparation de l\'envoi...',
    sending: 'Envoi des emails...',
    complete: 'Envoi terminé !',
  },
  status: {
    success: 'Tous les emails ont été envoyés avec succès ! {0} emails envoyés.',
    partial: '{0} emails envoyés avec succès, {1} échoués',
  },
} as const;

// Group all translations
export const emailCampaign = {
  ...general,
  accounts,
  form,
  csv,
  templates,
  filedropzone,
  sending,
} as const; 