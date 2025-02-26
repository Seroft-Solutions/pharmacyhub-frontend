"use client";

import { usePermissions } from "@/hooks/usePermissions";
import { useSession } from "@/hooks/useSession";
import { authService } from "@/shared/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  Key,
  Loader2
} from "lucide-react";
import { useState } from "react";

export function UserMenu() {
  const { session } = useSession();
  const { isAdmin, isManager } = usePermissions();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const user = session?.user;

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      
      // Logout using authService
      await authService.logout();
      
      // Clear local storage
      localStorage.clear();
      
      // Clear session cookies
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Redirect to login
      router.push('/login');
      
      // Force reload to clear any remaining state
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Still try to redirect even if logout fails
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span className="hidden md:inline-block">
              {user?.name || user?.email}
            </span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Role Badges */}
        <div className="px-2 py-1.5 text-xs">
          <div className="flex flex-wrap gap-1">
            {isAdmin && (
              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                Admin
              </span>
            )}
            {isManager && (
              <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                Manager
              </span>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />
        
        <Link href="/profile">
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        
        {isAdmin && (
          <Link href="/settings">
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
          </Link>
        )}

        {(isAdmin || isManager) && (
          <Link href="/permissions">
            <DropdownMenuItem className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              Permissions
            </DropdownMenuItem>
          </Link>
        )}

        <Link href="/change-password">
          <DropdownMenuItem className="cursor-pointer">
            <Key className="mr-2 h-4 w-4" />
            Change Password
          </DropdownMenuItem>
        </Link>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleSignOut}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          {isLoggingOut ? 'Signing out...' : 'Sign Out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}