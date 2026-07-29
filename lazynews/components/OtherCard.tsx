import React from 'react';
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
  const content = (
    <div className="w-full aspect-[4/3] overflow-hidden rounded-md border border-neutral-300 bg-[#32302f] flex items-center justify-center">
      <img
        src={imageUrl || '/fallback.svg'}
        alt="Other card thumbnail"
        className="w-full h-full object-contain"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/fallback.svg';
        }}
      />
    </div>
  );

  const wrapperClass = "w-[55%] shrink-0";

  if (sourceUrl) {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`pointer-events-auto block ${wrapperClass}`}
      >
        {content}
      </a>
    );
  }
  return <div className={wrapperClass}>{content}</div>;
}

export function OtherCardArticleSummary({ summary }: { summary?: string }) {
  return (
    <div className="flex-1 min-w-0 relative">
      <div className="absolute inset-0 bg-[#f6e0b5] rounded-md p-[12px] border border-neutral-300 flex flex-col custom-scrollbar overflow-y-auto">
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
        <p className="font-display text-[11px] text-[#32302f] leading-[16px]">
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
    <div className="w-full min-h-[42px] h-auto rounded-md px-4 py-1 flex flex-col justify-center shrink-0">
      <h3 className="font-body text-[20px] text-[#32302f] line-clamp-2 w-full leading-snug">
        {title || 'Headline Unavailable'}
      </h3>
      {(sourceName || publishedAt) && (
        <div className="flex items-center gap-1.5 mt-0.5">
          {sourceName && sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[11px] font-bold text-[#32302f] hover:text-[#000000] transition-colors"
            >
              {sourceName}
            </a>
          ) : (
            <span className="font-display text-[11px] font-bold text-[#32302f]">{sourceName}</span>
          )}
          {publishedAt && (
            <>
              <span className="text-[#d2cac5] text-[11px]">·</span>
              <span className="font-display text-[11px] text-[#847f7c]">
                {formatAbsoluteTime(publishedAt)}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function OtherCard(props: OtherCardProps) {
  return (
    <div className="relative w-full h-full min-h-[310px] border border-neutral-300 shadow-sm rounded-xl overflow-hidden p-[16px] bg-[#F4EEE0] flex flex-col">
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
      <div className="relative z-10 flex flex-col gap-[8px] w-full h-full flex-1">
        {/* Top Row: Image + Summary */}
        <div className="flex gap-[8px] items-stretch">
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
    </div>
  );
}
