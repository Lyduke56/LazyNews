"use client";

import React, { useState, useCallback, useTransition } from 'react';
import HeroCard from '@/components/HeroCard';
import BangerCarouselCard from '@/components/BangerCarouselCard';
import OtherCard from '@/components/OtherCard';
import TopicPill from '@/components/TopicPill';
import { HeroCardSkeleton, BangerCarouselCardSkeleton } from '@/components/Skeletons';
import { ContinuousPagination } from '@/components/ContinuousPagination';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { ChevronLeft, ChevronRight, RefreshCw, Search, X } from 'lucide-react';
import { Article } from '@/types/article';
import { formatRelativeTime } from '@/lib/formatDate';

const TOPICS_ROW_1 = ['All Topics', 'Technology', 'Politics', 'Business', 'Sports'];
const TOPICS_ROW_2 = ['Entertainment', 'Health', 'Science', 'World'];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 }),
};

interface NewsClientProps {
  initialBangers: Article[];
  initialOthers: Article[];
  fetchedAt: string;
}

export default function NewsClient({
  initialBangers,
  initialOthers,
  fetchedAt: initialFetchedAt,
}: NewsClientProps) {
  // ── Article state ──────────────────────────────────────────────────────
  const [bangerArticles, setBangerArticles] = useState<Article[]>(initialBangers);
  const [otherArticles, setOtherArticles] = useState<Article[]>(initialOthers);
  const [fetchedAt, setFetchedAt] = useState(initialFetchedAt);
  const [isRefreshing, startRefresh] = useTransition();
  const [refreshMessage, setRefreshMessage] = useState('');

  // ── Banger carousel ────────────────────────────────────────────────────
  const [activeId, setActiveId] = useState<string>(initialBangers[0]?.id ?? '');
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);

  // ── Topic filter + Search ──────────────────────────────────────────────
  const [activeTopic, setActiveTopic] = useState<string>('All Topics');
  const [searchQuery, setSearchQuery] = useState('');
  const [[otherPage, otherDirection], setOtherPage] = useState<[number, number]>([0, 0]);

  // ── Refresh handler ────────────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    setRefreshMessage('');
    startRefresh(async () => {
      try {
        const res = await fetch('/api/articles?force=1', { cache: 'no-store' });
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const data = await res.json();
        const articles: Article[] = data.articles ?? [];

        const bangers = articles.filter((a) => a.isBanger);
        const others = articles.filter((a) => !a.isBanger);

        setBangerArticles(bangers);
        setOtherArticles(others);
        setFetchedAt(data.fetchedAt ?? new Date().toISOString());
        setActiveId(bangers[0]?.id ?? '');
        setPage([0, 0]);
        setOtherPage([0, 0]);
        if (data.source === 'stale') setRefreshMessage('Could not fetch new articles. Showing the last available news.');
        else if (data.fromCache) setRefreshMessage('Already up to date. Try again in a few minutes.');
      } catch (err) {
        console.error('[NewsClient] refresh error:', err);
        setRefreshMessage('Refresh failed. Please try again later.');
      }
    });
  }, []);

  // ── Topic filter (resets page + search on change) ──────────────────────
  const handleTopicChange = (topic: string) => {
    setActiveTopic(topic);
    setSearchQuery('');
    setOtherPage([0, 0]);
  };

  // ── Search (resets topic + page on use) ───────────────────────────────
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query) setActiveTopic('All Topics');
    setOtherPage([0, 0]);
  };

  // ── Filtered other articles ────────────────────────────────────────────
  const filteredOther = otherArticles.filter((a) => {
    const topicMatch = activeTopic === 'All Topics' || a.topic === activeTopic;
    if (!topicMatch) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q);
  });

  // ── Banger carousel logic ──────────────────────────────────────────────
  const activeArticle = bangerArticles.find((a) => a.id === activeId) ?? bangerArticles[0];
  const carouselArticles = bangerArticles.filter((a) => a.id !== activeId);
  const totalPages = Math.ceil(carouselArticles.length / 3);
  const visibleCarouselArticles = carouselArticles.slice(page * 3, (page + 1) * 3);

  const handlePrevPage = () => setPage([page > 0 ? page - 1 : totalPages - 1, -1]);
  const handleNextPage = () => setPage([page < totalPages - 1 ? page + 1 : 0, 1]);

  // ── Other articles pagination (9 per page) ─────────────────────────────
  const totalOtherPages = Math.ceil(filteredOther.length / 9);
  const visibleOtherArticles = filteredOther.slice(otherPage * 9, (otherPage + 1) * 9);

  const handlePageChange = (pageNumber: number) => {
    const newIndex = pageNumber - 1;
    setOtherPage([newIndex, newIndex > otherPage ? 1 : -1]);
  };

  return (
    <main className="flex flex-col items-center pb-12 pt-2">
      <div className="max-w-[1600px] w-full flex flex-col items-center gap-[12px]">

        {/* ── SECTION 1: BANGER HEADLINES ───────────────────────────────── */}
        <div className="w-full max-w-[1200px] px-4 lg:px-0 flex flex-col mb-1">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-body text-[36px] sm:text-[48px] text-[#32302f] tracking-[0.08em]">Banger Headlines</h1>
              <p className="font-body text-[16px] sm:text-[20px] text-[#847f7c]">
                Curated bangers based on my chosen news preferences, we ballin&apos;.
              </p>
            </div>
            {/* Last updated + Refresh */}
            <div className="flex items-center gap-3 pb-2 shrink-0">
              {fetchedAt && (
                <span className="font-display text-[13px] text-[#847f7c]">
                  Updated {formatRelativeTime(fetchedAt)}
                </span>
              )}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-300 bg-[#e9e0d4] hover:bg-[#F6E0B5] transition-colors font-display text-[13px] text-[#32302f] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                {isRefreshing ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>
          </div>
          {refreshMessage && <p role="status" className="font-display text-sm text-[#6b4d31] mt-2">{refreshMessage}</p>}
        </div>

        {isRefreshing ? (
          <div className="w-full max-w-[1200px] px-4 lg:px-0">
            <HeroCardSkeleton />
            <div className="flex items-center gap-[20px] mt-4 mb-4 overflow-hidden">
              <div className="w-14 h-14 rounded-full bg-[#e5e5e5] shrink-0 animate-pulse hidden sm:flex" />
              <div className="w-full lg:w-[1200px] h-[200px] flex gap-[12px] overflow-hidden">
                <BangerCarouselCardSkeleton />
                <BangerCarouselCardSkeleton />
                <BangerCarouselCardSkeleton />
              </div>
              <div className="w-14 h-14 rounded-full bg-[#e5e5e5] shrink-0 animate-pulse hidden sm:flex" />
            </div>
          </div>
        ) : (
          <LayoutGroup>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeArticle?.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full px-4 lg:px-0"
              >
                <HeroCard
                  id={activeArticle?.id}
                  title={activeArticle?.title}
                  summary={activeArticle?.summary}
                  imageUrl={activeArticle?.imageUrl}
                  sourceUrl={activeArticle?.sourceUrl}
                  sourceName={activeArticle?.sourceName}
                  publishedAt={activeArticle?.publishedAt}
                />
              </motion.div>
            </AnimatePresence>

            <div className="w-full max-w-[1200px] flex items-center gap-[10px] sm:gap-[20px] mt-4 mb-4 px-4 lg:px-0">
              <button
                onClick={handlePrevPage}
                disabled={totalPages <= 1}
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#e5e5e5] hover:bg-[#d2cac5] transition-colors flex items-center justify-center shrink-0"
                aria-label="Previous banger articles"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-[#000000]" strokeWidth={3} />
              </button>

              <div className="w-full lg:w-[1200px] h-[200px] relative overflow-hidden">
                <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                  <motion.div
                    key={page}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="flex gap-[12px] w-full absolute inset-0 overflow-x-auto sm:overflow-hidden snap-x snap-mandatory custom-scrollbar pb-2 sm:pb-0"
                  >
                    {visibleCarouselArticles.map((article) => (
                      <div key={article.id} className="snap-center shrink-0 w-full sm:w-auto">
                        <BangerCarouselCard
                          id={article.id}
                          title={article.title}
                          imageUrl={article.imageUrl}
                          sourceName={article.sourceName}
                          publishedAt={article.publishedAt}
                          onClick={() => setActiveId(article.id)}
                        />
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                onClick={handleNextPage}
                disabled={totalPages <= 1}
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#e5e5e5] hover:bg-[#d2cac5] transition-colors flex items-center justify-center shrink-0"
                aria-label="Next banger articles"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-[#000000]" strokeWidth={3} />
              </button>
            </div>
          </LayoutGroup>
        )}

        {/* ── SECTION DIVIDER ───────────────────────────────────────────── */}
        <hr
          id="other-headlines"
          className="w-full max-w-[1200px] border-t-2 border-[#d2cac5] mt-8 mb-2 opacity-60 scroll-mt-[41px]"
        />

        {/* ── SECTION 2: OTHER ARTICLES TITLE ───────────────────────────── */}
        <div className="w-full max-w-[1200px] px-4 lg:px-0 flex flex-col mb-4">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <h2 className="font-body text-[36px] sm:text-[48px] text-[#32302f] tracking-[0.08em] leading-none">Other Articles</h2>
              <p className="font-body text-[16px] sm:text-[20px] text-[#847f7c] mt-2">
                still curated bangers based on my preferences but not as heavy as the ones above in terms of what it&apos;s about.
              </p>
            </div>
          </div>
        </div>

        {/* ── OTHER ARTICLES TABLE COMPONENT ────────────────────────────── */}
        <div className="w-full flex flex-col border border-neutral-300 sm:rounded-2xl overflow-hidden shadow-sm bg-[#F2F2F2] min-h-[1100px] lg:max-h-[1100px] lg:h-[85vh]">
          
          {/* Static Filtering Header */}
          <div className="w-full flex flex-col items-center py-5 px-4 bg-[#f8f5f0] border-b border-neutral-300 shrink-0">
            <div className="w-full max-w-[1200px] flex flex-col gap-4">
            
            {/* Top Row: Search (Left) & Pagination (Right) */}
            <div className="flex flex-col sm:flex-row justify-between items-center px-2 gap-4">
              <div className="relative w-full sm:max-w-[720px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#847f7c]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search articles by title or summary…"
                  aria-label="Search articles"
                  className="w-full pl-9 pr-9 py-2 rounded-full border border-neutral-300 bg-[#e9e0d4] font-display text-[14px] text-[#32302f] placeholder:text-[#847f7c] focus:outline-none focus:border-[#32302f] focus:ring-2 focus:ring-[#8b7355]/30 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearchChange('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#847f7c] hover:text-[#32302f] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="shrink-0 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar flex justify-center">
                <ContinuousPagination
                  totalPages={totalOtherPages}
                  currentPage={otherPage + 1}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>

            {/* Bottom Row: Funnel Topics (5 top, 4 bottom) */}
            <div className="flex flex-col gap-2 sm:gap-3 items-center">
              <div className="flex justify-center gap-3">
                {TOPICS_ROW_1.map((topic) => (
                  <TopicPill
                    key={topic}
                    label={topic}
                    isActive={activeTopic === topic && !searchQuery}
                    onClick={() => handleTopicChange(topic)}
                  />
                ))}
              </div>
              <div className="flex justify-center gap-3">
                {TOPICS_ROW_2.map((topic) => (
                  <TopicPill
                    key={topic}
                    label={topic}
                    isActive={activeTopic === topic && !searchQuery}
                    onClick={() => handleTopicChange(topic)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

          {/* Scrollable Grid Area */}
          <div className="w-full flex-1 overflow-y-auto py-4 sm:py-8 custom-scrollbar relative">
            <div className="flex flex-col items-center gap-[40px] w-full px-2 sm:px-4">
              <div className="w-full max-w-[1600px] min-h-[942px] relative">
            {filteredOther.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-neutral-200 bg-[#F4EEE0]">
                <p className="font-display text-[18px] text-[#847f7c]">
                  {searchQuery
                    ? `No results for "${searchQuery}".`
                    : `No articles found for "${activeTopic}".`}
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout" custom={otherDirection} initial={false}>
                <motion.div
                  key={`${otherPage}-${activeTopic}-${searchQuery}`}
                  custom={otherDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="w-full lg:absolute lg:inset-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[310px] gap-3"
                >
                  {visibleOtherArticles.map((article) => (
                    <OtherCard
                      key={article.id}
                      title={article.title}
                      summary={article.summary}
                      imageUrl={article.imageUrl}
                      sourceUrl={article.sourceUrl}
                      sourceName={article.sourceName}
                      publishedAt={article.publishedAt}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

        </div>
      </div>
    </main>
  );
}
