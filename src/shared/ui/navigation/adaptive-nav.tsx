import { useIsMobile } from "@/shared/lib/responsive";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface AdaptiveNavProps {
  items: NavItem[];
  className?: string;
  logo?: React.ReactNode;
}

export const AdaptiveNav = ({
  items,
  className,
  logo
}: AdaptiveNavProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <nav className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "h-16 px-4 border-b bg-background/95 backdrop-blur",
          className
        )}>
          <div className="flex items-center justify-between h-full">
            {logo}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
                <div className="flex flex-col gap-4 mt-8">
                  {items.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
        <div className="h-16" /> {/* Spacer for fixed nav */}
      </>
    );
  }

  return (
    <nav className={cn(
      "h-16 px-8 border-b bg-background",
      className
    )}>
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        {logo}
        <div className="flex items-center gap-8">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 text-sm font-medium hover:text-primary"
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};