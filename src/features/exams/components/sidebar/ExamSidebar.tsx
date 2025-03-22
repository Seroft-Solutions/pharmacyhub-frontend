"use client";

import React from 'react';
import { 
  FileText, 
  Medal, 
  BookOpen, 
  GraduationCap,
  FileQuestion,
  FileCog,
  BookMarked 
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ExamSidebarMenu } from "./ExamSidebarMenu";
import { ExamMenuItemType, ExamSidebarProps } from "./types";
import { useIsMobile } from "@/features/ui/hooks";

// Default exam menu items with icons, permissions, and colors
const defaultExamMenuItems: ExamMenuItemType[] = [
  {
    id: "exam-dashboard",
    label: "Dashboard",
    href: "/exam/dashboard",
    icon: GraduationCap,
    type: 'main',
    roles: ['USER', 'STUDENT'],
    color: "blue"
  },
  {
    id: "past-papers",
    label: "Past Papers",
    href: "/exam/past-papers",
    icon: FileText,
    type: 'main',
    permissions: ['view_past_papers'],
    color: "blue"
  },
  {
    id: "model-papers",
    label: "Model Papers",
    href: "/exam/model-papers",
    icon: Medal,
    type: 'main', 
    permissions: ['view_model_papers'],
    color: "amber"
  },
  {
    id: "subject-papers",
    label: "Subject Papers",
    href: "/exam/subject-papers",
    icon: BookOpen,
    type: 'main',
    permissions: ['view_subject_papers'],
    color: "green"
  }
];

/**
 * ExamSidebar component - A comprehensive sidebar for exam navigation
 * 
 * This component provides a fully featured sidebar for navigating exam content,
 * with support for nested items, badges, permissions, and responsive design.
 */
export function ExamSidebar({
  className,
  items = defaultExamMenuItems,
  collapsible = 'icon',
  variant = 'sidebar',
  side = 'left'
}: ExamSidebarProps) {
  const isMobile = useIsMobile();

  const sidebarContent = (
    <>
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="font-semibold text-base">Pharmacist Exams</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Exam Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <ExamSidebarMenu items={items} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 text-xs text-gray-500">
        Access exam materials based on your subscription level
      </SidebarFooter>
    </>
  );

  // For mobile, render the sidebar in a sheet
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side={side} className="p-0 w-72">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  // For desktop, render the full sidebar
  return (
    <SidebarProvider>
      <Sidebar 
        className={cn("border-r", className)}
        collapsible={collapsible}
        variant={variant}
        side={side}
      >
        {sidebarContent}
      </Sidebar>
    </SidebarProvider>
  );
}
