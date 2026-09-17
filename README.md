# Site GT3 992.2 — Apex Drive

Maquette front complète, une page, deux vues routées côté client.
Hébergé en statique sur Vercel, déploiement à chaque push.

## Contenu
- `public/index.html` — tout le front : HTML, CSS et JS en ligne, 172 Ko
- `public/assets/` — 22 images WebP, 924 Ko
- `src/app/api/` — les deux route handlers : `/api/dates`, `/api/reservation`
- `src/lib/` — configuration, grille tarifaire, Notion, Redis, agenda, e-mails
- `next.config.mjs` — routage : page statique, catch-all hors `/api`
- `vercel.json` — en-têtes de sécurité et cache des images
- `STACK-RESERVATION.md` — la spécification d'origine
- `.env.example` — les variables attendues, sans aucune valeur secrète

## Architecture du fichier
- **CSS** : un seul bloc `<style>`, DA Neo Oak Green (`--oak`, `--bone`, `--accent` blanc)
- **6 blocs `<script>`**, dans cet ordre imposé :
  1. `window.GT3` — moteur tarifaire, déclaré dans le `<head>` car utilisé plus bas
  2. méga-menu et tiroir mobile
  3. tunnel de réservation (4 étapes + calendrier maison)
  4. carrousel d'avis
  5. parallaxe au défilement
  6. routeur de vues + menu à état
- **2 vues** : `[data-route="/"]` et `[data-route="/le-moniteur/"]`, une seule visible

## Pièges connus
- Ne jamais déclarer une variable globale nommée `top`, `parent`, `name` ou `length` :
  collision avec une propriété non redéfinissable de `window`, le script entier tombe.
- Les scripts partagent la portée globale : envelopper tout nouveau bloc dans une IIFE.
- Le moteur tarifaire doit rester déclaré **avant** ses utilisations.

## Grille tarifaire
Dupliquée volontairement entre le front (`window.GT3`) et le serveur.
Le front **affiche**, le serveur **fait autorité**. Voir `STACK-RESERVATION.md`.

## Marque
Le site est publié sous le nom **Apex Drive** : le monogramme « AZ » du header a été
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

**Schéma Notion non confirmé.** `src/lib/notion-map.ts` est le SEUL point de
contact avec les noms de propriétés. Si le schéma réel diffère, corriger ce
fichier — jamais le code appelant. Une propriété absente remonte une erreur
explicite, une date dont le circuit est inconnu est ignorée et journalisée.

**Configuration incomplète** : la lecture des variables est paresseuse, donc
`next build` passe sans secret, et une variable absente fait répondre `503`
avec son nom. Voir `.env.example`.

**Dégradé** : si `/api/dates` ne répond pas, le calendrier reste ouvert et le
dit (« Disponibilités non vérifiées ») plutôt que de bloquer le tunnel. Passer
la constante `STRICT` à `true` dans `public/index.html` pour refuser toute date
non confirmée. Si aucune date n'est ouverte, le tunnel l'annonce et renvoie au
téléphone.

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

## À faire avant mise en ligne
- Remplacer `https://votresite.fr` dans les balises canoniques, Open Graph et JSON-LD
- Renseigner les variables d'environnement (`.env.example`) — sans elles, l'API répond 503
- Créer la base Notion « Réservations » (§4.2) et y partager l'intégration
- Confirmer le schéma réel de la base Trackday, puis corriger `src/lib/notion-map.ts`
- Trancher les TODO-DATA restants : capacité du « ou à deux », battement entre circuits,
  invitation du client à l'événement d'agenda, demande ou réservation ferme
- 6 circuits sur 8 utilisent un visuel d'illustration, pas une photo du lieu réel
- Les 6 avis Google sont fictifs : à remplacer avant publication
- En production, séparer les 2 vues en 2 URL réelles — le routeur client ne remplace pas des pages
