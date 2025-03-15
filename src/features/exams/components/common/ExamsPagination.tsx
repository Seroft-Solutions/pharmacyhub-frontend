"use client"

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ExamsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Component for pagination controls
 */
export const ExamsPagination: React.FC<ExamsPaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => (
            page === 1 || 
            page === totalPages || 
            (page >= currentPage - 1 && page <= currentPage + 1)
          ))
          .map((page, index, array) => {
            // Add ellipsis
            if (index > 0 && array[index - 1] !== page - 1) {
              return (
                <React.Fragment key={`ellipsis-${page}`}>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(page);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                </React.Fragment>
              );
            }
            
            return (
              <PaginationItem key={page}>
                <PaginationLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page);
                  }}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
        
        <PaginationItem>
          <PaginationNext 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
