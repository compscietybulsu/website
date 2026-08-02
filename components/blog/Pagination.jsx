"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-6 mt-10">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="text-green-400 disabled:text-green-900 transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={22} strokeWidth={3} />
      </button>
      <span className="font-heading font-semibold text-green-300">{page}</span>
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="text-green-400 disabled:text-green-900 transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={22} strokeWidth={3} />
      </button>
    </div>
  );
}