'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build page number list with ellipsis
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-16 mb-4 select-none">
      {/* Prev arrow */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="
          flex items-center justify-center w-9 h-9 rounded-full
          border border-[#e0d9cf]
          bg-white/70 backdrop-blur-sm
          text-[#7a6e60]
          transition-all duration-200
          hover:bg-[#f0ebe3] hover:border-[#c9bfb0] hover:text-[#3b3833] hover:shadow-sm
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/70 disabled:hover:border-[#e0d9cf] disabled:hover:shadow-none
        "
      >
        <ChevronLeft size={16} strokeWidth={2} />
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-[#b0a090] text-[14px] font-poppins">
            ···
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`
              flex items-center justify-center w-9 h-9 rounded-full
              text-[14px] font-poppins font-medium
              border transition-all duration-200
              ${
                currentPage === page
                  ? 'bg-[#3b3833] border-[#3b3833] text-white shadow-md scale-105'
                  : 'bg-white/70 backdrop-blur-sm border-[#e0d9cf] text-[#7a6e60] hover:bg-[#f0ebe3] hover:border-[#c9bfb0] hover:text-[#3b3833] hover:shadow-sm'
              }
            `}
          >
            {page}
          </button>
        )
      )}

      {/* Next arrow */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="
          flex items-center justify-center w-9 h-9 rounded-full
          border border-[#e0d9cf]
          bg-white/70 backdrop-blur-sm
          text-[#7a6e60]
          transition-all duration-200
          hover:bg-[#f0ebe3] hover:border-[#c9bfb0] hover:text-[#3b3833] hover:shadow-sm
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/70 disabled:hover:border-[#e0d9cf] disabled:hover:shadow-none
        "
      >
        <ChevronRight size={16} strokeWidth={2} />
      </button>
    </div>
  );
}
