"use client";

import { Bell, ChevronRight, MessageSquare, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "./UserMenu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
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

interface Breadcrumb {
  label: string;
  href: string;
}

interface AppTopbarProps {
  appName?: string;
  logoComponent?: React.ReactNode;
}

export function AppTopbar({ 
  appName = "Pharmacy Hub",
  logoComponent 
}: AppTopbarProps) {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  // Generate breadcrumbs based on the current path
  useEffect(() => {
    const segments = pathname?.split('/').filter(Boolean) || [];
    const crumbs: Breadcrumb[] = [];
    
    segments.forEach((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join('/')}`;
      const label = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
      
      crumbs.push({ label, href });
    });
    
    setBreadcrumbs(crumbs);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b bg-background shadow-sm">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-muted-foreground" />
          {logoComponent}
          <div className="hidden md:flex">
            <Link 
              href="/" 
              className="font-semibold transition-colors hover:text-foreground/80"
            >
              {appName}
            </Link>
          </div>
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="hidden md:flex items-center ml-4 space-x-1">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />}
                <Link
                  href={crumb.href}
                  className={`text-sm ${
                    index === breadcrumbs.length - 1
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="hidden md:flex ml-auto mr-4 relative w-full max-w-[400px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="w-full pl-9 bg-background/60"
          />
        </div>

        <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
}
