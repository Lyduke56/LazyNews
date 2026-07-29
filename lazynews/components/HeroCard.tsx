import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { formatAbsoluteTime } from '@/lib/formatDate';

interface HeroCardProps {
  id?: string;
  title?: string;
  summary?: string;
  imageUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
  publishedAt?: string;
  aiReason?: string;
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
  const content = (
    <motion.div
      layoutId={layoutId ? `${layoutId}-image` : undefined}
      className="w-[780px] h-[416px] overflow-hidden rounded-md border border-neutral-300 bg-[#32302f] flex items-center justify-center"
    >
      <img
        src={imageUrl || '/fallback.svg'}
        alt="Hero thumbnail"
        className="w-full h-full object-contain"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/fallback.svg';
        }}
      />
    </motion.div>
  );

  if (sourceUrl) {
    return (
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
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
      className="w-[780px] h-[140px] px-4 pb-4 pt-1 flex flex-col justify-between"
    >
      <h2 className="font-body text-[32px] font-semibold leading-[1.3] text-[#32302f] line-clamp-2 pb-2">
        {title || 'Headline Unavailable'}
      </h2>
      {(sourceName || publishedAt) && (
        <div className="flex items-center gap-2 mt-2">
          {sourceName && sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[16px] font-bold text-[#32302f] hover:text-[#000000] transition-colors"
            >
              {sourceName}
            </a>
          ) : (
            <span className="font-display text-[16px] font-bold text-[#32302f]">{sourceName}</span>
          )}
          {publishedAt && (
            <>
              <span className="text-[#d2cac5]">·</span>
              <span className="font-display text-[16px] text-[#847f7c]">
                {formatAbsoluteTime(publishedAt)}
              </span>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}

export function HeroCardArticleSummary({ summary, aiReason }: { summary?: string; aiReason?: string }) {
  return (
    // Extends to fill entire right column: 416px image + 12px gap + 140px title = 568px
    <div className="w-[376px] h-[568px] flex flex-col gap-3">
      {/* Top box: Article Summary */}
      <div className="flex-1 bg-[#f6e0b5] rounded-md p-4 border border-neutral-300 flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#32302f]"
          >
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" x2="6" y1="2" y2="4" />
            <line x1="10" x2="10" y1="2" y2="4" />
            <line x1="14" x2="14" y1="2" y2="4" />
          </svg>
          <span className="font-display text-[20px] font-bold text-[#32302f]">Article Summary</span>
        </div>
        {/* Scrollable body */}
        <div className="overflow-y-auto custom-scrollbar flex-1 pr-3">
          <p className="font-display text-[clamp(16px,1.5vw,20px)] text-[#32302f] leading-[1.8] tracking-wide text-justify">
            {summary || 'No summary available.'}
          </p>
        </div>
      </div>

      {/* Bottom box: AI Reason */}
      <div className="h-[220px] bg-[#e9e0d4] rounded-md p-4 border border-neutral-300 flex flex-col shrink-0">
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <Sparkles className="w-5 h-5 text-[#32302f]" />
          <span className="font-display text-[20px] font-bold text-[#32302f]">Why it's a Banger</span>
        </div>
        {/* Scrollable body */}
        <div className="overflow-y-auto custom-scrollbar flex-1 pr-3">
          <p className="font-display text-[15px] text-[#847f7c] leading-[1.7] text-justify">
            {aiReason || 'This article was flagged as a banger because it covers high-impact geopolitical events with significant global consequences and trending engagement metrics.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HeroCard(props: HeroCardProps) {
  return (
    // 1200x600, 16px edge padding
    <motion.div
      layoutId={props.id}
      className="relative w-[1200px] h-[600px] border border-neutral-300 p-[16px] rounded-xl shadow-sm overflow-hidden bg-[#F4EEE0]"
    >
      {/* Background image layer at 50% opacity */}
      <div
        className="absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage: 'url(/card-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 flex gap-[12px] w-full h-full">
        {/* Left Column: Image + Title */}
        <div className="flex flex-col gap-[12px]">
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

        <div className="shrink-0">
          <HeroCardArticleSummary summary={props.summary} aiReason={props.aiReason} />
        </div>
      </div>
    </motion.div>
  );
}
