"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ContentAreaProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * ContentArea component - Main content area for the application
 * 
 * This component renders the main content area where feature-specific content is displayed.
 * It applies proper styling for margins, padding, and background.
 * Designed to work with SidebarInset for proper layout.
 */
export function ContentArea({ children, className }: ContentAreaProps) {
  return (
    <main 
      data-sidebar="content-area"
      className={cn(
        "flex-1 overflow-auto p-4 md:p-6 relative w-full h-full",
        className
      )}
    >
      <div className="mx-auto max-w-7xl w-full h-full">
        {children}
      </div>
    </main>
  );
}
