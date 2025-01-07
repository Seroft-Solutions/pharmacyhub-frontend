"use client"

import * as React from "react"
import {
  BriefcaseMedical,
  HandCoins, Handshake,
  UserCog,
} from "lucide-react"

import { NavMain } from "@/components/NavSideBar/nav-main"
import { NavUser } from "@/components/NavSideBar/nav-user"
import { SideBarHeader } from "@/components/NavSideBar/sidebar-header"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {NavTabs} from "@/components/NavSideBar/nav-tabs";

// This is sample data.
const data = {

  navMain: [
    {
      name: "Pharmacist",
      url: "/pharmacist",
      icon: BriefcaseMedical,
    },
    {
      name: "Salesman",
      url: "/salesman",
      icon: HandCoins,
    },
    {
      name: "Proprietor",
      url: "/proprietor",
      icon: Handshake,
    },
    {
      name: "Manager",
      url: "/pharmacy-manager",
      icon: UserCog,
    },
  ],
  connections: [
    {
      name: "Pharmacist",
      url: "/pharmacist",
      icon: BriefcaseMedical,
    },
    {
      name: "Salesman",
      url: "#",
      icon: HandCoins,
    },
    {
      name: "Proprietor",
      url: "#",
      icon: Handshake,
    },
    {
      name: "Manager",
      url: "#",
      icon: UserCog,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SideBarHeader/>
        </SidebarHeader>
        <SidebarContent>
          <NavTabs menu={data.navMain} MainTitle={"Menu"} />
          <NavTabs menu={data.connections} MainTitle={"Established Connection"} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser/>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
  )
}
