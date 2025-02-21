import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveContainer = ({
  children,
  className
}: ResponsiveContainerProps) => {
  return (
    <div className={cn(
      "w-full px-4 mx-auto sm:px-6 md:px-8 max-w-7xl",
      className
    )}>
      {children}
    </div>
  );
};