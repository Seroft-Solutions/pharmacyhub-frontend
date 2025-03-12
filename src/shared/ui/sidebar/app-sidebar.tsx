"use client"

import * as React from "react"
import {GraduationCap} from "lucide-react"

import {NavMain} from "@/components/NavSideBar/nav-main"
import {NavUser} from "@/components/NavSideBar/nav-user"
import {SideBarHeader} from "@/components/NavSideBar/sidebar-header"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar"

// Universal access sidebar data
const data = {
  Nav: [
    {
      title: "Exams",
      url: "#",
      icon: GraduationCap,
      isActive: true,
      items: [
        {
          title: "Available Exams",
          url: "/exams",
        },
        {
          title: "My Results",
          url: "/exams/results",
        },
      ],
    },
  ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SideBarHeader/>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.Nav}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
      <SidebarRail/>
    </Sidebar>
  )
}
