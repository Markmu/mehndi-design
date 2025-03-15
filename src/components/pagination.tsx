'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/gallery?${params.toString()}`);
  };

  return (
    <nav className="flex items-center space-x-2">
      <button
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${
          currentPage === 1
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-gray-100 text-[#2D1810] hover:bg-gray-200'
        }`}
      >
        上一页
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(page => 
          page === 1 || 
          page === totalPages || 
          Math.abs(page - currentPage) <= 1
        )
        .map((page, index, array) => {
          if (index > 0 && page - array[index - 1] > 1) {
            return (
              <span key={`ellipsis-${page}`} className="px-3 py-1">...</span>
            );
          }
          
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-[#7E4E3B] text-white'
                  : 'bg-gray-100 text-[#2D1810] hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          );
        })}
      
      <button
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-gray-100 text-[#2D1810] hover:bg-gray-200'
        }`}
      >
        下一页
      </button>
    </nav>
  );
}