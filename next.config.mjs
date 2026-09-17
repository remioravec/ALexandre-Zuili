/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aucun rendu : le site est un fichier statique dans public/, les seules
  // routes applicatives sont les route handlers sous src/app/api/.

  // Tous les liens internes du site portent un slash final
  // (/formules/vip/, /circuits/magny-cours/…) et doivent être servis tels
  // quels, sans redirection 308 intermédiaire.
  //
  // `trailingSlash: true` réglerait ce cas mais ajouterait le même 308 sur
  // /api/dates et /api/reservation — une redirection sur un POST est un
  // piège. On désactive donc la redirection automatique et on laisse la
  // réécriture ci-dessous traiter les deux formes.
  skipTrailingSlashRedirect: true,

  async rewrites() {
    // Tableau simple = « afterFiles » : le système de fichiers (public/assets,
    // public/index.html) et les routes /api/* sont résolus AVANT ces règles.
    return [
      { source: '/', destination: '/index.html' },
      // Les routes pas encore construites (/formules/…, /circuits/…,
      // /reservation/) retombent sur la page, dont le routeur client affiche
      // la vue d'accueil au lieu d'une 404.
      //
      // `(?!api/)` est indispensable : sans lui, un appel à une route d'API
      // mal orthographiée reçoit la page en HTML avec un 200, et le client
      // tente de la parser en JSON. Avec, il reçoit un vrai 404.
      { source: '/:path((?!api/).*)', destination: '/index.html' },
    ];
  },
};
export default nextConfig;
