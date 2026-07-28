import React from 'react';
import { Home } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center py-2.5 bg-[#FFFFFF] bg-opacity-90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-200">
      <div className="w-[1200px] flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-[#32302f]" strokeWidth={2.5} />
          <span className="font-display font-bold text-xl text-[#32302f]">lazynews</span>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex items-center gap-20 font-body text-[16px] text-[#32302f]">
          <a href="#" className="hover:opacity-70 hover:underline transition-opacity">top headlines</a>
          <a href="#" className="hover:opacity-70 hover:underline transition-opacity">other headlines</a>
          <a href="#" className="hover:opacity-70 hover:underline transition-opacity">why?</a>
        </div>
      </div>
    </nav>
  );
}
