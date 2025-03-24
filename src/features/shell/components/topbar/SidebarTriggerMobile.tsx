"use client";

import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useMobileStore, selectIsMobile } from '@/features/core/mobile-support';

interface SidebarTriggerMobileProps {
  className?: string;
}

/**
 * SidebarTriggerMobile - Custom sidebar trigger for mobile devices
 * 
 * This component specifically handles the mobile sidebar toggling, ensuring
 * that the sidebar opens correctly on mobile devices when the trigger is clicked.
 */
export function SidebarTriggerMobile({ className }: SidebarTriggerMobileProps) {
  const { setOpenMobile } = useSidebar();
  const isMobile = useMobileStore(selectIsMobile);

  const handleClick = () => {
    // Only handle mobile behavior
    if (isMobile) {
      // Explicitly set openMobile to true to show the sidebar
      setOpenMobile(true);
    }
  };

  return (
    <Button
      data-sidebar="mobile-trigger"
      variant="ghost"
      size="icon"
      className={cn("h-9 w-9 md:h-10 md:w-10", className)}
      onClick={handleClick}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Open Mobile Menu</span>
    </Button>
  );
}

export default SidebarTriggerMobile;