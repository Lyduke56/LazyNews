"use client";

import React, { useState, useEffect } from 'react';
import HeroCard from '@/components/HeroCard';
import BangerCarouselCard from '@/components/BangerCarouselCard';
import OtherCard from '@/components/OtherCard';
import TopicPill from '@/components/TopicPill';
import Navbar from '@/components/Navbar';
import { HeroCardSkeleton, BangerCarouselCardSkeleton, OtherCardSkeleton } from '@/components/Skeletons';
import { ContinuousPagination } from '@/components/ContinuousPagination';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '@/types/article';

const TOPICS_ROW_1 = ['All Topics', 'Technology', 'Politics', 'Business', 'Sports'];
const TOPICS_ROW_2 = ['Entertainment', 'Health', 'Science', 'World'];
const ALL_TOPICS = [...TOPICS_ROW_1.slice(1), ...TOPICS_ROW_2];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 }),
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bangerArticles, setBangerArticles] = useState<Article[]>([]);
  const [otherArticles, setOtherArticles] = useState<Article[]>([]);

  const [activeId, setActiveId] = useState<string>('');
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);

  const [activeTopic, setActiveTopic] = useState<string>('All Topics');
  const [[otherPage, otherDirection], setOtherPage] = useState<[number, number]>([0, 0]);

  // ── Fetch from API ──────────────────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();

    async function fetchArticles() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch('/api/articles', { signal: controller.signal });
        if (!res.ok) throw new Error(`API returned ${res.status}`);

        const data = await res.json();
        const articles: Article[] = data.articles ?? [];

        const bangers = articles.filter((a) => a.isBanger);
        const others = articles.filter((a) => !a.isBanger);

        setBangerArticles(bangers);
        setOtherArticles(others);
        setActiveId(bangers[0]?.id ?? '');
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('[page] fetch error:', err);
        setError('Could not load articles. Please refresh.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticles();
    return () => controller.abort();
  }, []);

  // ── Topic filter (resets page on change) ────────────────────────────────
  const filteredOther =
    activeTopic === 'All Topics'
      ? otherArticles
      : otherArticles.filter((a) => a.topic === activeTopic);

  useEffect(() => {
    setOtherPage([0, 0]);
  }, [activeTopic]);

  // ── Banger carousel logic ────────────────────────────────────────────────
  const activeArticle = bangerArticles.find((a) => a.id === activeId) ?? bangerArticles[0];
  const carouselArticles = bangerArticles.filter((a) => a.id !== activeId);
  const totalPages = Math.ceil(carouselArticles.length / 3);
  const visibleCarouselArticles = carouselArticles.slice(page * 3, (page + 1) * 3);

  const handlePrevPage = () => setPage([page > 0 ? page - 1 : totalPages - 1, -1]);
  const handleNextPage = () => setPage([page < totalPages - 1 ? page + 1 : 0, 1]);

  // ── Other articles pagination (10 per page) ────────────────────────────
  const totalOtherPages = Math.ceil(filteredOther.length / 10);
  const visibleOtherArticles = filteredOther.slice(otherPage * 10, (otherPage + 1) * 10);

  const handlePageChange = (pageNumber: number) => {
    const newIndex = pageNumber - 1;
    setOtherPage([newIndex, newIndex > otherPage ? 1 : -1]);
  };

  return (
    <div id="top-headlines" className="min-h-screen bg-[#F2F2F2] scroll-mt-[41px]">
      <Navbar />
      <main className="flex flex-col items-center pb-12 pt-2">
        <div className="max-w-[1400px] w-full flex flex-col items-center gap-[12px]">

          {/* ── SECTION 1: BANGER HEADLINES ─────────────────────────────── */}
          <div className="w-[1200px] flex flex-col mb-1">
            <h1 className="font-body text-[48px] text-[#32302f] tracking-[0.08em]">Banger Headlines</h1>
            <p className="font-body text-[20px] text-[#847f7c]">
              Curated bangers based on my chosen news preferences, we ballin&apos;.
            </p>
          </div>

          {error ? (
            <div className="w-[1200px] h-[600px] flex items-center justify-center rounded-xl border border-neutral-300 bg-[#F4EEE0]">
              <p className="font-display text-[18px] text-[#847f7c]">{error}</p>
            </div>
          ) : isLoading ? (
            <>
              <HeroCardSkeleton />
              <div className="flex items-center gap-[20px] mt-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-[#e5e5e5] shrink-0 animate-pulse" />
                <div className="w-[1200px] h-[200px] flex gap-[12px]">
                  <BangerCarouselCardSkeleton />
                  <BangerCarouselCardSkeleton />
                  <BangerCarouselCardSkeleton />
                </div>
                <div className="w-14 h-14 rounded-full bg-[#e5e5e5] shrink-0 animate-pulse" />
              </div>
            </>
          ) : (
            <LayoutGroup>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeArticle?.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <HeroCard
                    id={activeArticle?.id}
                    title={activeArticle?.title}
                    summary={activeArticle?.summary}
                    imageUrl={activeArticle?.imageUrl}
                    sourceUrl={activeArticle?.sourceUrl}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-[20px] mt-4 mb-4">
                <button
                  onClick={handlePrevPage}
                  className="w-14 h-14 rounded-full bg-[#e5e5e5] hover:bg-[#d2cac5] transition-colors flex items-center justify-center shrink-0"
                >
                  <ChevronLeft className="w-8 h-8 text-[#000000]" strokeWidth={3} />
                </button>

                <div className="w-[1200px] h-[200px] relative">
                  <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                    <motion.div
                      key={page}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="flex gap-[12px] w-full absolute inset-0"
                    >
                      {visibleCarouselArticles.map((article) => (
                        <BangerCarouselCard
                          key={article.id}
                          id={article.id}
                          title={article.title}
                          imageUrl={article.imageUrl}
                          onClick={() => setActiveId(article.id)}
                        />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <button
                  onClick={handleNextPage}
                  className="w-14 h-14 rounded-full bg-[#e5e5e5] hover:bg-[#d2cac5] transition-colors flex items-center justify-center shrink-0"
                >
                  <ChevronRight className="w-8 h-8 text-[#000000]" strokeWidth={3} />
                </button>
              </div>
            </LayoutGroup>
          )}

          {/* ── SECTION DIVIDER ─────────────────────────────────────────── */}
          <hr
            id="other-headlines"
            className="w-[1200px] border-t-2 border-[#d2cac5] mt-8 mb-2 opacity-60 scroll-mt-[41px]"
          />

          {/* ── SECTION 2: OTHER ARTICLES ───────────────────────────────── */}
          <div className="w-[1200px] flex flex-col mb-6 mt-0">
            <h1 className="font-body text-[48px] text-[#32302f] tracking-[0.08em]">Other Articles</h1>
            <p className="font-body text-[20px] text-[#847f7c]">
              still curated bangers based on my preferences but not as heavy as the ones above in terms of what it&apos;s about.
            </p>
          </div>

          {/* Topic Pills */}
          <div className="flex flex-col gap-3 mb-8 w-[1200px] items-center">
            <div className="flex justify-center gap-3">
              {TOPICS_ROW_1.map((topic) => (
                <TopicPill
                  key={topic}
                  label={topic}
                  isActive={activeTopic === topic}
                  onClick={() => setActiveTopic(topic)}
                />
              ))}
            </div>
            <div className="flex justify-center gap-3">
              {TOPICS_ROW_2.map((topic) => (
                <TopicPill
                  key={topic}
                  label={topic}
                  isActive={activeTopic === topic}
                  onClick={() => setActiveTopic(topic)}
                />
              ))}
            </div>
          </div>

          {/* Other Articles Grid */}
          <div className="flex flex-col items-center gap-[40px] w-[1200px]">
            <div className="w-[1200px] h-[1574px] relative">
              {isLoading ? (
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-5 gap-[6px]">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <OtherCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredOther.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-neutral-200 bg-[#F4EEE0]">
                  <p className="font-display text-[18px] text-[#847f7c]">
                    No articles found for &ldquo;{activeTopic}&rdquo;.
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout" custom={otherDirection} initial={false}>
                  <motion.div
                    key={`${otherPage}-${activeTopic}`}
                    custom={otherDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute inset-0 grid grid-cols-2 grid-rows-5 gap-[6px]"
                  >
                    {visibleOtherArticles.map((article) => (
                      <OtherCard
                        key={article.id}
                        title={article.title}
                        summary={article.summary}
                        imageUrl={article.imageUrl}
                        sourceUrl={article.sourceUrl}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Pagination Component Below Grid */}
            <ContinuousPagination 
              totalPages={totalOtherPages} 
              currentPage={otherPage + 1} 
              onPageChange={handlePageChange} 
            />
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full flex justify-center border-t-2 border-[#d2cac5] bg-[#F2F2F2] py-8 mt-2 opacity-80">
        <div className="w-[1200px] flex justify-between items-center font-display text-[#847f7c] text-sm">
          <span>© 2026 lazynews. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#32302f] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#32302f] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#32302f] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
