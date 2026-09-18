import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { isFullPage } from '@notionhq/client';
import { notion, relireTrackday, ProprieteManquante } from '@/lib/notion';
import { PROP_RESERVATION, STATUT_RESERVATION, SYNC, propPlaces } from '@/lib/notion-map';
import { tarif, compris } from '@/lib/circuits';
import { creerEvenement } from '@/lib/calendar';
import { mailClient, mailInterne, type Demande } from '@/lib/mail';
import { reference } from '@/lib/reference';
import {
  limiteParIp,
  limiteParMail,
  prendreVerrou,
  libererVerrou,
  reponseIdempotente,
  memoriserIdempotence,
} from '@/lib/redis';
import { env, EnvManquante, reservationFerme } from '@/lib/env';

export const dynamic = 'force-dynamic';

const Body = z.object({
  trackdayId: z.string().min(1),
  km: z.number().int().positive(),
  prenom: z.string().min(1).max(60),
  nom: z.string().min(1).max(60),
  email: z.string().email(),
  telephone: z.string().min(9).max(20),
  experience: z.enum(['Jamais roulé sur circuit', 'Quelques journées', 'Pilote régulier']),
  flexibilite: z.enum(['Cette date uniquement', 'Souple à ± 1 semaine', 'Souple à ± 1 mois']),
  accompagnants: z.enum(['Je viens seul', '1 accompagnant', '2 accompagnants', '3 et plus']),
  message: z.string().max(1000).optional(),
  hp: z.string().max(0), // honeypot : doit être vide
  // Délai minimum de 3 s entre l'ouverture du tunnel et l'envoi (§9).
  ouvertureMs: z.number().int().positive().optional(),
});

type Reponse = {
  reference: string;
  date: string;
  circuit: string;
  formule: string;
  tarif: number;
};

function origineAutorisee(req: NextRequest): boolean {
  const attendue = env('ALLOWED_ORIGIN');
  const origine = req.headers.get('origin');
  // Requête same-origin : pas d'en-tête Origin, rien à refuser.
  return origine === null || origine === attendue;
}

export async function POST(req: NextRequest) {
  let verrou: string | null = null;

  try {
    if (!origineAutorisee(req)) {
      return NextResponse.json({ erreur: 'origine' }, { status: 403 });
    }

    const cle = req.headers.get('idempotency-key');
    if (!cle) {
      return NextResponse.json(
        { erreur: 'idempotency', message: 'En-tête Idempotency-Key obligatoire.' },
        { status: 400 },
      );
    }

    // Même clé rejouée : une seule page Notion (test d'acceptation n° 4).
    const deja = await reponseIdempotente<Reponse>(cle);
    if (deja) return NextResponse.json(deja, { status: 201 });

    // ── 1. Rate limit + honeypot + validation ──
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'inconnue';
    if (!(await limiteParIp().limit(ip)).success) {
      return NextResponse.json({ erreur: 'trop_de_requetes' }, { status: 429 });
    }

    const parse = Body.safeParse(await req.json());
    if (!parse.success) {
      // Le honeypot rempli est un robot : réponse volontairement muette.
      return NextResponse.json(
        { erreur: 'validation', details: parse.error.flatten().fieldErrors },
        { status: 422 },
      );
    }
    const b = parse.data;

    if (b.ouvertureMs !== undefined && Date.now() - b.ouvertureMs < 3000) {
      return NextResponse.json({ erreur: 'trop_rapide' }, { status: 429 });
    }

    if (!(await limiteParMail().limit(b.email.toLowerCase())).success) {
      return NextResponse.json({ erreur: 'trop_de_requetes' }, { status: 429 });
    }

    // ── 2. Verrou anti-doublon ──
    if (!(await prendreVerrou(b.trackdayId))) {
      return NextResponse.json({ erreur: 'creneau_pris' }, { status: 409 });
    }
    verrou = b.trackdayId;

    // ── 3. Relecture Notion, jamais le cache ──
    const t = await relireTrackday(b.trackdayId);
    if (!t) return NextResponse.json({ erreur: 'creneau_ferme' }, { status: 409 });
    if (t.places <= 0) return NextResponse.json({ erreur: 'creneau_pris' }, { status: 409 });
    if (t.date < new Date().toISOString().slice(0, 10)) {
      return NextResponse.json({ erreur: 'date_passee' }, { status: 422 });
    }

    // ── 4. Tarif recalculé côté serveur. Toute valeur envoyée est ignorée. ──
    const offre = tarif(t.circuit.palier, b.km);
    if (!offre) {
      return NextResponse.json(
        { erreur: 'km_incompatible', message: `${b.km} km n'existe pas au palier ${t.circuit.palier}.` },
        { status: 422 },
      );
    }

    // ── 5. Création de la page Réservations ──
    const titre = `${b.prenom} ${b.nom} — ${t.circuit.nom} — ${t.date.split('-').reverse().join('/')}`;
    const page = await notion().pages.create({
      parent: { database_id: env('NOTION_DB_RESERVATIONS') },
      properties: {
        [PROP_RESERVATION.nom]: { title: [{ text: { content: titre } }] },
        [PROP_RESERVATION.trackday]: { relation: [{ id: t.id }] },
        [PROP_RESERVATION.date]: { date: { start: t.date } },
        [PROP_RESERVATION.circuit]: { select: { name: t.circuit.nom } },
        [PROP_RESERVATION.formule]: { select: { name: offre.nom } },
        [PROP_RESERVATION.distance]: { number: offre.km },
        [PROP_RESERVATION.tarif]: { number: offre.prix },
        [PROP_RESERVATION.prenom]: { rich_text: [{ text: { content: b.prenom } }] },
        [PROP_RESERVATION.email]: { rich_text: [{ text: { content: b.email } }] },
        [PROP_RESERVATION.telephone]: { rich_text: [{ text: { content: b.telephone } }] },
        [PROP_RESERVATION.experience]: { select: { name: b.experience } },
        [PROP_RESERVATION.flexibilite]: { select: { name: b.flexibilite } },
        [PROP_RESERVATION.accompagnants]: { select: { name: b.accompagnants } },
        [PROP_RESERVATION.message]: { rich_text: [{ text: { content: b.message ?? '' } }] },
        [PROP_RESERVATION.statut]: { select: { name: STATUT_RESERVATION.demande } },
        [PROP_RESERVATION.source]: { select: { name: 'Site' } },
        [PROP_RESERVATION.idempotency]: { rich_text: [{ text: { content: cle } }] },
      },
    });

    const lienNotion = isFullPage(page) ? page.url : `https://notion.so/${page.id.replace(/-/g, '')}`;
    const ref = reference(page.id);

    // ── 6. Décrémenter la capacité si la réservation est ferme (option B) ──
    if (reservationFerme()) {
      const prop = propPlaces();
      if (!prop) {
        // La base n'a aucune propriété de capacité : l'option B ne peut pas
        // tenir sa promesse. On le dit au lieu de laisser croire au blocage.
        console.error(
          `[reservation] ${ref} RESERVATION_FERME=true mais aucune propriété de ` +
            `capacité n'existe dans la base : le créneau n'est PAS bloqué. ` +
            `Créer la propriété puis définir PROP_PLACES.`,
        );
      } else {
        try {
          await notion().pages.update({
            page_id: t.id,
            properties: { [prop]: { number: Math.max(0, t.places - 1) } },
          });
        } catch (e) {
          console.error(`[reservation] ${ref} décrément de « ${prop} » impossible`, e);
        }
      }
    }

    const demande: Demande = {
      reference: ref,
      date: t.date,
      circuit: t.circuit.nom,
      formule: offre.nom,
      km: offre.km,
      tarif: offre.prix,
      compris: compris(t.circuit.palier),
      prenom: b.prenom,
      nom: b.nom,
      email: b.email,
      telephone: b.telephone,
      experience: b.experience,
      flexibilite: b.flexibilite,
      accompagnants: b.accompagnants,
      ...(b.message ? { message: b.message } : {}),
      lienNotion,
    };

    // ── 7 et 8. Agenda puis e-mails. COMPENSATION : la réservation existe
    // déjà, on ne renvoie jamais d'erreur au client pour ces étapes. ──
    let lienAgenda: string | null = null;
    const echecs: string[] = [];

    try {
      lienAgenda = await creerEvenement({
        date: t.date,
        circuit: t.circuit.nom,
        palier: t.circuit.palier,
        prenom: b.prenom,
        nom: b.nom,
        km: offre.km,
        formule: offre.nom,
        tarif: offre.prix,
        compris: compris(t.circuit.palier),
        email: b.email,
        telephone: b.telephone,
        experience: b.experience,
        flexibilite: b.flexibilite,
        accompagnants: b.accompagnants,
        ...(b.message ? { message: b.message } : {}),
        lienNotion,
      });
    } catch (e) {
      echecs.push(SYNC.echecAgenda);
      console.error(`[reservation] ${ref} échec agenda`, e);
    }

    try {
      await Promise.all([mailClient(demande), mailInterne({ ...demande, lienAgenda })]);
    } catch (e) {
      echecs.push(SYNC.echecMail);
      console.error(`[reservation] ${ref} échec mail`, e);
    }

    if (echecs.length > 0) {
      try {
        await notion().pages.update({
          page_id: page.id,
          properties: { [PROP_RESERVATION.sync]: { select: { name: echecs.join(' + ') } } },
        });
      } catch (e) {
        // La propriété Sync n'existe peut-être pas encore dans la base.
        console.error(`[reservation] ${ref} marquage Sync impossible`, e);
      }
    }

    const reponse: Reponse = {
      reference: ref,
      date: t.date,
      circuit: t.circuit.nom,
      formule: offre.nom,
      tarif: offre.prix,
    };
    await memoriserIdempotence(cle, reponse);

    // Journal sans données personnelles (§9).
    console.log(
      `[reservation] ${ref} circuit=${t.circuit.slug} date=${t.date} km=${offre.km} statut=${
        echecs.length ? echecs.join('+') : 'ok'
      }`,
    );

    return NextResponse.json(reponse, { status: 201 });
  } catch (e) {
    if (e instanceof EnvManquante || e instanceof ProprieteManquante) {
      console.error('[reservation] configuration incomplète :', e.message);
      return NextResponse.json({ erreur: 'configuration', message: e.message }, { status: 503 });
    }
    console.error('[reservation] échec', e);
    return NextResponse.json({ erreur: 'serveur' }, { status: 500 });
  } finally {
    // ── 9. Libérer le verrou ──
    if (verrou) await libererVerrou(verrou);
  }
}
