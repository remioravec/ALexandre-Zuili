/**
 * Lecture des variables d'environnement.
 *
 * La spéc demande une erreur explicite quand une variable manque. Elle est
 * levée à la première requête qui en a besoin, pas à l'import du module :
 * `next build` ne dispose pas des secrets et échouerait, et une erreur au
 * chargement rendrait le site statique inaccessible. Le message nomme la
 * variable absente — jamais de valeur par défaut inventée.
 */

export class EnvManquante extends Error {
  constructor(public readonly nom: string) {
    super(
      `Variable d'environnement absente : ${nom}. ` +
        `À définir dans les réglages du projet Vercel (Settings → Environment Variables).`,
    );
    this.name = 'EnvManquante';
  }
}

export function env(nom: string): string {
  const v = process.env[nom];
  if (v === undefined || v.trim() === '') throw new EnvManquante(nom);
  return v;
}

/** Variable optionnelle : absente vaut « règle désactivée », jamais une valeur devinée. */
export function envOptionnel(nom: string): string | undefined {
  const v = process.env[nom];
  return v === undefined || v.trim() === '' ? undefined : v;
}

export function envEntier(nom: string): number | undefined {
  const v = envOptionnel(nom);
  if (v === undefined) return undefined;
  const n = Number.parseInt(v, 10);
  if (!Number.isFinite(n)) throw new Error(`${nom} doit être un entier, reçu « ${v} ».`);
  return n;
}

export function envBooleen(nom: string, defaut: boolean): boolean {
  const v = envOptionnel(nom);
  if (v === undefined) return defaut;
  return v === 'true' || v === '1';
}

/** Option A (demande) par défaut, comme tranché au §5.4 de la spéc. */
export const reservationFerme = () => envBooleen('RESERVATION_FERME', false);

/** TODO-DATA §5.3 : absent = garde-fou désactivé. */
export const bufferMemeCircuit = () => envEntier('BUFFER_JOURS_MEME_CIRCUIT') ?? 0;
export const bufferAutreCircuit = () => envEntier('BUFFER_JOURS_AUTRE_CIRCUIT');
