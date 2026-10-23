# Product

<!-- impeccable:product-schema 1 -->

Contexte produit déduit du brief BATIRÉEL collé dans la conversation du 23 octobre 2026 (directeur artistique digital, site vitrine immersif, référence d'exécution riseof.digital). Aucun entretien n'a eu lieu : le client attend une réalisation directe. Les faits marqués **[hypothèse]** n'ont pas été confirmés.

## Platform

web

## Stack

delegated : Vite 6 + React 19 + TypeScript, CSS natif (variables, grilles), GSAP + ScrollTrigger pour la narration au défilement, Lenis pour l'inertie, Three.js avec React Three Fiber pour la scène 3D du hero (chargée à la demande sur les écrans non tactiles, remplacée par une illustration SVG sur mobile, sans WebGL ou en mouvement réduit), Lucide pour les icônes, polices auto-hébergées par fontsource (Barlow Condensed pour les titres, Manrope pour le texte). Chaîne de contrôle reprise des sites TALORA, LOCAGAB et PAVEN du même client (captures, contrôles automatisés, déploiement statique Render préparé).

## Users

- **Particuliers** qui font construire ou rénover au Gabon (Libreville et environs d'abord) : ils veulent comparer des devis qu'ils ne savent pas lire, choisir un professionnel sans réseau et savoir où en est leur chantier.
- **Entreprises et maîtres d'ouvrage** (petites structures, commerces, promoteurs) qui pilotent plusieurs lots et ont besoin de preuves datées.
- **Professionnels du bâtiment** (artisans, entreprises de BTP, bureaux d'études, architectes) qui veulent présenter leurs réalisations et leurs références de façon vérifiable et recevoir des demandes qualifiées.
- Visiteurs secondaires : partenaires et investisseurs curieux du projet.

## Product Purpose

Le site présente BATIRÉEL, plateforme gabonaise qui modernise le BTP en mettant en relation particuliers, entreprises et professionnels, en facilitant la comparaison des devis et le suivi des chantiers. Il doit convaincre par une direction artistique singulière et des démonstrations réellement manipulables (comparateur de devis, Passeport Chantier). Succès : le visiteur comprend la promesse en quelques secondes, manipule une démonstration, et veut rejoindre la plateforme (particulier ou professionnel).

## Positioning

« Le chantier. Sans zone grise. » BATIRÉEL rend lisibles trois choses que le BTP laisse d'ordinaire dans le flou : le prix (devis comparés ligne par ligne : matériaux, main-d'œuvre, quantités, délais, prestations incluses), la personne (profils de professionnels distinguant le déclaré du vérifié) et l'avancement (Passeport Chantier : étapes, photographies datées, documents, validations). Première implantation envisagée à Libreville et ses environs.

Sous-titre : « Comparez les devis. Choisissez les bons professionnels. Suivez l'avancement de vos travaux en toute transparence. »

## Operating Context

- Communication en français, adaptée au marché gabonais (francs CFA, Libreville, Akanda, Owendo, Ntoum).
- Site d'une seule page, narration continue en dix temps : hero ; le constat ; la présentation ; le Passeport Chantier ; « Comparez autrement » ; « Des professionnels, des preuves » ; « Chaque étape sous contrôle » ; « Pensé pour le terrain » ; appel à l'action ; pied de page.
- Données de démonstration explicitement fictives (devis, chantiers, profils) ; aucune statistique, aucun partenaire, aucun professionnel vérifié, aucun chantier réel, aucun témoignage tant qu'ils ne sont pas fournis.
- Contact à compléter par le client (`VITE_CONTACT_EMAIL`), mentions légales à prévoir ; aucun faux lien.
- Déploiement non demandé : `render.yaml` et outil prêts, mise en ligne sur décision du client.

## Capabilities and Constraints

- Deux démonstrations réellement fonctionnelles : le comparateur de devis (sélection d'offres fictives, lignes de coûts, différences de prix et de prestations) et le Passeport Chantier (chronologie interactive, étapes avec informations associées).
- Motion comme langage : accélérations contrôlées, ralentissements, sensation de masse ; chaque animation révèle une structure, montre une transformation, guide l'attention ou confirme une interaction. Introduction brève, non bloquante, désactivable. Hero 3D sobre et architectural, influencé par le pointeur et le défilement, jamais « jeu vidéo ». Plans vectoriels tracés. Titres révélés ligne par ligne. Un texte monumental horizontal au plus. Révélations d'images par masques géométriques et passage dessin → photographie. Transitions de sections par lignes et panneaux. Micro-interactions immédiates au clavier, au toucher et au pointeur ; aucun curseur personnalisé bloquant. En-tête transparent puis minéral et compact. Fin de page : structure qui se referme.
- Interdits : apparence de modèle SaaS, sections répétitives, cartes arrondies partout, dégradés violets ou bleus, blobs, glassmorphism gratuit, animations typiques des sites générés automatiquement, animations de lettres excessives, parallaxe indépendante sur chaque élément, plus d'une ou deux sections épinglées.
- Performance et accessibilité : rapide, responsive (ordinateur, tablette, smartphone), ressources lourdes à la demande, `transform`/`opacity` seulement, alternative sans WebGL, `prefers-reduced-motion` respecté (état final lisible, sans parallaxe), navigation clavier, contrastes AA, aucun contenu essentiel masqué par une animation ; scènes 3D simplifiées et parallaxe réduite sur mobile.
- UX/UI : grille cohérente, marges généreuses, système d'espacement, états des boutons et des formulaires, compositions variées (plein écran, éditorial, visualisation technique, grand visuel, démonstration d'interface), jamais la répétition image à gauche / texte à droite.

## Brand Commitments

- Nom : BATIRÉEL (accent sur le É).
- Univers « Matière & Structure » : cabinet d'architecture contemporain, bureau d'études techniques et studio digital expérimental ; précision, solidité, transparence, maîtrise. Signature propre fondée sur l'architecture, les matériaux, les plans techniques et la transformation d'un chantier ; les principes d'exécution de riseof.digital (profondeur, narration par le défilement, transitions, compositions spatiales) sans son identité, ses textes ni ses compositions.
- Palette imposée : Noir graphite `#191B19` (structure, grands aplats) ; Craie minérale `#F0EDE4` (clair principal) ; Ocre cuivre `#B86F45` (signature, chaleur) ; Vert oxyde `#657568` (secondaire, ponctuel) ; Gris pierre `#A5A39A` (soutien, séparateurs, annotations) ; Blanc chantier `#FCFBF7` (lisibilité) ; Rouge contrôle `#B84D3D` (fonctionnel : alertes, anomalies, statuts, jamais décoratif). Hiérarchie stricte : graphite et craie dominent, le cuivre signe, l'oxyde ponctue.
- Typographie : Barlow Condensed (titres, capitales puissantes, compositions éditoriales) + Manrope (texte, données, interface) ; très grands titres, lignes courtes, chiffres techniques, microtextes espacés, légendes de plans, annotations.
- Hero : « LE CHANTIER. SANS ZONE GRISE. » en mise en page asymétrique, sous-titre de la proposition de valeur, deux actions « Découvrir BATIRÉEL » et « Explorer le concept », volume architectural traité comme un objet de direction artistique.
- Logo à créer **[non fourni]** : un B bâti (lettre massive aux contre-formes carrées, la fenêtre basse en cuivre) et le mot BATIRÉEL en Barlow Condensed.
- Photographies de chantier authentiques et pertinentes (banque d'images sous licence libre, crédits conservés) **[hypothèse : aucune photo fournie]**.
