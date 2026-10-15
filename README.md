# Site GT3 992.2 — DRS Experience

Maquette front complète, une page, deux vues routées côté client.
Hébergé en statique sur Vercel, déploiement à chaque push.

## Contenu
- `public/index.html` — tout le front : HTML, CSS et JS en ligne, 185 Ko
- `public/assets/` — 22 images WebP, 924 Ko
- `public/` (racine) — icônes (`favicon.ico`, `favicon.svg`, PNG 16→512,
  `apple-touch-icon.png`), `site.webmanifest`, `robots.txt`, `sitemap.xml`
  et `og-drs-experience.jpg` (image de partage 1200×630)
- `src/app/api/` — les deux route handlers : `/api/dates`, `/api/reservation`
- `src/lib/` — configuration, grille tarifaire, Notion, Redis, agenda, e-mails
- `next.config.mjs` — routage : page statique, catch-all hors `/api`
- `vercel.json` — en-têtes de sécurité et cache des images
- `STACK-RESERVATION.md` — la spécification d'origine
- `.env.example` — les variables attendues, sans aucune valeur secrète

## Architecture du fichier
- **CSS** : un seul bloc `<style>`, DA Neo Oak Green (`--oak`, `--bone`, `--accent` blanc)
- **7 blocs `<script>`**, dans cet ordre imposé :
  1. `window.GT3` — moteur tarifaire, déclaré dans le `<head>` car utilisé plus bas
  2. méga-menu et tiroir mobile
  3. tunnel de réservation (4 étapes + calendrier maison)
  4. carrousel d'avis
  5. parallaxe au défilement
  6. routeur de vues + menu à état
  7. consentement et chargement de Google Analytics 4
- **2 vues** : `[data-route="/"]` et `[data-route="/le-moniteur/"]`, une seule visible.
  La route vit dans le **chemin** (`/le-moniteur/`), plus dans le hash : une visite
  directe ou un robot obtient la bonne vue, son titre et sa canonique. Le hash
  (`#/le-moniteur/`) reste accepté en entrée pour les anciens liens.

## Pièges connus
- Ne jamais déclarer une variable globale nommée `top`, `parent`, `name` ou `length` :
  collision avec une propriété non redéfinissable de `window`, le script entier tombe.
- Les scripts partagent la portée globale : envelopper tout nouveau bloc dans une IIFE.
- Le moteur tarifaire doit rester déclaré **avant** ses utilisations.

## Grille tarifaire
Dupliquée volontairement entre le front (`window.GT3`) et le serveur.
Le front **affiche**, le serveur **fait autorité**. Voir `STACK-RESERVATION.md`.

## Marque
Le site est publié sous le nom **DRS Experience** : le monogramme « AZ » du header a été
retiré (le logo est un wordmark seul) et le nom remplacé dans le `title`, l'Open Graph,
le JSON-LD `Organization`, le pied de page, les libellés ARIA, les titres du routeur,
le favicon et l'avatar du bouton d'appel. « GL Coaching Racing » et le nom de
Guillaume Léger sont conservés : ils désignent le moniteur, pas l'exploitant du site.

## Moteur de réservation

Next.js 15, App Router, **route handlers uniquement** : aucun rendu côté
serveur, la page reste le fichier statique de `public/`.

| Route | Rôle |
|---|---|
| `GET /api/dates` | les dates ouvertes de la base Notion, cache 5 min |
| `POST /api/reservation` | page Notion + événement d'agenda + 2 e-mails |

**Le tarif n'est jamais reçu du client** : il est recalculé dans
`src/lib/circuits.ts` à partir du circuit et de la distance. Toute valeur
envoyée par le front est ignorée. La grille est dupliquée volontairement entre
`window.GT3` (affichage) et ce module (autorité).

**Schéma Notion relevé le 18/09/2026** sur la base « Agenda trackdays », et
non plus supposé : il diffère du §4.1 de la spécification (voir l'en-tête de
`src/lib/notion-map.ts`). Ce fichier est le SEUL point de contact avec les noms
de propriétés. Si le schéma bouge, corriger ce fichier — jamais le code appelant. Une propriété absente remonte une erreur
explicite, une date dont le circuit est inconnu est ignorée et journalisée.

**Configuration incomplète** : la lecture des variables est paresseuse, donc
`next build` passe sans secret, et une variable absente fait répondre `503`
avec son nom. Voir `.env.example`.

**Dégradé** : si `/api/dates` ne répond pas, le calendrier reste ouvert et le
dit (« Disponibilités non vérifiées ») plutôt que de bloquer le tunnel. Passer
la constante `STRICT` à `true` dans `public/index.html` pour refuser toute date
non confirmée. Si aucune date n'est ouverte, le tunnel l'annonce et renvoie au
téléphone.

## Notifications
Les deux e-mails (client et interne) partent en **SMTP Gmail** depuis
`administration@remi-oravec.fr`, avec un mot de passe d'application. Choix
arrêté le 05/10/2026 : pas de Resend, pas de domaine expéditeur dédié.

Gmail réécrit l'expéditeur avec le compte authentifié, donc le client reçoit
ses messages de « DRS Experience <administration@remi-oravec.fr> ».

Le chemin Resend reste câblé dans `src/lib/mail.ts` et prendrait la priorité
si `RESEND_API_KEY` était renseignée — c'est la porte de sortie si le volume
dépasse un jour les ~500 envois quotidiens de Gmail.

**Après toute modification d'une variable d'environnement, attendre avant de
déclencher le build** : Vercel fige les variables au lancement, et un
déploiement créé dans la foulée repart avec les anciennes valeurs. Ce piège
a coûté deux faux diagnostics sur ce projet.

## Indexation et mesure d'audience
`robots.txt` exclut les sections non construites (`/formules/`, `/circuits/`,
`/reservation/`, `/mentions-legales/`) : le catch-all les sert avec le contenu
de l'accueil, les indexer reviendrait à publier la même page sous huit adresses.
`sitemap.xml` ne déclare donc que les deux vues réelles, `/` et `/le-moniteur/`.

La canonique de l'accueil pointe sur `https://drs-experience.com/` — elle
désignait `/location-voiture-circuit/`, que le sitemap ne déclare pas. Le
routeur la réécrit à chaque changement de vue.

Google Analytics 4 est câblé dans le dernier bloc `<script>` : **consent mode
v2 refusé par défaut**, bandeau d'acceptation, et le tag ne se télécharge
qu'après accord (choix mémorisé dans `localStorage`, clé `drs-consent`).
`GA4_ID` vide = aucun tag, aucun bandeau ; renseigner l'identifiant de flux
`G-…` suffit à tout activer.

## Domaine
Le site est publié sous **drs-experience.com**. Les balises canoniques,
Open Graph et JSON-LD pointent vers ce domaine.

`ALLOWED_ORIGIN` accepte plusieurs origines séparées par des virgules :
pendant une bascule, le site répond à la fois sur l'URL Vercel et sur le
domaine, et n'en autoriser qu'une ferait répondre 403 au formulaire depuis
l'autre.

## Déploiement
Projet Vercel `apex-drive` (https://apex-drive-one.vercel.app), lié à ce dépôt.
Framework détecté : Next.js. Les fichiers de `public/` et les routes `/api/*`
sont résolus avant les réécritures, donc `/assets/*.webp` et l'API ne sont
jamais détournés.

Les routes non construites (`/formules/…`, `/circuits/…`, `/reservation/`) sont
renvoyées sur la page par le catch-all de `next.config.mjs` : le routeur client
retombe sur la vue d'accueil au lieu d'une 404. Le catch-all exclut `/api/`,
sans quoi une route d'API mal orthographiée renverrait la page en HTML avec un
200.

### Développement local
```sh
npm install
npm run dev       # http://localhost:3000
npm run typecheck
npm run build
```

## Roadmap — état au 15/10/2026

### Livré
- Front complet (2 vues) déployé sur Vercel, déploiement à chaque push
- **drs-experience.com** et `www`, certificat émis, DNS posé chez OVH
- `GET /api/dates` : les dates publiables de la base « Agenda trackdays »
  alimentent le calendrier du tunnel
- `POST /api/reservation` : page créée dans « Réservations site », e-mail client
  et e-mail interne, idempotence par `Idempotency-Key`, pot de miel, tarif
  recalculé côté serveur
- Notifications SMTP Gmail vers Guillaume, Rémi et Alexandre — vérifiées par un
  envoi réel, lignes de test supprimées de Notion
- Schéma Notion relevé le 18/09/2026 et câblé dans `src/lib/notion-map.ts`
- Mise en page des deux e-mails refaite à la charte
- Icônes, manifeste, image de partage, `robots.txt`, `sitemap.xml`, canonique
  de l'accueil corrigée, routes portées par le chemin
- Google Analytics 4 câblé avec consentement préalable

### En attente d'une action de Rémi ou d'Alexandre
- [ ] **Créer la propriété GA4** « DRS Experience » (Admin → Créer une propriété,
      fuseau Paris, devise EUR, flux Web `https://drs-experience.com`). Ensuite je
      lis l'identifiant `G-…` par l'API, je le pose et je redéploie. Composio
      n'expose que des outils de lecture sur Analytics.
- [ ] **Vérifier le domaine en Search Console** : soit la balise HTML (me
      transmettre la valeur `content="…"`, je la pose), soit l'enregistrement TXT
      à faire ajouter chez OVH. La propriété `drs-experience.com` est déjà créée,
      non vérifiée. Une fois vérifiée, je soumets le sitemap.
- [ ] **Cocher « Update content »** sur l'intégration Notion « Site GT3 » : sans
      ce droit, impossible de modifier une ligne existante (décrémenter une
      capacité, faire passer un trackday à « Réservé »). Lecture et création
      fonctionnent déjà.
- [ ] **Régénérer le jeton Notion** : il a transité par une conversation.
- [ ] Remplacer les **6 avis Google fictifs** de la page.
- [ ] 6 circuits sur 8 sont illustrés par un visuel générique, pas une photo du
      lieu réel.
- [ ] Trancher **La Ferté-Gaucher** et **Les Écuyers** : annoncés sur la page,
      aucune date ouverte dans Notion.
- [ ] TODO-DATA restants de la spécification : capacité du « ou à deux »,
      battement entre deux circuits éloignés, invitation du client à l'événement
      d'agenda, demande ou réservation ferme.

### Ensuite, côté technique
- **Agenda Google non branché** : `GOOGLE_CALENDAR_ID` et le compte de service
  ne sont pas renseignés, la réservation répond donc `agenda: "absent"`. C'est le
  dégradé prévu, pas une panne — à brancher si Guillaume veut l'événement.
- **Pas de limitation de débit** (Upstash absent) : la protection contre le
  double envoi repose sur une requête Notion d'idempotence.
- **Mentions légales et CGV** : la route est exclue de l'indexation tant que la
  page n'existe pas.
- **Pages réelles pour les formules et les circuits** : aujourd'hui le catch-all
  renvoie l'accueil, ces URL ne peuvent donc pas se positionner. C'est le
  chantier à ouvrir si on veut du trafic sur « location GT3 Magny-Cours » et
  consorts.
- **Suivi des conversions** : poser un événement GA4 sur l'envoi du formulaire
  une fois l'identifiant de flux en place.
