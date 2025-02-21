import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface InteractiveCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const InteractiveCard = ({
  children,
  onClick,
  className,
  disabled = false
}: InteractiveCardProps) => {
  return (
    <motion.div
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={cn(
        "p-4 rounded-lg shadow-sm bg-card",
        "touch-none",
        !disabled && "cursor-pointer active:bg-accent/50",
        disabled && "opacity-60 cursor-not-allowed",
        "transition-colors duration-200",
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </motion.div>
  );
};