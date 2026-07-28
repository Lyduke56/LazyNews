import React from 'react';
import { motion } from 'motion/react';

interface BangerCarouselCardProps {
  id?: string;
  title?: string;
  imageUrl?: string;
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
        src={imageUrl || 'https://placehold.co/400x300'}
        alt="Banger thumbnail"
        className="h-full w-auto object-contain"
      />
    </motion.div>
  );
}

export function BangerCarouselTitle({
  title,
  layoutId,
}: {
  title?: string;
  layoutId?: string;
}) {
  return (
    <motion.div
      layoutId={layoutId ? `${layoutId}-title` : undefined}
      className="w-[368px] h-[46px] flex items-center px-2"
    >
      <h3 className="font-display text-[16px] font-semibold text-[#32302f] truncate">
        {title || 'Headline Unavailable'}
      </h3>
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
        <BangerCarouselTitle title={props.title} layoutId={props.id} />
      </div>
    </motion.div>
  );
}
