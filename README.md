# Apex Drive

Site vitrine « location de Porsche 911 GT3 992.2 sur circuit avec moniteur ».
Une seule page statique (`index.html`), sans build ni dépendance : tout le CSS,
le JS et les images sont embarqués dans le fichier.

## Structure

| Fichier       | Rôle                                                        |
|---------------|-------------------------------------------------------------|
| `index.html`  | L'intégralité du site (styles, scripts, visuels en data-URI) |
| `vercel.json` | Hébergement statique Vercel : rewrite catch-all + en-têtes   |

## Navigation

Le site est une mini-SPA : deux vues (`data-route="/"` et
`data-route="/le-moniteur/"`) affichées par le script de fin de page, avec
`history.pushState`. Les autres liens (`/formules/…`, `/circuits/…`,
`/reservation/`) pointent vers des pages qui n'existent pas encore ; le
rewrite catch-all de `vercel.json` les renvoie sur `index.html`, qui retombe
sur la vue d'accueil au lieu de servir une 404.

## Déploiement

Projet Vercel lié à ce dépôt : chaque push déclenche un déploiement
(preview sur les branches, production sur la branche de production).
Aucune commande de build, aucun dossier de sortie à configurer.

## Développement local

```sh
python3 -m http.server 8000
# puis http://localhost:8000
```
