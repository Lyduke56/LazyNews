import React from 'react';

export function HeroCardSkeleton() {
  return (
    <div className="relative w-[1200px] h-[600px] border border-neutral-200 rounded-xl p-[20px] shadow-sm overflow-hidden bg-[#e5e5e5] animate-pulse">
      {/* Top section */}
      <div className="flex gap-[16px] h-full w-full">
        {/* Image skeleton */}
        <div className="w-[780px] h-[416px] bg-[#d2cac5] rounded-xl shrink-0" />
        
        {/* Right side summary skeleton */}
        <div className="w-[364px] h-[416px] bg-[#d2cac5] rounded-xl shrink-0" />
      </div>
      {/* Bottom Title skeleton */}
      <div className="absolute bottom-[20px] left-[20px] w-[1160px] h-[124px] bg-[#d2cac5] rounded-xl" />
    </div>
  );
}

export function BangerCarouselCardSkeleton() {
  return (
    <div className="relative w-[392px] h-[200px] border border-neutral-200 rounded-xl p-[12px] shadow-sm overflow-hidden bg-[#e5e5e5] animate-pulse flex flex-col gap-[8px]">
      <div className="w-full h-full bg-[#d2cac5] rounded-lg" />
      <div className="w-full h-[46px] bg-[#d2cac5] rounded-lg shrink-0" />
    </div>
  );
}

export function OtherCardSkeleton() {
  return (
    <div className="relative w-[596.73px] h-[274px] border border-neutral-200 shadow-sm rounded-xl overflow-hidden p-[16px] bg-[#e5e5e5] animate-pulse flex flex-col gap-[8px]">
      {/* Top Row */}
      <div className="flex gap-[8px]">
        {/* Image */}
        <div className="w-[372.12px] h-[191.72px] bg-[#d2cac5] rounded-md shrink-0" />
        {/* Summary */}
        <div className="w-[184.55px] h-[192px] bg-[#d2cac5] rounded-md shrink-0" />
      </div>
      {/* Title */}
      <div className="w-[564.73px] h-[42px] bg-[#d2cac5] rounded-md shrink-0" />
    </div>
  );
}
