---
name: BATIRÉEL
description: Site vitrine d'une page, univers « Matière & Structure » — papier technique, graphite, lignes de plan, cuivre en signature.
colors:
  graphite: "#191b19"
  graphite-deep: "#121412"
  graphite-2: "#222523"
  graphite-3: "#2d312e"
  craie: "#f0ede4"
  craie-2: "#e7e3d7"
  craie-3: "#ddd8c9"
  blanc-chantier: "#fcfbf7"
  cuivre: "#b86f45"
  cuivre-deep: "#9a5a36"
  cuivre-light: "#d08c62"
  oxyde: "#657568"
  oxyde-deep: "#4f5d52"
  oxyde-light: "#8d9c8f"
  pierre: "#a5a39a"
  pierre-deep: "#7e7c74"
  controle: "#b84d3d"
  controle-deep: "#9b3f31"
  encre: "#1c1e1c"
  encre-2: "#4a4d49"
  encre-3: "#6a6d68"
  on-dark: "#fcfbf7"
  on-dark-2: "#cdcabf"
  on-dark-3: "#a5a39a"
  line-dark: "rgb(252 251 247 / 0.14)"
  line-dark-strong: "rgb(252 251 247 / 0.3)"
  line-light: "rgb(25 27 25 / 0.16)"
  line-light-strong: "rgb(25 27 25 / 0.36)"
  grid-dark: "rgb(252 251 247 / 0.16)"
  grid-light: "rgb(25 27 25 / 0.18)"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "clamp(3.75rem, 11vw, 10rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.01em"
  monumental:
    fontFamily: "Barlow Condensed, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "clamp(5rem, 14vw, 14rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "clamp(2.75rem, 6.2vw, 5.75rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "clamp(1.625rem, 2.8vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.005em"
  title-compact:
    fontFamily: "Barlow Condensed, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "normal"
  button:
    fontFamily: "Barlow Condensed, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.04em"
  lead:
    fontFamily: "Manrope Variable, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(1.125rem, 1.4vw, 1.375rem)"
    fontWeight: 450
    lineHeight: 1.5
  body:
    fontFamily: "Manrope Variable, Segoe UI, Roboto, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 450
    lineHeight: 1.6
  small:
    fontFamily: "Manrope Variable, Segoe UI, Roboto, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 600
    lineHeight: 1.5
  cote:
    fontFamily: "Manrope Variable, Segoe UI, Roboto, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.16em"
  label:
    fontFamily: "Manrope Variable, Segoe UI, Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.14em"
rounded:
  none: "0"
  dot: "50%"
spacing:
  space-1: "8px"
  space-2: "16px"
  space-3: "24px"
  space-4: "40px"
  space-5: "64px"
  space-6: "96px"
  gutter: "clamp(20px, 4.5vw, 64px)"
  section-y: "clamp(96px, 12vw, 184px)"
  container: "1360px"
  header-h: "76px"
components:
  button-primary:
    backgroundColor: "{colors.cuivre}"
    textColor: "{colors.graphite-deep}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 26px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.cuivre-light}"
    textColor: "{colors.graphite-deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 26px"
    height: "56px"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark}"
  button-dark:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.blanc-chantier}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 26px"
    height: "56px"
  button-dark-hover:
    backgroundColor: "{colors.graphite-3}"
    textColor: "{colors.blanc-chantier}"
  button-header:
    backgroundColor: "{colors.cuivre}"
    textColor: "{colors.graphite-deep}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "46px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark-2}"
    typography: "{typography.small}"
    padding: "10px 0"
  nav-link-hover:
    textColor: "{colors.on-dark}"
  statut:
    backgroundColor: "transparent"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "5px 10px"
  statut-ok:
    textColor: "{colors.oxyde-light}"
  statut-attente:
    textColor: "{colors.pierre}"
  statut-alerte:
    textColor: "{colors.controle}"
  statut-declare:
    textColor: "{colors.on-dark-2}"
  cartouche:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark-3}"
    typography: "{typography.label}"
    padding: "14px 0 0"
  cote:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark-3}"
    typography: "{typography.cote}"
  pick:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark-2}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 18px 0 14px"
    height: "52px"
  pick-on:
    backgroundColor: "rgb(184 111 69 / 0.1)"
    textColor: "{colors.on-dark}"
  sheet-passeport:
    backgroundColor: "{colors.blanc-chantier}"
    textColor: "{colors.encre}"
    rounded: "{rounded.none}"
    padding: "clamp(24px, 3vw, 40px)"
  stamp:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.blanc-chantier}"
    typography: "{typography.small}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
  alerte:
    backgroundColor: "transparent"
    textColor: "{colors.controle-deep}"
    typography: "{typography.small}"
    rounded: "{rounded.none}"
    padding: "14px 16px"
  skip-link:
    backgroundColor: "{colors.cuivre}"
    textColor: "{colors.graphite}"
    padding: "12px 18px"
---

# Design System: BATIRÉEL

Système relevé sur le site livré (`src/styles/tokens.css`, `src/styles/global.css`, `src/lib/motion.ts`, `src/brand/`, `src/components/`, `src/sections/`). Les jetons du bloc d'en-tête sont normatifs ; la prose explique où et pourquoi ils servent. Le fichier `.impeccable/design.json` porte ce que l'en-tête ne peut pas contenir (ombres, mouvement, points de rupture, extraits de composants).

## Overview

**Creative North Star: "Le dossier de plans"**

Le site est un dossier de plans que l'on feuillette en défilant. Chaque section est une feuille : un cartouche la numérote (01 / 10, titre, échelle), un filet se trace pour passer à la suivante, les feuilles claires (craie) se posent en biais sur le fond graphite comme des calques coupés au cutter. La matière vient des aplats : graphite pour la structure, craie pour le papier technique, blanc chantier pour la feuille active ; le cuivre est la seule chaleur, réservé à ce qui signe (accent du É, point du repère, numéros, rail d'avancement, action principale). L'oxyde ponctue le « vérifié », la pierre soutient (annotations, séparateurs), le rouge contrôle n'apparaît que sur une anomalie.

Densité éditoriale : titres condensés très grands, colonnes de texte courtes (44 à 62 ch), grilles asymétriques 7/5, 6/5, 5/7, 4/8 qui changent d'une feuille à l'autre, et beaucoup d'air entre les feuilles (96 à 184 px). Aucun arrondi, aucune carte flottante : les blocs sont délimités par des filets d'un pixel, les listes par des traits, les statuts par un cadre au trait. Le dessin technique précède la matière : les plans SVG se tracent, puis la photographie apparaît derrière son dessin.

Le mouvement a de la masse et de la précision : `power4.out` sur 1,1 s par défaut, les titres montent mot à mot derrière leur masque, les filets s'étirent, les traits se tracent, rien ne rebondit, rien n'anime une largeur ou une hauteur. Rejets confirmés par la livraison : aspect de gabarit SaaS, cartes arrondies, dégradés bleus ou violets, blobs, verre dépoli décoratif, parallaxe par élément, plus d'une section épinglée.

**Key Characteristics:**
- Feuilles de plan : cartouche numéroté, filet de transition tracé, découpe en biais (`clip-path`) entre craie et graphite.
- Deux tons seulement (`data-tone="light"` sur craie, `dark` sur graphite) ; chaque composant a ses deux encres.
- Cuivre = signature, jamais surface : accents, repères, numéros, rail, un seul bouton plein par vue.
- Barlow Condensed en capitales serrées pour tout ce qui titre et numérote ; Manrope pour le texte, les données et les annotations espacées.
- Trait d'abord, matière ensuite : dessins SVG tracés (`data-draw`), photographie révélée derrière son plan.
- Aucun rayon (hors points ronds de repère), aucune ombre portée nette, aucun dégradé coloré ; la profondeur vient des aplats et des filets.

## Colors

Graphite et craie dominent, le cuivre signe, l'oxyde ponctue, la pierre annote, le rouge contrôle se tait sauf anomalie.

### Primary
- **Ocre cuivre** (`cuivre`) : la signature. Bouton principal (`.btn--primary`), point central du repère, accent du É, rail rempli du Passeport, trait de rappel des notes de marge, sélection de texte, caret. Le site n'en met jamais un aplat plus large qu'un bouton.
- **Cuivre clair** (`cuivre-light`) : le cuivre sur graphite quand il doit rester lisible en petit : numéros de cartouche, repères du hero, soulignement des liens de navigation, survol du bouton principal, ligne convergente du pied de page.
- **Cuivre profond** (`cuivre-deep`) : le même rôle sur craie (numéros de cartouche et d'étapes, grand chiffre du Passeport, anneau de focus en ton clair).

### Secondary
- **Vert oxyde** (`oxyde`, `oxyde-light` sur graphite, `oxyde-deep` sur craie) : ce qui est vérifié ou le plus bas : statut `ok`, montant minimal du comparateur, légende correspondante. Ponctuel, jamais décoratif.

### Tertiary
- **Rouge contrôle** (`controle`, `controle-deep` pour le texte sur craie) : l'anomalie et rien d'autre. Statut `alerte`, repère d'étape en alerte, encadré d'anomalie du Passeport, poste absent du comparateur (fond `rgb(184 77 61 / 0.08)`), zone signalée du dessin du constat.

### Neutral
- **Noir graphite** (`graphite`, `graphite-deep`, `graphite-2`, `graphite-3`) : fond du site et des feuilles sombres ; `graphite-deep` pour l'introduction, le pied de page et le texte sur cuivre ; `graphite-2` pour le fond d'attente des photographies ; `graphite-3` pour le survol du bouton sombre.
- **Craie minérale** (`craie`, `craie-2`, `craie-3`) : les feuilles claires (`[data-tone="light"]`) ; `craie-2` sur la seconde ligne du titre du hero ; `craie-3` pour le fond d'attente des photographies sur feuille claire.
- **Blanc chantier** (`blanc-chantier`) : la feuille active posée sur la craie (fiche d'étape du Passeport, plan de situation), le texte sur graphite, le tracé du logo sur fond sombre.
- **Gris pierre** (`pierre`, `pierre-deep`) : statut `attente`, barre de défilement.
- **Encres sur craie** (`encre`, `encre-2`, `encre-3`) : texte principal, texte secondaire (introductions, paragraphes), annotations.
- **Blancs sur graphite** (`on-dark`, `on-dark-2`, `on-dark-3`) : mêmes trois niveaux sur fond sombre ; `on-dark-3` est la pierre.
- **Filets et trames** (`line-*`, `grid-*`) : séparateurs à 1 px (faible pour les listes, fort pour les bords de bloc) et trame de points du papier (`.sheet`, pas de 36 px, point de 1,2 px) posée sur un grain de béton très discret (`public/grain-dark.svg` et `grain-light.svg`, bruit SVG en tuile de 240 px, alpha ≤ 0,15).

### Named Rules
**La règle du rouge muet.** Le rouge contrôle n'existe que pour une anomalie, un poste absent ou un statut d'alerte. Aucun titre, aucun bouton, aucun ornement ne le porte.
**La règle des deux encres.** Chaque composant déclare sa couleur sur graphite et sa couleur sous `[data-tone="light"]` ; aucune couleur de texte n'est posée en dur dans une section sans sa contrepartie.
**La règle de la signature.** Le cuivre signe (accent, point, numéro, rail, une action principale) ; il ne remplit jamais une surface plus grande qu'un bouton ni un dégradé visible au-delà d'un halo à 8–12 % d'opacité.

## Typography

**Display Font:** Barlow Condensed (graisses 600, 700, 800 auto-hébergées ; repli Arial Narrow, Roboto Condensed)
**Body Font:** Manrope Variable (repli Segoe UI, Roboto)

**Character :** des capitales condensées, lourdes, serrées, qui tiennent sur une ou deux lignes comme un titre de feuille ; en dessous, un texte à chasse large et chiffres tabulaires qui lit comme une notice technique. Tout ce qui est titre, numéro, onglet ou bouton est en Barlow Condensed capitales ; tout ce qui est texte, donnée ou annotation est en Manrope.

### Hierarchy
- **Display** (800, `clamp(3.75rem, 11vw, 10rem)`, 0.92) : le h1 du hero, deux lignes, la seconde décalée (`clamp(0, 6vw, 110px)`) et en craie-2.
- **Monumental** (800, `clamp(5rem, 14vw, 14rem)`, 0.9) : le texte qui traverse l'écran (`Marquee`), une seule fois dans la page, entre deux filets, en craie sur graphite.
- **Headline** (700, `clamp(2.75rem, 6.2vw, 5.75rem)`, 0.92) : le h2 de chaque feuille, révélé mot à mot (`data-title`).
- **Title** (700, `clamp(1.625rem, 2.8vw, 2.5rem)`, 0.98) : les h3 ; les sections les resserrent souvent à `clamp(1.5rem, 2.4vw, 2.1rem)`.
- **Title compact** (700, 1.5rem, 1) : onglets du Passeport, libellés des étapes, en-têtes de colonnes et totaux du comparateur, numéro de cartouche.
- **Button** (700, 1.25rem, 0.04em, capitales) : boutons, sélecteurs d'offres, libellés de phase.
- **Lead** (450, `clamp(1.125rem, 1.4vw, 1.375rem)`, 1.5, 44 ch max) : l'introduction sous chaque h2.
- **Body** (450, 1.0625rem, 1.6, 46 à 62 ch) : paragraphes ; `strong` à 700.
- **Small** (0.9rem, souvent 600) : lignes de listes, dates, notes, pied de page. C'est la taille la plus utilisée après le corps.
- **Cote** (600, 0.8125rem, 0.16em, capitales, Manrope) : l'annotation de plan, précédée d'un trait de 22 px (`.cote`) ou nue (`.cote--plain`). Posée à côté, en légende ou en tête de liste.
- **Label** (600 ou 700, 0.75rem, 0.12–0.14em, capitales) : cartouche, statuts, étiquettes de tampon, en-têtes de postes.

### Named Rules
**La règle des capitales condensées.** Tout titre, numéro, onglet et bouton est en Barlow Condensed capitales, interlettrage négatif ou nul (−0.01em à 0.04em). Manrope ne titre jamais ; Barlow ne compose jamais un paragraphe.
**La règle de la cote.** Le microtexte espacé est une annotation de plan (référence, lieu, métier, légende, en-tête de liste), jamais un surtitre éditorial posé au-dessus d'un h2.
**La règle des chiffres tabulaires.** `font-variant-numeric: tabular-nums` est actif sur le corps ; montants, dates et numéros s'alignent.

## Layout

Le conteneur mesure `min(1360px, 100% − 2 × gouttière)`, gouttière `clamp(20px, 4.5vw, 64px)`. Chaque section de `main` prend `clamp(96px, 12vw, 184px)` de marge verticale ; l'en-tête fixe mesure 76 px (transparent, puis graphite à 88 % avec flou de 14 px dès 32 px de défilement).

Grilles asymétriques, jamais identiques deux feuilles de suite : en-tête de feuille 7/5 (titre à gauche, introduction alignée en bas à droite), corps 6/6 avec dessin collant (constat), 6/5 (coupe), 4/8 (chronologie / fiche), 5/7 (fiche pro, étapes), 5/6 (plan / vision), 1/1 (deux entrées), pied de page 5/3/4. Les écarts internes des grilles sont fluides (`clamp(32px, 5vw, 80px)` à `clamp(40px, 6vw, 112px)`).

Les feuilles claires se découpent en biais sur le graphite : `--cut: clamp(26px, 3.2vw, 60px)`, marge négative égale, `clip-path: polygon(…)` qui alterne le sens de la coupe (haut-gauche vers haut-droit, puis l'inverse). Le hero occupe `100svh`, la section « Chaque étape » aussi (épinglée). Une ligne de transition (`PlanDivider`, 48 px) peut séparer deux feuilles de même ton.

Rythme vertical : les échelons déclarés sont 8 / 16 / 24 / 40 / 64 / 96 px ; en pratique les sections posent des valeurs littérales proches (10, 12, 16, 24, 28, 32, 36, 40, 48 px) et des `clamp()` fluides pour les grands sauts. Pour une nouvelle feuille, préférer les jetons `--space-*` et les `clamp()` déjà employés.

Points de rupture observés : 1100 px (fiches pro sur une colonne), 900 px (menu mobile, toutes les grilles sur une colonne, scène du hero sous le titre, liste des étapes masquée), 600 px et 480 px (annotations autorisées à passer à la ligne). Tout contrôle fait au minimum 44 px de haut ; les tableaux larges défilent horizontalement (`min-width: 760px`) plutôt que de déborder.

## Elevation & Depth

Pas de système d'ombres : la profondeur vient des aplats de ton (graphite-deep sous graphite, blanc chantier sur craie), de la trame de points et du grain de béton du papier, des filets à 1 px et des calques coupés en biais. Trois exceptions, toutes diffuses ou plates, et aucune ombre portée nette.

### Shadow Vocabulary
- **Feuille posée** (`box-shadow: 0 24px 48px -28px rgb(25 27 25 / 0.35), 0 1px 0 var(--line-light)`) : la fiche d'étape du Passeport, blanc chantier posé sur la craie.
- **Filet d'en-tête** (`box-shadow: 0 1px 0 var(--line-dark)`) : le bord bas de l'en-tête compact, avec `backdrop-filter: blur(14px)` sur graphite à 88 %.
- **Anneau du repère** (`box-shadow: inset 0 0 0 1px var(--line-dark-strong)`) : le disque qui ferme le pied de page.

Les halos de cuivre (`radial-gradient` à 8–12 % d'opacité dans le hero, les étapes et l'appel à l'action) sont de l'éclairage, pas de l'élévation.

### Named Rules
**La règle du calque.** Une surface se distingue par son ton, sa trame ou sa découpe, pas par une ombre. Si un bloc a besoin de se détacher, il devient blanc chantier sur craie ou graphite-deep sur graphite.

## Shapes

Angles vifs partout : aucun `border-radius` sur les boutons, les feuilles, les tampons, les cadres, les cases à cocher (22 px, bord 1 px). Les seuls cercles sont des repères : le point du logo, la puce de 7 px des statuts, les repères de 12 px sur le rail du Passeport, le nœud de contact de 14 px, le séparateur du texte monumental, le disque de 96 px du pied de page.

Le trait fait 1 px (filets, bords, cadres) ou 1,5 px (flèche des boutons, anneau du statut « déclaré ») ; 2 px pour le rail et les repères actifs ; les dessins SVG utilisent `vector-effect: non-scaling-stroke` à 0,9–1,6 d'épaisseur. Les feuilles claires sont des polygones coupés en biais ; les photographies apparaissent par `clip-path: inset()` qui s'ouvre de gauche à droite. Le favicon pose le monogramme sur un carré graphite à coins de 12 px : c'est la seule concession au rayon, imposée par le format d'icône.

## Components

Les composants sont des pièces de plan : du trait, du ton, un mouvement court qui confirme. Chaque pièce a sa version sur graphite et sa version sur craie.

### Buttons
- **Shape :** rectangle à angles vifs, 56 px de haut, 26 px de marge horizontale ; libellé Barlow Condensed 1.25rem capitales suivi d'une flèche dessinée (trait de 26 × 1,5 px, pointe de 8 px).
- **Primary :** cuivre plein, texte graphite-deep (4,8:1). Survol et focus : cuivre clair, le libellé glisse de 4 px et la flèche de 8 px (520 ms, `ease-out`).
- **Ghost :** transparent, bord 1 px `line-dark-strong` (ou `line-light-strong` sur craie), texte au ton ; le bord devient plein au survol. Même glissement.
- **Dark :** graphite plein, texte blanc chantier, graphite-3 au survol (utilisé sur craie).
- **En-tête :** variante primaire réduite (46 px, 20 px de marge, 1.125rem).
- **Désactivé :** opacité 0,45, curseur interdit. **Focus :** anneau 2 px cuivre clair (cuivre profond sur craie) décalé de 3 px, pour tous les éléments focalisables.

### Liens
- **Lien technique** (`.link`, navigation de l'en-tête) : texte 600, un trait de 1 px se trace sous le libellé de gauche à droite (`scaleX`, 520 ms). Dans l'en-tête le trait est cuivre clair et le texte passe de `on-dark-2` à `on-dark`.
- **Pied de page :** un tiret de 14 px précède chaque lien et s'allonge à ×1,85 en cuivre au survol.

### Chips (statuts)
- **Style :** cadre 1 px `currentColor`, 5 × 10 px, label 0.75rem 700 espacé 0.12em capitales, puce ronde de 7 px.
- **State :** `ok` oxyde (clair sur graphite, profond sur craie), `attente` pierre (encre-3 sur craie), `alerte` rouge contrôle, `declare` ton secondaire avec puce évidée (anneau 1,5 px).
- **Sélecteur d'offres** (comparateur) : bouton bascule de 52 px, bord 1 px, case de 22 px ; sélectionné : bord cuivre, fond cuivre à 10 %, case pleine cuivre avec coche graphite. Jamais une carte.

### Cards / Containers
- **Feuille claire** : section `[data-tone="light"].sheet`, craie tramée, coupée en biais.
- **Fiche posée** : blanc chantier, ombre diffuse « feuille posée », marge interne `clamp(24px, 3vw, 40px)` ; photographie 16/9 avec tampon daté graphite en bas à gauche (8 × 12 px, 0.9rem 700, étiquette 0.75rem espacée).
- **Plan encadré** : blanc chantier, bord 1 px `line-light-strong`, marge `clamp(12px, 2vw, 24px)`.
- **Listes** : jamais de boîte ; un filet fort au-dessus, un filet faible entre les lignes, 38 à 60 px de hauteur, tiret cuivre de 12 px en puce.
- **Encadré d'anomalie** : bord 1 px rouge contrôle, texte rouge profond 0.9rem 600, icône au trait ; seule surface du site qui porte le rouge.

### Inputs / Fields
Aucun champ de saisie n'est livré ; les interactions sont des boutons, des onglets et des sélecteurs. Si un champ est ajouté : bord 1 px au ton, angles vifs, 56 px, focus par l'anneau cuivre commun.

### Navigation
- **En-tête** fixe, 76 px, transparent sur le hero puis graphite 88 % flouté avec filet bas dès 32 px de défilement. Logo à gauche, liens 0.9rem 600 (écart 30 px), action cuivre réduite à droite.
- **Mobile (≤ 900 px)** : bouton carré 46 px bordé ; menu plein graphite, liens Barlow Condensed 2rem capitales de 60 px numérotés en cuivre clair (0.75rem espacé), entrée en fondu décalée de 55 ms par ligne ; action finale en cuivre clair.
- **Lien d'évitement** : cuivre plein, texte graphite, visible au focus seulement.

### Cartouche (signature)
Bloc-titre de feuille en bas de chaque section : filet 1 px au-dessus, 14 px de marge, grille `auto 1fr auto`. Numéro `01` en Barlow Condensed 1.5rem cuivre (clair sur graphite, profond sur craie) suivi de `/ 10` en 0.9rem pierre ; titre 0.75rem 700 espacé 0.14em ; « Échelle 1:100 » tabulaire à droite.

### Cote et note de marge (signature)
`.cote` : annotation 0.8125rem 600 espacée 0.16em capitales, pierre (encre-3 sur craie), trait de 22 px devant (absent en `--plain`), insécable sauf sous 480 px. `.plan-note` : 0.9rem, 40 ch max, trait cuivre de 16 px en marge gauche.

### Logo (signature)
Monogramme « B sculpté » : lettre massive en une seule couleur (viewBox 14 10 72 80, fût de 20, barres de 14), bols en coussin (rayons 14 et 16, flanc droit plat), contre-formes à angles vifs côté fût et arrondis côté bol ; une entaille de 3 entre le fût et la barre médiane (la dalle passe à côté du poteau) et deux chanfreins de 5 aux angles du fût (l'arête du béton coffré), visibles en grand, effacés en petit. Lettre blanc chantier sur graphite (`logo--dark`), graphite sur craie (`logo--light`), jamais de cuivre dans le symbole, jamais de plaque ni de cadre autour. Mot BATIR·É·EL en Barlow Condensed 800, capitales à la hauteur du monogramme (1,43 × la taille), espacé 0.06em, écart de 0,5 × la taille, le É en cuivre clair (profond sur craie), seule couleur du bloc-marque. Le favicon le pose sur un carré graphite ; l'image Open Graph (1200 × 630) reprend graphite, blanc chantier, cuivre clair et lignes à 12 %.

### Pièces de plan (signature)
- **PlanDivider** : filet et graduations SVG qui se tracent entre deux feuilles, étiquette `.cote` à droite sur le fond de la section.
- **ImageReveal** : photographie révélée de gauche à droite (`clip-path: inset`, 1,5 s `power4.inOut`) derrière une grille et une élévation au trait qui restent à 18 % (ou disparaissent).
- **Marquee** : texte monumental répété trois fois, séparé par un anneau cuivre, déplacé de +4 % à −22 % au rythme du défilement (`scrub: 0.5`). Une seule occurrence par page.
- **Rail du Passeport** : trait 2 px `line-light-strong`, remplissage cuivre `scaleY` jusqu'à l'étape active (1,1 s), repères ronds pleins (fait), évidés et agrandis ×1,3 (actif), rouge (alerte).

### Mouvement (grammaire commune, `src/lib/motion.ts`)
- Défaut GSAP : `power4.out`, 1,1 s. Transitions CSS : 200 ms (`--d-fast`, couleurs), 520 ms (`--d`, déplacements), 1 100 ms (`--d-slow`, rail) ; courbes `--ease-out` `cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-inout` `cubic-bezier(0.7, 0, 0.2, 1)`, `--ease` `cubic-bezier(0.4, 0, 0.2, 1)`.
- `data-title` : mots masqués (`.w > i`) qui montent de 112 % à 0 en 1,2 s, décalés de 50 ms. `data-reveal` : fondu + montée de 28 px en 1,1 s, décalage 80 ms, `data-reveal-delay` optionnel. `data-draw` / `data-stroke` : traits SVG tracés dans l'ordre, 0,35 à 1,6 s selon la longueur, `power2.inOut` ; `data-pop` apparaît ensuite. `data-rule` : filet `scaleX` 0 → 1 en 1,3 s.
- Lenis : `lerp 0.085`, roue seulement (natif au toucher), désactivé en mouvement réduit ; aller à une section : 1,4 s, quartique.
- Une seule section épinglée (« Chaque étape », `scrub 0.9`, longueur `n × 70 %`). Scène 3D du hero chargée à la demande sur écrans non tactiles, dessin axonométrique sinon.
- Introduction : lignes, murs, cotes, repère tracés en ~2,3 s puis calque effacé vers le haut en 0,9 s ; une fois par session, passable au clic ou à Échap, `?nointro` pour la sauter.
- Mouvement réduit : toutes les révélations rendent l'état final, Lenis et l'épinglage sont coupés, les durées CSS tombent à 0,01 ms.

## Do's and Don'ts

### Do:
- **Do** ouvrir chaque nouvelle feuille par un h2 `data-title` en Barlow Condensed capitales, une introduction `.lead` (44 ch) alignée en bas de la colonne de droite, et la fermer par un `Cartouche` numéroté.
- **Do** alterner les tons de feuille (`data-tone="light"` sur craie tramée, `dark` sur graphite) et couper les feuilles claires en biais avec `--cut` et `clip-path`, en inversant le sens de coupe d'une feuille à l'autre.
- **Do** déclarer les deux encres de tout nouveau composant (sur graphite et sous `[data-tone="light"]`) et prendre ses couleurs dans `tokens.css`.
- **Do** réserver le cuivre aux signes : accent, point, numéro, rail, trait de rappel, une seule action pleine par vue  ; dans le comparateur, « le plus bas » en oxyde clair et « le plus haut » en pierre avec son écart, jamais en cuivre (le cuivre reste l'action).
- **Do** dessiner avant de montrer : plans SVG `data-draw` avec `vector-effect: non-scaling-stroke`, photographie en `ImageReveal` derrière son dessin, filets `data-rule`.
- **Do** n'animer que `transform`, `opacity` et `clip-path`, avec les durées et courbes des jetons ; rendre l'état final lisible sans JavaScript et en mouvement réduit.
- **Do** garder les contrôles à 44 px minimum, les tableaux larges en défilement horizontal, les annotations `.cote` autorisées à passer à la ligne sous 480 px.
- **Do** marquer toute donnée de démonstration comme fictive dans le texte même (« entreprise fictive », « chantier fictif ») et laisser « À compléter » visible tant que le client n'a pas fourni l'information.

### Don't:
- **Don't** utiliser le rouge contrôle hors d'une anomalie, d'un poste absent ou d'un statut d'alerte ; jamais sur un titre, un bouton, un ornement.
- **Don't** poser de surtitre ou d'eyebrow au-dessus d'un h2 ; `.cote` annote (référence, lieu, métier, légende, en-tête de liste), il ne précède pas un titre de feuille.
- **Don't** animer `width`, `height`, `top`, `left` ni une marge ; pas de rebond (`back`, `elastic`), pas de parallaxe par élément, pas plus d'une section épinglée, pas de second texte monumental.
- **Don't** arrondir : aucun `border-radius` hors des points et disques de repère ; aucune carte flottante, aucune ombre portée nette, aucun verre dépoli en dehors de l'en-tête compact.
- **Don't** introduire de dégradé coloré (bleu, violet, multicolore) ni de blob ; les seuls dégradés sont des halos de cuivre à 8–12 % et les fondus de masque du hero.
- **Don't** composer un titre en Manrope ni un paragraphe en Barlow Condensed ; pas de graisse Barlow en dessous de 600.
- **Don't** utiliser d'emoji, d'icône glyphe de police ou de pictogramme décoratif ; les icônes sont des SVG au trait (Lucide : flèches, coche, moins, calendrier, document, triangle d'alerte, menu) et restent fonctionnelles.
- **Don't** inventer de partenaires, de témoignages, de statistiques, de professionnels vérifiés ni de chantiers réels ; le seul partenaire affiché est MÉTHODE AURA (conception et réalisation), avec son logo fourni.
- **Don't** répéter une composition image à gauche / texte à droite d'une feuille à l'autre ; changer de grille (7/5, 6/5, 4/8, 5/7, 5/6, 1/1).
