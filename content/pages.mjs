/**
 * Contenu des pages réelles. Un objet = une URL de la feuille ROADMAP CONTENU.
 *
 * Règle de fond : aucun chiffre inventé. Les tarifs viennent de la grille
 * qui fait autorité (src/lib/circuits.ts, palier B pour Le Mans et
 * Magny-Cours), les éléments de circuit sont ceux publiés par les
 * exploitants, et ce qui n'est pas vérifié n'est pas écrit.
 */

const CTA3 = `<div class="cta3">
  <a class="btn btn-1" href="/#reserver">Réserver une date</a>
  <a class="btn btn-2" href="tel:+33638685961">06 38 68 59 61</a>
  <span class="q">Une question avant de réserver&nbsp;? <a href="#faq-page">Voir les questions fréquentes</a></span>
</div>`;

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
      <p>Trois pages détaillent un circuit : <a href="/stage-de-pilotage/le-mans/">le Bugatti, au Mans</a>, <a href="/stage-de-pilotage/magny-cours/">Magny-Cours</a> et, au départ de Paris, <a href="/stage-de-pilotage/ile-de-france/">La Ferté-Gaucher en Île-de-France</a>. Les cinq autres — Dijon-Prenois, Paul Ricard au Castellet, Spa-Francorchamps, Clastres et Les Écuyers — se réservent de la même façon, depuis le calendrier de l'<a href="/">accueil</a>.</p>
      <p>Si c'est la voiture qui vous amène plutôt que le lieu, la page <a href="/location-porsche-gt3/">location de Porsche GT3 sur circuit</a> détaille ce que comprend la journée.</p>
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
  /* ──────────── fille commerciale : louer la GT3 sur circuit ──────────── */
  {
    url: '/location-porsche-gt3/',
    title: 'Location Porsche GT3 sur circuit — la 992.2 à la journée | DRS Experience',
    description:
      "Location d'une Porsche 911 GT3 992.2 Touring sur circuit, moniteur à droite : de 90 à 300 km, carburant et inscription compris, huit circuits en France et en Belgique.",
    fil: [{ nom: 'Location Porsche GT3 sur circuit' }],
    service: true,
    corps: `
<section class="band">
  <div class="shell">
    <p class="label rise">Porsche 911 GT3 992.2 Touring</p>
    <h1 class="rise">Louer une Porsche GT3 sur circuit</h1>
    <div class="brief rise">
      <p>Une <b>location de Porsche GT3 sur circuit</b>, ce n'est pas une location de voiture à laquelle on ajoute une piste. C'est une journée : la 911 GT3 992.2 Touring ne roule qu'avec vous, un moniteur professionnel est assis à droite du premier au dernier tour, et la distance se compte en kilomètres — de 90 à 300 — pas en tours.</p>
      <div class="keys">
        <span class="key"><b>510 ch</b> · 2,8 kg par cheval</span>
        <span class="key">De <b>90 à 300 km</b> au volant</span>
        <span class="key">Carburant et inscription <b>compris</b></span>
      </div>
      ${CTA3}
    </div>
    <nav class="toc rise" aria-label="Sommaire">
      <p>Sur cette page</p>
      <ol>
        <li><a href="#route-ou-piste">Louer une Porsche pour la route ou pour la piste ?</a></li>
        <li><a href="#ce-que-vous-louez">Ce que vous louez exactement</a></li>
        <li><a href="#tours-ou-km">Tours comptés ou kilomètres : l'écart en un coup d'œil</a></li>
        <li><a href="#tarifs">Les tarifs par circuit</a></li>
        <li><a href="#choisir">Trois questions pour choisir votre distance</a></li>
      </ol>
    </nav>
  </div>
</section>

<section class="band" id="route-ou-piste">
  <div class="shell">
    <div class="hd rise"><h2>Louer une Porsche pour la route ou pour la piste ?</h2></div>
    <div class="rise texte">
      <p>Les deux existent, et ce ne sont pas les mêmes métiers. Si vous cherchez une Porsche <b>pour la route</b> — un week-end, un mariage, un déplacement — les loueurs généralistes et les plateformes entre particuliers font cela très bien, à la journée ou à la semaine.</p>
      <p>Ici, la voiture ne sort pas sur route ouverte. Elle est préparée pour la piste, chaussée pour la piste, et elle vous est confiée <b>sur un circuit fermé, avec un moniteur</b>. Vous n'avez ni assurance personnelle à engager sur la route, ni kilométrage à surveiller : vous avez une journée de roulage.</p>
      <p>Si c'est la route que vous cherchez, nous ne sommes pas le bon interlocuteur, et autant le dire tout de suite. Si c'est la piste, la suite de cette page vous dit exactement ce que vous achetez.</p>
    </div>
  </div>
</section>

<section class="band" id="ce-que-vous-louez">
  <div class="shell">
    <div class="hd rise"><h2>Ce que vous louez exactement</h2></div>
    <div class="duo flat rise" style="aspect-ratio:3/2;max-width:760px">
      <img src="/assets/studio-trois-quarts.webp" alt="Porsche 911 GT3 992.2 Touring de trois quarts avant, peinture Neo Oak Green" width="1250" height="833" loading="lazy">
    </div>
    <div class="rise texte">
      <p>Une <b>911 GT3 992.2 Touring</b> : flat-six atmosphérique de 4,0 litres, 510 chevaux, boîte PDK à sept rapports, roues arrière directrices. Le rapport qui compte n'est pas la puissance mais le poids : <b>2,8 kg par cheval</b>. C'est ce qui lui permet de freiner tard, de se placer tôt et de rester rapide quand le pilote devient précis — là où une sportive plus lourde demande d'être brusquée.</p>
      <p>Elle est <b>unique</b>. Pas de parc de six voitures aux réglages différents selon celle qui est libre : la même voiture, le même amortissement, les mêmes pneus d'un relais à l'autre, suivie par celui qui la prépare. C'est la condition pour que le chrono veuille dire quelque chose.</p>
      <h3>Ce qui est compris</h3>
      ${COMPRIS}
    </div>
  </div>
</section>

<section class="band" id="tours-ou-km">
  <div class="shell">
    <div class="hd rise"><h2>Tours comptés ou kilomètres : l'écart en un coup d'œil</h2></div>
    <div class="rise texte">
      <p>Le marché du roulage grand public se vend au tour : quelques boucles dans une voiture partagée, à partir d'environ 100 à 250 € selon les circuits et les organisateurs. Rapporté à la distance réellement parcourue, l'écart saute aux yeux.</p>
    </div>
    <figure class="cmp rise" aria-label="Distance au volant selon le format">
      <div class="row"><span class="lab">Baptême, 3 tours</span><span class="bar"><i style="width:4%"></i><b>environ 13 km</b></span></div>
      <div class="row"><span class="lab">Stage, 10 tours</span><span class="bar"><i style="width:14%"></i><b>environ 42 km</b></span></div>
      <div class="row"><span class="lab">DRS · Découverte</span><span class="bar"><i style="width:30%"></i><b>90 km</b></span></div>
      <div class="row"><span class="lab">DRS · Performance</span><span class="bar"><i style="width:47%"></i><b>140 km</b></span></div>
      <div class="row"><span class="lab">DRS · VIP</span><span class="bar"><i style="width:67%"></i><b>200 km</b></span></div>
      <div class="row"><span class="lab">DRS · Exclusive</span><span class="bar"><i style="width:100%"></i><b>300 km</b></span></div>
      <figcaption>Tours convertis en kilomètres sur la base du Bugatti (4,185 km le tour). Les formats baptême et stage sont ceux affichés par les organisateurs généralistes ; les quatre formules DRS sont les distances contractuelles.</figcaption>
    </figure>
  </div>
</section>

<section class="band" id="tarifs">
  <div class="shell">
    <div class="hd rise"><h2>Les tarifs par circuit</h2></div>
    ${GRILLE_B}
    <div class="rise texte">
      <p>Ces tarifs valent pour <a href="/stage-de-pilotage/le-mans/">Le Mans</a>, <a href="/stage-de-pilotage/magny-cours/">Magny-Cours</a>, Dijon-Prenois et La Ferté-Gaucher. Les deux circuits courts, Clastres et Les Écuyers, démarrent à <b>820 € les 50 km</b> ; Paul Ricard et Spa-Francorchamps, où le transport du véhicule est compris, démarrent à <b>3 490 € les 90 km</b>.</p>
      <p>Le tarif n'est jamais calculé à partir de ce que vous saisissez : il est recalculé à la réservation depuis le circuit et la distance. Pas de supplément de carburant à l'arrivée, pas de droits de piste en sus.</p>
      ${CTA3}
    </div>
  </div>
</section>

<section class="band" id="choisir">
  <div class="shell">
    <div class="hd rise"><h2>Trois questions pour choisir votre distance</h2></div>
    <div class="qa rise">
      <details><summary>Est-ce votre première journée sur circuit&nbsp;?<span class="pm data">+</span></summary><p class="ans">Si oui, 90 km suffisent largement : la fatigue arrive plus vite qu'on ne l'imagine, et la progression se joue sur les trois premiers relais. Si vous avez déjà roulé, 140 km laissent le temps de travailler un point précis après l'avoir identifié.</p></details>
      <details><summary>Voulez-vous travailler un objectif ou découvrir&nbsp;?<span class="pm data">+</span></summary><p class="ans">Découvrir tient en une demi-journée. Travailler un freinage ou un enchaînement demande de pouvoir le répéter : c'est à partir de 140 km que le débrief entre relais porte vraiment.</p></details>
      <details><summary>Roulez-vous seul ou à deux&nbsp;?<span class="pm data">+</span></summary><p class="ans">La formule 200 km peut se partager entre deux pilotes sur le même forfait. À deux, comptez que chacun dispose de la moitié de la distance — d'où l'intérêt de monter d'un cran.</p></details>
    </div>
    <div class="rise texte">
      <p>Ces repères ne remplacent pas un échange : le choix dépend du circuit, de votre expérience et de ce que vous voulez en retirer. Un appel de trois minutes tranche mieux qu'un tableau.</p>
      ${CTA3}
    </div>
  </div>
</section>`,
    faq: [
      ['Faut-il une licence ou une expérience du circuit&nbsp;?',
       "Non. Un permis B en cours de validité suffit, et le moniteur cale le rythme sur le vôtre. Aucune licence sportive n'est demandée."],
      ['La voiture est-elle assurée sur circuit&nbsp;?',
       "La couverture piste et le montant de la franchise figurent au devis, et la franchise n'est encaissée qu'en cas de dommage. C'est un point à faire préciser par écrit avant de réserver."],
      ['Peut-on louer la GT3 sans moniteur&nbsp;?',
       "Non. Le moniteur fait partie de la prestation et son tarif est déjà compris dans le prix affiché : c'est ce qui distingue cette journée d'une location sèche."],
      ['Quelle différence avec une location de Porsche pour la route&nbsp;?',
       "Tout : la voiture est préparée et chaussée pour la piste, elle roule sur circuit fermé avec un moniteur, et le tarif comprend le carburant et l'accès à la piste. Elle ne sort pas sur route ouverte."],
    ],
  },

  /* ──────────── fille : Île-de-France ──────────────────────────────────── */
  {
    url: '/stage-de-pilotage/ile-de-france/',
    title: 'Stage de pilotage en Île-de-France — GT3 992.2 à La Ferté-Gaucher | DRS Experience',
    description:
      "Stage de pilotage en Île-de-France au volant d'une Porsche 911 GT3 992.2 avec moniteur : La Ferté-Gaucher à 1 h de Paris, de 90 à 300 km, carburant et inscription compris.",
    fil: [{ nom: 'Stage de pilotage sur circuit', url: '/stage-de-pilotage/' }, { nom: 'Île-de-France' }],
    service: true,
    corps: `
<section class="band">
  <div class="shell">
    <p class="label rise">Seine-et-Marne · La Ferté-Gaucher</p>
    <h1 class="rise">Stage de pilotage en Île-de-France</h1>
    <div class="brief rise">
      <p>Rouler près de Paris sans y passer la journée de route : le circuit de <b>La Ferté-Gaucher</b>, en Seine-et-Marne, est à une heure de l'est parisien. C'est là que nous emmenons la 911 GT3 992.2 Touring, pour une journée complète — pas pour trois tours.</p>
      <div class="keys">
        <span class="key"><b>1 h</b> de l'est parisien</span>
        <span class="key">De <b>90 à 300 km</b> au volant</span>
        <span class="key">Moniteur <b>sur tous les tours</b></span>
      </div>
      ${CTA3}
    </div>
    <nav class="toc rise" aria-label="Sommaire">
      <p>Sur cette page</p>
      <ol>
        <li><a href="#marche">Ce que vend le marché francilien</a></li>
        <li><a href="#la-ferte">La Ferté-Gaucher, et l'autre option à 1 h 15</a></li>
        <li><a href="#journee">À quoi ressemble la journée</a></li>
        <li><a href="#tarifs-idf">Les tarifs</a></li>
      </ol>
    </nav>
  </div>
</section>

<section class="band" id="marche">
  <div class="shell">
    <div class="hd rise"><h2>Ce que vend le marché francilien</h2></div>
    <div class="rise texte">
      <p>Cherchez « stage de pilotage en Île-de-France » et vous trouverez surtout du <b>multivolant</b> : deux à quatre GT essayées dans la même session, quelques tours chacune, entre 34 et 416 € selon la formule, sur les circuits de La Ferté-Gaucher ou de Trappes. S'y ajoutent le drift, le rallye et la monoplace découverte.</p>
      <p>C'est un bon produit pour comparer des voitures une fois dans sa vie. Ce n'en est pas un pour progresser : on ne répète rien, on ne mesure rien, et le moniteur change de passager toutes les vingt minutes.</p>
      <p>Notre réponse est l'inverse exact : <b>une seule voiture, une journée entière, le même moniteur</b>. Moins de variété, beaucoup plus de kilomètres, et un chrono qui veut dire quelque chose parce que rien d'autre n'a changé entre deux relais.</p>
    </div>
  </div>
</section>

<section class="band" id="la-ferte">
  <div class="shell">
    <div class="hd rise"><h2>La Ferté-Gaucher, et l'autre option à 1 h 15</h2></div>
    <div class="duo flat rise" style="aspect-ratio:16/9;max-width:760px">
      <img src="/assets/circuit-la-ferte-gaucher.webp" alt="La Porsche 911 GT3 992.2 sur le circuit de La Ferté-Gaucher, en Seine-et-Marne" width="760" height="427" loading="lazy">
    </div>
    <div class="rise texte">
      <p><b>La Ferté-Gaucher (77)</b> est le circuit francilien de référence pour le roulage : tracé technique d'environ deux kilomètres sur l'aérodrome, à une heure de Paris par la N4. Il est court, donc on y repasse souvent au même endroit — c'est précisément ce qu'il faut pour corriger un point de freinage et vérifier la correction dans le tour suivant.</p>
      <p>À 1 h 15 au nord-est, le <b>circuit des Écuyers</b> (02) offre un tracé plus vallonné et un tarif d'entrée plus bas : la formule Initiation y démarre à <b>820 € les 50 km</b>. C'est souvent le meilleur rapport découverte/budget pour une première journée au départ de Paris.</p>
    </div>
  </div>
</section>

<section class="band" id="journee">
  <div class="shell">
    <div class="hd rise"><h2>À quoi ressemble la journée</h2></div>
    <div class="rise texte">
      <p>Accueil et briefing, puis un premier relais de reconnaissance : vous découvrez le tracé, le moniteur découvre votre conduite. À partir du deuxième relais, chaque session a un objectif — un freinage, une courbe, le placement du regard — et se termine par un débrief avant de repartir.</p>
      <p>Les relais durent une vingtaine de minutes, ce qui est la limite au-delà de laquelle la concentration baisse plus vite que le chrono ne descend. Entre deux, la voiture refroidit et vous aussi.</p>
      <p>Il n'y a rien à apporter d'autre que le permis, des vêtements couvrants et des chaussures fines. Le casque est fourni.</p>
    </div>
  </div>
</section>

<section class="band" id="tarifs-idf">
  <div class="shell">
    <div class="hd rise"><h2>Les tarifs</h2></div>
    ${GRILLE_B}
    <div class="rise texte">
      <p>Ces tarifs sont ceux de La Ferté-Gaucher. Aux Écuyers, circuit plus court, la grille démarre à 820 € les 50 km et monte à 3 100 € les 200 km.</p>
      <h3>Ce qui est compris</h3>
      ${COMPRIS}
      <p>Pour comparer les formats, voyez la page <a href="/stage-de-pilotage/">stage de pilotage sur circuit</a>. Si vous acceptez deux heures de route, <a href="/stage-de-pilotage/le-mans/">le Bugatti au Mans</a> offre un tracé bien plus rapide, au même tarif. Le parcours du moniteur est sur <a href="/le-moniteur/">sa page</a>.</p>
      ${CTA3}
    </div>
  </div>
</section>`,
    faq: [
      ['Quel est le circuit le plus proche de Paris&nbsp;?',
       "La Ferté-Gaucher, en Seine-et-Marne, à environ une heure de l'est parisien. Le circuit des Écuyers, dans l'Aisne, est à 1 h 15."],
      ['Peut-on venir en transports&nbsp;?',
       "Les circuits franciliens sont mal desservis : prévoyez une voiture ou un covoiturage. Dites-le-nous à la réservation, nous organisons souvent les arrivées entre participants du même jour."],
      ['Est-ce adapté à un débutant&nbsp;?',
       "Oui, et La Ferté-Gaucher s'y prête particulièrement : le tracé est court, les vitesses restent contenues, et on répète beaucoup. Un permis B en cours de validité suffit."],
      ['Proposez-vous du multivolant comme les autres organisateurs&nbsp;?',
       "Non. Nous n'avons qu'une voiture, la 911 GT3 992.2 Touring, et c'est délibéré : une seule voiture suivie par celui qui la prépare, pour que la progression soit mesurable d'un relais à l'autre."],
    ],
  },
];
