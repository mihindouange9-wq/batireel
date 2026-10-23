/* ───────────── Tous les textes publics de BATIRÉEL (français, Gabon) ─────────────
   Rien n'est affirmé comme acquis : pas de partenaires, pas de professionnels vérifiés, pas de chantiers
   réels, pas de chiffres de marché. Les démonstrations sont fictives et le disent. */

export const SITE = {
  name: "BATIRÉEL",
  tagline: "Le chantier. Sans zone grise.",
  description:
    "BATIRÉEL met en relation particuliers, entreprises et professionnels du bâtiment au Gabon : comparez les devis ligne par ligne, choisissez les bons professionnels et suivez l'avancement de vos travaux en toute transparence.",
  url: import.meta.env.VITE_SITE_URL || "https://batireel.example",
  contact: {
    /* Adresse à renseigner par le client (variable VITE_CONTACT_EMAIL). Vide : le site le dit honnêtement. */
    email: (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) ?? "",
    /* Numéro WhatsApp à renseigner par le client (variable VITE_WHATSAPP : indicatif pays, sans « + » ni espaces,
       par exemple 241XXXXXXXX). Vide : le formulaire propose de copier le message et le dit. */
    whatsapp: (import.meta.env.VITE_WHATSAPP as string | undefined) ?? "",
  },
  legal: {
    noticeStatus: "Mentions légales : à prévoir avant publication.",
    privacyStatus: "Aucune donnée personnelle n'est collectée par ce site. Une politique de confidentialité sera rédigée avec la plateforme.",
  },
} as const;

export const NAV = [
  { label: "Le constat", href: "#constat" },
  { label: "Passeport Chantier", href: "#passeport" },
  { label: "Comparer", href: "#comparer" },
  { label: "Professionnels", href: "#professionnels" },
  { label: "Le terrain", href: "#terrain" },
] as const;

export const NAV_CTA = { label: "Décrire mon projet", court: "Mon projet", href: "#contact" } as const;

export const HERO = {
  title: ["Le chantier.", "Sans zone grise."],
  subtitle: "Comparez les devis. Choisissez les bons professionnels. Suivez l'avancement de vos travaux en toute transparence.",
  primary: { label: "Découvrir BATIRÉEL", href: "#presentation" },
  secondary: { label: "Explorer le concept", href: "#constat" },
  cotes: ["Libreville · 0°23′ N, 9°27′ E", "Feuille 01 · échelle 1:100", "Plateforme en conception"],
  scroll: "Descendre sur le chantier",
} as const;

export const CONSTAT = {
  title: "Trois zones grises, un seul chantier.",
  lead: "Au Gabon comme ailleurs, construire ou rénover revient trop souvent à avancer sans visibilité. BATIRÉEL part de trois situations concrètes, observées sur le terrain, sans les transformer en statistiques.",
  points: [
    {
      title: "Des devis impossibles à comparer",
      text: "Un devis détaille les fournitures, l'autre un forfait, le troisième oublie la toiture. Sans lignes communes, le prix le plus bas cache souvent une prestation en moins.",
      note: "Zone grise n° 1 · le prix",
    },
    {
      title: "Des informations dispersées",
      text: "Références dans un téléphone, photos dans une messagerie, attestations sur papier : rien ne permet de juger un professionnel sur des éléments vérifiables.",
      note: "Zone grise n° 2 · la personne",
    },
    {
      title: "Un avancement sans repères",
      text: "Entre deux visites, le chantier continue sans trace : pas de photos datées, pas de validation d'étape, pas de document rangé au bon endroit.",
      note: "Zone grise n° 3 · l'avancement",
    },
  ],
} as const;

export const PRESENTATION = {
  title: "Une plateforme pour rendre le chantier lisible.",
  lead: "BATIRÉEL réunit sur un même plan ceux qui font construire et ceux qui construisent, et rend lisibles les trois éléments qu'un chantier laisse d'ordinaire dans le flou.",
  strates: [
    { label: "Le prix", title: "Des devis lus ligne par ligne", text: "Matériaux, main-d'œuvre, quantités, délais, prestations incluses : chaque offre est ramenée à une grille commune pour être comparée sans surprise." },
    { label: "La personne", title: "Des profils qui distinguent le déclaré du vérifié", text: "Métier, réalisations, références et documents : ce qui a été contrôlé est marqué comme tel, le reste reste une déclaration." },
    { label: "L'avancement", title: "Un Passeport Chantier daté", text: "Étapes, photographies datées, documents et validations rangés dans une seule chronologie, partagée entre le client et le professionnel." },
  ],
  marquee: "Bâtir avec confiance",
} as const;

export const PASSEPORT = {
  title: "Le Passeport Chantier.",
  lead: "Une chronologie de projet qui rassemble les étapes, les photographies datées, les documents et les validations. Chaque étape se consulte ; rien ne se perd entre deux visites.",
  hint: "Sélectionnez une étape pour afficher ses éléments.",
  demoNote: "Démonstration sur un chantier fictif : dates, documents et validations sont inventés pour illustrer le fonctionnement.",
  labels: { documents: "Documents", validations: "Validations", photo: "Photographie datée" },
} as const;

export const COMPARATEUR = {
  title: "Comparez autrement.",
  lead: "Trois devis pour le même projet, ramenés aux mêmes lignes : matériaux, main-d'œuvre, quantités, délais et prestations incluses. Sélectionnez les offres à comparer ; les écarts s'affichent ligne par ligne.",
  project: "Construction d'une maison R+1 de 140 m², Libreville · projet et devis fictifs",
  hint: "Deux ou trois offres à la fois.",
  columns: { ligne: "Poste", quantite: "Quantité", materiaux: "Matériaux", main: "Main-d'œuvre", delai: "Délai", total: "Total du poste" },
  legend: { min: "Montant le plus bas de la ligne", max: "Montant le plus haut, avec son écart", absent: "Poste non inclus dans l'offre" },
  totalLabel: "Total de l'offre",
  delaiLabel: "Durée annoncée",
  ecartLabel: "Écart avec l'offre complète la plus basse",
  inclusLabel: "Prestations incluses",
} as const;

export const PROS = {
  title: "Des professionnels, des preuves.",
  lead: "Un profil BATIRÉEL présente le métier, les réalisations, les références et les documents. Ce qui a été vérifié est marqué comme tel ; ce qui est simplement déclaré reste une déclaration. Exemples fictifs.",
  legend: { verified: "Vérifié par BATIRÉEL", declared: "Déclaré par le professionnel", missing: "Document non fourni" },
  realisationsLabel: "Réalisations",
  referencesLabel: "Références",
  infosLabel: "Informations",
} as const;

export const ETAPES = {
  title: "Chaque étape sous contrôle.",
  lead: "De la préparation à la livraison, le chantier avance par étapes validées. Faites défiler : la structure se monte, les points de contrôle s'allument.",
  phases: [
    { id: "preparation", label: "Préparation", text: "Implantation, bornage, installation de chantier." },
    { id: "terrassement", label: "Terrassement", text: "Fouilles, plateforme, évacuation des terres." },
    { id: "fondations", label: "Fondations", text: "Semelles, longrines, dallage sur hérisson." },
    { id: "structure", label: "Structure", text: "Poteaux, poutres, planchers, escalier." },
    { id: "enveloppe", label: "Enveloppe", text: "Murs, charpente, couverture, menuiseries." },
    { id: "finitions", label: "Finitions", text: "Réseaux, enduits, revêtements, peinture." },
    { id: "livraison", label: "Livraison", text: "Réception, réserves, remise des clés." },
  ],
} as const;

export const TERRAIN = {
  title: "Pensé pour le terrain.",
  lead: "BATIRÉEL se construit avec les réalités du Gabon : des chantiers de particuliers et de petites entreprises, des professionnels souvent excellents mais peu visibles, des documents qui existent mais ne circulent pas.",
  points: [
    { title: "Libreville et ses environs d'abord", text: "Une première implantation envisagée à Libreville, Akanda, Owendo et Ntoum, là où l'équipe peut suivre les chantiers de près." },
    { title: "Une approche réaliste", text: "Pas de promesse de vérification totale : BATIRÉEL précise toujours ce qui a été contrôlé, par qui et quand." },
    { title: "Des outils qui tiennent sur un téléphone", text: "Photos datées, validations et documents pensés pour un usage sur site, avec une connexion qui n'est pas toujours stable." },
  ],
  reperes: [
    { id: "libreville", label: "Libreville", x: 48, y: 52, main: true },
    { id: "akanda", label: "Akanda", x: 54, y: 28, main: false },
    { id: "owendo", label: "Owendo", x: 58, y: 70, main: false },
    { id: "ntoum", label: "Ntoum", x: 82, y: 56, main: false },
  ],
  disclaimer: "Calendrier, périmètre et offre de services restent à préciser : rien n'est présenté ici comme lancé.",
} as const;

export const REJOINDRE = {
  title: "Entrez sur le chantier.",
  lead: "BATIRÉEL se construit avec ses premiers utilisateurs. Que vous fassiez construire ou que vous construisiez, dites-nous où vous en êtes.",
  particuliers: {
    title: "Particuliers et entreprises",
    text: "Vous préparez des travaux ou un projet de construction et vous voulez comparer, choisir et suivre sans zone grise.",
    action: "Décrire mon projet",
  },
  pros: {
    title: "Professionnels du bâtiment",
    text: "Artisan, entreprise, bureau d'études ou architecte : présentez vos réalisations et vos références de façon vérifiable.",
    action: "Présenter mon activité",
  },
} as const;

export const CONTACT = {
  title: "Décrivez-nous votre projet.",
  lead: "Quelques lignes suffisent : ce que vous voulez construire, où, et où vous en êtes. Le message part de votre WhatsApp vers l'équipe BATIRÉEL ; le site n'enregistre rien.",
  profilLegend: "Vous êtes",
  profils: [
    { id: "particulier", label: "Je fais construire", hint: "Particulier, famille ou entreprise" },
    { id: "pro", label: "Je suis un professionnel", hint: "Artisan, entreprise, bureau d'études, architecte" },
  ],
  champs: {
    nom: { label: "Votre nom", placeholder: "Prénom et nom" },
    commune: { label: "Commune du projet", placeholder: "Libreville, Akanda, Owendo, Ntoum…" },
    type: { label: "Type de projet", options: ["Construction neuve", "Rénovation", "Extension ou surélévation", "Aménagement intérieur", "Clôture, portail ou extérieurs", "Autre"] },
    metier: {
      label: "Votre métier",
      options: ["Maçonnerie et gros œuvre", "Électricité", "Plomberie", "Menuiserie", "Carrelage, peinture et finitions", "Charpente et couverture", "Architecte ou bureau d'études", "Entreprise générale", "Autre"],
    },
    surface: { label: "Surface approximative", optional: "facultatif, en m²", placeholder: "140" },
    stade: { label: "Où en êtes-vous ?", options: ["Une idée, pas encore de terrain", "Le terrain est acquis", "Les plans sont prêts", "J'ai déjà reçu des devis", "Le chantier est en cours"] },
    message: {
      label: "Votre projet, en quelques lignes",
      placeholder: "Ce que vous voulez construire, les délais que vous visez, ce qui vous inquiète…",
      labelPro: "Votre activité, en quelques lignes",
      placeholderPro: "Vos réalisations récentes, votre zone d'intervention, ce que vous attendez de BATIRÉEL…",
    },
  },
  apercu: "Votre message, tel qu'il partira",
  etat: { enCours: "En cours de rédaction", pret: "Prêt à envoyer" },
  envoyer: "Envoyer sur WhatsApp",
  copier: "Copier le message",
  direct: "ou écrivez directement au",
  numeroAbsent: "Le numéro WhatsApp de BATIRÉEL sera ajouté à la publication. En attendant, le message se copie, prêt à envoyer.",
  statut: {
    ouvert: "WhatsApp s'ouvre avec votre message. Si rien ne se passe, copiez-le et envoyez-le depuis votre téléphone.",
    copie: "Message copié",
    copieImpossible: "La copie n'a pas fonctionné : sélectionnez le texte de l'aperçu pour le copier.",
    invalide: "Vérifiez les champs signalés.",
  },
  erreurs: {
    nom: "Indiquez votre nom.",
    commune: "Indiquez la commune du projet.",
    surface: "Indiquez une surface en chiffres, par exemple 140.",
    message: "Décrivez votre projet en quelques mots, vingt caractères au moins.",
  },
  confidentialite: "Aucune donnée n'est enregistrée par ce site : le message est composé ici, puis envoyé depuis votre propre WhatsApp.",
  signature: "Envoyé depuis le site BATIRÉEL",
} as const;

export const FOOTER = {
  mission: "Mettre en relation particuliers, entreprises et professionnels du bâtiment, comparer les devis et suivre les chantiers, au Gabon.",
  demo: "Les devis, chantiers et profils présentés sont des démonstrations fictives ; les photographies proviennent d'une banque d'images.",
  nameNote: "Plateforme en cours de conception.",
  partner: { label: "En collaboration avec", name: "MÉTHODE AURA", note: "Conception et réalisation du site", url: "https://methode-aura.onrender.com" },
} as const;
