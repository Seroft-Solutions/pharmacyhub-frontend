
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { MenuItem } from '@/types/menuItem';
import { menuItems } from '@/config/menuItems';

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  return (
      <header className={cn("border-b", className)}>
        {/* Logo Container */}
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
                src="/PharmacyHub.png"  // Replace with your actual logo
                alt="Logo"
                className="h-10 w-10"

            />
            <span className="text-xl font-bold">Pharmacy Hub</span>
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col space-y-4 mt-6">
                {menuItems.map((item) => (
                    <MobileNavItem key={item.title} item={item} />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Navigation Container */}
        <div className="border-t">
          <div className="container hidden lg:block">
            <nav className="flex items-center space-x-6">
              {menuItems.map((item) => (
                  <NavItem key={item.title} item={item} />
              ))}
            </nav>
          </div>
        </div>
      </header>
  );
};

interface NavItemProps {
  item: MenuItem;
}

const NavItem = ({ item }: NavItemProps) => {
  const Icon = item.icon;

  return (
      <Button
          variant="ghost"
          className="flex items-center space-x-2 h-12 px-4 hover:bg-accent"
          asChild
      >
        <a href={item.link}>
          <Icon className="h-4 w-4" />
          <span>{item.title}</span>
        </a>
      </Button>
  );
};

const MobileNavItem = ({ item }: NavItemProps) => {
  const Icon = item.icon;

  return (
      <Button
          variant="ghost"
          className="w-full justify-start"
          asChild
      >
        <a href={item.link}>
          <Icon className="mr-2 h-4 w-4" />
          {item.title}
        </a>
      </Button>
  );
};

export default Navbar;