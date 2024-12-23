import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { menuItems } from '@/config/menuItems';
import MobileNavItem from "@/components/layout/MobileNavItem";
import NavItem from "@/components/layout/NavItem";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  return (
      <header className={cn("border-b", className)}>

        <div className="container flex h-16 items-center justify-between">

          <div className="flex items-center space-x-2">
            <img
                src="/api/placeholder/40/40"
                alt="Pharmacy Hub logo"
                className="h-10 w-10"
            />
            <span className="text-xl font-bold">Pharmacy Hub</span>
          </div>


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

export default Navbar;
