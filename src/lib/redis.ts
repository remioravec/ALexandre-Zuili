import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { envOptionnel } from './env';

/**
 * Upstash est OPTIONNEL.
 *
 * Sans lui, le service reste opérationnel mais avec des garanties réduites,
 * et le dit dans le journal :
 *   - limitation de débit en mémoire, donc par instance et remise à zéro à
 *     chaque démarrage à froid — freine un curieux, pas une attaque ;
 *   - pas de verrou distribué : deux envois vraiment simultanés sur la même
 *     date peuvent passer tous les deux. La relecture Notion et le contrôle
 *     d'idempotence (dans notion.ts) restent en place.
 * Renseigner UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN rétablit les
 * deux sans changement de code.
 */
export function redisConfigure(): boolean {
  return !!envOptionnel('UPSTASH_REDIS_REST_URL') && !!envOptionnel('UPSTASH_REDIS_REST_TOKEN');
}

let redisClient: Redis | null = null;
function redis(): Redis | null {
  if (!redisConfigure()) return null;
  if (!redisClient) {
    redisClient = new Redis({
      url: envOptionnel('UPSTASH_REDIS_REST_URL')!,
      token: envOptionnel('UPSTASH_REDIS_REST_TOKEN')!,
    });
  }
  return redisClient;
}

let parIp: Ratelimit | null = null;
let parMail: Ratelimit | null = null;

/** Repli en mémoire : fenêtre glissante simple, vidée aux démarrages à froid. */
const memoire = new Map<string, number[]>();
function limiteMemoire(cle: string, max: number, fenetreMs: number): boolean {
  const t = Date.now();
  const vus = (memoire.get(cle) ?? []).filter((x) => t - x < fenetreMs);
  if (vus.length >= max) {
    memoire.set(cle, vus);
    return false;
  }
  vus.push(t);
  memoire.set(cle, vus);
  if (memoire.size > 5000) memoire.clear(); // garde-fou mémoire
  return true;
}

/** 5 requêtes / 10 min / IP (§9). */
export async function autoriseIp(ip: string): Promise<boolean> {
  const r = redis();
  if (!r) return limiteMemoire(`ip:${ip}`, 5, 10 * 60 * 1000);
  if (!parIp) {
    parIp = new Ratelimit({ redis: r, limiter: Ratelimit.slidingWindow(5, '10 m'), prefix: 'rl:ip' });
  }
  return (await parIp.limit(ip)).success;
}

/** 3 requêtes / heure / adresse e-mail (§9). */
export async function autoriseMail(email: string): Promise<boolean> {
  const r = redis();
  if (!r) return limiteMemoire(`mail:${email}`, 3, 60 * 60 * 1000);
  if (!parMail) {
    parMail = new Ratelimit({ redis: r, limiter: Ratelimit.slidingWindow(3, '1 h'), prefix: 'rl:mail' });
  }
  return (await parMail.limit(email)).success;
}

/**
 * Verrou anti-doublon : `SET NX EX 30` (§6, étape 2).
 * Sans Redis, renvoie true — l'unicité repose alors sur la relecture Notion
 * et sur le contrôle d'idempotence.
 */
export async function prendreVerrou(trackdayId: string): Promise<boolean> {
  const r = redis();
  if (!r) return true;
  return (await r.set(`reservation:${trackdayId}`, Date.now(), { nx: true, ex: 30 })) === 'OK';
}

export async function libererVerrou(trackdayId: string): Promise<void> {
  const r = redis();
  if (!r) return;
  try {
    await r.del(`reservation:${trackdayId}`);
  } catch (e) {
    // Le verrou expire seul en 30 s : un échec de libération ne casse rien.
    console.warn('[verrou] libération impossible', e);
  }
}
