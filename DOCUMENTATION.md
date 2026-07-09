# دعاء — أذكار الطريق
### Documentation complète du mini-site NFC

Ce document explique, étape par étape et en langage simple, comment
lancer, comprendre et personnaliser entièrement le projet. Aucune
connaissance technique préalable n'est nécessaire.

---

## 1. Architecture du projet

```
nfc-car/
├── index.html              → Page d'accueil
├── doua-rokoub.html         → دعاء الركوب (playlist 3 pistes)
├── adhkar-sabah.html        → أذكار الصباح (playlist 3 pistes)
├── adhkar-massa.html        → أذكار المساء (playlist 3 pistes)
├── doua-safar.html          → دعاء السفر (playlist 3 pistes)
├── quran.html                → قرآن كريم (playlist 4 pistes)
├── about.html                → من نحن + galerie de présentation
├── car.html                  → Page de redirection pour l'URL courte du tag NFC
├── style.css                 → Toutes les couleurs, polices, mises en page, animations
├── script.js                  → Comportement : lecteur playlist, scroll, splash…
├── i18n.js                    → Système de traduction Arabe / Français
├── audio/
│   ├── doua-rokoub/           → MP3 de la playlist دعاء الركوب
│   ├── adhkar-sabah/          → MP3 de la playlist أذكار الصباح
│   ├── adhkar-massa/          → MP3 de la playlist أذكار المساء
│   ├── doua-safar/            → MP3 de la playlist دعاء السفر
│   └── quran/                 → MP3 de la playlist قرآن كريم
├── images/
│   ├── logo/                  → Votre logo officiel (logo.png)
│   ├── presentation/          → Vos images de présentation de l'app
│   └── icons/                 → Icônes personnalisées (optionnel)
└── DOCUMENTATION.md           → Ce fichier
```

Chaque dossier audio correspond à une seule catégorie : vous pouvez
ajouter, supprimer ou remplacer les fichiers d'une catégorie sans
jamais toucher aux autres.

---

## 2. Lancer le projet

Vous n'avez besoin d'aucune installation, d'aucun logiciel de
développement, ni de Node.js.

### Option A — Le plus simple : ouvrir directement le fichier
Double-cliquez sur `index.html`. Il s'ouvre dans votre navigateur.
(Sur mobile, certains navigateurs bloquent l'audio en ouverture locale :
préférez l'option B pour tester le comportement réel du tag NFC.)

### Option B — Recommandée : héberger le dossier en ligne
1. Choisissez un hébergement simple : Netlify, Vercel, GitHub Pages, ou
   votre propre hébergement web (OVH, o2switch, etc.).
2. Déposez tout le contenu du dossier `nfc-car/` (pas le dossier
   lui-même, mais son contenu) à la racine de votre hébergement, ou
   dans un sous-dossier `/car/` si vous voulez l'URL `/car`.
3. Ouvrez l'URL sur votre téléphone pour vérifier que tout fonctionne
   (design, langue, boutons, lecture audio).

### Option C — Test rapide en local avec un mini-serveur
```
cd nfc-car
python3 -m http.server 8080
```
Puis ouvrez `http://localhost:8080` dans votre navigateur.

---

## 3. URL courte pour le tag NFC

**Méthode recommandée** : configurez une règle de redirection côté
hébergement qui fait pointer `/car` vers `index.html`.
- Netlify : fichier `_redirects` avec `/car   /index.html   200`
- Vercel : règle `rewrites` dans `vercel.json`
- Apache : `.htaccess` avec `RewriteRule ^car$ index.html [L]`

**Solution de secours (déjà intégrée)** : le fichier `car.html` fourni
redirige automatiquement vers `index.html`. Encodez l'URL finale sur
votre tag NFC avec une application comme "NFC Tools" (iOS/Android).

---

## 4. Le site en deux langues (Français / العربية)

### Comment ça marche
- Un petit bouton de langue se trouve dans l'en-tête de chaque page
  (icône de globe + "FR" ou "ع").
- Un clic bascule instantanément tous les textes de la page, sans
  rechargement, et inverse le sens de lecture (RTL pour l'arabe, LTR
  pour le français).
- Le choix de langue est mémorisé dans le navigateur du visiteur
  (`localStorage`) : il reste actif d'une page à l'autre et lors des
  visites suivantes.
- Le texte des invocations elles-mêmes (le dou'a en arabe) reste
  toujours affiché dans sa langue originale — c'est le texte à réciter
  — accompagné d'une courte explication de son sens, elle traduite
  selon la langue choisie.

### Comment fonctionne le code (i18n.js)
Tout le texte traduisible dans le HTML porte un attribut `data-i18n` :
```html
<h1 data-i18n="home.title">أذكار الطريق</h1>
```
Le fichier `i18n.js` contient un dictionnaire à cet effet :
```js
'home.title': { ar:'أذكار الطريق', fr:'Douâs de la route' },
```
Au chargement (et à chaque clic sur le bouton de langue), le script
remplace automatiquement le texte de chaque élément `data-i18n` par la
bonne traduction.

### Ajouter ou modifier une traduction
1. Ouvrez `i18n.js`.
2. Trouvez la ligne correspondant à la clé (ex : `'home.lead'`).
3. Modifiez le texte arabe (`ar:`) ou français (`fr:`) entre
   apostrophes.
4. Enregistrez : la modification s'applique à toutes les pages qui
   utilisent cette clé.

### Ajouter un nouveau texte traduisible
1. Dans le HTML, ajoutez un attribut `data-i18n="ma.nouvelle.cle"` sur
   l'élément concerné.
2. Dans `i18n.js`, ajoutez une ligne dans le dictionnaire :
   ```js
   'ma.nouvelle.cle': { ar:'النص بالعربية', fr:'Le texte en français' },
   ```
Cas particuliers :
- `data-i18n-aria="cle"` traduit un `aria-label` (accessibilité).
- `data-i18n-html="cle"` traduit en autorisant du HTML simple (ex : un
  `<br>` pour un retour à la ligne).
- Les titres de chaque piste audio (`data-title-ar` / `data-title-fr`
  sur les `<li class="track-item">`) ne passent pas par le
  dictionnaire : ils sont propres à chaque piste (voir section 6).

### Pourquoi un léger effet de "flash" est normal
La direction (RTL/LTR) est fixée en tout début de page pour éviter tout
clignotement visuel. La traduction complète du texte s'applique juste
après le chargement du HTML : sur une connexion normale, cela reste
imperceptible.

---

## 5. Optimisation mobile

Le site est conçu Mobile First : toutes les tailles, espacements et
mises en page partent du plus petit écran, puis s'adaptent aux écrans
plus larges (voir les `@media` dans `style.css`).

Points déjà en place :
- Zones tactiles d'au moins 44×44 px pour tous les boutons, y compris
  les contrôles du lecteur audio et le bouton de changement de langue.
- Prise en compte des zones sûres iPhone (encoche, barre de gestes) via
  `env(safe-area-inset-*)`.
- `touch-action: manipulation` et suppression du surlignage bleu au
  tap pour une sensation plus native.
- Testé visuellement en Safari iOS et Chrome Android : polices, RTL,
  lecteur audio et animations se comportent normalement dans les deux.
- Aucune dépendance à des technologies non supportées sur mobile.

Pour vérifier vous-même après vos modifications :
1. Ouvrez le site sur un vrai téléphone (via l'hébergement, pas en
   fichier local, pour un test fidèle de l'audio).
2. Vérifiez que rien ne dépasse horizontalement de l'écran.
3. Vérifiez que chaque bouton est facile à toucher avec le pouce.

---

## 6. Système audio multi-pistes (playlist)

Chaque catégorie (دعاء الركوب, أذكار الصباح, أذكار المساء, دعاء السفر,
قرآن كريم) utilise désormais **un seul lecteur** capable de contenir
plusieurs pistes, avec navigation Précédent/Suivant, liste cliquable,
et **transition en fondu** (la piste en cours s'estompe avant que la
suivante ne démarre — jamais de coupure brutale).

### Structure HTML d'un lecteur playlist
```html
<div class="playlist-player" data-playlist aria-label="...">
  <div class="now-playing">
    <button class="np-play" data-action="playpause">...</button>
    <div class="np-info">
      <span class="np-title">Titre affiché</span>
      <span class="np-index">1 / 3</span>
    </div>
    <div class="np-nav">
      <button class="np-btn np-prev" data-action="prev">...</button>
      <button class="np-btn np-next" data-action="next">...</button>
    </div>
  </div>
  <div class="bar"><div class="bar-fill"></div></div>
  <div class="time"><span class="cur">0:00</span><span class="dur">0:00</span></div>

  <audio preload="none"></audio>

  <ul class="track-list">
    <li class="track-item is-active"
        data-src="audio/categorie/01-fichier.mp3"
        data-title-ar="العنوان بالعربية"
        data-title-fr="Titre en français">
      <span class="t-num">01</span>
      <span class="t-title">العنوان بالعربية</span>
      <span class="t-dur">--:--</span>
      <span class="t-play">...</span>
    </li>
    <!-- autres pistes -->
  </ul>
</div>
```

Le script `script.js` détecte automatiquement chaque `[data-playlist]`
et met en place toute la logique (lecture, navigation, fondu, mise à
jour des titres selon la langue active). **Vous n'avez jamais besoin
d'écrire de JavaScript vous-même.**

### Ajouter une piste à une catégorie existante
1. Déposez le MP3 dans le dossier correspondant (ex :
   `audio/adhkar-sabah/04-nouveau-fichier.mp3`).
2. Dans le fichier HTML de la page (ex : `adhkar-sabah.html`),
   dupliquez un `<li class="track-item">` existant dans la
   `<ul class="track-list">` et collez-le juste avant `</ul>`.
3. Modifiez :
   - `data-src` → le chemin vers votre nouveau fichier
   - `data-title-ar` et `data-title-fr` → les titres dans les deux langues
   - le texte visible dans `<span class="t-title">` (mettez la version
     arabe par défaut ; elle sera automatiquement remplacée si le
     français est actif)
   - `<span class="t-num">` → le numéro d'ordre (ex : `04`)
4. Mettez à jour `<span class="np-index">1 / 3</span>` en `1 / 4` (le
   nombre total de pistes) sur toutes les occurrences de la page.

### Retirer une piste
Supprimez simplement son bloc `<li class="track-item">...</li>` et
mettez à jour le total dans `np-index`.

### Pourquoi la transition est fluide
Quand vous changez de piste (bouton Suivant/Précédent, ou clic sur une
piste de la liste), le volume de la piste en cours diminue
progressivement (fondu de sortie, ~260 ms), puis la nouvelle piste est
chargée et son volume remonte progressivement (fondu d'entrée). Le
titre affiché ("En cours de lecture") s'estompe et réapparaît en même
temps, pour un changement toujours doux, jamais brutal.

### Comportement respecté
- Aucune piste ne se lance automatiquement à l'ouverture de la page :
  la première lecture nécessite toujours un clic (bouton Lecture ou
  clic sur une piste).
- Une fois qu'une lecture a été démarrée par l'utilisateur, le passage
  automatique à la piste suivante en fin de lecture est activé (pour
  une écoute continue pendant le trajet) — vous pouvez le désactiver en
  retirant le bloc `audio.addEventListener('ended', ...)` dans
  `script.js` si vous préférez un arrêt complet après chaque piste.

---

## 7. Organisation des dossiers audio

```
audio/
├── doua-rokoub/    → دعاء الركوب
├── adhkar-sabah/   → أذكار الصباح
├── adhkar-massa/   → أذكار المساء
├── doua-safar/     → دعاء السفر
└── quran/          → قرآن كريم
```

Chaque dossier contient un `README.txt` rappelant les noms de fichiers
attendus par le code. Cette séparation permet d'ajouter, remplacer ou
supprimer les fichiers d'une catégorie sans jamais risquer d'affecter
les autres pages du site.

Pour créer une toute nouvelle catégorie audio (ex : "دعاء الوضوء") :
voir section 10 ci-dessous.

---

## 8. Logo et images de l'application

### Le logo
Le logo a un emplacement dédié : `images/logo/logo.png`.

- **Tant qu'aucun fichier n'est présent**, le site affiche
  automatiquement un repli élégant (le mot "دعاء" stylisé), dans
  l'en-tête, la page d'accueil et l'écran de chargement.
- **Dès que vous déposez `images/logo/logo.png`**, il s'affiche
  automatiquement partout, sans modifier une seule ligne de code.
- Pour utiliser un fichier `.svg` plutôt que `.png` : dans chaque
  fichier HTML, remplacez `src="images/logo/logo.png"` par
  `src="images/logo/logo.svg"` (recherche/remplacement global dans
  tous les fichiers `.html`).

### Écran de chargement
Un bref écran de chargement (moins d'une seconde, une seule fois par
visite) affiche le logo au centre de l'écran avant l'apparition du
site. Il est géré par le bloc `<div class="splash" id="appSplash">` en
haut de `index.html`, avec sa logique dans `initSplash()` de
`script.js`. Vous pouvez :
- ajuster sa durée en modifiant `550` (millisecondes) dans
  `window.setTimeout(hide, 550);`
- le retirer complètement en supprimant le bloc `<div class="splash">`
  d'`index.html` et l'appel `initSplash();` dans `script.js`.

### Images de présentation
Un emplacement dédié existe dans `images/presentation/`, affiché sous
forme de galerie sur `about.html` :
```
images/presentation/presentation-1.jpg
images/presentation/presentation-2.jpg
images/presentation/presentation-3.jpg
images/presentation/presentation-4.jpg
```
Tant qu'un fichier n'existe pas à cet endroit, un joli motif de repli
s'affiche à sa place avec le texte "Ajoutez une image ici" — jamais
d'image cassée visible par vos visiteurs.

Pour ajouter un cinquième emplacement (ou plus), dupliquez un bloc
`<figure>` dans la section `<div class="gallery">` d'`about.html`.

### Icônes
Toutes les icônes actuelles sont des SVG écrits directement dans le
code (rapides, nettes, aucun fichier à charger). Le dossier
`images/icons/` est prévu si vous préférez utiliser vos propres icônes
image à la place — voir le `README.txt` de ce dossier.

### Bonnes pratiques pour un rendu premium et rapide
- Logo : PNG ou SVG à fond transparent, moins de 80 Ko.
- Images de présentation : JPG ou WEBP, largeur 1000–1200 px, moins de
  300 Ko chacune (compressez avec tinypng.com ou squoosh.app avant de
  les déposer).
- Toutes les images de la galerie utilisent déjà `loading="lazy"` pour
  ne charger que les images visibles à l'écran, et un cadre à
  proportions fixes pour éviter tout "saut" de mise en page pendant le
  chargement.

---

## 9. Modifier les textes, couleurs et boutons

### Textes
La quasi-totalité des textes passe désormais par le système de
traduction (voir section 4) : modifiez-les dans `i18n.js`. Pour un
texte qui n'est volontairement pas traduit (ex : le nom de marque
"دعاء", qui reste identique dans les deux langues), modifiez-le
directement dans le fichier HTML concerné.

### Couleurs
Toutes les couleurs du site sont centralisées dans le bloc `:root`
tout en haut de `style.css` :
```css
:root{
  --teal-950:#081E1C;   /* fond principal */
  --gold-500:#C9A24B;   /* doré principal */
  --cream-100:#FAF6EC;  /* blanc cassé */
  ...
}
```
Changez uniquement le code hexadécimal ; toutes les pages suivent
automatiquement.

### Boutons
```html
<a class="btn" href="index.html" data-i18n="order.btn">اطلب توا</a>
```
- Texte : modifiez la valeur correspondante dans `i18n.js` (clé
  `order.btn`).
- Destination : modifiez `href`.
- Le bouton de commande ("اطلب توا") pointe actuellement vers `href="#"`.
  **Dès que vous avez le lien final**, remplacez `href="#"` par votre
  vraie adresse dans chaque page qui contient ce bouton — le message
  d'attente disparaîtra automatiquement.

---

## 10. Ajouter une toute nouvelle catégorie (page + playlist)

1. Créez un nouveau dossier audio, ex : `audio/doua-woudou/`, avec son
   propre `README.txt` si vous le souhaitez.
2. Dupliquez une page existante proche du besoin (ex :
   `doua-rokoub.html`) et renommez la copie (ex : `doua-woudou.html`).
3. Dans la copie, mettez à jour :
   - le `<title>`
   - les clés `data-i18n` du titre/eyebrow/texte (créez de nouvelles
     clés dans `i18n.js`, ex : `woudou.title`, `woudou.lead`)
   - chaque `data-src`, `data-title-ar`, `data-title-fr` des pistes
   - le nombre total de pistes dans `np-index`
4. Ajoutez une carte vers cette page sur `index.html`, dans
   `<nav class="menu-grid">` (dupliquez une carte existante, changez
   `href`, l'icône si besoin, et les clés `data-i18n` du label/sous-titre).

---

## 11. Modifier les animations

Toutes les animations sont définies dans `style.css` :
- `.reveal` : fondu + léger décalage vers le haut à l'entrée dans
  l'écran.
- `.reveal.zoom` : même effet avec un léger zoom d'entrée.
- `.fade-in` / `.slide-up` : animations jouées immédiatement au
  chargement (hero).
- `.np-title.is-switching` : fondu du titre lors du changement de piste
  audio.

Pour désactiver une animation sur un élément, retirez simplement la
classe correspondante de sa balise HTML. Le site respecte aussi
automatiquement le réglage système "réduire les animations"
(`prefers-reduced-motion`).

---

## 12. Bonnes pratiques avant mise en production

- Vérifiez que chaque fichier MP3 pèse moins de 8-10 Mo pour un
  chargement rapide en 4G dans une voiture.
- Testez le site en français ET en arabe, sur un vrai iPhone (Safari)
  et un vrai téléphone Android (Chrome), avant de graver l'URL finale
  sur le tag NFC.
- Vérifiez que le tag NFC pointe vers l'adresse HTTPS de votre
  hébergement final (et non vers un fichier local).
- Gardez `style.css`, `script.js` et `i18n.js` directement dans le
  dossier `nfc-car/`, au même niveau que les fichiers `.html`.
- Remplacez `href="#"` du bouton de commande par votre lien réel.
- Déposez votre logo dans `images/logo/logo.png` et vos visuels dans
  `images/presentation/`.

---

Bonne personnalisation, et bon voyage. 🚗🤍
