import { cn } from "@/lib/utils";
import { useIsMobile } from "@/shared/lib/responsive";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomNavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavProps {
  items: BottomNavItem[];
  className?: string;
}

export const BottomNav = ({ items, className }: BottomNavProps) => {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  if (!isMobile) return null;

  return (
    <>
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "h-16 px-4 bg-background border-t",
        "safe-bottom",
        className
      )}>
        <div className="flex items-center justify-around h-full max-w-lg mx-auto">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center",
                  "w-16 h-16 gap-1",
                  "tap-highlight-transparent touch-manipulation",
                  "transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.icon}
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="h-16" /> {/* Spacer for fixed nav */}
    </>
  );
};