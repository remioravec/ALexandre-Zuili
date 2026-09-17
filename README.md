# Site GT3 992.2 — Apex Drive

Maquette front complète, une page, deux vues routées côté client.
Hébergé en statique sur Vercel, déploiement à chaque push.

## Contenu
- `index.html` — tout le front : HTML, CSS et JS en ligne, 169 Ko
- `assets/` — 22 images WebP, 924 Ko
- `vercel.json` — hébergement statique : rewrite catch-all + en-têtes de sécurité
- `STACK-RESERVATION.md` — spécification du moteur de réservation, non implémenté

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

## Déploiement
Projet Vercel `a-lexandre-zuili`, lié à ce dépôt. Aucune commande de build, aucun
dossier de sortie. Les fichiers statiques sont servis avant les rewrites, donc
`/assets/*.webp` est bien servi malgré le catch-all.

Les routes non construites (`/formules/…`, `/circuits/…`, `/reservation/`) sont
renvoyées sur `index.html` par le rewrite : le routeur client retombe sur la vue
d'accueil au lieu d'une 404.

### Développement local
```sh
python3 -m http.server 8000
# puis http://localhost:8000
```

## À faire avant mise en ligne
- Remplacer `https://votresite.fr` dans les balises canoniques, Open Graph et JSON-LD
- Brancher `/api/dates` et `/api/reservation` (voir `STACK-RESERVATION.md`)
- 6 circuits sur 8 utilisent un visuel d'illustration, pas une photo du lieu réel
- Les 6 avis Google sont fictifs : à remplacer avant publication
- En production, séparer les 2 vues en 2 URL réelles — le routeur client ne remplace pas des pages
