"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { Pill, Search, Settings, HelpCircle, GraduationCap, FileText, Medal, BookOpen, FileQuestion, LayoutDashboard, Clock, BookMarked } from "lucide-react";
import { SidebarInput } from "@/components/ui/sidebar";
import Link from "next/link";
import { useIsMobile } from "@/features/ui/hooks";
import { SidebarMenu } from "./SidebarMenu";
import { useNavigation } from '../../navigation';

interface AppSidebarProps {
  className?: string;
  collapsible?: 'offcanvas' | 'icon' | 'none';
  variant?: 'sidebar' | 'floating' | 'inset';
  side?: 'left' | 'right';
  showFeatureGroups?: boolean;
}

/**
 * AppSidebar component - The main application sidebar
 * 
 * This component provides a fully featured sidebar for navigating the application,
 * with support for nested items, badges, permissions, and responsive design.
 * It uses the NavigationContext to get navigation items from all registered features.
 */
export function AppSidebar({
  className,
  collapsible = 'icon',
  variant = 'sidebar',
  side = 'left',
  showFeatureGroups = true
}: AppSidebarProps) {
  const isMobile = useIsMobile();
  const { features } = useNavigation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';





  // For desktop, render the full sidebar
  return (
    <Sidebar 
      className={cn("border-r", className)}
      collapsible={collapsible}
      variant={variant}
      side={side}
    >
      <SidebarHeader className="flex items-center p-4 border-b bg-sidebar">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center text-white">
            <Pill className="h-5 w-5" />
          </div>
          <span className="font-bold text-base">Pharmacy Hub</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="py-2">
        {/* Search functionality */}
        <div className="px-4 py-3 mb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <SidebarInput 
              placeholder="Search..." 
              className="h-9 pl-8 bg-background border shadow-sm hover:border-input focus-visible:ring-1"
            />
          </div>
        </div>
        
        {/* Dashboard navigation */}
        <div className="px-4 mb-2">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            Dashboard
          </h3>
        </div>
        <SidebarMenu items={[
          {
            id: "dashboard",
            label: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            permissions: [],
            roles: []
          }
        ]} />

        {/* Exams section */}
        <div className="mt-4 px-4 mb-2">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            Exam Preparation
          </h3>
        </div>
        
        <SidebarMenu items={[
          {
            id: "exams",
            label: "Exams",
            href: "/exam/dashboard",
            icon: GraduationCap,
            permissions: [],
            roles: [],
          },
          {
            id: "past-papers",
            label: "Past Papers",
            href: "/exam/past-papers",
            icon: FileText,
            permissions: [],
            roles: []
          },
          {
            id: "model-papers",
            label: "Model Papers",
            href: "/exam/model-papers",
            icon: Medal,
            permissions: [],
            roles: []
          },
          {
            id: "subject-papers",
            label: "Subject Papers",
            href: "/exam/subject-papers",
            icon: BookOpen,
            permissions: [],
            roles: []
          },
          {
            id: "practice-exams",
            label: "Practice Exams",
            href: "/exam/practice",
            icon: FileQuestion,
            permissions: [],
            roles: [],
            badge: "New",
            subItems: [
              {
                id: "timed-exams",
                label: "Timed Exams",
                href: "/exam/practice/timed",
                icon: Clock,
                permissions: [],
                roles: []
              },
              {
                id: "topic-exams",
                label: "Topic Based",
                href: "/exam/practice/topics",
                icon: BookMarked,
                permissions: [],
                roles: []
              }
            ]
          }
        ]} />
      </SidebarContent>
      
      <SidebarFooter className="p-4 text-xs text-muted-foreground border-t bg-sidebar/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">© {new Date().getFullYear()} Pharmacy Hub</span>
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-bold">v1.0.0</span>
        </div>
      </SidebarFooter>
      <SidebarRail className="bg-muted hover:bg-primary/10" />
    </Sidebar>
  );
}
