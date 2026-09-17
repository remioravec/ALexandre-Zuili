import { google } from 'googleapis';
import { env } from './env';
import type { Palier } from './circuits';

/** colorId par palier (§7). */
const COULEUR: Record<Palier, string> = { A: '2', B: '5', C: '6' };

/**
 * Le compte de service n'a pas d'agenda propre : l'agenda cible doit être
 * partagé avec son adresse en « Apporter des modifications aux événements ».
 */
function agenda() {
  const auth = new google.auth.JWT({
    email: env('GOOGLE_SA_EMAIL'),
    // Clé privée stockée avec des \n échappés.
    key: env('GOOGLE_SA_PRIVATE_KEY').replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar.events'],
  });
  return google.calendar({ version: 'v3', auth });
}

export type EvenementDemande = {
  date: string;
  circuit: string;
  palier: Palier;
  prenom: string;
  nom: string;
  km: number;
  formule: string;
  tarif: number;
  compris: string;
  email: string;
  telephone: string;
  experience: string;
  flexibilite: string;
  accompagnants: string;
  message?: string;
  lienNotion: string;
};

/** Journée entière sur la date, fuseau Europe/Paris. */
export async function creerEvenement(d: EvenementDemande): Promise<string | null> {
  const lendemain = new Date(`${d.date}T00:00:00Z`);
  lendemain.setUTCDate(lendemain.getUTCDate() + 1);

  const description = [
    `Formule : ${d.formule} (${d.km} km)`,
    `Tarif TTC : ${d.tarif} €`,
    `Compris : ${d.compris}`,
    '',
    `Contact : ${d.prenom} ${d.nom} — ${d.email} — ${d.telephone}`,
    `Expérience : ${d.experience}`,
    `Flexibilité : ${d.flexibilite}`,
    `Accompagnants : ${d.accompagnants}`,
    d.message ? `Message : ${d.message}` : null,
    '',
    `Page Notion : ${d.lienNotion}`,
  ]
    .filter((l) => l !== null)
    .join('\n');

  const r = await agenda().events.insert({
    calendarId: env('GOOGLE_CALENDAR_ID'),
    requestBody: {
      summary: `GT3 992.2 — ${d.circuit} — ${d.prenom} ${d.nom} (${d.km} km)`,
      location: d.circuit,
      description,
      colorId: COULEUR[d.palier],
      start: { date: d.date, timeZone: 'Europe/Paris' },
      end: { date: lendemain.toISOString().slice(0, 10), timeZone: 'Europe/Paris' },
      // TODO-DATA §7 : inviter le client ? Son adresse serait visible par tous
      // les invités de l'événement. Laissé vide jusqu'à arbitrage.
    },
  });
  return r.data.htmlLink ?? null;
}
