"use client";

import { useAuth } from "@/features/core/auth/hooks";
import { Bell, ChevronRight, MessageSquare, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Import Zustand stores
import { useNavigationStore } from "../../../store/navigationStore";

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
 * 
 * Completely rebuilt to use Zustand for state management
 * 
 * @deprecated This component is deprecated and will be moved to AppTopbar.tsx
 */
export function AppTopbar({ 
  appName = "Pharmacy Hub",
  logoComponent,
  showRoleSwitcher = true
}: AppTopbarProps) {
  const pathname = usePathname();
  const { features } = useNavigationStore();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

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
    <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background shadow-sm gap-4 px-4 md:px-6">
      <SidebarTrigger className="text-muted-foreground" />
      
      {/* Breadcrumbs */}
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

      {/* Search */}
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex relative w-full max-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="w-full pl-9 bg-background/60"
          />
        </div>

        {/* Messages dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="h-5 w-5" />
              <Badge className="absolute top-1 right-1 h-2 w-2 p-0"></Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Messages</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              <DropdownMenuGroup>
                {[1, 2, 3].map((i) => (
                  <DropdownMenuItem key={i} className="p-3 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">User {i}</p>
                          <span className="text-xs text-muted-foreground">
                            {i === 1 ? 'Just now' : `${i} hrs ago`}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          This is a sample message notification to show how it would look...
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-center" asChild>
              <Link href="/messages" className="w-full">View all messages</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute top-1 right-1 h-2 w-2 p-0 bg-red-500"></Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              <DropdownMenuGroup>
                {/* For demo notifications */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <DropdownMenuItem key={i} className="p-3 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                        i % 3 === 0 ? 'bg-blue-100 text-blue-700' :
                        i % 3 === 1 ? 'bg-green-100 text-green-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {i % 3 === 0 ? <Bell className="h-4 w-4" /> :
                         i % 3 === 1 ? <MessageSquare className="h-4 w-4" /> :
                         <Bell className="h-4 w-4" />}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {i % 3 === 0 ? 'New Update Available' :
                             i % 3 === 1 ? 'New Message' :
                             'Reminder'}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {i === 1 ? 'Just now' : `${i} hrs ago`}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
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