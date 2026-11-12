import { Client, isFullPage } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { env } from './env';
import {
  PROP_RESERVATION,
  PROP_TRACKDAY,
  capacite,
  etatsPubliables,
  exigerAlz,
  exigerLoc,
  nomsDrs,
} from './notion-map';
import { resoudreCircuit, offres, type CircuitResolu, type Offre } from './circuits';

let client: Client | null = null;
export function notion(): Client {
  if (!client) client = new Client({ auth: env('NOTION_TOKEN') });
  return client;
}

export class ProprieteManquante extends Error {
  constructor(nom: string, indice?: string) {
    super(
      `La propriété « ${nom} » est absente de la base Notion. ` +
        `Corriger src/lib/notion-map.ts pour coller au schéma réel.` +
        (indice ? ` ${indice}` : ''),
    );
    this.name = 'ProprieteManquante';
  }
}

type Props = PageObjectResponse['properties'];

function propriete(props: Props, nom: string) {
  const p = props[nom];
  if (!p) throw new ProprieteManquante(nom);
  return p;
}

function lireDate(props: Props, nom: string): string | null {
  const p = propriete(props, nom);
  return p.type === 'date' ? (p.date?.start ?? null) : null;
}

/** `Circuit` est un select, `État` un status : les deux passent par ici. */
function lireLibelle(props: Props, nom: string): string | null {
  const p = propriete(props, nom);
  if (p.type === 'select') return p.select?.name ?? null;
  if (p.type === 'status') return p.status?.name ?? null;
  if (p.type === 'multi_select') return p.multi_select.map((o) => o.name).join(', ') || null;
  if (p.type === 'rich_text') return p.rich_text.map((t) => t.plain_text).join('') || null;
  if (p.type === 'title') return p.title.map((t) => t.plain_text).join('') || null;
  return null;
}

/** Même nom à un accent, une casse ou un tiret près. */
const aplati = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

/**
 * Retrouve le nom RÉEL d'une colonne à partir des orthographes acceptées.
 *
 * Notion conserve l'accent et la casse saisis à la création de la colonne :
 * « DRS Expérience » et « DRS Experience » sont deux clés différentes pour
 * l'API. On compare donc à plat, et on échoue en nommant les colonnes vues
 * plutôt que de renvoyer un calendrier vide sans explication.
 */
function resoudrePropriete(props: Props, candidats: string[]): string {
  for (const c of candidats) if (props[c]) return c;

  const cles = Object.keys(props);
  for (const c of candidats) {
    const cible = aplati(c);
    const trouvee = cles.find((k) => aplati(k) === cible);
    if (trouvee) return trouvee;
  }

  const attendu = candidats.join(' » ou « ') || '(aucun nom accepté)';
  throw new ProprieteManquante(attendu, `Colonnes présentes : ${cles.join(', ')}.`);
}

function lireCase(props: Props, nom: string): boolean {
  const p = propriete(props, nom);
  return p.type === 'checkbox' ? p.checkbox : false;
}

export type Trackday = {
  id: string;
  date: string;
  circuit: CircuitResolu;
  places: number;
  offres: Offre[];
};

/** Une date dont le circuit est inconnu est ignorée ET journalisée — jamais devinée. */
export function versTrackday(page: PageObjectResponse): Trackday | null {
  const date = lireDate(page.properties, PROP_TRACKDAY.date);
  if (!date) {
    console.warn(`[dates] ${page.id} ignorée : ${PROP_TRACKDAY.date} vide`);
    return null;
  }

  const brut = lireLibelle(page.properties, PROP_TRACKDAY.circuit);
  if (!brut) {
    console.warn(`[dates] ${page.id} ignorée : ${PROP_TRACKDAY.circuit} vide`);
    return null;
  }

  const circuit = resoudreCircuit(brut);
  if (!circuit) {
    // Attendu pour Barcelona, Hockenheim, Monza, Nürburgring, Val de Vienne
    // et Le Mans - Tracé des 24H : ces circuits ne sont pas proposés.
    console.warn(`[dates] ${page.id} ignorée : circuit « ${brut} » hors des 8 du site.`);
    return null;
  }

  const liste = offres(circuit.palier);
  // La base ne porte aucune propriété de capacité : on retombe sur le défaut.
  const places = capacite(null, liste[0]?.km ?? 0);

  return { id: page.id, date: date.slice(0, 10), circuit, places, offres: liste };
}

/** La ligne est-elle mise en vente ? Règle documentée dans notion-map.ts. */
function publiable(page: PageObjectResponse): boolean {
  const props = page.properties;

  // Condition unique : la case « DRS Expérience ».
  if (!lireCase(props, resoudrePropriete(props, nomsDrs()))) return false;

  // Garde-fous facultatifs, sans effet tant que leur variable est vide.
  const etats = etatsPubliables();
  if (etats.length > 0) {
    const etat = lireLibelle(props, PROP_TRACKDAY.etat);
    if (etat === null || !etats.includes(etat)) return false;
  }
  if (exigerAlz() && !lireCase(props, PROP_TRACKDAY.alz)) return false;
  if (exigerLoc() && !lireCase(props, PROP_TRACKDAY.loc)) return false;
  return true;
}

/**
 * Dates à venir et mises en vente.
 *
 * Notion ne filtre que sur la date ; la case `DRS Expérience` est relue côté
 * serveur. Les orthographes acceptées se résolvent à plat (`resoudrePropriete`),
 * ce qu'un filtre Notion, qui exige le nom exact de la colonne, ne sait pas
 * faire. Le volume le permet — 96 lignes.
 */
export async function datesOuvertes(): Promise<Trackday[]> {
  const aujourdhui = new Date().toISOString().slice(0, 10);
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const r = await notion().databases.query({
      database_id: env('NOTION_DB_TRACKDAYS'),
      filter: { property: PROP_TRACKDAY.date, date: { on_or_after: aujourdhui } },
      sorts: [{ property: PROP_TRACKDAY.date, direction: 'ascending' }],
      start_cursor: cursor,
      page_size: 100,
    });
    pages.push(...r.results.filter(isFullPage));
    cursor = r.has_more ? (r.next_cursor ?? undefined) : undefined;
  } while (cursor);

  const retenus: Trackday[] = [];
  const vus = new Set<string>();

  for (const page of pages) {
    if (!publiable(page)) continue;
    const t = versTrackday(page);
    if (!t || t.places <= 0) continue;

    // La base porte plusieurs organisateurs pour un même circuit le même
    // jour (deux lignes Hockenheim au 13/04, par exemple). Le calendrier
    // n'a qu'une case par jour : on garde la première et on journalise.
    const cle = `${t.circuit.slug}:${t.date}`;
    if (vus.has(cle)) {
      console.warn(`[dates] doublon ignoré : ${cle} (page ${page.id})`);
      continue;
    }
    vus.add(cle);
    retenus.push(t);
  }

  return retenus;
}

/**
 * Idempotence sans Redis : cherche une réservation déjà enregistrée sous
 * cette clé. C'est la base Notion qui fait foi, donc la garantie tient même
 * si le cache mémoire a été perdu (démarrage à froid, autre instance).
 */
export async function reservationExistante(
  cle: string,
): Promise<{ id: string; url: string } | null> {
  const r = await notion().databases.query({
    database_id: env('NOTION_DB_RESERVATIONS'),
    filter: { property: PROP_RESERVATION.idempotency, rich_text: { equals: cle } },
    page_size: 1,
  });
  const p = r.results[0];
  if (!p || !isFullPage(p)) return null;
  return { id: p.id, url: p.url };
}

/** Relit une page sans cache (§6, étape 3) et revalide sa mise en vente. */
export async function relireTrackday(id: string): Promise<Trackday | null> {
  const page = await notion().pages.retrieve({ page_id: id });
  if (!isFullPage(page)) return null;
  if (!publiable(page)) return null;
  return versTrackday(page);
}
