/**
 * ═══ SEUL POINT DE CONTACT AVEC LE SCHÉMA NOTION ═══
 *
 * Schéma RELEVÉ le 18/09/2026 sur la base « Agenda trackdays »
 * (2c5f3377-b8f2-802a-b153-e3818a799abd), et non plus supposé.
 *
 * Il diffère nettement du §4.1 de STACK-RESERVATION.md :
 *   - pas de `Statut` Ouvert/Complet/Annulé, mais `État` (type *status*)
 *     avec « A réserver » / « Contacté » / « Réservé » ;
 *   - pas de `Places` : la capacité retombe donc sur PLACES_DEFAUT ;
 *   - `Notes` s'appelle `Commentaire` ;
 *   - `Organisateur` est un multi_select, pas un select ;
 *   - s'y ajoutent `Loc`, `ALZ`, `GL` (cases à cocher), `Prix` et `Presta GL`.
 *
 * `Prix` est le COÛT du trackday pour GL (125 à 1399 €), jamais le tarif
 * client. Le tarif reste calculé par src/lib/circuits.ts.
 */

export const PROP_TRACKDAY = {
  nom: 'Nom',
  date: 'Date',
  circuit: 'Circuit',
  organisateur: 'Organisateur',
  etat: 'État',
  commentaire: 'Commentaire',
  prixAchat: 'Prix',
  prestaGL: 'Presta GL',
  loc: 'Loc',
  alz: 'ALZ',
  gl: 'GL',
} as const;

/** Valeurs réelles de la propriété `État`. */
export const ETAT = {
  aReserver: 'A réserver',
  contacte: 'Contacté',
  reserve: 'Réservé',
} as const;

/**
 * ═══ RÈGLE DE MISE EN VENTE — À CONFIRMER PAR RÉMI ═══
 *
 * `État` décrit le pipeline d'achat de GL, pas la disponibilité publique :
 * « A réserver » = le trackday existe au catalogue de l'organisateur mais
 * le créneau n'est pas pris ; « Réservé » = le créneau est acquis.
 *
 * Par défaut on ne publie donc que `Réservé` : vendre une date que GL n'a
 * pas réservée reviendrait à vendre un créneau qui n'existe pas.
 *
 * Relevé du 18/09/2026 sur les 27 lignes à venir :
 *   - `État = Réservé`            → 4 dates (Magny-Cours, Clastres)
 *   - `ALZ` cochée                → les 4 mêmes lignes
 *   - `Loc` cochée                → 0 ligne sur 96 (case jamais utilisée)
 *   - toutes dates futures du site → 24 dates
 *
 * `ETATS_PUBLIABLES` est modifiable par variable d'environnement, sans
 * redéploiement du code : ETATS_PUBLIABLES="Réservé,Contacté".
 */
export function etatsPubliables(): string[] {
  const brut = process.env.ETATS_PUBLIABLES;
  if (brut && brut.trim() !== '') {
    return brut.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [ETAT.reserve];
}

/** Exiger en plus la case `ALZ` (la voiture est du voyage). Défaut : non. */
export const exigerAlz = () => process.env.EXIGER_ALZ === 'true';

/** Exiger en plus la case `Loc`. Défaut : non — elle n'est jamais cochée. */
export const exigerLoc = () => process.env.EXIGER_LOC === 'true';

export const PROP_RESERVATION = {
  nom: 'Nom',
  trackday: 'Trackday',
  date: 'Date',
  circuit: 'Circuit',
  formule: 'Formule',
  distance: 'Distance',
  tarif: 'Tarif TTC',
  prenom: 'Prénom',
  nomClient: 'Nom du pilote',
  email: 'Email',
  telephone: 'Téléphone',
  experience: 'Expérience',
  flexibilite: 'Flexibilité',
  accompagnants: 'Accompagnants',
  message: 'Message',
  statut: 'Statut',
  source: 'Source',
  idempotency: 'Idempotency-Key',
  sync: 'Sync',
} as const;

export const STATUT_RESERVATION = {
  demande: 'Demande',
  confirmee: 'Confirmée',
  refusee: 'Refusée',
  annulee: 'Annulée',
} as const;

/** Valeurs de la propriété `Sync`, écrites en compensation (§6). */
export const SYNC = {
  ok: 'OK',
  echecAgenda: 'Échec agenda',
  echecMail: 'Échec mail',
} as const;

/**
 * La base ne porte AUCUNE propriété de capacité : une seule voiture, donc 1.
 * TODO-DATA §5.2 — l'affiche annonce la formule 200 km « ou à deux » ;
 * si la règle est confirmée, elle se pose ICI et nulle part ailleurs.
 */
export const PLACES_DEFAUT = 1;

/**
 * Nom de la propriété de capacité, SI elle est un jour ajoutée à la base.
 * Elle n'existe pas au relevé du 18/09/2026, ce qui rend l'option B du §5.4
 * (réservation ferme) inopérante : il n'y a rien à décrémenter. Renseigner
 * PROP_PLACES="Places" après l'avoir créée.
 */
export const propPlaces = (): string | undefined => process.env.PROP_PLACES?.trim() || undefined;
export function capacite(places: number | null, km: number): number {
  if (places !== null) return places;
  if (km === 200 && process.env.CAPACITE_200_A_DEUX === 'true') return 2;
  return PLACES_DEFAUT;
}
