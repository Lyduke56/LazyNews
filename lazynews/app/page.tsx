"use client";

import React, { useState } from 'react';
import HeroCard from '@/components/HeroCard';
import BangerCarouselCard from '@/components/BangerCarouselCard';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Dummy data for testing the interaction (10 articles)
const DUMMY_ARTICLES = Array.from({ length: 10 }, (_, i) => ({
  id: `article-${i + 1}`,
  title: `Banger Article Title ${i + 1} - consectetur adipiscing elit`,
  summary: `Article Summary Body ${i + 1} - Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada, nulla vitae fermentum rhoncus, ipsum mauris tincidunt elit, sed molestie nisi purus sit amet erat. Nam eu sem ac magna elementum cursus.\n\nPraesent dui magna, mollis convallis est a, tristique imperdiet orci. Integer vel rhoncus urna. Sed at mattis nisl. Aenean consectetur dolor a libero viverra, at mattis arcu consequat. Morbi aliquet metus eros, posuere pharetra erat pharetra eget. Donec ut augue a augue hendrerit fermentum in et ipsum. Suspendisse eget bibendum urna. Vestibulum eget lorem in ipsum commodo pulvinar.`,
  imageUrl: `https://placehold.co/780x416/333333/FFFFFF?text=Article+${i + 1}`
}));

export default function Home() {
  const [activeId, setActiveId] = useState<string>(DUMMY_ARTICLES[0].id);
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);

  const activeArticle = DUMMY_ARTICLES.find(a => a.id === activeId) || DUMMY_ARTICLES[0];
  const carouselArticles = DUMMY_ARTICLES.filter(a => a.id !== activeId);
  
  const totalPages = Math.ceil(carouselArticles.length / 3);
  const visibleCarouselArticles = carouselArticles.slice(page * 3, (page + 1) * 3);

  const handlePrevPage = () => {
    setPage([page > 0 ? page - 1 : totalPages - 1, -1]);
  };
  const handleNextPage = () => {
    setPage([page < totalPages - 1 ? page + 1 : 0, 1]);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      <Navbar />
      <main className="flex flex-col items-center pb-12 pt-6">
        <div className="max-w-[1400px] w-full flex flex-col items-center gap-[12px]">

          {/* Section Header (Aligned to 1200px container) */}
          <div className="w-[1200px] flex flex-col mb-1">
            <h1 className="font-body text-[48px] text-[#32302f] tracking-[0.08em]">Banger Headlines</h1>
            <p className="font-body text-[20px] text-[#847f7c]">
              Curated bangers based on my chosen news preferences, we ballin'.
            </p>
          </div>

          <LayoutGroup>
            {/* Render the Active Hero Card */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeArticle.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <HeroCard 
                  id={activeArticle.id}
                  title={activeArticle.title}
                  summary={activeArticle.summary}
                  body={activeArticle.body}
                  imageUrl={activeArticle.imageUrl}
                />
              </motion.div>
            </AnimatePresence>

            {/* Render the Carousel Cards with Pagination Controls */}
            <div className="flex items-center gap-[20px] mt-4">
              
              {/* Prev Button */}
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
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex gap-[12px] w-full absolute inset-0"
                  >
                    {visibleCarouselArticles.map(article => (
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

              {/* Next Button */}
              <button 
                onClick={handleNextPage}
                className="w-14 h-14 rounded-full bg-[#e5e5e5] hover:bg-[#d2cac5] transition-colors flex items-center justify-center shrink-0"
              >
                <ChevronRight className="w-8 h-8 text-[#000000]" strokeWidth={3} />
              </button>

            </div>
          </LayoutGroup>

        </div>
      </main>
    </div>
  );
}
