"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar"; // Import useSidebar directly

interface SidebarCloseButtonProps {
  className?: string;
}

/**
 * SidebarCloseButton - Provides a way to close the sidebar on mobile
 * 
 * This component renders a back arrow button that allows users to close
 * the mobile sidebar and return to the main content.
 */
export function SidebarCloseButton({ 
  className
}: SidebarCloseButtonProps) {
  // Use the sidebar context directly
  const { setOpenMobile } = useSidebar();

  // Close the sidebar using the context method
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMobile(false);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "sidebar-close-button", // Custom CSS class for styling
        "md:hidden", // Only show on mobile
        className
      )}
      onClick={handleClose}
      aria-label="Close sidebar"
    >
      <ChevronLeft className="h-5 w-5" />
      <span className="sr-only">Back</span>
    </Button>
  );
}

export default SidebarCloseButton;