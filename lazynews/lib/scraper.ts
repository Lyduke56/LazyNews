import Parser from 'rss-parser';
import { Article } from '@/types/article';

// ---------------------------------------------------------------------------
// RSS Feed Sources
// ---------------------------------------------------------------------------
const RSS_FEEDS: { url: string; name: string; defaultTopic: string }[] = [
  // ── Global ──────────────────────────────────────────────────────────────
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC News', defaultTopic: 'World' },
  { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', name: 'BBC Technology', defaultTopic: 'Technology' },
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', name: 'BBC Business', defaultTopic: 'Business' },
  { url: 'https://feeds.bbci.co.uk/sport/rss.xml', name: 'BBC Sport', defaultTopic: 'Sports' },
  { url: 'https://feeds.bbci.co.uk/news/health/rss.xml', name: 'BBC Health', defaultTopic: 'Health' },
  { url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', name: 'BBC Science', defaultTopic: 'Science' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', name: 'NY Times World', defaultTopic: 'World' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml', name: 'NY Times Technology', defaultTopic: 'Technology' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', name: 'NY Times Business', defaultTopic: 'Business' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml', name: 'NY Times Health', defaultTopic: 'Health' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Science.xml', name: 'NY Times Science', defaultTopic: 'Science' },
  { url: 'https://feeds.theguardian.com/theguardian/world/rss', name: 'The Guardian World', defaultTopic: 'World' },
  { url: 'https://feeds.theguardian.com/theguardian/technology/rss', name: 'The Guardian Tech', defaultTopic: 'Technology' },
  { url: 'https://feeds.theguardian.com/theguardian/business/rss', name: 'The Guardian Business', defaultTopic: 'Business' },
  { url: 'https://feeds.theguardian.com/theguardian/sport/rss', name: 'The Guardian Sport', defaultTopic: 'Sports' },
  { url: 'https://feeds.theguardian.com/theguardian/science/rss', name: 'The Guardian Science', defaultTopic: 'Science' },
  { url: 'https://feeds.theguardian.com/theguardian/politics/rss', name: 'The Guardian Politics', defaultTopic: 'Politics' },
  // ── Philippines ─────────────────────────────────────────────────────────
  { url: 'https://www.rappler.com/feed/', name: 'Rappler', defaultTopic: 'World' },
  { url: 'https://newsinfo.inquirer.net/feed', name: 'Inquirer News', defaultTopic: 'World' },
  { url: 'https://technology.inquirer.net/feed', name: 'Inquirer Tech', defaultTopic: 'Technology' },
  { url: 'https://business.inquirer.net/feed', name: 'Inquirer Business', defaultTopic: 'Business' },
  { url: 'https://sports.inquirer.net/feed', name: 'Inquirer Sports', defaultTopic: 'Sports' },
  { url: 'https://entertainment.inquirer.net/feed', name: 'Inquirer Entertainment', defaultTopic: 'Entertainment' },
  { url: 'https://www.philstar.com/rss/headlines', name: 'Philstar Headlines', defaultTopic: 'World' },
  { url: 'https://www.philstar.com/rss/business', name: 'Philstar Business', defaultTopic: 'Business' },
  { url: 'https://www.philstar.com/rss/sports', name: 'Philstar Sports', defaultTopic: 'Sports' },
  { url: 'https://www.gmanetwork.com/news/rss/topstories/', name: 'GMA News Top Stories', defaultTopic: 'World' },
  { url: 'https://www.gmanetwork.com/news/rss/scitech/', name: 'GMA SciTech', defaultTopic: 'Technology' },
  { url: 'https://www.gmanetwork.com/news/rss/sports/', name: 'GMA Sports', defaultTopic: 'Sports' },
];

// Max articles per topic in the "Other" section
const MAX_PER_TOPIC = 25;
// Total banger headlines
const BANGER_COUNT = 10;

// ---------------------------------------------------------------------------
// Topic keyword classification
// Uses word-boundary regex to prevent partial-word false positives
// (e.g. "game" won't match "engagement", "sport" won't match "sporting goods")
// ---------------------------------------------------------------------------
const TOPIC_KEYWORDS: Record<string, string[]> = {
  Technology: [
    'ai', 'artificial intelligence', 'tech', 'software', 'hardware', 'apple',
    'google', 'microsoft', 'meta', 'openai', 'robot', 'cyber', 'digital',
    'startup', 'app', 'data', 'cloud', 'chip', 'semiconductor', 'elon',
    'spacex', 'tesla', 'nvidia', 'quantum', 'programming', 'developer',
  ],
  Politics: [
    'president', 'election', 'vote', 'congress', 'senate', 'parliament',
    'minister', 'government', 'policy', 'democrat', 'republican', 'trump',
    'biden', 'white house', 'kremlin', 'nato', 'united nations',
    'diplomacy', 'sanction', 'treaty', 'legislation',
  ],
  Business: [
    'market', 'stock', 'economy', 'gdp', 'inflation', 'trade', 'bank',
    'investment', 'corporate', 'earnings', 'revenue', 'profit',
    'merger', 'acquisition', 'ipo', 'interest rate', 'recession',
    'oil', 'energy', 'finance', 'cryptocurrency', 'bitcoin',
  ],
  Sports: [
    'match', 'team', 'player', 'coach', 'league', 'tournament',
    'championship', 'olympic', 'nba', 'nfl', 'soccer', 'football',
    'basketball', 'tennis', 'golf', 'cricket', 'athlete',
  ],
  Entertainment: [
    'movie', 'film', 'music', 'album', 'celebrity', 'actor', 'director',
    'award', 'oscar', 'grammy', 'netflix', 'disney', 'concert', 'artist',
    'song', 'streaming', 'box office',
  ],
  Health: [
    'health', 'medical', 'hospital', 'doctor', 'drug', 'vaccine', 'disease',
    'cancer', 'mental health', 'fda', 'pandemic', 'virus', 'outbreak',
    'clinical', 'diet', 'exercise', 'surgery', 'medicine',
  ],
  Science: [
    'science', 'nasa', 'space', 'planet', 'climate', 'environment',
    'species', 'gene', 'dna', 'physics', 'chemistry', 'biology', 'fossil',
    'discovery', 'experiment', 'universe', 'ocean', 'atmosphere', 'carbon',
  ],
  World: [],
};

// Pre-compile regexes once at module load for performance
const TOPIC_REGEXES: Record<string, RegExp[]> = Object.fromEntries(
  Object.entries(TOPIC_KEYWORDS).map(([topic, keywords]) => [
    topic,
    keywords.map((kw) => new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')),
  ])
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60) +
    '-' +
    Date.now().toString(36)
  );
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function makeSummary(body: string): string {
  const sentences = body.match(/[^.!?]+[.!?]+/g) || [];
  let summary = '';
  for (const s of sentences) {
    if ((summary + s).length > 320) break;
    summary += s + ' ';
  }
  return summary.trim() || body.slice(0, 280).trim() + '…';
}

function classifyTopic(text: string, defaultTopic: string): string {
  for (const [topic, regexes] of Object.entries(TOPIC_REGEXES)) {
    if (topic === 'World') continue;
    if (regexes.some((re) => re.test(text))) return topic;
  }
  return defaultTopic;
}

// ---------------------------------------------------------------------------
// LLM Ranking via Gemini API
// ---------------------------------------------------------------------------

/**
 * Ask Gemini to rank articles by how "hard-hitting" / impactful they are
 * and return the indices of the top BANGER_COUNT articles.
 */
async function rankBangersByLLM(
  articles: { id: string; title: string; summary: string }[]
): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[scraper] No GEMINI_API_KEY — falling back to first', BANGER_COUNT, 'articles');
    return articles.slice(0, BANGER_COUNT).map((a) => a.id);
  }

  const numbered = articles
    .map((a, i) => `${i + 1}. [${a.id}] ${a.title}\n   ${a.summary.slice(0, 120)}`)
    .join('\n');

  const prompt = `You are a senior news editor. Rank the following articles by how hard-hitting, globally significant, and impactful the information is for a general audience. Consider: breaking news value, geopolitical importance, societal impact, and urgency.

Return ONLY a JSON array of exactly ${BANGER_COUNT} article IDs (the part in brackets), ordered from most to least impactful. No explanation, no markdown, just raw JSON.

Articles:
${numbered}

Response format: ["id1","id2","id3",...]`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 256 },
        }),
      }
    );

    if (!res.ok) throw new Error(`Gemini API ${res.status}`);

    const data = await res.json();
    const raw: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Strip markdown fences if present
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed: string[] = JSON.parse(clean);

    if (!Array.isArray(parsed)) throw new Error('LLM did not return array');
    return parsed.slice(0, BANGER_COUNT);
  } catch (err) {
    console.warn('[scraper] LLM ranking failed, falling back to first', BANGER_COUNT, ':', err);
    return articles.slice(0, BANGER_COUNT).map((a) => a.id);
  }
}

// ---------------------------------------------------------------------------
// Single feed parser (used in parallel)
// ---------------------------------------------------------------------------

type RawArticle = Omit<Article, 'isBanger'> & { score: number };

async function parseFeed(
  parser: Parser,
  feed: { url: string; name: string; defaultTopic: string }
): Promise<RawArticle[]> {
  try {
    const result = await parser.parseURL(feed.url);
    const articles: RawArticle[] = [];

    for (const item of result.items.slice(0, 10)) {
      if (!item.title) continue;

      const rawItem = item as unknown as Record<
        string,
        string & { $?: { url?: string }; url?: string }
      >;

      const rawBody =
        rawItem['content:encoded'] ||
        item.content ||
        item.contentSnippet ||
        item.summary ||
        '';
      const body = stripHtml(rawBody);

      let imageUrl =
        rawItem['mediaContent']?.$?.url ||
        rawItem['mediaThumbnail']?.$?.url ||
        rawItem['enclosure']?.url ||
        '';

      if (!imageUrl && rawBody) {
        const match = rawBody.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (match) imageUrl = match[1];
      }

      const title = stripHtml(item.title || '');
      const publishedAt = item.isoDate || item.pubDate || new Date().toISOString();
      const combinedText = title + ' ' + stripHtml(item.contentSnippet || item.summary || '');
      const topic = classifyTopic(combinedText, feed.defaultTopic);
      const summary = makeSummary(body || stripHtml(item.contentSnippet || item.summary || ''));

      // Recency score for initial ordering (used before LLM ranking)
      const ageHours = (Date.now() - new Date(publishedAt).getTime()) / 36e5;
      const score = ageHours < 3 ? 5 : ageHours < 6 ? 3 : ageHours < 12 ? 1 : 0;

      articles.push({
        id: slugify(title),
        title,
        summary,
        body: body || summary,
        imageUrl,
        topic,
        publishedAt,
        sourceUrl: item.link || '',
        sourceName: feed.name,
        score,
      });
    }

    return articles;
  } catch (err) {
    console.warn(`[scraper] Failed to fetch ${feed.url}:`, err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Main scraper
// ---------------------------------------------------------------------------

export async function scrapeArticles(): Promise<Article[]> {
  const parser = new Parser({
    customFields: {
      item: [
        ['media:content', 'mediaContent', { keepArray: false }],
        ['media:thumbnail', 'mediaThumbnail', { keepArray: false }],
        ['enclosure', 'enclosure', { keepArray: false }],
      ],
    },
  });

  // ── Fetch all feeds in parallel ──────────────────────────────────────────
  const feedResults = await Promise.allSettled(
    RSS_FEEDS.map((feed) => parseFeed(parser, feed))
  );

  const seen = new Set<string>();
  const rawArticles: RawArticle[] = [];

  for (const result of feedResults) {
    if (result.status !== 'fulfilled') continue;
    for (const article of result.value) {
      const titleKey = article.title.toLowerCase().slice(0, 60);
      if (seen.has(titleKey)) continue;
      seen.add(titleKey);
      rawArticles.push(article);
    }
  }

  if (rawArticles.length === 0) return [];

  // ── LLM ranking for bangers ────────────────────────────────────────────
  // Sort by recency first so LLM sees the freshest articles
  rawArticles.sort((a, b) => b.score - a.score);

  // Take top 30 candidates and let Gemini pick the best BANGER_COUNT
  const candidates = rawArticles.slice(0, 30);
  const bangerIds = new Set(
    await rankBangersByLLM(
      candidates.map((a) => ({ id: a.id, title: a.title, summary: a.summary }))
    )
  );

  // ── Cap other articles per topic at MAX_PER_TOPIC ──────────────────────
  const topicCounts: Record<string, number> = {};
  const finalArticles: Article[] = [];

  for (const article of rawArticles) {
    const isBanger = bangerIds.has(article.id);

    if (isBanger) {
      finalArticles.push({ ...article, isBanger: true });
      continue;
    }

    // Non-banger: enforce per-topic cap
    topicCounts[article.topic] = (topicCounts[article.topic] ?? 0) + 1;
    if (topicCounts[article.topic] > MAX_PER_TOPIC) continue;

    finalArticles.push({ ...article, isBanger: false });
  }

  // Ensure bangers come first in the response
  finalArticles.sort((a, b) => (b.isBanger ? 1 : 0) - (a.isBanger ? 1 : 0));

  // Strip internal score field
  return finalArticles.map(({ ...rest }) => rest as Article);
}
