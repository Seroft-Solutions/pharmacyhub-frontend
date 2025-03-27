"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, MessageSquare, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarTriggerMobile } from "./SidebarTriggerMobile";
import { 
  SidebarTrigger, 
  useSidebar 
} from "@/components/ui/sidebar";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Import Zustand stores
import { useNavigationStore } from "../../store/navigationStore";
import { useMobileStore, selectIsMobile } from '@/features/core/mobile-support';

// Import components
import { UserMenu } from "./UserMenu";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface AppTopbarProps {
  appName?: string;
  logoComponent?: React.ReactNode;
  showRoleSwitcher?: boolean;
}

/**
 * AppTopbar - Main application header component
 * 
 * Includes breadcrumbs, search, notifications, messages, and user menu
 * Properly integrates with the SidebarProvider context
 */
export function AppTopbar({ 
  appName = "Pharmacy Hub",
  logoComponent,
  showRoleSwitcher = true
}: AppTopbarProps) {
  const pathname = usePathname();
  const { features } = useNavigationStore();
  const { toggleSidebar } = useSidebar();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const isMobile = useMobileStore(selectIsMobile);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Generate breadcrumbs based on the current path and navigation items
  useEffect(() => {
    const segments = pathname?.split('/').filter(Boolean) || [];
    const crumbs: BreadcrumbItem[] = [];
    
    // Add home as the first crumb
    crumbs.push({ label: 'Dashboard', href: '/' });
    
    // Generate breadcrumbs from path segments
    let currentPath = '';
    for (let i = 0; i < segments.length; i++) {
      currentPath += `/${segments[i]}`;
      
      // Try to find matching navigation item for better labels
      let label = segments[i]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
      
      // Look for matching label in navigation
      // First flatten all items, including nested subItems
      const allItems = features.flatMap(feature => {
        // Get top-level items
        const topItems = feature.items || [];
        
        // Get sub-items (level 2)
        const subItems = topItems.flatMap(item => item.subItems || []);
        
        // Get sub-sub-items (level 3)
        const subSubItems = subItems.flatMap(item => item.subItems || []);
        
        // Combine all levels
        return [...topItems, ...subItems, ...subSubItems];
      });
      
      const matchingItem = allItems.find(item => item.href === currentPath);
      if (matchingItem) {
        label = matchingItem.label;
      }
      
      crumbs.push({ label, href: currentPath });
    }
    
    setBreadcrumbs(crumbs);
  }, [pathname, features]);

  return (
    <header className="sticky top-0 z-40 flex h-14 sm:h-16 items-center border-b bg-background shadow-sm gap-2 sm:gap-4 px-2 sm:px-4 md:px-6">
      {/* Use mobile trigger on mobile, desktop trigger on desktop */}
      {isMobile ? (
        <SidebarTriggerMobile className="text-muted-foreground" />
      ) : (
        <SidebarTrigger className="text-muted-foreground" onClick={toggleSidebar} />
      )}
      
      {/* Current Page Title (Mobile Only) */}
      {isMobile && (
        <div className="text-base font-medium truncate">
          {breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : 'Dashboard'}
        </div>
      )}
      
      {/* Breadcrumbs (Desktop Only) */}
      <Breadcrumb className="hidden md:flex items-center">
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              {index > 0 && <BreadcrumbSeparator />}
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                </BreadcrumbItem>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Search & Actions */}
      <div className="ml-auto flex items-center gap-1 sm:gap-2">

        {/* Notifications dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size={isMobile ? "sm" : "icon"} className="relative h-8 w-8 sm:h-9 sm:w-9">
              <Bell className="h-4 w-4" />
              <Badge className="absolute top-1 right-1 h-2 w-2 p-0 bg-red-500"></Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={isMobile ? "w-[280px]" : "w-80"}>
            <DropdownMenuLabel className={isMobile ? "text-sm py-1.5" : ""}>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className={`${isMobile ? 'max-h-[250px]' : 'max-h-[300px]'} overflow-y-auto`}>
              <DropdownMenuGroup>
                {/* For demo notifications */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <DropdownMenuItem key={i} className={`${isMobile ? 'p-2' : 'p-3'} cursor-pointer`}>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className={`${isMobile ? 'h-7 w-7' : 'h-9 w-9'} rounded-full flex items-center justify-center ${
                        i % 3 === 0 ? 'bg-blue-100 text-blue-700' :
                        i % 3 === 1 ? 'bg-green-100 text-green-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {i % 3 === 0 ? <Bell className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} /> :
                         i % 3 === 1 ? <MessageSquare className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} /> :
                         <Bell className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                            {i % 3 === 0 ? 'New Update Available' :
                             i % 3 === 1 ? 'New Message' :
                             'Reminder'}
                          </p>
                          <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
                            {i === 1 ? 'Just now' : `${i} hrs ago`}
                          </span>
                        </div>
                        <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
                          {i % 3 === 0 ? 'A new version of the platform is available with new features' :
                           i % 3 === 1 ? 'You have received a new message from administration' :
                           'Your scheduled exam is coming up in 3 days'}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-center" asChild>
              <Link href="/notifications" className="w-full">View all notifications</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <UserMenu />
      </div>
    </header>
  );
}