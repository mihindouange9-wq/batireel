# BATIRÉEL — site vitrine

Site d'une seule page qui présente BATIRÉEL, plateforme gabonaise qui met en relation particuliers, entreprises et professionnels du bâtiment, facilite la comparaison des devis et le suivi des chantiers. Direction artistique « Matière & Structure » : papier technique, béton, lignes de plan, cuivre en signature. Le site ne contient pas l'application : les devis, le chantier et les profils présentés sont des démonstrations explicitement fictives.

## Lancer

```
npm install
npm run dev        # http://127.0.0.1:5205
npm run build      # vérification TypeScript puis dist/
npm run preview    # http://127.0.0.1:5206 (sert dist/)
npm run verify     # contrôles automatisés sur la prévisualisation (tools/check.mjs)
```

Node 22 (fichier `.node-version`). Pile : Vite 6, React 19, TypeScript, CSS natif, GSAP (ScrollTrigger), Lenis (défilement à inertie), Three.js avec React Three Fiber (scène du hero, chargée à la demande sur les écrans non tactiles), Lucide, polices Barlow Condensed et Manrope auto-hébergées (fontsource). Aucun backend, aucun service tiers, aucune donnée collectée.

`?nointro` dans l'adresse saute l'introduction (utile pour les tests) ; `?no3d` remplace la scène 3D par le dessin axonométrique ; `?scene` affiche la scène du film de présentation (1920 × 1080), pilotée image par image par `tools/video-render.mjs`. La scène 3D est chargée après le premier rendu, quand le navigateur est libre, et seulement sur les écrans non tactiles.

## Ce que le site contient

- **Introduction** (moins de trois secondes, une fois par session, passable au clic ou à Échap) : des lignes de construction se tracent, deux cotes s'affichent, le monogramme se trace puis se coule, puis le calque s'efface et le hero se met en place.
- **Hero** « Le chantier. Sans zone grise. » : une villa R+1 en 3D réaliste, à l'échelle (dalle, poteaux, murs enduits, dalle haute en porte-à-faux sur la terrasse, étage, toiture-terrasse à acrotère, vitrages, brise-soleil en bois, escalier extérieur, poteau cuivre de la signature), avec textures physiques, soleil à ombres portées, environnement de réflexion et brouillard graphite. Le chantier se monte en huit phases (fondations → finitions, 7,6 s), tient quatre secondes, se démonte dans l'ordre inverse et recommence ; le pointeur incline la scène, le défilement rapproche la caméra. Sur écran tactile, sans WebGL ou en mouvement réduit, un dessin axonométrique tracé au trait remplace la scène (le module 3D n'est alors pas chargé).
- **Le constat** (feuille claire) : les trois zones grises, relevées dans un dessin technique dont les traits se tracent.
- **La présentation** : une coupe du bâtiment en trois strates (le prix, la personne, l'avancement), une photographie qui apparaît derrière son dessin, le texte monumental « Bâtir avec confiance » qui traverse l'écran.
- **Le Passeport Chantier** : chronologie interactive à six étapes (onglets au clic et au clavier) avec photographie datée, documents, validations et anomalie.
- **Comparez autrement** : comparateur de trois devis fictifs, sélection de deux ou trois offres, lignes communes (matériaux, main-d'œuvre, quantités, délais), montant le plus bas et le plus haut marqués avec l'écart, poste absent signalé, totaux, écart avec l'offre complète la moins chère (une offre incomplète n'est jamais « la plus basse »), prestations incluses ; sur téléphone, chaque poste devient une fiche avec les offres côte à côte.
- **Des professionnels, des preuves** : trois profils fictifs qui distinguent le vérifié du déclaré et disent ce qui manque.
- **Chaque étape sous contrôle** : section épinglée où le bâtiment se monte en coupe au rythme du défilement, en sept phases.
- **Pensé pour le terrain** : la vision pour le Gabon et un plan de situation de l'Estuaire.
- **Entrer sur le chantier** : deux entrées (particuliers et entreprises, professionnels) et le point de contact.
- **Pied de page** : les lignes du plan convergent vers le monogramme ; navigation, contacts à compléter, mentions à prévoir, collaboration MÉTHODE AURA.

Chaque section porte un cartouche (numéro de feuille, titre, échelle), comme une feuille d'un dossier de plans.

## Film de présentation

`node tools/video-render.mjs` (la prévisualisation doit tourner) rend « Nadège et Joël construisent », un film de 116 secondes en 1080p et 720p, H.264 + AAC, dans `livrables/` (non versionné) avec son affiche. L'histoire d'un couple fictif qui veut construire à Libreville sans se faire avoir : l'ouverture BATIRÉEL × MÉTHODE AURA, le rêve, la peur (les zones grises), la décision, puis les trois gestes (comparer les devis sur les mêmes lignes, choisir un professionnel sur ses preuves, suivre le chantier avec le Passeport pendant que la villa 3D se monte), les clés, l'appel et la signature du partenaire. La scène (`src/components/Scene.tsx`, `/?scene`) est une ligne de temps GSAP en pause : l'outil place la tête de lecture à chaque image, le chantier 3D reçoit son instant de l'extérieur, puis une seconde page Chrome encode (`video/encodeur.html`, WebCodecs) et compose la bande-son synthétisée à partir des repères publiés par la scène (`window.SON` : accords, pulsation, arpèges, impacts, tampons, montées). `--apercu` produit une planche-contact (`video/apercu.jpg`) sans encoder ; `--sans-mobile` saute le 720p ; `--reprendre` reprend un rendu interrompu en gardant les images déjà capturées. Chrome utilise la carte graphique de la machine ; ne pas recompiler le site pendant le rendu.

## Palette et typographie

Palette imposée par le brief : Noir graphite `#191B19`, Craie minérale `#F0EDE4`, Ocre cuivre `#B86F45`, Vert oxyde `#657568`, Gris pierre `#A5A39A`, Blanc chantier `#FCFBF7`, Rouge contrôle `#B84D3D` (anomalies uniquement). Variables dans `src/styles/tokens.css`. Titres en Barlow Condensed, texte et données en Manrope.

## À renseigner avant publication

| Quoi | Où |
| --- | --- |
| Numéro WhatsApp qui reçoit les messages du formulaire « Décrire mon projet » (bouton « Envoyer sur WhatsApp », lien direct, pied de page) | variable `VITE_WHATSAPP` au déploiement : indicatif pays sans « + » ni espaces, par exemple `241XXXXXXXX`. Tant qu’elle est vide, le formulaire le dit et propose de copier le message |
| Adresse de contact (pied de page) | variable `VITE_CONTACT_EMAIL` au déploiement, ou `src/content/site.ts` |
| Adresse publique du site (canonical, Open Graph, sitemap, robots) | variable `VITE_SITE_URL` |
| Mentions légales et politique de confidentialité | `src/content/site.ts` (`SITE.legal`) |

## Structure

```
index.html              métadonnées, Open Graph, icônes
public/                 favicon.svg, favicon-32.png, apple-touch-icon.png, og-image.png (tools/build-brand.mjs),
                        photos/*.webp (tools/fetch-photos.mjs), textures/*.webp (tools/fetch-textures.mjs),
                        partenaires/ (logo MÉTHODE AURA)
src/content/site.ts     tous les textes publics (français), navigation, contact, formulaire « Décrire mon projet »
src/lib/whatsapp.ts     composition du message et lien wa.me (le site ne stocke rien : le message part du WhatsApp du visiteur)
src/content/demo.ts     données fictives : devis, Passeport Chantier, profils
src/brand/Logo.tsx      logo : le B sculpté (lettre massive en une couleur, bols en coussin, entaille fine, chanfreins de béton) + le mot
src/components/         Intro (introduction), HeroScene (3D), HeroDrawing (dessin), Scene (film), Plan (cartouche, ligne de
                        transition, révélation photographique, texte monumental, annotation)
src/sections/           une section = un composant + sa feuille de style
src/lib/motion.ts       Lenis, révélations (titres, blocs, tracés, filets), grammaire de mouvement
src/styles/             tokens.css (palette, typographie, rythme) et global.css (base, boutons, statuts, cartouche)
tools/                  build-brand.mjs, fetch-photos.mjs, fetch-textures.mjs, check.mjs, shoot.mjs, fullpage.mjs, render-deploy.mjs, video-render.mjs
video/                  encodeur.html (WebCodecs, bande-son), mp4-muxer.js
livrables/              films rendus par tools/video-render.mjs (BATIREEL-film-116s-1080p.mp4, -720p.mp4, affiche), non versionné
docs/                   credits-photos.md, credits-textures.md
render.yaml             blueprint Render prêt, non déployé
PRODUCT.md, DESIGN.md   contexte produit et système de design
```

Textures de la scène 3D : Poly Haven (CC0), téléchargées puis réduites en WebP 768 px par `node tools/fetch-textures.mjs` dans `public/textures/`, crédits dans `docs/credits-textures.md`. Photographies : banque d'images Pexels (licence Pexels, usage libre), téléchargées en plusieurs largeurs (`srcset`) par `node tools/fetch-photos.mjs` ; chantiers et personnes n'ont aucun lien avec BATIRÉEL, crédits dans `docs/credits-photos.md`.

## Vérifications

`npm run verify` : polices, un seul h1, hiérarchie des titres, textes alternatifs, libellés, scène 3D sur ordinateur (dessin et absence du module 3D sur mobile), en-tête compact, Passeport Chantier (clic, flèches, Début), comparateur (sélection, minimum deux offres, écarts et poste absent, offre incomplète jamais donnée « la plus basse », fiches côte à côte sur mobile), ancres et focus, destinations des boutons, aucune erreur console, aucun débordement à 1600, 1280, 768, 390 et 320 px, menu mobile, cibles tactiles, mouvement réduit (rien de masqué, bâtiment montré terminé), focus clavier.

Lighthouse 12 sur le build local, le 23 oct. 2026 (les scores de performance varient de quelques points d'une mesure à l'autre) : ordinateur 77 à 81 / 100 / 100 / 100, mobile 72 à 77 / 100 / 100 / 100 ; détecteur impeccable sans anti-pattern.

## Déploiement

Non effectué. `render.yaml` et `tools/render-deploy.mjs` (`RENDER_API_KEY=rnd_xxx node tools/render-deploy.mjs`) sont prêts ; au moment de déployer, renseigner `VITE_SITE_URL`, `VITE_WHATSAPP` et `VITE_CONTACT_EMAIL`.
