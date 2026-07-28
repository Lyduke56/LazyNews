import React from 'react';
import { motion } from 'motion/react';

interface HeroCardProps {
  id?: string;
  title?: string;
  summary?: string;
  body?: string;
  imageUrl?: string;
}

export function HeroCardImage({ imageUrl = 'https://placehold.co/780x416', layoutId }: { imageUrl?: string; layoutId?: string }) {
  return (
    <motion.div layoutId={layoutId ? `${layoutId}-image` : undefined} className="w-[780px] h-[416px] overflow-hidden rounded-md border border-neutral-300">
      <img src={imageUrl} alt="Hero thumbnail" className="w-full h-full object-cover" />
    </motion.div>
  );
}

export function HeroCardTitle({ title = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. - article title 32-40 size', layoutId }: { title?: string; layoutId?: string }) {
  return (
    <motion.div layoutId={layoutId ? `${layoutId}-title` : undefined} className="w-[780px] h-[140px] bg-[#e9e0d4] rounded-md p-4 flex items-center border border-neutral-300">
      {/* IBM Plex Serif (font-body), 32-40px depending on length */}
      <h2 className="font-body text-[32px] md:text-[40px] font-semibold leading-tight text-[#32302f]">
        {title}
      </h2>
    </motion.div>
  );
}

export function HeroCardArticleSummary({ summary = 'Article Summary Body - Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }: { summary?: string }) {
  return (
    <div className="w-[376px] h-[160px] bg-[#f6e0b5] rounded-md p-4 border border-neutral-300 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#32302f]">
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" x2="6" y1="2" y2="4" />
          <line x1="10" x2="10" y1="2" y2="4" />
          <line x1="14" x2="14" y1="2" y2="4" />
        </svg>
        <span className="font-display text-[20px] font-bold text-[#32302f]">Article Summary</span>
      </div>
      <p className="font-display text-[16px] text-[#32302f] leading-snug">
        {summary}
      </p>
    </div>
  );
}

export function HeroCardBody({ body = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...' }: { body?: string }) {
  return (
    <div className="w-[376px] h-[396px] bg-[#e9e0d4] rounded-md p-4 border border-neutral-300 overflow-y-auto custom-scrollbar">
      {/* 16px, 24 line height */}
      <p className="text-[16px] leading-[24px] text-[#32302f]">
        {body}
      </p>
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
      {/* Background Image layer at 50% opacity */}
      <div
        className="absolute inset-0 z-0 opacity-50"
        style={{ backgroundImage: 'url(/card-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 flex gap-[12px] w-full h-full">
        {/* Left Column (Image + Title) */}
        <div className="flex flex-col gap-[12px]">
          <HeroCardImage imageUrl={props.imageUrl} layoutId={props.id} />
          <HeroCardTitle title={props.title} layoutId={props.id} />
        </div>

        {/* Right Column (Summary + Body) */}
        <div className="flex flex-col gap-[12px]">
          <HeroCardArticleSummary summary={props.summary} />
          <HeroCardBody body={props.body} />
        </div>
      </div>
    </motion.div>
  );
}
