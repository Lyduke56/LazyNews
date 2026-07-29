import React from 'react';
import { motion } from 'motion/react';
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
  return (
    <motion.div
      layoutId={layoutId ? `${layoutId}-image` : undefined}
      className="w-[368px] h-[126px] overflow-hidden rounded-md border border-neutral-300 bg-[#32302f] flex items-center justify-center"
    >
      <img
        src={imageUrl || '/fallback.svg'}
        alt="Banger thumbnail"
        className="w-full h-full object-contain"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/fallback.svg';
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
      className="w-[368px] flex flex-col px-2 py-1"
    >
      <h3 className="font-display text-[16px] font-semibold text-[#32302f] truncate">
        {title || 'Headline Unavailable'}
      </h3>
      {(sourceName || publishedAt) && (
        <div className="flex items-center gap-1.5 mt-0.5">
          {sourceName && (
            <span className="font-display text-[11px] font-bold text-[#32302f] truncate">{sourceName}</span>
          )}
          {publishedAt && (
            <>
              <span className="text-[#d2cac5] text-[11px]">·</span>
              <span className="font-display text-[11px] text-[#847f7c] shrink-0">
                {formatAbsoluteTime(publishedAt)}
              </span>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function BangerCarouselCard(props: BangerCarouselCardProps) {
  return (
    <motion.div
      layoutId={props.id}
      onClick={props.onClick}
      className="relative w-[392px] h-[200px] border border-neutral-300 rounded-xl p-[12px] shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
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
      <div className="relative z-10 flex flex-col gap-[2px] w-full h-full">
        <BangerCarouselImage imageUrl={props.imageUrl} layoutId={props.id} />
        <BangerCarouselTitle
          title={props.title}
          layoutId={props.id}
          sourceName={props.sourceName}
          publishedAt={props.publishedAt}
        />
      </div>
    </motion.div>
  );
}
