# STACK — Moteur de réservation GT3 992.2

Spécification à implémenter. Cible : **Vercel**. Front existant : une page HTML/CSS/JS autonome
avec un tunnel de réservation en 4 étapes et un calendrier maison (aucun framework front).

> Tout bloc marqué **TODO-DATA** attend une donnée de Rémi. Ne pas inventer de valeur :
> lever une erreur explicite au démarrage si la variable est absente.

---

## 1. Ce que le système doit faire

1. Exposer les **dates réellement ouvertes** (issues de la base Notion « Trackday ») au calendrier du tunnel.
2. Enregistrer une demande de réservation → **page Notion**, **événement Google Agenda**, **2 e-mails**.
3. Empêcher qu'une date complète reste sélectionnable (une seule voiture).

Le calendrier actuel propose n'importe quel jour futur. C'est le premier défaut à corriger :
**seules les dates de la base Notion doivent être sélectionnables.**

---

## 2. Stack

| Couche | Choix | Raison |
|---|---|---|
| Hébergement | Vercel | déjà connecté |
| Framework | **Next.js 15, App Router, route handlers uniquement** | pas de rendu, juste des API |
| Langage | TypeScript strict | |
| Validation | `zod` | rejet à la frontière |
| Notion | `@notionhq/client` | officiel |
| Google Agenda | `googleapis` + **compte de service** | pas d'OAuth utilisateur à renouveler |
| E-mail | `resend` | domaine à vérifier ; fallback `nodemailer` + SMTP Gmail si Rémi préfère |
| Anti-abus | `@upstash/ratelimit` + `@upstash/redis` | 5 req / 10 min / IP |
| Verrou anti-doublon | Upstash Redis `SET NX` | évite deux réservations simultanées sur la même date |

Aucune base de données propre : **Notion est la source de vérité**.

---

## 3. Variables d'environnement

```
NOTION_TOKEN=                 # intégration interne, partagée avec la base
NOTION_DB_TRACKDAYS=          # TODO-DATA — ID de la base (32 hex)
GOOGLE_SA_EMAIL=              # compte de service
GOOGLE_SA_PRIVATE_KEY=        # clé privée, \n échappés
GOOGLE_CALENDAR_ID=           # TODO-DATA — agenda partagé avec le compte de service
RESEND_API_KEY=
MAIL_FROM=reservation@<domaine>          # TODO-DATA — domaine à vérifier chez Resend
MAIL_INTERNAL=guillaume60leger@gmail.com # + TODO-DATA : autres destinataires ?
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
ALLOWED_ORIGIN=https://<domaine-du-site>
```

---

## 4. Modèle de données Notion

### 4.1 Base « Trackday » — schéma attendu

**TODO-DATA — à confirmer.** Les 33 liens fournis ne portaient aucune propriété lisible.
Si le schéma réel diffère, ne pas adapter le code au cas par cas : corriger la table de mapping
ci-dessous, elle est le seul point de contact.

| Propriété Notion | Type | Usage |
|---|---|---|
| `Date` | Date | jour du roulage — **obligatoire** |
| `Circuit` | Select | doit correspondre à une clé de `CIRCUITS` (§5.1) |
| `Organisateur` | Select / Text | affiché en interne uniquement |
| `Statut` | Select | `Ouvert` / `Complet` / `Annulé` — seul `Ouvert` est proposé |
| `Places` | Number | capacité restante ; défaut 1 si absent |
| `Notes` | Text | interne |

### 4.2 Base « Réservations » — à créer

| Propriété | Type |
|---|---|
| `Nom` | Title — `{Prénom} {Nom} — {Circuit} — {JJ/MM/AAAA}` |
| `Trackday` | Relation → base Trackday |
| `Date` | Date |
| `Circuit` | Select |
| `Formule` | Select (`Initiation`, `Découverte`, `Performance`, `Grand format`, `VIP GT3 Touring`, `Exclusive`) |
| `Distance` | Number (km) |
| `Tarif TTC` | Number |
| `Prénom` `Nom` `Email` `Téléphone` | Text |
| `Expérience` | Select |
| `Flexibilité` | Select |
| `Accompagnants` | Select |
| `Message` | Text |
| `Statut` | Select — `Demande` / `Confirmée` / `Refusée` / `Annulée` |
| `Source` | Select — `Site` |
| `Idempotency-Key` | Text (unique) |

---

## 5. Règles métier

### 5.1 Circuits et paliers tarifaires

```ts
export const CIRCUITS = {
  'le-mans-bugatti':   { nom: 'Le Bugatti — Le Mans',        palier: 'B' },
  'magny-cours':       { nom: 'Magny-Cours',                  palier: 'B' },
  'dijon-prenois':     { nom: 'Dijon-Prenois',                palier: 'B' },
  'la-ferte-gaucher':  { nom: 'La Ferté-Gaucher',             palier: 'B' },
  'le-castellet':      { nom: 'Paul Ricard — Le Castellet',   palier: 'C' },
  'spa-francorchamps': { nom: 'Spa-Francorchamps',            palier: 'C' },
  'clastres':          { nom: 'Clastres',                     palier: 'A' },
  'les-ecuyers':       { nom: 'Les Écuyers',                  palier: 'A' },
} as const;

// [km, prix TTC en euros] — relevé sur les affiches GL Coaching Racing, 20/08/2026
export const GRILLE = {
  A: [[50, 820], [70, 1140], [120, 1900], [150, 2300], [200, 3100]],
  B: [[90, 2430], [140, 3690], [200, 4800], [300, 6500]],
  C: [[90, 3490], [140, 4990], [200, 6790], [300, 8990]],
} as const;

export const NOM_FORMULE: Record<number, string> = {
  50: 'Initiation', 70: 'Découverte', 90: 'Découverte', 120: 'Performance',
  140: 'Performance', 150: 'Grand format', 200: 'VIP GT3 Touring', 300: 'Exclusive',
};

// Palier C : transport du véhicule inclus (mention portée sur l'affiche Paul Ricard)
export const compris = (palier: string) =>
  palier === 'C'
    ? 'Coaching · carburant · inscription circuit · transport du véhicule'
    : 'Coaching · carburant · inscription circuit';
```

**Le tarif n'est jamais reçu du client.** Il est recalculé côté serveur à partir de
`circuit + km`. Toute valeur envoyée par le front est ignorée.

### 5.2 Capacité

**TODO-DATA.** Une seule voiture. La formule 200 km est annoncée « ou à deux » sur l'affiche,
donc une date peut porter deux pilotes sur ce format. Règle à confirmer :

- capacité par défaut = `1`
- si `Formule = 200 km`, capacité = `2` ?
- une date à `Places = 0` disparaît de `/api/dates`

### 5.3 Battement entre deux circuits

**TODO-DATA.** La voiture est transportée. Deux dates rapprochées sur deux circuits éloignés
sont incompatibles. Implémenter un garde-fou paramétrable :

```
BUFFER_JOURS_MEME_CIRCUIT=0
BUFFER_JOURS_AUTRE_CIRCUIT=?   # TODO-DATA
```

### 5.4 Statut d'une réservation

**TODO-DATA — arbitrage à trancher par Rémi.**

- **Option A — demande.** Le créneau reste ouvert, Rémi confirme sous 24 h.
  Cohérent avec le texte actuel du site. Aucun risque de survente.
- **Option B — réservation ferme.** Le créneau se bloque au clic.
  Plus fluide, mais Rémi ne peut plus refuser sans se dédire.

Implémenter **l'option A par défaut**, avec un booléen `RESERVATION_FERME=false`
qui bascule vers B sans refonte.

---

## 6. Routes

### `GET /api/dates`

Lit la base Trackday, renvoie les dates ouvertes. Cache 5 min (`s-maxage=300`).

```json
{
  "dates": [
    { "date": "2026-09-14", "circuit": "le-mans-bugatti",
      "nom": "Le Bugatti — Le Mans", "places": 1, "palier": "B",
      "offres": [{ "km": 90, "prix": 2430, "nom": "Découverte" }] }
  ],
  "genere": "2026-08-20T09:00:00.000Z"
}
```

Filtres : `Statut = Ouvert`, `Date >= aujourd'hui`, `Places > 0`.
Une date dont le `Circuit` ne correspond à aucune clé de `CIRCUITS` est **ignorée et journalisée** —
jamais devinée.

### `POST /api/reservation`

En-tête `Idempotency-Key` obligatoire (UUID généré par le front à l'ouverture du tunnel).

```ts
const Body = z.object({
  trackdayId: z.string(),          // id de page Notion, issu de /api/dates
  km: z.number().int().positive(),
  prenom: z.string().min(1).max(60),
  nom: z.string().min(1).max(60),
  email: z.string().email(),
  telephone: z.string().min(9).max(20),
  experience: z.enum(['Jamais roulé sur circuit','Quelques journées','Pilote régulier']),
  flexibilite: z.enum(['Cette date uniquement','Souple à ± 1 semaine','Souple à ± 1 mois']),
  accompagnants: z.enum(['Je viens seul','1 accompagnant','2 accompagnants','3 et plus']),
  message: z.string().max(1000).optional(),
  hp: z.string().max(0),           // honeypot : doit être vide
});
```

**Séquence, dans cet ordre :**

1. Rate limit + honeypot + validation.
2. Verrou Redis `SET reservation:{trackdayId} NX EX 30`. Si pris → `409`.
3. Relire la page Trackday dans Notion (**ne jamais faire confiance au cache**) :
   vérifier `Statut = Ouvert`, `Places > 0`, date future, `km` présent dans le palier.
4. Recalculer le tarif côté serveur.
5. Créer la page dans **Réservations**.
6. Décrémenter `Places` sur la page Trackday si `RESERVATION_FERME=true`.
7. Créer l'événement **Google Agenda**.
8. Envoyer les **2 e-mails**.
9. Libérer le verrou. Réponse `201` avec `{ reference, date, circuit, formule, tarif }`.

**Compensation.** Si l'étape 7 ou 8 échoue, la réservation existe déjà : ne pas renvoyer d'erreur
au client. Marquer la page Notion `Sync = Échec agenda` / `Échec mail` et journaliser.
Une réservation enregistrée mais non notifiée vaut mieux qu'un client qui croit avoir échoué.

---

## 7. Événement Google Agenda

```
summary     : GT3 992.2 — {Circuit} — {Prénom} {Nom} ({km} km)
start / end : journée entière sur la date, fuseau Europe/Paris
location    : nom du circuit
description : formule, distance, tarif TTC, compris, contact, expérience,
              flexibilité, accompagnants, message, lien vers la page Notion
attendees   : TODO-DATA — inviter le client ? (adresse e-mail visible par tous les invités)
colorId     : par palier — A=2, B=5, C=6
```

Le compte de service n'a pas d'agenda propre : **partager l'agenda cible avec son adresse**
en droit « Apporter des modifications aux événements ».

---

## 8. E-mails

### Client — « Votre demande de réservation »
Récapitulatif : voiture, circuit, date en toutes lettres, formule, distance, tarif TTC,
ce qui est compris, délai de réponse de 24 h, référence, téléphone `06 38 68 59 61`.
Mentionner explicitement : **aucun paiement n'a été effectué**.

### Interne — « Nouvelle demande — {Circuit} — {Date} »
Toutes les données brutes, le lien vers la page Notion, le lien vers l'événement d'agenda,
et un `reply-to` réglé sur l'adresse du client pour répondre en un clic.

Gabarits HTML sobres, table centrée 600 px, version texte incluse.

---

## 9. Sécurité

- CORS restreint à `ALLOWED_ORIGIN`.
- Rate limit 5 / 10 min / IP, plus 3 / heure / adresse e-mail.
- Honeypot + délai minimum de 3 s entre l'ouverture du tunnel et l'envoi.
- Aucune clé côté client. Le front n'appelle que `/api/dates` et `/api/reservation`.
- Journaliser sans les données personnelles : id de réservation, circuit, date, statut.

---

## 10. Contrat avec le front existant

Deux modifications seulement dans la page HTML :

1. Au chargement du tunnel : `fetch('/api/dates')`. Les jours absents de la réponse sont
   **désactivés** dans le calendrier. Les circuits sans date ouverte sortent du sélecteur.
2. À l'envoi : `POST /api/reservation` avec l'en-tête `Idempotency-Key`.
   `201` → écran de confirmation existant. `409` → « ce créneau vient d'être pris ».
   `4xx` → message d'erreur sous le bouton, formulaire conservé.

Le moteur tarifaire du front (`window.GT3`) reste **l'affichage**.
Le serveur reste **l'autorité**. Les deux lisent la même grille, dupliquée volontairement.

---

## 11. Tests d'acceptation

1. Une date absente de Notion n'est pas cliquable.
2. Une date `Complet` disparaît en moins de 5 minutes.
3. Deux envois simultanés sur la même date : un `201`, un `409`.
4. Même `Idempotency-Key` renvoyée deux fois : une seule page Notion.
5. Tarif falsifié dans la requête : ignoré, montant serveur appliqué.
6. Agenda injoignable : réservation créée, page marquée `Échec agenda`, client non bloqué.
7. `km` incompatible avec le palier du circuit : `422`.

---

## 12. Bloquants — à obtenir de Rémi avant mise en service

| # | Donnée | Impact |
|---|---|---|
| 1 | ID de la base Notion Trackday + partage de l'intégration | bloque tout |
| 2 | Schéma réel des propriétés (§4.1) | bloque `/api/dates` |
| 3 | ID de l'agenda Google + compte de service autorisé | bloque l'étape 7 |
| 4 | Capacité par date, et règle du « ou à deux » sur 200 km | risque de survente |
| 5 | Battement minimum entre deux circuits | risque logistique |
| 6 | Demande ou réservation ferme (§5.4) | change le contrat client |
| 7 | Domaine expéditeur vérifié chez Resend | les mails partent en spam sans lui |
| 8 | Destinataires internes en plus de Guillaume | |
| 9 | Acompte ou paiement en ligne | hors périmètre à ce stade — à confirmer |
