import React from 'react';

interface OtherCardProps {
  title?: string;
  summary?: string;
  imageUrl?: string;
  sourceUrl?: string;
}

export function OtherCardImage({
  imageUrl,
  sourceUrl,
}: {
  imageUrl?: string;
  sourceUrl?: string;
}) {
  const img = (
    <div className="w-[372.12px] h-[191.72px] overflow-hidden rounded-md border border-neutral-300 bg-[#32302f] flex items-center justify-center shrink-0">
      <img
        src={imageUrl || 'https://placehold.co/400x300'}
        alt="Other card thumbnail"
        className="h-full w-auto object-contain"
      />
    </div>
  );

  if (sourceUrl) {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto shrink-0"
      >
        {img}
      </a>
    );
  }
  return img;
}

export function OtherCardArticleSummary({ summary }: { summary?: string }) {
  return (
    <div className="w-[184.55px] h-[192px] bg-[#f6e0b5] rounded-md p-[12px] border border-neutral-300 flex flex-col shrink-0">
      <div className="flex items-center gap-[6px] mb-2 shrink-0">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#32302f] shrink-0"
        >
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" x2="6" y1="2" y2="4" />
          <line x1="10" x2="10" y1="2" y2="4" />
          <line x1="14" x2="14" y1="2" y2="4" />
        </svg>
        <span className="font-display text-[14px] font-bold text-[#32302f] leading-none">
          Article Summary
        </span>
      </div>
      {/* Scrollable summary */}
      <div className="overflow-y-auto custom-scrollbar flex-1 pr-[2px]">
        <p className="font-display text-[11px] text-[#32302f] leading-[16px]">
          {summary || 'No summary available.'}
        </p>
      </div>
    </div>
  );
}

export function OtherCardTitle({ title }: { title?: string }) {
  return (
    <div className="w-[564.73px] min-h-[42px] h-auto bg-[#e9e0d4] rounded-md px-4 py-2 flex items-center border border-neutral-300 shrink-0">
      <h3 className="font-body text-[20px] text-[#32302f] line-clamp-2 w-full leading-snug">
        {title || 'Headline Unavailable'}
      </h3>
    </div>
  );
}

export default function OtherCard(props: OtherCardProps) {
  return (
    <div className="relative w-[596.73px] h-[310px] border border-neutral-300 shadow-sm rounded-xl overflow-hidden p-[16px] bg-[#F4EEE0]">
      {/* Background Image layer at 50% opacity */}
      <div
        className="absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage: 'url(/card-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col gap-[8px] w-full h-full">
        {/* Top Row: Image + Summary */}
        <div className="flex gap-[8px]">
          <OtherCardImage imageUrl={props.imageUrl} sourceUrl={props.sourceUrl} />
          <OtherCardArticleSummary summary={props.summary} />
        </div>

        {/* Bottom Row: Title */}
        <OtherCardTitle title={props.title} />
      </div>
    </div>
  );
}
