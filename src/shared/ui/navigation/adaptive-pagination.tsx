import { cn } from "@/lib/utils";
import { useIsMobile } from "@/shared/lib/responsive";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGestures } from "@/shared/lib/hooks/use-gestures";

interface AdaptivePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function AdaptivePagination({
  currentPage,
  totalPages,
  onPageChange,
  className
}: AdaptivePaginationProps) {
  const isMobile = useIsMobile();

  useGestures({
    onSwipeLeft: () => {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    },
    onSwipeRight: () => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    }
  });

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = isMobile ? 3 : 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 1) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        if (currentPage > 3) pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        if (currentPage < totalPages - 2) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={cn(
      "flex items-center justify-center gap-2",
      className
    )}>
      <Button
        variant="outline"
        size={isMobile ? "icon" : "default"}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        {!isMobile && <span className="ml-2">Previous</span>}
      </Button>

      {!isMobile && (
        <div className="flex items-center gap-1">
          {renderPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <Button
                key={index}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page)}
                className="w-8 h-8"
              >
                {page}
              </Button>
            ) : (
              <span key={index} className="px-1">...</span>
            )
          ))}
        </div>
      )}

      {isMobile && (
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
      )}

      <Button
        variant="outline"
        size={isMobile ? "icon" : "default"}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {!isMobile && <span className="mr-2">Next</span>}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}