import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectRankedIds, sortFeaturedFirst } from '../lib/ranking.ts';

test('keeps model order while discarding unknown and duplicate IDs', () => {
  assert.deepEqual(selectRankedIds(['a', 'b', 'c'], ['c', 'unknown', 'c', 'a'], 2), ['c', 'a']);
});

test('fills malformed or short rankings from candidate order', () => {
  assert.deepEqual(selectRankedIds(['a', 'b', 'c'], ['b', 12], 3), ['b', 'a', 'c']);
  assert.deepEqual(selectRankedIds(['a', 'b', 'c'], null, 2), ['a', 'b']);
});

test('shows the first ranked story before other featured and regular stories', () => {
  const articles = [
    { id: 'a', isBanger: true },
    { id: 'other', isBanger: false },
    { id: 'b', isBanger: true },
  ];
  assert.deepEqual(sortFeaturedFirst(articles, ['b', 'a']).map((a) => a.id), ['b', 'a', 'other']);
});
