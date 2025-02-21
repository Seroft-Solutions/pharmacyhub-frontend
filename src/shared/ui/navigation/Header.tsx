import React from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { ModernMinimalistLogo } from "@/shared/ui/logo";

interface NavbarProps {
  className?: string;
}

const Header = ({className}: NavbarProps) => {
  return (
    <header className={cn("border-b border-gray-200 bg-white", className)}>
      <div className="container mx-auto px-4 flex h-14 md:h-16 items-center justify-between">
        {/* Neon Logo */}
        <div className="flex items-center">
          <ModernMinimalistLogo size="small" animate={true} />
        </div>

        {/* Join Us Button - Visible on both mobile and desktop */}
        <Link href="/login" passHref>
          <Button
            variant="outline"
            className="text-sm md:text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 hover:opacity-90 transition-all duration-300 py-1.5 md:py-2 px-3 md:px-4"
          >
            Join Us
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;