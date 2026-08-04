'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { formatAbsoluteTime } from '@/lib/formatDate';

interface BangerCarouselCardProps {
  id?: string;
  title?: string;
  imageUrl?: string;
  sourceName?: string;
  publishedAt?: string;
  onClick?: () => void;
}

export function BangerCarouselImage({
  imageUrl,
  layoutId,
}: {
  imageUrl?: string;
  layoutId?: string;
}) {
  const [imgSrc, setImgSrc] = useState(imageUrl || '/fallback.svg');

  return (
    <motion.div
      layoutId={layoutId ? `${layoutId}-image` : undefined}
      className="w-full h-[140px] sm:h-[126px] overflow-hidden rounded-md border border-neutral-300 bg-[#1c1a19] flex items-center justify-center relative shadow-inner"
    >
      <Image
        src={imgSrc}
        alt="Banger thumbnail"
        fill
        sizes="(max-width: 768px) 100vw, 368px"
        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        onError={() => {
          if (imgSrc !== '/fallback.svg') setImgSrc('/fallback.svg');
        }}
      />
    </motion.div>
  );
}

export function BangerCarouselTitle({
  title,
  layoutId,
  sourceName,
  publishedAt,
}: {
  title?: string;
  layoutId?: string;
  sourceName?: string;
  publishedAt?: string;
}) {
  return (
    <motion.div
      layoutId={layoutId ? `${layoutId}-title` : undefined}
      className="w-full flex flex-col px-2 py-1 relative z-10"
    >
      <h3 className="font-display text-[15px] sm:text-[16px] font-semibold text-[#32302f] line-clamp-2 sm:truncate group-hover:text-black transition-colors">
        {title || 'Headline Unavailable'}
      </h3>
      {(sourceName || publishedAt) && (
        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
          {sourceName && (
            <span className="font-display text-[11px] sm:text-[12px] font-bold text-[#8b7355] truncate">{sourceName}</span>
          )}
          {publishedAt && (
            <>
              <span className="text-[#d2cac5] text-[11px]">·</span>
              <time dateTime={publishedAt} className="font-display text-[11px] sm:text-[12px] text-[#847f7c] shrink-0">
                {formatAbsoluteTime(publishedAt)}
              </time>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function BangerCarouselCard(props: BangerCarouselCardProps) {
  return (
    <motion.article
      layoutId={props.id}
      onClick={props.onClick}
      className="relative w-full sm:w-[392px] h-auto sm:h-[200px] border border-neutral-300 rounded-xl p-[12px] shadow-sm overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 flex-shrink-0 bg-[#F4EEE0]"
    >
      {/* Background Image layer with subtle overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.35] group-hover:opacity-50 transition-opacity duration-300"
        style={{
          backgroundImage: 'url(/card-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col gap-2 w-full h-full">
        <BangerCarouselImage imageUrl={props.imageUrl} layoutId={props.id} />
        <BangerCarouselTitle
          title={props.title}
          layoutId={props.id}
          sourceName={props.sourceName}
          publishedAt={props.publishedAt}
        />
      </div>
    </motion.article>
  );
}
