import { NextResponse } from 'next/server';
import { datesOuvertes } from '@/lib/notion';
import { compris } from '@/lib/circuits';
import { EnvManquante } from '@/lib/env';
import { ProprieteManquante } from '@/lib/notion';

export const dynamic = 'force-dynamic';

/**
 * GET /api/dates — les dates réellement ouvertes, pour le calendrier du tunnel.
 * Cache 5 min (s-maxage=300).
 */
export async function GET() {
  try {
    const trackdays = await datesOuvertes();

    const dates = trackdays.map((t) => ({
      id: t.id,
      date: t.date,
      circuit: t.circuit.slug,
      nom: t.circuit.nom,
      places: t.places,
      palier: t.circuit.palier,
      compris: compris(t.circuit.palier),
      offres: t.offres,
    }));

    return NextResponse.json(
      { dates, genere: new Date().toISOString() },
      {
        headers: {
          // Vercel ne conserve pas `s-maxage` sur une route `force-dynamic` :
          // la réponse repartait en `cache-control: public` seul, donc mise en
          // cache heuristique par le CDN, et une date ajoutée dans Notion
          // n'apparaissait qu'au bout d'un délai imprévisible.
          //
          // On sépare donc les deux étages : le navigateur revalide à chaque
          // fois, le CDN garde 30 s — assez pour absorber une rafale, assez
          // court pour qu'une modification de l'agenda se voie tout de suite.
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'CDN-Cache-Control': 'max-age=30, stale-while-revalidate=60',
        },
      },
    );
  } catch (e) {
    if (e instanceof EnvManquante || e instanceof ProprieteManquante) {
      console.error('[dates] configuration incomplète :', e.message);
      return NextResponse.json({ erreur: 'configuration', message: e.message }, { status: 503 });
    }
    console.error('[dates] échec', e);
    return NextResponse.json({ erreur: 'indisponible' }, { status: 502 });
  }
}
