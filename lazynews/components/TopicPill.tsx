import React from 'react';
import { motion } from 'motion/react';

interface TopicPillProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function TopicPill({ label, isActive, onClick }: TopicPillProps) {
  return (
    <button
      onClick={onClick}
      className={`relative w-[175px] h-[30px] rounded-full border border-neutral-300 flex items-center justify-center transition-colors ${
        isActive ? 'bg-[#F6E0B5] font-bold text-[#32302f]' : 'bg-[#e9e0d4] text-[#847f7c] hover:bg-[#F6E0B5]/50'
      }`}
    >
      <span className="font-display text-[14px] z-10">{label}</span>
      {isActive && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 rounded-full border-2 border-[#32302f] pointer-events-none"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}
