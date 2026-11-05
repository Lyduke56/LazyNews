export function selectRankedIds(candidateIds: string[], llmIds: unknown, count: number): string[] {
  const allowed = new Set(candidateIds);
  const selected: string[] = [];
  const seen = new Set<string>();

  if (Array.isArray(llmIds)) {
    for (const id of llmIds) {
      if (typeof id !== 'string' || !allowed.has(id) || seen.has(id)) continue;
      selected.push(id);
      seen.add(id);
      if (selected.length === count) return selected;
    }
  }

  for (const id of candidateIds) {
    if (seen.has(id)) continue;
    selected.push(id);
    seen.add(id);
    if (selected.length === count) break;
  }
  return selected;
}

export function sortFeaturedFirst<T extends { id: string; isBanger: boolean }>(
  articles: T[], rankedIds: string[],
): T[] {
  const rank = new Map(rankedIds.map((id, index) => [id, index]));
  return articles.sort((a, b) => {
    if (a.isBanger && b.isBanger) return (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity);
    return Number(b.isBanger) - Number(a.isBanger);
  });
}
