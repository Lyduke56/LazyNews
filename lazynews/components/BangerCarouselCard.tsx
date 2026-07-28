import React from 'react';
import { motion } from 'motion/react';

interface BangerCarouselCardProps {
  id?: string;
  title?: string;
  imageUrl?: string;
  onClick?: () => void;
}

export function BangerCarouselImage({ imageUrl = 'https://placehold.co/368x130', layoutId }: { imageUrl?: string; layoutId?: string }) {
  return (
    <motion.div layoutId={layoutId ? `${layoutId}-image` : undefined} className="w-[368px] h-[130px] overflow-hidden rounded-t-md">
      <img src={imageUrl} alt="Carousel thumbnail" className="w-full h-full object-cover" />
    </motion.div>
  );
}

export function BangerCarouselTitle({ title = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. - article title', layoutId }: { title?: string; layoutId?: string }) {
  return (
    <motion.div layoutId={layoutId ? `${layoutId}-title` : undefined} className="w-[368px] h-[46px] flex items-center px-2">
      {/* 16px inika */}
      <h3 className="font-display text-[16px] font-semibold text-[#32302f] truncate">
        {title}
      </h3>
    </motion.div>
  );
}

export default function BangerCarouselCard(props: BangerCarouselCardProps) {
  return (
    // banger-carousel card - 392x200; 
    <motion.div 
      layoutId={props.id}
      onClick={props.onClick}
      className="relative w-[392px] h-[200px] border border-neutral-300 rounded-xl p-[12px] shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Background Image layer at 50% opacity */}
      <div 
        className="absolute inset-0 z-0 opacity-50"
        style={{ backgroundImage: 'url(/card-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col gap-[2px] w-full h-full pointer-events-none">
        <BangerCarouselImage imageUrl={props.imageUrl} layoutId={props.id} />
        <BangerCarouselTitle title={props.title} layoutId={props.id} />
      </div>
    </motion.div>
  );
}
