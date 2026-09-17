import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { env } from './env';

let redisClient: Redis | null = null;
export function redis(): Redis {
  if (!redisClient) {
    redisClient = new Redis({
      url: env('UPSTASH_REDIS_REST_URL'),
      token: env('UPSTASH_REDIS_REST_TOKEN'),
    });
  }
  return redisClient;
}

let parIp: Ratelimit | null = null;
let parMail: Ratelimit | null = null;

/** 5 requêtes / 10 min / IP (§9). */
export function limiteParIp(): Ratelimit {
  if (!parIp) {
    parIp = new Ratelimit({
      redis: redis(),
      limiter: Ratelimit.slidingWindow(5, '10 m'),
      prefix: 'rl:ip',
    });
  }
  return parIp;
}

/** 3 requêtes / heure / adresse e-mail (§9). */
export function limiteParMail(): Ratelimit {
  if (!parMail) {
    parMail = new Ratelimit({
      redis: redis(),
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      prefix: 'rl:mail',
    });
  }
  return parMail;
}

/**
 * Verrou anti-doublon : `SET NX EX 30` sur la date (§6, étape 2).
 * Deux envois simultanés sur la même date → un 201, un 409.
 */
export async function prendreVerrou(trackdayId: string): Promise<boolean> {
  const r = await redis().set(`reservation:${trackdayId}`, Date.now(), { nx: true, ex: 30 });
  return r === 'OK';
}

export async function libererVerrou(trackdayId: string): Promise<void> {
  try {
    await redis().del(`reservation:${trackdayId}`);
  } catch (e) {
    // Le verrou expire seul en 30 s : un échec de libération ne casse rien.
    console.warn('[verrou] libération impossible', e);
  }
}

/**
 * Idempotence : mémorise la réponse d'une clé déjà traitée pour que deux
 * envois de la même `Idempotency-Key` ne créent qu'une seule page Notion.
 */
export async function reponseIdempotente<T>(cle: string): Promise<T | null> {
  return (await redis().get<T>(`idem:${cle}`)) ?? null;
}

export async function memoriserIdempotence(cle: string, valeur: unknown): Promise<void> {
  await redis().set(`idem:${cle}`, valeur, { ex: 60 * 60 * 24 });
}
