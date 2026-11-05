'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { formatAbsoluteTime } from '@/lib/formatDate';

interface HeroCardProps {
  id?: string;
  title?: string;
  summary?: string;
  imageUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
  publishedAt?: string;
}

export function HeroCardImage({
  imageUrl,
  layoutId,
  sourceUrl,
}: {
  imageUrl?: string;
  layoutId?: string;
  sourceUrl?: string;
}) {
  const [imgSrc, setImgSrc] = useState(imageUrl || '/fallback.svg');

  const content = (
    <motion.div
      layoutId={layoutId ? `${layoutId}-image` : undefined}
      className="w-full lg:w-[780px] h-[250px] sm:h-[350px] lg:h-[416px] overflow-hidden rounded-md border border-neutral-300 bg-[#1c1a19] flex items-center justify-center relative shadow-inner shrink-0"
    >
      <Image
        src={imgSrc}
        alt="Hero thumbnail"
        fill
        sizes="(max-width: 1024px) 100vw, 780px"
        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        onError={() => {
          if (imgSrc !== '/fallback.svg') setImgSrc('/fallback.svg');
        }}
      />
    </motion.div>
  );

  if (sourceUrl) {
    return (
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="block cursor-pointer overflow-hidden rounded-md">
        {content}
      </a>
    );
  }
  return content;
}

export function HeroCardTitle({
  title,
  layoutId,
  sourceName,
  publishedAt,
  sourceUrl,
}: {
  title?: string;
  layoutId?: string;
  sourceName?: string;
  publishedAt?: string;
  sourceUrl?: string;
}) {
  return (
    <motion.div
      layoutId={layoutId ? `${layoutId}-title` : undefined}
      className="w-full lg:w-[780px] px-2 sm:px-4 pb-4 pt-3 lg:pt-1 flex flex-col justify-between"
    >
      <h2 className="font-body text-[24px] sm:text-[28px] lg:text-[32px] font-semibold leading-[1.3] text-[#32302f] line-clamp-3 lg:line-clamp-2 pb-2">
        {title || 'Headline Unavailable'}
      </h2>
      {(sourceName || publishedAt) && (
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {sourceName && sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[14px] sm:text-[16px] font-bold text-[#32302f] hover:text-[#000000] hover:underline transition-all"
            >
              {sourceName}
            </a>
          ) : (
            <span className="font-display text-[14px] sm:text-[16px] font-bold text-[#32302f]">{sourceName}</span>
          )}
          {publishedAt && (
            <>
              <span className="text-[#d2cac5]">·</span>
              <time dateTime={publishedAt} className="font-display text-[14px] sm:text-[16px] text-[#847f7c]">
                {formatAbsoluteTime(publishedAt)}
              </time>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}

export function HeroCardArticleSummary({ summary }: { summary?: string }) {
  return (
    <div className="w-full lg:w-[376px] lg:h-[568px] flex flex-col shrink-0">
      {/* Top box: Article Summary */}
      <div className="flex-1 bg-white/60 backdrop-blur-md rounded-md p-4 border border-white/40 shadow-sm flex flex-col min-h-[200px] lg:min-h-0 relative overflow-hidden group/summary hover:bg-white/80 transition-colors duration-300">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f6e0b5]/20 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-3 shrink-0 relative z-10">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#8b7355]"
          >
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" x2="6" y1="2" y2="4" />
            <line x1="10" x2="10" y1="2" y2="4" />
            <line x1="14" x2="14" y1="2" y2="4" />
          </svg>
          <span className="font-display text-[18px] sm:text-[20px] font-bold text-[#32302f]">Article Summary</span>
        </div>
        {/* Scrollable body */}
        <div className="overflow-y-auto custom-scrollbar flex-1 pr-3 relative z-10">
          <p className="font-display text-[15px] sm:text-[16px] lg:text-[clamp(16px,1.5vw,18px)] text-[#4a4745] leading-[1.8] tracking-wide text-justify">
            {summary || 'No summary available.'}
          </p>
        </div>
      </div>

    </div>
  );
}

export default function HeroCard(props: HeroCardProps) {
  return (
    <motion.article
      layoutId={props.id}
      className="relative w-full max-w-[1200px] h-auto lg:h-[600px] border border-neutral-300 p-3 sm:p-4 rounded-xl shadow-sm overflow-hidden bg-[#F4EEE0] group hover:shadow-md transition-all duration-300 mx-auto"
    >
      {/* Background image layer with blur and gradient overlay for modern feel */}
      <div
        className="absolute inset-0 z-0 opacity-[0.35]"
        style={{
          backgroundImage: 'url(/card-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#F4EEE0]/80 via-transparent to-[#f6e0b5]/20 pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-3 lg:gap-[12px] w-full h-full">
        {/* Left Column: Image + Title */}
        <div className="flex flex-col gap-3 lg:gap-[12px] flex-1 min-w-0">
          <HeroCardImage
            imageUrl={props.imageUrl}
            layoutId={props.id}
            sourceUrl={props.sourceUrl}
          />
          <HeroCardTitle
            title={props.title}
            layoutId={props.id}
            sourceName={props.sourceName}
            publishedAt={props.publishedAt}
            sourceUrl={props.sourceUrl}
          />
        </div>

        {/* Right Column: Summaries */}
        <HeroCardArticleSummary summary={props.summary} />
      </div>
    </motion.article>
  );
}
