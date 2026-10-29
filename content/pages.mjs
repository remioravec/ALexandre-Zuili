/**
 * Contenu des pages réelles. Un objet = une URL de la feuille ROADMAP CONTENU.
 *
 * Règle de fond : aucun chiffre inventé. Les tarifs viennent de la grille
 * qui fait autorité (src/lib/circuits.ts, palier B pour Le Mans et
 * Magny-Cours), les éléments de circuit sont ceux publiés par les
 * exploitants, et ce qui n'est pas vérifié n'est pas écrit.
 */

const CTA = (t = 'Voir les dates disponibles') =>
  `<p class="pcta"><a class="btn btn-1" href="/#reserver">${t}</a> <a class="btn btn-2" href="tel:+33638685961">06 38 68 59 61</a></p>`;

const GRILLE_B = `<div class="tarifs">
  <table>
    <caption>Tarifs TTC au Mans et à Magny-Cours — coaching, carburant et inscription circuit compris.</caption>
    <thead><tr><th scope="col">Formule</th><th scope="col">Distance</th><th scope="col">Tarif</th></tr></thead>
    <tbody>
      <tr><th scope="row">Découverte</th><td>90 km</td><td>2 430 €</td></tr>
      <tr><th scope="row">Performance</th><td>140 km</td><td>3 690 €</td></tr>
      <tr><th scope="row">VIP GT3 Touring</th><td>200 km</td><td>4 800 €</td></tr>
      <tr><th scope="row">Exclusive</th><td>300 km</td><td>6 500 €</td></tr>
    </tbody>
  </table>
</div>`;

const COMPRIS = `<ul class="liste">
  <li><b>Le moniteur à droite</b>, sur tous les tours, pas seulement au premier relais.</li>
  <li><b>Le carburant</b>, quelle que soit la distance retenue.</li>
  <li><b>L'inscription au circuit</b> et les droits de piste.</li>
  <li><b>La voiture pour vous seul</b> : une 911 GT3 992.2 Touring, pas une file d'attente.</li>
</ul>`;

export const pages = [
  /* ───────────────────────── silo : stage de pilotage ───────────────────── */
  {
    url: '/stage-de-pilotage/',
    title: 'Stage de pilotage sur circuit — une GT3 992.2 à la journée | DRS Experience',
    description:
      "Stage de pilotage sur circuit au volant d'une Porsche 911 GT3 992.2 Touring, moniteur à droite : de 90 à 300 km, carburant et inscription compris, huit circuits.",
    fil: [{ nom: 'Stage de pilotage sur circuit' }],
    service: true,
    corps: `
<section class="band">
  <div class="shell">
    <p class="label rise">Location de voiture sur circuit</p>
    <h1 class="rise">Stage de pilotage sur circuit</h1>
    <div class="brief rise">
      <p>La plupart des <b>stages de pilotage</b> se vendent au tour : trois à six boucles dans une voiture partagée avec dix autres personnes, casque prêté, moniteur au premier relais puis au revoir. C'est une belle entrée en matière, et ce n'est pas ce que nous faisons.</p>
      <p>Chez DRS Experience, vous réservez une <b>journée</b> : une Porsche 911 GT3 992.2 Touring qui ne roule qu'avec vous, un moniteur professionnel assis à droite du premier au dernier tour, et une distance qui se compte en kilomètres — de 90 à 300 — pas en tours.</p>
      <div class="keys">
        <span class="key">De <b>90 à 300 km</b> au volant</span>
        <span class="key">Moniteur <b>sur tous les tours</b></span>
        <span class="key"><b>8 circuits</b> en France et en Belgique</span>
        <span class="key">Permis B — <b>aucune expérience requise</b></span>
      </div>
      ${CTA('Demander une date')}
    </div>
  </div>
</section>

<section class="band">
  <div class="shell">
    <div class="hd rise"><h2>Tours comptés ou kilomètres : ce que vous achetez vraiment</h2></div>
    <div class="rise texte">
      <p>Le marché du stage de pilotage affiche aujourd'hui des offres à partir de 107 à 250 € selon les circuits et les organisateurs. Ce prix achète, presque partout, le même produit : <b>quelques tours</b> dans une voiture d'école partagée, sur un tracé souvent raccourci, avec un briefing collectif.</p>
      <p>Une journée DRS n'a pas le même objet. Vous ne venez pas goûter, vous venez <b>progresser</b> : il faut des kilomètres, une voiture qui ne change pas de réglage entre deux pilotes, et quelqu'un à droite qui voit ce que vous faites et vous le dit entre chaque session. La différence de prix n'est pas une marge, c'est une différence de nature.</p>
      <p>Si ce que vous cherchez est un baptême d'une demi-heure, un stage classique vous servira mieux, et nous vous le dirons. Si vous voulez repartir avec deux secondes au tour en moins et comprendre pourquoi, c'est ici.</p>
    </div>
  </div>
</section>

<section class="band">
  <div class="shell">
    <div class="hd rise"><h2>La voiture : une 911 GT3 992.2 Touring</h2></div>
    <div class="duo flat rise" style="aspect-ratio:3/2;max-width:760px">
      <img src="/assets/studio-trois-quarts.webp" alt="Porsche 911 GT3 992.2 Touring vue de trois quarts avant, peinture Neo Oak Green" width="1250" height="833" loading="lazy">
    </div>
    <div class="rise texte">
      <p>Un flat-six atmosphérique de 4,0 litres, <b>510 chevaux</b>, une boîte PDK à sept rapports et surtout <b>2,8 kg par cheval</b> : la 992.2 n'est pas la voiture la plus puissante qu'on puisse louer sur circuit, elle est celle qui se place le mieux. Les roues arrière directrices, nouvelles sur cette génération, font rentrer la voiture dans les épingles sans qu'on ait à la brusquer.</p>
      <p>C'est précisément ce qui en fait une bonne voiture d'apprentissage : elle pardonne, elle parle, et elle reste rapide quand le pilote devient précis. Sur un tracé technique, elle tient le rythme de sportives beaucoup plus puissantes.</p>
    </div>
  </div>
</section>

<section class="band">
  <div class="shell">
    <div class="hd rise"><h2>Le moniteur fait partie de la prestation</h2></div>
    <div class="rise texte">
      <p><a href="/le-moniteur/">Guillaume Léger</a>, moniteur de pilotage et fondateur de GL Coaching Racing, accompagne chaque roulage. Il est à droite sur tous les tours : trajectoires, points de freinage, placement du regard, et un débrief entre chaque session plutôt qu'un bilan expédié à la fin de la journée.</p>
      <p>Son tarif n'est pas une option ajoutée au devis : il est déjà compris dans les prix ci-dessous.</p>
    </div>
  </div>
</section>

<section class="band">
  <div class="shell">
    <div class="hd rise"><h2>Les formules et les tarifs</h2></div>
    ${GRILLE_B}
    <div class="rise texte">
      <p>Les tarifs ci-dessus valent pour <a href="/stage-de-pilotage/le-mans/">Le Mans</a>, <a href="/stage-de-pilotage/magny-cours/">Magny-Cours</a>, Dijon-Prenois et La Ferté-Gaucher. Clastres et Les Écuyers, plus courts, démarrent à 820 € les 50 km ; Paul Ricard et Spa-Francorchamps, où le transport du véhicule est compris, démarrent à 3 490 € les 90 km.</p>
      <h3>Ce qui est compris</h3>
      ${COMPRIS}
      ${CTA()}
    </div>
  </div>
</section>

<section class="band">
  <div class="shell">
    <div class="hd rise"><h2>Les huit circuits</h2></div>
    <div class="rise texte">
      <p>Deux circuits ont leur page : <a href="/stage-de-pilotage/le-mans/">le Bugatti, au Mans</a>, et <a href="/stage-de-pilotage/magny-cours/">Magny-Cours</a>. Les six autres — Dijon-Prenois, Paul Ricard au Castellet, Spa-Francorchamps, La Ferté-Gaucher, Clastres et Les Écuyers — se réservent de la même façon, depuis le calendrier de l'<a href="/">accueil</a>.</p>
      <p>Le choix du circuit change trois choses : le tarif, la distance qu'il est raisonnable de couvrir dans la journée, et le type de progression. Un tracé court et technique travaille le placement ; un grand tracé travaille le rythme et la lecture des appuis. Si vous hésitez, appelez-nous : c'est une conversation de trois minutes.</p>
      ${CTA('Voir les dates disponibles')}
    </div>
  </div>
</section>`,
    faq: [
      ['Faut-il avoir déjà roulé sur circuit&nbsp;?',
       "Non. Le rythme est calé sur le vôtre, et la 992.2 est une voiture facile à placer. Un permis B en cours de validité suffit."],
      ['Le moniteur est-il obligatoire&nbsp;?',
       "Il est systématique, et compris dans le prix affiché. C'est ce qui distingue une journée DRS d'une location sèche."],
      ['Que se passe-t-il si la météo est mauvaise&nbsp;?',
       "Le roulage se fait sous la pluie comme au sec, c'est même le meilleur moment pour travailler la douceur. Les reports éventuels sont décidés avec le circuit et discutés avec vous."],
      ['Peut-on offrir une journée&nbsp;?',
       "Oui, sous forme de bon valable un an. Le bénéficiaire choisit ensuite son circuit et sa date."],
    ],
  },

  /* ───────────────────────── fille : Le Mans ───────────────────────────── */
  {
    url: '/stage-de-pilotage/le-mans/',
    title: 'Stage de pilotage au Mans — GT3 992.2 sur le Bugatti | DRS Experience',
    description:
      "Stage de pilotage au Mans sur le circuit Bugatti, au volant d'une Porsche 911 GT3 992.2 avec moniteur : 90 à 300 km, carburant et inscription compris.",
    fil: [{ nom: 'Stage de pilotage sur circuit', url: '/stage-de-pilotage/' }, { nom: 'Le Mans' }],
    service: true,
    corps: `
<section class="band">
  <div class="shell">
    <p class="label rise">Sarthe · circuit Bugatti</p>
    <h1 class="rise">Stage de pilotage au Mans</h1>
    <div class="brief rise">
      <p>Le <b>Bugatti</b> est le tracé permanent du complexe des 24 Heures du Mans : <b>4,185 km et 13 virages</b>, dont la portion qui emprunte la piste des 24 Heures. À côté, le circuit <b>Maison Blanche</b> (1,9 km) sert de piste école. C'est sur le Bugatti que nous emmenons la GT3.</p>
      <div class="keys">
        <span class="key"><b>4,185 km</b> · 13 virages</span>
        <span class="key">À <b>2 h de Paris</b></span>
        <span class="key">De <b>90 à 300 km</b> au volant</span>
      </div>
      ${CTA('Demander une date au Mans')}
    </div>
  </div>
</section>

<section class="band">
  <div class="shell">
    <div class="hd rise"><h2>Ce que la 992.2 fait sur le Bugatti</h2></div>
    <div class="duo flat rise" style="aspect-ratio:16/9;max-width:760px">
      <img src="/assets/circuit-le-mans-bugatti.webp" alt="La Porsche 911 GT3 992.2 Touring lancée sur le circuit Bugatti du Mans" width="760" height="427" loading="lazy">
    </div>
    <div class="rise texte">
      <p>Le Bugatti enchaîne des freinages appuyés et des virages lents, puis libère la voiture sur la portion rapide. C'est un tracé qui sanctionne le pilote approximatif à l'entrée et récompense celui qui ressort tôt : exactement le terrain où les <b>roues arrière directrices</b> de la 992.2 se voient, parce qu'elles raccourcissent la voiture là où elle devrait patiner.</p>
      <p>Concrètement, la journée se découpe en relais de vingt à vingt-cinq minutes, entrecoupés de débriefs. Le premier relais sert à reconnaître ; à partir du deuxième, on travaille un point précis — un freinage, une courbe, un enchaînement — et on le mesure au chrono.</p>
    </div>
  </div>
</section>

<section class="band">
  <div class="shell">
    <div class="hd rise"><h2>Tarifs au Mans</h2></div>
    ${GRILLE_B}
    <div class="rise texte">
      <h3>Ce qui est compris</h3>
      ${COMPRIS}
      <p>Le circuit du Mans est l'un des plus demandés de France : les dates ouvertes partent vite, et le calendrier de l'<a href="/">accueil</a> affiche celles qui restent, circuit par circuit.</p>
      ${CTA('Voir les dates au Mans')}
    </div>
  </div>
</section>

<section class="band">
  <div class="shell">
    <div class="hd rise"><h2>Y aller, et préparer sa journée</h2></div>
    <div class="rise texte">
      <p>Le circuit se trouve au sud du Mans, à environ deux heures de Paris et deux heures et demie de Rennes. Prévoyez des vêtements couvrants et des chaussures fines ; le casque est fourni. Le reste — inscription, carburant, accès piste — est déjà réglé quand vous arrivez.</p>
      <p>Vous hésitez avec un autre tracé&nbsp;? <a href="/stage-de-pilotage/magny-cours/">Magny-Cours</a> est au même tarif et offre un tout autre caractère, et la page <a href="/stage-de-pilotage/">stage de pilotage</a> compare les formats. Le parcours du moniteur est détaillé sur <a href="/le-moniteur/">sa page</a>.</p>
    </div>
  </div>
</section>`,
    faq: [
      ['Roule-t-on sur le circuit des 24 Heures&nbsp;?',
       "Le Bugatti emprunte une partie du tracé des 24 Heures, dont la ligne droite des stands. La boucle complète des 24 Heures, elle, utilise des routes ouvertes et n'est pas accessible hors épreuve."],
      ['Quelle différence avec le circuit Maison Blanche&nbsp;?',
       "Maison Blanche est la piste école du complexe, courte et large, utilisée par les stages grand public. Nous roulons sur le Bugatti, le tracé permanent de 4,185 km."],
      ['Combien de tours représentent 140 km&nbsp;?',
       "Environ 33 tours du Bugatti, répartis sur la journée en relais encadrés. C'est la formule Performance, à 3 690 €."],
      ['Peut-on venir accompagné&nbsp;?',
       "Oui. L'accompagnant assiste à la journée depuis les stands ; le partage du volant entre deux pilotes se discute sur la formule 200 km."],
    ],
  },

  /* ───────────────────────── fille : Magny-Cours ───────────────────────── */
  {
    url: '/stage-de-pilotage/magny-cours/',
    title: 'Stage de pilotage à Magny-Cours — GT3 992.2 | DRS Experience',
    description:
      "Stage de pilotage à Magny-Cours en Porsche 911 GT3 992.2 avec moniteur à droite : de 90 à 300 km, carburant et inscription circuit compris.",
    fil: [{ nom: 'Stage de pilotage sur circuit', url: '/stage-de-pilotage/' }, { nom: 'Magny-Cours' }],
    service: true,
    corps: `
<section class="band">
  <div class="shell">
    <p class="label rise">Nièvre · circuit de Nevers Magny-Cours</p>
    <h1 class="rise">Stage de pilotage à Magny-Cours</h1>
    <div class="brief rise">
      <p>Magny-Cours a reçu le <b>Grand Prix de France de Formule 1</b> jusqu'en 2008. Son tracé Grand Prix reste l'un des mieux entretenus du pays, et le tracé Club, plus court (environ 2,5 km), sert aux formats d'initiation. Nous y emmenons la 911 GT3 992.2 Touring.</p>
      <div class="keys">
        <span class="key">Ancien tracé <b>F1</b></span>
        <span class="key">De <b>90 à 300 km</b> au volant</span>
        <span class="key">Moniteur <b>sur tous les tours</b></span>
      </div>
      ${CTA('Demander une date à Magny-Cours')}
    </div>
  </div>
</section>

<section class="band">
  <div class="shell">
    <div class="hd rise"><h2>Un tracé qui apprend le rythme</h2></div>
    <div class="duo flat rise" style="aspect-ratio:3/2;max-width:760px">
      <img src="/assets/circuit-magny-cours.webp" alt="Roulage de la Porsche 911 GT3 992.2 sur le circuit de Nevers Magny-Cours" width="760" height="506" loading="lazy">
    </div>
    <div class="rise texte">
      <p>Là où Le Mans sanctionne les entrées de virage, Magny-Cours demande de la <b>continuité</b> : les appuis s'enchaînent, et une erreur de placement se paie deux virages plus loin. C'est le tracé sur lequel on progresse le plus vite en lecture de trajectoire, parce que la faute y est immédiatement lisible au chrono.</p>
      <p>La journée suit le même découpage qu'ailleurs : reconnaissance, puis des relais de vingt minutes consacrés chacun à un objectif, avec débrief entre chaque. Le moniteur est à droite du premier au dernier tour.</p>
    </div>
  </div>
</section>

<section class="band">
  <div class="shell">
    <div class="hd rise"><h2>Tarifs à Magny-Cours</h2></div>
    ${GRILLE_B}
    <div class="rise texte">
      <h3>Ce qui est compris</h3>
      ${COMPRIS}
      ${CTA('Voir les dates à Magny-Cours')}
    </div>
  </div>
</section>

<section class="band">
  <div class="shell">
    <div class="hd rise"><h2>Avant de réserver</h2></div>
    <div class="rise texte">
      <p>Le circuit se trouve au sud de Nevers, à environ deux heures et demie de Paris et une heure et demie de Lyon. Permis B en cours de validité, vêtements couvrants, chaussures fines : le casque et le reste sont fournis.</p>
      <p>Pour comparer les formats et les distances, voyez la page <a href="/stage-de-pilotage/">stage de pilotage sur circuit</a> ; pour un tracé plus tranchant, <a href="/stage-de-pilotage/le-mans/">le Bugatti au Mans</a> est au même tarif. Le <a href="/le-moniteur/">moniteur</a> est le même sur les deux.</p>
    </div>
  </div>
</section>`,
    faq: [
      ['Roule-t-on sur le tracé Grand Prix&nbsp;?',
       "C'est le tracé que nous privilégions ; l'organisation dépend du calendrier du circuit, qui alterne Grand Prix et Club selon les journées. La date proposée précise le tracé retenu."],
      ['Combien de tours pour la formule 90 km&nbsp;?',
       "De l'ordre d'une vingtaine de tours du Grand Prix, en relais encadrés, pour 2 430 €."],
      ["Faut-il une expérience de la monoplace&nbsp;?",
       "Non, et ce n'est pas le même exercice. Nous roulons en GT, voiture fermée, avec un moniteur à droite — aucune expérience préalable n'est demandée."],
      ['Le transport de la voiture est-il compris&nbsp;?',
       "À Magny-Cours comme au Mans, le tarif comprend le coaching, le carburant et l'inscription au circuit. Le transport du véhicule est compris sur Paul Ricard et Spa-Francorchamps."],
    ],
  },
];
