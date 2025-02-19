"use client"

import * as React from "react"
import {
  BriefcaseMedical,
  HandCoins, Handshake, SquareTerminal,
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
Nav:[
    {
  title: "Pharmacist",
      url: "#",
    icon: BriefcaseMedical,
    isActive: true,
    items: [
  {
    title: "List",
    url: "/pharmacist",
  },
  {
    title: "Established Connection",
    url: "/pharmacistsConnections",
  },
],
},
  {
    title: "Salesman",
    url: "#",
    icon: HandCoins,
    isActive: true,
    items: [
      {
        title: "List",
        url: "/salesman",
      },
      {
        title: "Established Connection",
        url: "salesmanConnections",
      },
    ],
  },
  {
    title: "Proprietor",
    url: "",
    icon: Handshake,
    isActive: true,
    items: [
      {
        title: "List",
        url: "/proprietor",
      },
      {
        title: "Established Connection",
        url: "proprietorConnections",
      },
    ],
  },
  {
    title: "Manager",
    url: "/pharmacy-manager",
    icon: UserCog,
    isActive: true,
    items: [
      {
        title: "List",
        url: "/pharmacy-manager",
      },
      {
        title: "Established Connection",
        url: "pharmacyManagerConnections",
      },
    ],
  },],
  requests:
  [
    {
      name:"Connection Requests",
      url:"connectionRequests",
      icon:Handshake,
    }
  ]

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SideBarHeader/>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.Nav} />
          <NavTabs menu={data.requests} MainTitle={"Connection Requests"} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser/>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
  )
}
