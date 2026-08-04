'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { formatAbsoluteTime } from '@/lib/formatDate';

interface OtherCardProps {
  title?: string;
  summary?: string;
  imageUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
  publishedAt?: string;
}

export function OtherCardImage({
  imageUrl,
  sourceUrl,
}: {
  imageUrl?: string;
  sourceUrl?: string;
}) {
  const [imgSrc, setImgSrc] = useState(imageUrl || '/fallback.svg');

  const content = (
    <div className="w-full aspect-[4/3] overflow-hidden rounded-md border border-neutral-300 bg-[#1c1a19] flex items-center justify-center relative shadow-inner">
      <Image
        src={imgSrc}
        alt="Other card thumbnail"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        onError={() => {
          if (imgSrc !== '/fallback.svg') setImgSrc('/fallback.svg');
        }}
      />
    </div>
  );

  const wrapperClass = "w-[55%] sm:w-[45%] md:w-[55%] shrink-0";

  if (sourceUrl) {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`pointer-events-auto block ${wrapperClass} overflow-hidden rounded-md`}
      >
        {content}
      </a>
    );
  }
  return <div className={wrapperClass}>{content}</div>;
}

export function OtherCardArticleSummary({ summary }: { summary?: string }) {
  return (
    <div className="flex-1 min-w-0 relative h-full">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-md p-2 sm:p-[12px] border border-white/40 flex flex-col custom-scrollbar overflow-y-auto shadow-sm group-hover/summary:bg-white/80 transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f6e0b5]/20 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-[6px] mb-2 shrink-0 relative z-10">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#8b7355] shrink-0"
          >
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" x2="6" y1="2" y2="4" />
            <line x1="10" x2="10" y1="2" y2="4" />
            <line x1="14" x2="14" y1="2" y2="4" />
          </svg>
          <span className="font-display text-[13px] sm:text-[14px] font-bold text-[#32302f] leading-none">
            Article Summary
          </span>
        </div>
        <p className="font-display text-[11px] sm:text-[12px] text-[#4a4745] leading-[16px] sm:leading-[18px] relative z-10 text-justify">
          {summary || 'No summary available.'}
        </p>
      </div>
    </div>
  );
}

export function OtherCardTitle({
  title,
  sourceName,
  publishedAt,
  sourceUrl,
}: {
  title?: string;
  sourceName?: string;
  publishedAt?: string;
  sourceUrl?: string;
}) {
  return (
    <div className="w-full min-h-[42px] h-auto rounded-md px-2 sm:px-4 py-1 flex flex-col justify-center shrink-0 relative z-10">
      <h3 className="font-body text-[16px] sm:text-[18px] lg:text-[20px] text-[#32302f] line-clamp-2 w-full leading-snug group-hover:text-black transition-colors">
        {title || 'Headline Unavailable'}
      </h3>
      {(sourceName || publishedAt) && (
        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
          {sourceName && sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[11px] font-bold text-[#8b7355] hover:text-[#000000] transition-colors"
            >
              {sourceName}
            </a>
          ) : (
            <span className="font-display text-[11px] font-bold text-[#32302f]">{sourceName}</span>
          )}
          {publishedAt && (
            <>
              <span className="text-[#d2cac5] text-[11px]">·</span>
              <time dateTime={publishedAt} className="font-display text-[11px] text-[#847f7c]">
                {formatAbsoluteTime(publishedAt)}
              </time>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function OtherCard(props: OtherCardProps) {
  return (
    <article className="relative w-full h-full min-h-[250px] sm:min-h-[310px] border border-neutral-300 shadow-sm rounded-xl overflow-hidden p-3 sm:p-[16px] bg-[#F4EEE0] flex flex-col group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      {/* Background Image layer with subtle overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.35] group-hover:opacity-50 transition-opacity duration-300"
        style={{
          backgroundImage: 'url(/card-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#F4EEE0]/90 to-transparent pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col gap-2 sm:gap-[8px] w-full h-full flex-1">
        {/* Top Row: Image + Summary */}
        <div className="flex flex-row gap-2 sm:gap-[8px] items-stretch h-[120px] sm:h-auto">
          <OtherCardImage imageUrl={props.imageUrl} sourceUrl={props.sourceUrl} />
          <OtherCardArticleSummary summary={props.summary} />
        </div>

        {/* Bottom Row: Title + source badge */}
        <OtherCardTitle
          title={props.title}
          sourceName={props.sourceName}
          publishedAt={props.publishedAt}
          sourceUrl={props.sourceUrl}
        />
      </div>
    </article>
  );
}
