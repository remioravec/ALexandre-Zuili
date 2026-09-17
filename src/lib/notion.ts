import { Client, isFullPage } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { env } from './env';
import { PROP_TRACKDAY, STATUT_TRACKDAY, capacite } from './notion-map';
import { resoudreCircuit, offres, type CircuitResolu, type Offre } from './circuits';

let client: Client | null = null;
export function notion(): Client {
  if (!client) client = new Client({ auth: env('NOTION_TOKEN') });
  return client;
}

export class ProprieteManquante extends Error {
  constructor(nom: string) {
    super(
      `La propriété « ${nom} » est absente de la base Notion. ` +
        `Corriger src/lib/notion-map.ts pour coller au schéma réel.`,
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

function lireSelect(props: Props, nom: string): string | null {
  const p = propriete(props, nom);
  if (p.type === 'select') return p.select?.name ?? null;
  if (p.type === 'status') return p.status?.name ?? null;
  if (p.type === 'rich_text') return p.rich_text.map((t) => t.plain_text).join('') || null;
  if (p.type === 'title') return p.title.map((t) => t.plain_text).join('') || null;
  return null;
}

function lireNombre(props: Props, nom: string): number | null {
  const p = propriete(props, nom);
  return p.type === 'number' ? p.number : null;
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
    console.warn(`[dates] page ${page.id} ignorée : ${PROP_TRACKDAY.date} vide`);
    return null;
  }

  const brut = lireSelect(page.properties, PROP_TRACKDAY.circuit);
  if (!brut) {
    console.warn(`[dates] page ${page.id} ignorée : ${PROP_TRACKDAY.circuit} vide`);
    return null;
  }

  const circuit = resoudreCircuit(brut);
  if (!circuit) {
    console.warn(
      `[dates] page ${page.id} ignorée : circuit « ${brut} » absent de CIRCUITS. ` +
        `Aligner la valeur du Select Notion sur src/lib/circuits.ts.`,
    );
    return null;
  }

  const liste = offres(circuit.palier);
  const places = capacite(lireNombre(page.properties, PROP_TRACKDAY.places), liste[0]?.km ?? 0);

  return { id: page.id, date: date.slice(0, 10), circuit, places, offres: liste };
}

/** Filtres : Statut = Ouvert, Date >= aujourd'hui, Places > 0. */
export async function datesOuvertes(): Promise<Trackday[]> {
  const aujourdhui = new Date().toISOString().slice(0, 10);
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const r = await notion().databases.query({
      database_id: env('NOTION_DB_TRACKDAYS'),
      filter: {
        and: [
          { property: PROP_TRACKDAY.date, date: { on_or_after: aujourdhui } },
          { property: PROP_TRACKDAY.statut, select: { equals: STATUT_TRACKDAY.ouvert } },
        ],
      },
      sorts: [{ property: PROP_TRACKDAY.date, direction: 'ascending' }],
      start_cursor: cursor,
      page_size: 100,
    });
    pages.push(...r.results.filter(isFullPage));
    cursor = r.has_more ? (r.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return pages
    .map(versTrackday)
    .filter((t): t is Trackday => t !== null && t.places > 0);
}

/**
 * Relit une page Trackday sans passer par le cache (§6, étape 3) et revalide
 * statut, places et date.
 */
export async function relireTrackday(id: string): Promise<Trackday | null> {
  const page = await notion().pages.retrieve({ page_id: id });
  if (!isFullPage(page)) return null;
  if (lireSelect(page.properties, PROP_TRACKDAY.statut) !== STATUT_TRACKDAY.ouvert) return null;
  return versTrackday(page);
}
