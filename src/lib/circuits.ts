/**
 * Circuits, paliers et grille tarifaire.
 *
 * Dupliqué volontairement avec `window.GT3` côté front : le front AFFICHE,
 * ce module FAIT AUTORITÉ. Relevé sur les affiches GL Coaching Racing,
 * 20/08/2026.
 *
 * Le front identifie un circuit par son NOM affiché (« Le Bugatti — Le Mans »),
 * la base Notion par un Select dont la valeur doit correspondre à ce même nom
 * ou au slug. `resoudreCircuit` accepte les deux et n'invente rien.
 */

export type Palier = 'A' | 'B' | 'C';

export const CIRCUITS = {
  'le-mans-bugatti': { nom: 'Le Bugatti — Le Mans', palier: 'B' },
  'magny-cours': { nom: 'Magny-Cours', palier: 'B' },
  'dijon-prenois': { nom: 'Dijon-Prenois', palier: 'B' },
  'la-ferte-gaucher': { nom: 'La Ferté-Gaucher', palier: 'B' },
  'le-castellet': { nom: 'Paul Ricard — Le Castellet', palier: 'C' },
  'spa-francorchamps': { nom: 'Spa-Francorchamps', palier: 'C' },
  clastres: { nom: 'Clastres', palier: 'A' },
  'les-ecuyers': { nom: 'Les Écuyers', palier: 'A' },
} as const satisfies Record<string, { nom: string; palier: Palier }>;

export type SlugCircuit = keyof typeof CIRCUITS;

/** [km, prix TTC en euros] */
export const GRILLE = {
  A: [
    [50, 820],
    [70, 1140],
    [120, 1900],
    [150, 2300],
    [200, 3100],
  ],
  B: [
    [90, 2430],
    [140, 3690],
    [200, 4800],
    [300, 6500],
  ],
  C: [
    [90, 3490],
    [140, 4990],
    [200, 6790],
    [300, 8990],
  ],
} as const satisfies Record<Palier, ReadonlyArray<readonly [number, number]>>;

export const NOM_FORMULE: Record<number, string> = {
  50: 'Initiation',
  70: 'Découverte',
  90: 'Découverte',
  120: 'Performance',
  140: 'Performance',
  150: 'Grand format',
  200: 'VIP GT3 Touring',
  300: 'Exclusive',
};

/** Palier C : transport du véhicule inclus (mention portée sur l'affiche Paul Ricard). */
export function compris(palier: Palier): string {
  const base = 'Coaching · carburant · inscription circuit';
  return palier === 'C' ? `${base} · transport du véhicule` : base;
}

export type Offre = { km: number; prix: number; nom: string };

export function offres(palier: Palier): Offre[] {
  return GRILLE[palier].map(([km, prix]) => ({
    km,
    prix,
    nom: NOM_FORMULE[km] ?? `${km} km`,
  }));
}

/**
 * Le tarif n'est JAMAIS reçu du client : il est recalculé ici à partir du
 * circuit et de la distance. `null` si le km n'existe pas dans le palier —
 * l'appelant répond 422, il ne prend pas le palier voisin.
 */
export function tarif(palier: Palier, km: number): Offre | null {
  return offres(palier).find((o) => o.km === km) ?? null;
}

/**
 * La base Notion n'orthographie pas les circuits comme le site. Relevé du
 * 18/09/2026 sur « Agenda trackdays » : 12 valeurs, dont 6 seulement
 * correspondent à un circuit du site.
 *
 * Les six autres — Barcelona-Catalunya, Hockenheim, Monza, Nürburgring
 * Nordschleife, Val de Vienne, Le Mans - Tracé des 24H — ne sont pas
 * proposées sur le site : elles sont ignorées et journalisées, jamais
 * rattachées de force à un circuit voisin.
 *
 * À l'inverse, La Ferté-Gaucher et Les Écuyers sont proposés par le site
 * mais n'ont AUCUNE ligne dans la base : ils ne sortiront jamais du
 * sélecteur tant qu'aucune date n'y est saisie.
 */
export const ALIAS_CIRCUIT: Record<string, SlugCircuit> = {
  'Le Mans - Bugatti': 'le-mans-bugatti',
  'Paul Ricard': 'le-castellet',
  'Spa - Francorchamps': 'spa-francorchamps',
  'Magny-Cours': 'magny-cours',
  'Dijon-Prenois': 'dijon-prenois',
  Clastres: 'clastres',
};

const PAR_NOM = new Map<string, SlugCircuit>(
  (Object.keys(CIRCUITS) as SlugCircuit[]).map((slug) => [CIRCUITS[slug].nom, slug]),
);

export type CircuitResolu = { slug: SlugCircuit; nom: string; palier: Palier };

/**
 * Résout un slug OU un nom affiché. Retourne `null` sur une valeur inconnue :
 * jamais de palier par défaut, contrairement au front qui retombe sur « B »
 * pour l'affichage.
 */
export function resoudreCircuit(valeur: string): CircuitResolu | null {
  const brut = valeur.trim();
  const direct = (CIRCUITS as Record<string, { nom: string; palier: Palier } | undefined>)[brut];
  if (direct) return { slug: brut as SlugCircuit, nom: direct.nom, palier: direct.palier };

  const parNom = PAR_NOM.get(brut);
  if (parNom) {
    return { slug: parNom, nom: CIRCUITS[parNom].nom, palier: CIRCUITS[parNom].palier };
  }

  const alias = ALIAS_CIRCUIT[brut];
  if (alias) {
    return { slug: alias, nom: CIRCUITS[alias].nom, palier: CIRCUITS[alias].palier };
  }
  return null;
}
