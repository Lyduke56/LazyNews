"use client";

import { type FC, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* --- Types --- */

export interface ContinuousPaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

/* --- Helpers --- */

function getPageWindow(currentPage: number, totalPages: number): number[] {
    const pages: number[] = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);
    
    // Ensure we always show 5 pages if possible
    if (end - start < 4) {
        if (start === 1) end = Math.min(totalPages, 5);
        else if (end === totalPages) start = Math.max(1, totalPages - 4);
    }
    
    for (let p = start; p <= end; p++) pages.push(p);

    return pages;
}

/* --- Sub-Components --- */

interface PageButtonProps {
    children: ReactNode;
    onClick: () => void;
}

const PageButton: FC<PageButtonProps> = ({ children, onClick }) => {
    return (
        <motion.button
            onClick={onClick}
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl flex items-center justify-center text-[#706F78] dark:text-zinc-500 hover:text-[#65656c] dark:hover:text-zinc-300 border border-slate-500/20 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_4px_10px_rgba(0,0,0,0.12)]"
            whileHover={{
                scale: 1.08,
                y: -6,
                boxShadow: "0 6px 10px rgba(0,0,0,0.12)",
            }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
            {children}
        </motion.button>
    );
};

/* --- Main Component --- */

export const ContinuousPagination: FC<ContinuousPaginationProps> = ({
    totalPages = 5,
    currentPage = 1,
    onPageChange,
}) => {
    const isDark = false; // hardcoding to false for this theme

    const paginate = (page: number) => {
        if (page < 1 || page > totalPages) return;
        onPageChange(page);
    };

    if (totalPages <= 1) return null;

    const pageWindow = getPageWindow(currentPage, totalPages);

    return (
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 text-sm">
            {/* Prev */}
            <PageButton onClick={() => paginate(currentPage - 1)}>
                <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
            </PageButton>

            {/* Pages + Ellipsis */}
            <div className="relative flex gap-1.5 sm:gap-3">
                {pageWindow.map((page) => {
                    const isActive = page === currentPage;

                    return (
                        <motion.button
                            key={page}
                            onClick={() => paginate(page)}
                            className={`relative z-10 h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl flex items-center justify-center text-sm font-medium transition-colors duration-300 border border-slate-500/20 dark:border-zinc-800 shadow-[0_4px_10px_rgba(0,0,0,0.12)]
                ${isActive
                                ? "text-white"
                                : "text-gray-500 dark:text-zinc-500 hover:text-gray-800 dark:hover:text-zinc-300 bg-white dark:bg-zinc-900"
                            }`}
                            whileHover={
                                !isActive
                                    ? {
                                        y: -6,
                                        boxShadow: isDark
                                            ? "0 10px 20px rgba(0,0,0,0.4)"
                                            : "0 6px 10px rgba(0,0,0,0.12)",
                                    }
                                    : {}
                            }
                            whileTap={{ scale: 0.92 }}
                            transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        >
                            {/* Active background */}
                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-bg"
                                        className="absolute inset-0 rounded-lg sm:rounded-xl overflow-hidden"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 220, damping: 24, mass: 0.8 }}
                                    >
                                        <div
                                            className="absolute inset-0 rounded-lg sm:rounded-xl"
                                            style={{
                                                background: `linear-gradient(135deg, #2a2a2e 0%, #1a1a1c 50%, #0a0a0c 100%)`,
                                                border: `1px solid #3a3a3e`,
                                                boxShadow: `
                                                    0 8px 16px -4px rgba(0,0,0,0.7),
                                                    inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)
                                                `,
                                            }}
                                        />
                                        <motion.div
                                            className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12"
                                            animate={{ x: ["-100%", "200%"] }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                repeatDelay: 5,
                                                ease: "easeInOut",
                                            }}
                                        />
                                        <span
                                            className="absolute inset-0 rounded-[inherit] pointer-events-none"
                                            style={{
                                                boxShadow: "inset 0 -4px 8px 0 rgba(0, 0, 0, 0.6)",
                                            }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <span className="relative z-10 text-[15px] sm:text-lg font-semibold">{page}</span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Next */}
            <PageButton onClick={() => paginate(currentPage + 1)}>
                <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
            </PageButton>
        </div>
    );
};
