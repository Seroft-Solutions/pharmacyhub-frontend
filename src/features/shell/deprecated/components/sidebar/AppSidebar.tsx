"use client";

import React from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  FileText, 
  Medal, 
  BookOpen, 
  LayoutDashboard,
  Pill
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider
} from "@/components/ui/sidebar";

// Import navigation data
import { useNavigationStore } from '../../../store/navigationStore';

interface AppSidebarProps {
  className?: string;
}

/**
 * @deprecated - AppSidebar - This version has been deprecated
 */
export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar className={cn("border-r", className)}>
        <SidebarHeader className="flex flex-col">
          <div className="flex items-center p-3 border-b">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="bg-primary h-7 w-7 rounded-md flex items-center justify-center text-primary-foreground">
                <Pill className="h-4 w-4" />
              </div>
              <span className="font-semibold text-sm">Pharmacy Hub</span>
            </Link>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="py-2 px-2">
          <SidebarMenu>
            {/* Dashboard */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push('/dashboard')}
                isActive={pathname === '/dashboard'}
                tooltip="Dashboard"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            {/* Past Papers */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push('/exam/past-papers')}
                isActive={pathname === '/exam/past-papers' || pathname?.startsWith('/exam/past-papers/')}
                tooltip="Past Papers"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Past Papers</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            {/* Model Papers */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push('/exam/model-papers')}
                isActive={pathname === '/exam/model-papers' || pathname?.startsWith('/exam/model-papers/')}
                tooltip="Model Papers"
              >
                <Medal className="mr-2 h-4 w-4" />
                <span>Model Papers</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            {/* Subject Papers */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push('/exam/subject-papers')}
                isActive={pathname === '/exam/subject-papers' || pathname?.startsWith('/exam/subject-papers/')}
                tooltip="Subject Papers"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Subject Papers</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter className="p-3 text-xs text-muted-foreground border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs">© {new Date().getFullYear()} Pharmacy Hub</span>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}

export default AppSidebar;