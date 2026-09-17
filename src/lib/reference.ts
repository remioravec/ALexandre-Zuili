/**
 * Référence lisible communiquée au client et portée par l'e-mail interne.
 * Déterministe à partir de l'id de page Notion : deux appels sur la même
 * réservation donnent la même référence.
 */
export function reference(pageId: string): string {
  const hex = pageId.replace(/-/g, '').slice(-6).toUpperCase();
  return `GT3-${hex}`;
}
