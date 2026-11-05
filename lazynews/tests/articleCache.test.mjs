import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createArticleCache } from '../lib/articleCache.ts';

const article = { id: 'story' };

test('coalesces concurrent scrapes and applies the forced-refresh cooldown', async () => {
  let scrapeCount = 0;
  let release;
  const scrape = () => {
    scrapeCount++;
    return new Promise((resolve) => { release = () => resolve([article]); });
  };
  const cache = createArticleCache(scrape, () => null);
  const first = cache.get();
  const second = cache.get(true);
  assert.equal(scrapeCount, 1);
  release();
  assert.equal((await first).source, 'scrape');
  assert.equal((await second).source, 'scrape');
  assert.equal((await cache.get(true)).source, 'memory');
  assert.equal(scrapeCount, 1);
});

test('returns stale seed data when a scrape fails', async () => {
  const seed = { articles: [article], fetchedAt: '2020-01-01T00:00:00.000Z' };
  let attempts = 0;
  const cache = createArticleCache(async () => { attempts++; throw new Error('feed offline'); }, () => seed);
  const result = await cache.get();
  assert.equal(result.source, 'stale');
  assert.deepEqual(result.entry, seed);
  assert.equal((await cache.get(true)).source, 'stale');
  assert.equal(attempts, 1);
});

test('does not repeatedly scrape when no fallback exists', async () => {
  let attempts = 0;
  const cache = createArticleCache(async () => { attempts++; throw new Error('feed offline'); }, () => null);
  await assert.rejects(cache.get(), /feed offline/);
  assert.equal((await cache.get(true)).entry.articles.length, 0);
  assert.equal(attempts, 1);
});
