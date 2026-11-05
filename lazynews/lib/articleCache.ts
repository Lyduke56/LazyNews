import type { Article } from '../types/article';

export interface CacheEntry {
  articles: Article[];
  fetchedAt: string;
}

export interface CacheResult {
  entry: CacheEntry;
  source: 'memory' | 'seed' | 'scrape' | 'stale';
}

export function createArticleCache(
  scrape: () => Promise<Article[]>,
  readSeed: () => CacheEntry | null,
  ttlMs = 60 * 60 * 1000,
  refreshCooldownMs = 5 * 60 * 1000,
) {
  let memoryCache: CacheEntry | null = null;
  let inFlight: Promise<CacheResult> | null = null;
  let servingSeed = false;
  let lastAttemptAt = 0;

  function ageMs(entry: CacheEntry): number {
    return Date.now() - new Date(entry.fetchedAt).getTime();
  }

  async function get(force = false): Promise<CacheResult> {
    if (inFlight) return inFlight;

    if (!memoryCache) {
      memoryCache = readSeed();
      servingSeed = memoryCache !== null;
    }
    if (memoryCache?.articles.length) {
      const age = ageMs(memoryCache);
      if (age >= 0 && age < (force ? refreshCooldownMs : ttlMs)) {
        return { entry: memoryCache, source: servingSeed ? 'seed' : 'memory' };
      }
    }
    if (memoryCache?.articles.length && Date.now() - lastAttemptAt < refreshCooldownMs) {
      return { entry: memoryCache, source: 'stale' };
    }
    if (!memoryCache && lastAttemptAt && Date.now() - lastAttemptAt < refreshCooldownMs) {
      return { entry: { articles: [], fetchedAt: new Date(lastAttemptAt).toISOString() }, source: 'stale' };
    }

    inFlight = (async () => {
      lastAttemptAt = Date.now();
      try {
        const articles = await scrape();
        if (articles.length) {
          memoryCache = { articles, fetchedAt: new Date().toISOString() };
          servingSeed = false;
          return { entry: memoryCache, source: 'scrape' as const };
        }
        if (memoryCache?.articles.length) return { entry: memoryCache, source: 'stale' as const };
        return { entry: { articles: [], fetchedAt: new Date().toISOString() }, source: 'scrape' as const };
      } catch (error) {
        if (memoryCache?.articles.length) return { entry: memoryCache, source: 'stale' as const };
        throw error;
      }
    })();

    try {
      return await inFlight;
    } finally {
      inFlight = null;
    }
  }

  return { get };
}
