import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { menuItems } from "@/config/menuItems";
import MobileNavItem from "@/components/NavigationBar/MobileNavItem";
import NavItem from "@/components/NavigationBar/NavItem";
import Link from "next/link";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {

  return (
      <header className={cn("border-b", className)}>
        <div className="container flex h-16 items-center justify-between">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col space-y-4 mt-6">
                {menuItems.map((item) => (
                    <MobileNavItem key={item.title} item={item} />
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <img
                src="/Images/PharmacyHub.png"
                alt="Pharmacy Hub logo"
                className="h-10 w-10"
            />
            <span className="text-xl font-bold">Pharmacy Hub</span>
          </div>

          {/* Feature Button */}
          <div className="hidden lg:flex">
            <Link href="/login" passHref>
              <Button
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white transform group-hover:scale-105 transition-all duration-300"
              >
                Join Us
              </Button>
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
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
