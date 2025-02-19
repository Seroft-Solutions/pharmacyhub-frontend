// src/components/Layout/UserMenu.tsx
import React from 'react';
import {useRouter} from 'next/navigation';
import {useAuthContext} from "@/context/AuthContext";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {FaSignOutAlt, FaUser} from "react-icons/fa";

interface UserMenuProps {
  user: {
    name: string;
    email: string;
  } | null;
}

const UserMenu: React.FC<UserMenuProps> = ({user}) => {
  const router = useRouter();
  const {logout} = useAuthContext();

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt={user.name}/>
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick={() => router.push("/account-settings")}>
          <FaUser className="mr-2 h-4 w-4"/>
          <span>Account settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <FaSignOutAlt className="mr-2 h-4 w-4"/>
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;