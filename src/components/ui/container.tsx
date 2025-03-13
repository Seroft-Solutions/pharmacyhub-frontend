import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Container component for consistent page layout
 */
export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div 
      className={cn(
        "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
