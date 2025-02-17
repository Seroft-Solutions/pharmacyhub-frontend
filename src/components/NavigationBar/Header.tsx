import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NavbarProps {
  className?: string;
}

const Header = ({ className }: NavbarProps) => {
  return (
      <header className={cn("border-b", className)}>
        <div className="container flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <img
                src="/Images/PharmacyHub.png"
                alt="Pharmacy Hub logo"
                className="h-10 w-10"
            />
            <span className="text-xl font-bold">Pharmacy Hub</span>
          </div>

          {/* Join Us Button - Visible on both mobile and desktop */}
          <Link href="/login" passHref>
            <Button
                variant="outline"
                className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white transform group-hover:scale-105 transition-all duration-300"
            >
              Join Us
            </Button>
          </Link>
        </div>
      </header>
  );
};

export default Header;