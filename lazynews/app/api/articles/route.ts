import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { scrapeArticles } from '@/lib/scraper';
import { Article } from '@/types/article';

// ---------------------------------------------------------------------------
// In-memory cache (module-level singleton)
// Lives as long as the Node process — survives multiple requests but resets
// on cold starts. Falls back to the JSON file for the very first cold start.
// ---------------------------------------------------------------------------
interface CacheEntry {
  articles: Article[];
  fetchedAt: string;
}

let memoryCache: CacheEntry | null = null;

// Re-scrape every 60 minutes
const CACHE_TTL_MS = 60 * 60 * 1000;

// Seed path — read ONCE on cold start, never written
const SEED_PATH = path.join(process.cwd(), 'public', 'articles-cache.json');

function readSeedFile(): CacheEntry | null {
  try {
    if (!fs.existsSync(SEED_PATH)) return null;
    const raw = fs.readFileSync(SEED_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as CacheEntry;
    if (!parsed.articles?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

function isCacheValid(entry: CacheEntry): boolean {
  const age = Date.now() - new Date(entry.fetchedAt).getTime();
  return age < CACHE_TTL_MS && entry.articles.length > 0;
}

// ---------------------------------------------------------------------------
// Public helper — used by the RSC page so it can share the same cache
// without going through an HTTP roundtrip
// ---------------------------------------------------------------------------
export async function getArticles(force = false): Promise<CacheEntry> {
  // 1. Serve from memory if fresh and not forced
  if (!force && memoryCache && isCacheValid(memoryCache)) {
    return memoryCache;
  }

  // 2. Cold-start: seed from file if available and not forced
  if (!force && !memoryCache) {
    const seed = readSeedFile();
    if (seed && isCacheValid(seed)) {
      memoryCache = seed;
      return memoryCache;
    }
  }

  // 3. Scrape fresh articles
  try {
    const articles = await scrapeArticles();

    if (articles.length === 0) {
      // Nothing came back — return stale cache rather than empty
      if (memoryCache) return memoryCache;
      const seed = readSeedFile();
      if (seed) return seed;
      return { articles: [], fetchedAt: new Date().toISOString() };
    }

    memoryCache = { articles, fetchedAt: new Date().toISOString() };
    return memoryCache;
  } catch (err) {
    console.error('[cache] Scraper threw, using stale cache:', err);
    if (memoryCache) return memoryCache;
    const seed = readSeedFile();
    if (seed) return seed;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const force = req.nextUrl.searchParams.get('force') === '1';

  try {
    const { articles, fetchedAt } = await getArticles(force);

    if (articles.length === 0) {
      return NextResponse.json({ error: 'No articles could be fetched.' }, { status: 503 });
    }

    return NextResponse.json(
      { articles, fetchedAt, fromCache: !force },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (err) {
    console.error('[api/articles]', err);
    return NextResponse.json({ error: 'Failed to fetch articles.' }, { status: 500 });
  }
}
