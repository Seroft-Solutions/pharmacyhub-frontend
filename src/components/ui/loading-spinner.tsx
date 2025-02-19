"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-3",
  lg: "h-12 w-12 border-4"
};

const variantClasses = {
  light: "border-white/20 border-t-white",
  dark: "border-gray-200 border-t-gray-600"
};

export function LoadingSpinner({
  size = "md",
  variant = "dark",
  className,
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export function LoadingOverlay({
  message = "Loading...",
  className,
  ...props
}: {
  message?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50",
        className
      )}
      {...props}
    >
      <LoadingSpinner size="lg" />
      {message && (
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );
}

// Example usage:
/*
// Basic spinner
<LoadingSpinner />

// Custom size and variant
<LoadingSpinner size="lg" variant="light" />

// Full overlay
<LoadingOverlay message="Please wait..." />
*/