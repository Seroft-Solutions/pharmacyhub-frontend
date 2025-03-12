"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarProvider,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/features/ui/hooks";
import { SidebarMenu } from "./SidebarMenu";
import { DEFAULT_SIDEBAR_ITEMS } from "./constants";
import { AppSidebarProps } from "./types";

/**
 * AppSidebar component - The main application sidebar
 * 
 * This component provides a fully featured sidebar for navigating the application,
 * with support for nested items, badges, permissions, and responsive design.
 */
export function AppSidebar({
  className,
  items = DEFAULT_SIDEBAR_ITEMS,
  collapsible = 'icon',
  variant = 'sidebar',
  side = 'left'
}: AppSidebarProps) {
  const isMobile = useIsMobile();

  const sidebarContent = (
    <>
      <SidebarHeader className="flex items-center p-4">