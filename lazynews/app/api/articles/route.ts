import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { scrapeArticles } from '@/lib/scraper';
import { Article } from '@/types/article';

// Cache file lives in public/ so it's readable without the filesystem API at build time
const CACHE_PATH = path.join(process.cwd(), 'public', 'articles-cache.json');
// Re-scrape every 60 minutes
const CACHE_TTL_MS = 60 * 60 * 1000;

interface Cache {
  fetchedAt: string;
  articles: Article[];
}

function readCache(): Cache | null {
  try {
    if (!fs.existsSync(CACHE_PATH)) return null;
    const raw = fs.readFileSync(CACHE_PATH, 'utf-8');
    return JSON.parse(raw) as Cache;
  } catch {
    return null;
  }
}

function writeCache(articles: Article[]): void {
  try {
    const cache: Cache = { fetchedAt: new Date().toISOString(), articles };
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[api/articles] Could not write cache:', err);
  }
}

export async function GET() {
  // 1. Try to serve from cache first
  const cache = readCache();
  if (cache) {
    const age = Date.now() - new Date(cache.fetchedAt).getTime();
    if (age < CACHE_TTL_MS && cache.articles.length > 0) {
      return NextResponse.json(
        { articles: cache.articles, fetchedAt: cache.fetchedAt, fromCache: true },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        }
      );
    }
  }

  // 2. Cache is stale or missing — run the scraper
  try {
    const articles = await scrapeArticles();

    if (articles.length === 0) {
      // Scraper returned nothing — fall back to stale cache if we have one
      if (cache && cache.articles.length > 0) {
        return NextResponse.json(
          { articles: cache.articles, fetchedAt: cache.fetchedAt, fromCache: true, stale: true },
          { status: 200 }
        );
      }
      return NextResponse.json({ error: 'No articles could be fetched.' }, { status: 503 });
    }

    writeCache(articles);

    return NextResponse.json(
      { articles, fetchedAt: new Date().toISOString(), fromCache: false },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (err) {
    console.error('[api/articles] Scraper error:', err);

    // Always fall back to stale cache on error
    if (cache && cache.articles.length > 0) {
      return NextResponse.json(
        { articles: cache.articles, fetchedAt: cache.fetchedAt, fromCache: true, stale: true },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: 'Failed to fetch articles.' }, { status: 500 });
  }
}
