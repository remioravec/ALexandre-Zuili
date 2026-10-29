/**
 * Générateur des pages réelles (ticket T21).
 *
 * Le site reste un fichier statique : public/index.html porte l'accueil et la
 * vue /le-moniteur/, ce script produit les AUTRES URL de la roadmap contenu,
 * chacune avec son propre title, sa canonique et son balisage.
 *
 * L'en-tête, le pied de page et le bouton d'appel sont DÉCOUPÉS dans
 * index.html, jamais recopiés : une correction du menu vaut pour tout le site
 * au prochain `npm run pages`.
 *
 *   node scripts/pages.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pages } from '../content/pages.mjs';

const RACINE = path.resolve(import.meta.dirname, '..');
const PUB = path.join(RACINE, 'public');
const SITE = 'https://drs-experience.com';

const lire = (p) => fs.readFileSync(path.join(PUB, p), 'utf8');
const empreinte = (p) => crypto.createHash('sha256').update(lire(p)).digest('hex').slice(0, 8);

const index = lire('index.html');
const vCss = empreinte('assets/site.css');
const vJs = empreinte('assets/site.js');

/** Découpe un morceau d'index.html entre deux repères, bornes comprises. */
function morceau(debut, fin) {
  const i = index.indexOf(debut);
  const j = index.indexOf(fin, i);
  if (i < 0 || j < 0) throw new Error(`repère introuvable : ${debut}`);
  return index.slice(i, j + fin.length);
}

const ENTETE = index.slice(index.indexOf('<header class="top" id="top">'), index.indexOf('<div class="view" id="v-home"'));
const PIED = morceau('<footer>', '</footer>');
const APPEL = morceau('<a class="callfab"', '</a>', 1) + '';

/** Sur une page réelle, une ancre de l'accueil doit y ramener. */
const ancresVersAccueil = (h) =>
  h.replace(/href="#(?!main\b)([a-z0-9-]+)"/g, 'href="/#$1"');

const echappe = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function faqJsonLd(faq) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map(([q, r]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: r.replace(/<[^>]+>/g, '') },
    })),
  };
}

function rendre(p) {
  const url = `${SITE}${p.url}`;
  const graphe = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
        ...p.fil.map((f, i) => ({
          '@type': 'ListItem',
          position: i + 2,
          name: f.nom,
          ...(f.url ? { item: `${SITE}${f.url}` } : {}),
        })),
      ],
    },
    {
      '@type': 'WebPage',
      '@id': url,
      name: p.title,
      inLanguage: 'fr-FR',
      isPartOf: { '@type': 'WebSite', url: `${SITE}/` },
      ...(p.service ? { about: { '@id': `${SITE}/#service` } } : {}),
    },
    ...(p.faq?.length ? [faqJsonLd(p.faq)] : []),
  ];

  const fil = `<nav class="crumb" aria-label="Fil d'ariane"><div class="shell"><ol>
    <li><a href="/">Accueil</a></li>
    ${p.fil.map((f, i) => (i === p.fil.length - 1
      ? `<li><span aria-current="page">${echappe(f.nom)}</span></li>`
      : `<li><a href="${f.url}">${echappe(f.nom)}</a></li>`)).join('\n    ')}
  </ol></div></nav>`;

  const faq = p.faq?.length
    ? `<section class="band faq-sec">
  <div class="shell">
    <div class="hd rise"><h2>${echappe(p.faqTitre ?? 'Questions fréquentes')}</h2></div>
    <div class="qa rise">
      ${p.faq.map(([q, r]) => `<details><summary>${echappe(q)}<span class="pm data">+</span></summary><p class="ans">${r}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>`
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${echappe(p.title)}</title>
<meta name="description" content="${echappe(p.description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#141A16">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
<link rel="manifest" href="/site.webmanifest">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="DRS Experience">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${echappe(p.title)}">
<meta property="og:description" content="${echappe(p.description)}">
<meta property="og:image" content="${SITE}/og-drs-experience.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SITE}/og-drs-experience.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v=${vCss}">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graphe })}</script>
</head>
<body class="page">
<a class="skip" href="#main">Aller au contenu</a>

${ancresVersAccueil(ENTETE)}
${fil}
<main id="main">
${p.corps.trim()}
${faq}
</main>

${ancresVersAccueil(PIED)}
${ancresVersAccueil(APPEL)}
<script src="/assets/site.js?v=${vJs}" defer></script>
</body>
</html>
`;
}

/* ── écriture ─────────────────────────────────────────────────────────── */
let n = 0;
for (const p of pages) {
  const dossier = path.join(PUB, p.url.replace(/^\/|\/$/g, ''));
  fs.mkdirSync(dossier, { recursive: true });
  fs.writeFileSync(path.join(dossier, 'index.html'), rendre(p));
  console.log(`  ${p.url.padEnd(38)} ${(fs.statSync(path.join(dossier, 'index.html')).size / 1024).toFixed(1)} Ko`);
  n++;
}

/* L'accueil pointe les mêmes empreintes, sinon le cache d'un an le fige. */
const indexVersionne = index
  .replace(/\/assets\/site\.css(\?v=[a-f0-9]+)?/g, `/assets/site.css?v=${vCss}`)
  .replace(/\/assets\/site\.js(\?v=[a-f0-9]+)?/g, `/assets/site.js?v=${vJs}`);
if (indexVersionne !== index) fs.writeFileSync(path.join(PUB, 'index.html'), indexVersionne);

console.log(`\n${n} page(s) · css ?v=${vCss} · js ?v=${vJs}`);
