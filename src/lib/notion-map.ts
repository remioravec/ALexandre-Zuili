/**
 * ═══ SEUL POINT DE CONTACT AVEC LE SCHÉMA NOTION ═══
 *
 * TODO-DATA §4.1 — schéma NON CONFIRMÉ. La base Trackday
 * (2c5f3377-b8f2-802a-b153-e3818a799abd) est privée et l'intégration n'y est
 * pas encore partagée : les noms ci-dessous sont ceux que documente la spéc,
 * pas des noms relevés.
 *
 * Si le schéma réel diffère, NE PAS adapter le code appelant : corriger
 * uniquement les chaînes de ce fichier. Un nom de propriété absent de la base
 * remonte en erreur explicite (voir `lirePropriete`), jamais en valeur devinée.
 */

export const PROP_TRACKDAY = {
  date: 'Date',
  circuit: 'Circuit',
  organisateur: 'Organisateur',
  statut: 'Statut',
  places: 'Places',
  notes: 'Notes',
} as const;

/** Seul `Ouvert` est proposé au public. */
export const STATUT_TRACKDAY = {
  ouvert: 'Ouvert',
  complet: 'Complet',
  annule: 'Annulé',
} as const;

export const PROP_RESERVATION = {
  nom: 'Nom',
  trackday: 'Trackday',
  date: 'Date',
  circuit: 'Circuit',
  formule: 'Formule',
  distance: 'Distance',
  tarif: 'Tarif TTC',
  prenom: 'Prénom',
  nomClient: 'Nom',
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
 * Capacité par défaut quand `Places` est absent ou vide.
 *
 * TODO-DATA §5.2 — une seule voiture, donc 1. L'affiche annonce la formule
 * 200 km « ou à deux » : si la règle est confirmée, c'est ICI qu'elle se pose,
 * et nulle part ailleurs.
 */
export const PLACES_DEFAUT = 1;
export function capacite(places: number | null, km: number): number {
  if (places !== null) return places;
  if (km === 200 && process.env.CAPACITE_200_A_DEUX === 'true') return 2;
  return PLACES_DEFAUT;
}
