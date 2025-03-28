"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/core/app-auth/hooks";
import { Settings, User, CreditCard, LogOut, HelpCircle, Moon, Sun, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAdmin = user?.roles?.includes('ADMIN') || user?.roles?.includes('SUPER_ADMIN');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt={user?.name || "User"} />
            <AvatarFallback className="bg-primary/90 text-primary-foreground">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user?.email || "Not signed in"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>

          {isAdmin && (
            <DropdownMenuItem onClick={() => router.push("/admin/dashboard")}>
              <UserCog className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}