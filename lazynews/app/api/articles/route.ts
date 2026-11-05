import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { scrapeArticles } from '@/lib/scraper';
import { createArticleCache, type CacheEntry } from '@/lib/articleCache';

// ---------------------------------------------------------------------------
// In-memory cache (module-level singleton)
// Lives as long as the Node process — survives multiple requests but resets
// on cold starts. Falls back to the JSON file for the very first cold start.
// ---------------------------------------------------------------------------
// Seed path — read ONCE on cold start, never written
const SEED_PATH = path.join(process.cwd(), 'public', 'articles-cache.json');

function readSeedFile(): CacheEntry | null {
  try {
    const raw = fs.readFileSync(SEED_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as CacheEntry;
    return Array.isArray(parsed.articles) && parsed.articles.length && !isNaN(Date.parse(parsed.fetchedAt)) ? parsed : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public helper — used by the RSC page so it can share the same cache
// without going through an HTTP roundtrip
// ---------------------------------------------------------------------------
const articleCache = createArticleCache(scrapeArticles, readSeedFile);

export async function getArticles(force = false) {
  return articleCache.get(force);
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const force = req.nextUrl.searchParams.get('force') === '1';

  try {
    const { entry: { articles, fetchedAt }, source } = await getArticles(force);

    if (articles.length === 0) {
      return NextResponse.json({ error: 'No articles could be fetched.' }, { status: 503 });
    }

    return NextResponse.json(
      { articles, fetchedAt, fromCache: source !== 'scrape', source },
      {
        headers: {
          'Cache-Control': force ? 'no-store' : 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (err) {
    console.error('[api/articles]', err);
    return NextResponse.json({ error: 'Failed to fetch articles.' }, { status: 500 });
  }
}
