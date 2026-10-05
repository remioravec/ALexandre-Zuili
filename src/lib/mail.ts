import { Resend } from 'resend';
import nodemailer, { type Transporter } from 'nodemailer';
import { env, envOptionnel } from './env';

/**
 * Deux voies d'envoi, une seule à configurer.
 *
 *  - RESEND_API_KEY → Resend. Propre et scalable, mais tant que le domaine
 *    n'est pas vérifié, Resend n'accepte d'écrire qu'à l'adresse du
 *    titulaire du compte : suffisant pour la notification interne, pas pour
 *    le client.
 *  - SMTP_USER + SMTP_PASS → SMTP Gmail (mot de passe d'application). Écrit
 *    à n'importe qui immédiatement, ~500 envois par jour. C'est le repli
 *    prévu au §2 de la spéc, et la voie la plus rapide à ouvrir.
 *
 * Si aucune n'est configurée, `env()` lève une erreur nommant RESEND_API_KEY.
 */
export type Voie = 'resend' | 'smtp' | 'aucune';
export function voieMail(): Voie {
  if (envOptionnel('RESEND_API_KEY')) return 'resend';
  if (envOptionnel('SMTP_USER') && envOptionnel('SMTP_PASS')) return 'smtp';
  return 'aucune';
}

let resendClient: Resend | null = null;
function resend(): Resend {
  if (!resendClient) resendClient = new Resend(env('RESEND_API_KEY'));
  return resendClient;
}

let smtp: Transporter | null = null;
function transport(): Transporter {
  if (!smtp) {
    smtp = nodemailer.createTransport({
      host: envOptionnel('SMTP_HOST') ?? 'smtp.gmail.com',
      port: Number(envOptionnel('SMTP_PORT') ?? 465),
      secure: (envOptionnel('SMTP_PORT') ?? '465') === '465',
      auth: { user: env('SMTP_USER'), pass: env('SMTP_PASS') },
    });
  }
  return smtp;
}

type Envoi = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

/** Expéditeur : MAIL_FROM, ou l'adresse SMTP elle-même en repli. */
function expediteur(): string {
  return envOptionnel('MAIL_FROM') ?? env('SMTP_USER');
}

async function envoyer(m: Envoi): Promise<void> {
  if (voieMail() === 'smtp') {
    await transport().sendMail({
      from: `DRS Experience <${expediteur()}>`,
      to: Array.isArray(m.to) ? m.to.join(', ') : m.to,
      subject: m.subject,
      text: m.text,
      html: m.html,
      ...(m.replyTo ? { replyTo: m.replyTo } : {}),
    });
    return;
  }
  const r = await resend().emails.send({
    from: expediteur(),
    to: m.to,
    subject: m.subject,
    text: m.text,
    html: m.html,
    ...(m.replyTo ? { replyTo: m.replyTo } : {}),
  });
  if (r.error) throw new Error(`Resend : ${r.error.message}`);
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

/**
 * Gabarit d'e-mail, à la direction artistique du site : Neo Oak Green
 * (#3D5343 / #232F27 / #141A16 sur fond os #EAE6DA).
 *
 * Contraintes propres à l'e-mail, respectées ici : tables imbriquées plutôt
 * que flexbox ou grid, styles en ligne uniquement, largeur fixe de 600 px,
 * aucune image distante — les clients de messagerie bloquent les images par
 * défaut, donc tout le visuel tient dans des fonds de cellule et du texte.
 */
const OAK = '#3D5343';
const OAK_DEEP = '#232F27';
const INK = '#141A16';
const BONE = '#EAE6DA';
const PAPIER = '#F4F3EE';
const TRAIT = '#E3E1D7';
const GRIS = '#6B6F66';

type Bloc = { titre: string; valeur: string; fort?: boolean };

/** Bandeau de marque, repris du header du site : wordmark + filet + baseline. */
function enTete(): string {
  return `<tr><td style="background:${OAK_DEEP};padding:26px 32px">
  <div style="font-size:17px;letter-spacing:.16em;text-transform:uppercase;color:${BONE};font-weight:700">DRS Experience</div>
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:9px"><tr>
    <!-- Le filet passe par un div de 1px : une cellule avec height:1px est
         étirée par la hauteur de sa voisine et rend un pavé gris. -->
    <td width="22" style="padding:0;vertical-align:middle"><div style="height:1px;line-height:1px;font-size:1px;background:rgba(234,230,218,.45);overflow:hidden">&#8203;</div></td>
    <td style="padding-left:9px;font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:#A5A79B;vertical-align:middle">911 GT3 &middot; 992.2</td>
  </tr></table>
</td></tr>`;
}

function piedDePage(): string {
  return `<tr><td style="padding:18px 32px;background:#F8F7F2;border-top:1px solid ${TRAIT};color:${GRIS};font-size:11px;line-height:1.7">
  DRS Experience &middot; Porsche 911 GT3 992.2 Touring &middot; <a href="tel:+33638685961" style="color:${GRIS};text-decoration:none">${TEL}</a><br>
  <a href="https://drs-experience.com" style="color:${GRIS}">drs-experience.com</a>
</td></tr>`;
}

/** Le bloc qui porte l'essentiel : date, circuit, formule, tarif. */
function carte(d: Demande): string {
  const blocs: Bloc[] = [
    { titre: 'Date souhaitée', valeur: dateLongue(d.date), fort: true },
    { titre: 'Circuit', valeur: d.circuit },
    { titre: 'Formule', valeur: `${d.formule} · ${d.km} km au volant` },
    { titre: 'Tarif TTC', valeur: euros(d.tarif), fort: true },
  ];
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPIER};border:1px solid ${TRAIT}">
  ${blocs
    .map(
      (b, i) => `<tr>
    <td style="padding:${i === 0 ? '18px' : '12px'} 22px ${i === blocs.length - 1 ? '18px' : '12px'};${i ? `border-top:1px solid ${TRAIT};` : ''}">
      <div style="font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:${GRIS}">${echapper(b.titre)}</div>
      <div style="margin-top:5px;font-size:${b.fort ? '20px' : '15px'};font-weight:${b.fort ? '700' : '600'};color:${b.fort ? OAK : INK};line-height:1.3">${echapper(b.valeur)}</div>
    </td></tr>`,
    )
    .join('')}
</table>`;
}

/** Lignes clé/valeur sobres, pour le détail secondaire et l'e-mail interne. */
function tableau(lignes: [string, string][]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${lignes
    .map(
      ([k, v], i) =>
        `<tr>
      <td style="padding:9px 0;${i ? `border-top:1px solid ${TRAIT};` : ''}color:${GRIS};font-size:12px;width:42%;vertical-align:top">${echapper(k)}</td>
      <td style="padding:9px 0;${i ? `border-top:1px solid ${TRAIT};` : ''}color:${INK};font-size:13px;font-weight:600;text-align:right">${echapper(v)}</td>
    </tr>`,
    )
    .join('')}</table>`;
}

/** Encadré d'avertissement, pour la mention « aucun paiement ». */
function encadre(texte: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid ${OAK};border-left:3px solid ${OAK}">
  <tr><td style="padding:14px 18px;font-size:13px;line-height:1.6;color:${INK}">${texte}</td></tr>
</table>`;
}

function bouton(href: string, libelle: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td style="background:${OAK};padding:12px 24px">
      <a href="${href}" style="color:${BONE};font-size:12px;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;font-weight:700">${echapper(libelle)}</a>
    </td></tr></table>`;
}

function page(titre: string, corps: string): string {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${echapper(titre)}</title></head>
<body style="margin:0;padding:0;background:${PAPIER};-webkit-font-smoothing:antialiased">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPIER};padding:28px 12px;font-family:Helvetica,Arial,sans-serif">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#FFFFFF;border:1px solid ${TRAIT}">
${enTete()}
<tr><td style="padding:30px 32px">
<h1 style="margin:0 0 20px;font-size:19px;line-height:1.35;color:${INK};font-weight:700">${echapper(titre)}</h1>
${corps}
</td></tr>
${piedDePage()}
</table>
</td></tr></table></body></html>`;
}

/** Client — « Votre demande de réservation ». */
export async function mailClient(d: Demande): Promise<void> {
  const texte = [
    `Bonjour ${d.prenom},`,
    '',
    `Nous avons bien reçu votre demande de roulage sur ${d.circuit}.`,
    '',
    `Date souhaitée : ${dateLongue(d.date)}`,
    `Formule        : ${d.formule}, ${d.km} km au volant`,
    `Tarif TTC      : ${euros(d.tarif)}`,
    `Compris        : ${d.compris}`,
    `Référence      : ${d.reference}`,
    '',
    "AUCUN PAIEMENT N'A ÉTÉ EFFECTUÉ.",
    "Il s'agit d'une demande : nous vérifions la disponibilité de la 992.2",
    'et revenons vers vous sous 24 heures.',
    '',
    `Une question ? Appelez-nous au ${TEL}.`,
    '',
    'DRS Experience — Porsche 911 GT3 992.2 Touring',
    'https://drs-experience.com',
  ].join('\n');

  const corps = [
    `<p style="margin:0 0 20px;font-size:14px;line-height:1.65;color:${INK}">Bonjour <b>${echapper(d.prenom)}</b>,<br>nous avons bien reçu votre demande de roulage. Voici ce que nous avons enregistré&nbsp;:</p>`,
    carte(d),
    `<p style="margin:20px 0 10px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:${GRIS}">Compris dans la formule</p>`,
    `<p style="margin:0 0 22px;font-size:13px;line-height:1.6;color:${INK}">${echapper(d.compris)}</p>`,
    encadre(
      `<b>Aucun paiement n'a été effectué.</b> Il s'agit d'une demande : nous vérifions la disponibilité de la 992.2 et revenons vers vous <b>sous 24 heures</b>.`,
    ),
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px"><tr>
      <td>${bouton(`tel:+33638685961`, 'Nous appeler')}</td>
      <td style="text-align:right;font-size:12px;color:${GRIS};line-height:1.6">Référence<br><b style="color:${INK};font-size:14px;letter-spacing:.06em">${echapper(d.reference)}</b></td>
    </tr></table>`,
  ].join('');

  await envoyer({
    to: d.email,
    subject: `Votre demande de réservation — ${d.circuit}, ${dateLongue(d.date)}`,
    text: texte,
    html: page('Votre demande de réservation', corps),
  });
}

/** Interne — « Nouvelle demande — {Circuit} — {Date} ». */
export async function mailInterne(d: Demande): Promise<void> {
  const destinataires = env('MAIL_INTERNAL')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const pilote: [string, string][] = [
    ['Pilote', `${d.prenom} ${d.nom}`],
    ['Email', d.email],
    ['Téléphone', d.telephone],
    ['Expérience', d.experience],
    ['Flexibilité', d.flexibilite],
    ['Accompagnants', d.accompagnants],
    ['Référence', d.reference],
  ];

  const corps = [
    carte(d),
    `<p style="margin:24px 0 10px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:${GRIS}">Le pilote</p>`,
    tableau(pilote),
    ...(d.message
      ? [
          `<p style="margin:24px 0 10px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:${GRIS}">Message</p>`,
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPIER};border-left:3px solid ${TRAIT}">
            <tr><td style="padding:14px 18px;font-size:13px;line-height:1.6;color:${INK};white-space:pre-wrap">${echapper(d.message)}</td></tr></table>`,
        ]
      : []),
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:26px"><tr>
      <td style="padding-right:10px">${bouton(d.lienNotion, 'Ouvrir dans Notion')}</td>
      ${d.lienAgenda ? `<td>${bouton(d.lienAgenda, "Voir l'agenda")}</td>` : ''}
    </tr></table>`,
    `<p style="margin:22px 0 0;font-size:12px;color:${GRIS};line-height:1.6">Répondre à ce message écrit directement à <b style="color:${INK}">${echapper(d.email)}</b>.</p>`,
  ].join('');

  await envoyer({
    to: destinataires,
    replyTo: d.email, // répondre au client en un clic
    subject: `Nouvelle demande — ${d.circuit} — ${dateLongue(d.date)}`,
    text: [
      `NOUVELLE DEMANDE — ${d.circuit} — ${dateLongue(d.date)}`,
      '',
      `Formule   : ${d.formule}, ${d.km} km`,
      `Tarif TTC : ${euros(d.tarif)}`,
      `Compris   : ${d.compris}`,
      '',
      ...pilote.map(([k, v]) => `${k.padEnd(14)}: ${v}`),
      ...(d.message ? ['', `Message   : ${d.message}`] : []),
      '',
      `Notion : ${d.lienNotion}`,
      ...(d.lienAgenda ? [`Agenda : ${d.lienAgenda}`] : []),
    ].join('\n'),
    html: page(`Nouvelle demande — ${d.circuit}`, corps),
  });
}

/** Expéditeur non vérifié chez Resend = tout part en spam (§12, bloquant 7). */
export const domaineExpediteur = () => envOptionnel('MAIL_FROM');
