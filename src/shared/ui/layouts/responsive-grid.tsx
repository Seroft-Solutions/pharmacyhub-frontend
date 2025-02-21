import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
}

export const ResponsiveGrid = ({
  children,
  className,
  cols = {
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4
  },
  gap = "4"
}: ResponsiveGridProps) => {
  const getGridCols = () => {
    return {
      'grid-cols-1': true,
      [`sm:grid-cols-${cols.sm}`]: cols.sm,
      [`md:grid-cols-${cols.md}`]: cols.md,
      [`lg:grid-cols-${cols.lg}`]: cols.lg,
      [`xl:grid-cols-${cols.xl}`]: cols.xl,
    };
  };

  return (
    <div className={cn(
      "grid",
      `gap-${gap}`,
      getGridCols(),
      className
    )}>
      {children}
    </div>
  );
};