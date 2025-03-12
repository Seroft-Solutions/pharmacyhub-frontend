"use client";

import React, { useMemo } from 'react';
import Link from "next/link";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { 
  FileText, 
  Medal, 
  BookOpen, 
  GraduationCap 
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { usePermissions } from "@/features/rbac/hooks";

// Define exam menu items with icons and permissions
const examMenuItems = [
  {
    label: "Exams Preparation",
    href: "/exam/dashboard",
    icon: GraduationCap,
    type: 'main',
    roles: ['USER', 'STUDENT'],
    subItems: [
      {
        label: "Past Papers",
        href: "/exam/past-papers",
        icon: FileText,
        type: 'submenu',
        permissions: ['view_past_papers']
      },
      {
        label: "Model Papers",
        href: "/exam/model-papers",
        icon: Medal,
        type: 'submenu', 
        permissions: ['view_model_papers']
      },
      {
        label: "Subject Papers",
        href: "/exam/subject-papers",
        icon: BookOpen,
        type: 'submenu',
        permissions: ['view_subject_papers']
      }
    ]
  }
];

export function ExamsSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { hasAccess } = usePermissions();
  const [openMainItem, setOpenMainItem] = React.useState<number | null>(null);

  // Memoize menu items with access filtering
  const filteredMenuItems = useMemo(() => {
    return examMenuItems.filter(item => 
      hasAccess({
        permissions: item.permissions,
        roles: item.roles,
        requireAll: false
      })
    );
  }, [hasAccess]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Exams</SidebarGroupLabel>
          <SidebarMenu>
            {filteredMenuItems.map((item, index) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  onClick={() => {
                    // If it's a main item with subitems, toggle expand/collapse
                    if (item.subItems && item.subItems.length > 0) {
                      setOpenMainItem(
                        openMainItem === index ? null : index
                      );
                    }
                    
                    // If it's a main item without subitems, navigate to its dashboard
                    if (item.type === 'main') {
                      router.push(item.href);
                    }
                  }}
                  className={pathname === item.href ? 'bg-blue-50 text-blue-600' : ''}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </SidebarMenuButton>

                {/* Render sub-items if open */}
                {item.subItems && openMainItem === index && (
                  <SidebarMenu>
                    {item.subItems.map((subItem) => (
                      <SidebarMenuItem key={subItem.href}>
                        <SidebarMenuButton
                          onClick={() => router.push(subItem.href)}
                          className={pathname === subItem.href ? 'bg-blue-50 text-blue-600' : ''}
                        >
                          <subItem.icon className="mr-2 h-4 w-4" />
                          {subItem.label}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarTrigger />
    </Sidebar>
  );
}