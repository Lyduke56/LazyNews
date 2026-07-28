import React from 'react';
import { motion } from 'motion/react';

interface HeroCardProps {
  id?: string;
  title?: string;
  summary?: string;
  imageUrl?: string;
  sourceUrl?: string;
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
        src={imageUrl || 'https://placehold.co/780x416'}
        alt="Hero thumbnail"
        className="h-full w-auto object-contain"
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
}: {
  title?: string;
  layoutId?: string;
}) {
  return (
    <motion.div
      layoutId={layoutId ? `${layoutId}-title` : undefined}
      className="w-[780px] h-[140px] bg-[#e9e0d4] rounded-md p-4 flex items-center border border-neutral-300"
    >
      <h2 className="font-body text-[32px] font-semibold leading-tight text-[#32302f] line-clamp-2">
        {title || 'Headline Unavailable'}
      </h2>
    </motion.div>
  );
}

export function HeroCardArticleSummary({ summary }: { summary?: string }) {
  return (
    // Extends to fill entire right column: 416px image + 12px gap + 140px title = 568px
    <div className="w-[376px] h-[568px] bg-[#f6e0b5] rounded-md p-4 border border-neutral-300 flex flex-col">
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
          <HeroCardTitle title={props.title} layoutId={props.id} />
        </div>

        {/* Right Column: Extended Summary only */}
        <HeroCardArticleSummary summary={props.summary} />
      </div>
    </motion.div>
  );
}
