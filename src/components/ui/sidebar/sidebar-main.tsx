"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import { SidebarCollapsible, SidebarSide, SidebarVariant, SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON, SIDEBAR_WIDTH_MOBILE } from "./sidebar-constants"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/features/shell/components/sidebar/custom-sheet"
import { TooltipProvider } from "@/components/ui/tooltip"

export interface SidebarProps extends React.ComponentProps<"div"> {
  side?: SidebarSide
  variant?: SidebarVariant