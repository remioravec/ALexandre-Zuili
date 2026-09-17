import { Resend } from 'resend';
import { env, envOptionnel } from './env';

let resendClient: Resend | null = null;
function resend(): Resend {
  if (!resendClient) resendClient = new Resend(env('RESEND_API_KEY'));
  return resendClient;
}

export type Demande = {
  reference: string;
  date: string;
  circuit: string;
  formule: string;
  km: number;
  tarif: number;
  compris: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  experience: string;
  flexibilite: string;
  accompagnants: string;
  message?: string;
  lienNotion: string;
  lienAgenda?: string | null;
};

const TEL = '06 38 68 59 61';

function dateLongue(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Paris',
  });
}

const euros = (n: number) => `${n.toLocaleString('fr-FR')} €`;

function echapper(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Table centrée 600 px, sobre. */
function gabarit(titre: string, lignes: [string, string][], apres: string): string {
  const rows = lignes
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;color:#6b6f66;font-size:13px">${echapper(k)}</td>` +
        `<td style="padding:8px 0;text-align:right;color:#141a16;font-size:14px;font-weight:600">${echapper(v)}</td></tr>`,
    )
    .join('');
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f4f3ee;font-family:Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3ee;padding:32px 0">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#fff;border:1px solid #e3e1d7">
<tr><td style="background:#232f27;padding:22px 28px;color:#eae6da;font-size:15px;letter-spacing:.14em;text-transform:uppercase"><b>Apex Drive</b></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 18px;font-size:19px;color:#141a16">${echapper(titre)}</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e3e1d7">${rows}</table>
<div style="margin-top:22px;font-size:14px;color:#3f453d;line-height:1.6">${apres}</div>
</td></tr>
<tr><td style="padding:16px 28px;background:#f8f7f2;color:#6b6f66;font-size:12px">Apex Drive · Porsche 911 GT3 992.2 Touring · ${TEL}</td></tr>
</table></td></tr></table></body></html>`;
}

function lignes(d: Demande): [string, string][] {
  const base: [string, string][] = [
    ['Voiture', 'Porsche 911 GT3 992.2 Touring'],
    ['Circuit', d.circuit],
    ['Date souhaitée', dateLongue(d.date)],
    ['Formule', d.formule],
    ['Distance au volant', `${d.km} km`],
    ['Tarif TTC', euros(d.tarif)],
    ['Compris', d.compris],
    ['Référence', d.reference],
  ];
  return base;
}

/** Client — « Votre demande de réservation ». */
export async function mailClient(d: Demande): Promise<void> {
  const texte = [
    `Bonjour ${d.prenom},`,
    '',
    `Nous avons reçu votre demande pour le ${dateLongue(d.date)} sur ${d.circuit}.`,
    `Formule ${d.formule}, ${d.km} km au volant, ${euros(d.tarif)} TTC.`,
    `Compris : ${d.compris}.`,
    '',
    'AUCUN PAIEMENT N\'A ÉTÉ EFFECTUÉ. Il s\'agit d\'une demande :',
    'nous vérifions la disponibilité de la voiture et revenons vers vous sous 24 heures.',
    '',
    `Référence : ${d.reference}`,
    `Une question ? ${TEL}`,
  ].join('\n');

  await resend().emails.send({
    from: env('MAIL_FROM'),
    to: d.email,
    subject: 'Votre demande de réservation — Porsche 911 GT3 992.2',
    text: texte,
    html: gabarit('Votre demande de réservation', lignes(d), [
      `<p style="margin:0 0 12px"><b>Aucun paiement n'a été effectué.</b> Il s'agit d'une demande : nous vérifions la disponibilité de la 992.2 et revenons vers vous <b>sous 24 heures</b>.</p>`,
      `<p style="margin:0">Une question ? Appelez-nous au <b>${TEL}</b>.</p>`,
    ].join('')),
  });
}

/** Interne — « Nouvelle demande — {Circuit} — {Date} ». */
export async function mailInterne(d: Demande): Promise<void> {
  const destinataires = env('MAIL_INTERNAL')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const brut: [string, string][] = [
    ...lignes(d),
    ['Pilote', `${d.prenom} ${d.nom}`],
    ['Email', d.email],
    ['Téléphone', d.telephone],
    ['Expérience', d.experience],
    ['Flexibilité', d.flexibilite],
    ['Accompagnants', d.accompagnants],
    ...((d.message ? [['Message', d.message]] : []) as [string, string][]),
  ];

  const liens =
    `<p style="margin:0 0 8px"><a href="${d.lienNotion}">Ouvrir la page Notion</a></p>` +
    (d.lienAgenda ? `<p style="margin:0"><a href="${d.lienAgenda}">Ouvrir l'événement d'agenda</a></p>` : '');

  await resend().emails.send({
    from: env('MAIL_FROM'),
    to: destinataires,
    replyTo: d.email, // répondre au client en un clic
    subject: `Nouvelle demande — ${d.circuit} — ${dateLongue(d.date)}`,
    text: [
      ...brut.map(([k, v]) => `${k} : ${v}`),
      '',
      `Notion : ${d.lienNotion}`,
      d.lienAgenda ? `Agenda : ${d.lienAgenda}` : '',
    ].join('\n'),
    html: gabarit(`Nouvelle demande — ${d.circuit}`, brut, liens),
  });
}

/** Expéditeur non vérifié chez Resend = tout part en spam (§12, bloquant 7). */
export const domaineExpediteur = () => envOptionnel('MAIL_FROM');
