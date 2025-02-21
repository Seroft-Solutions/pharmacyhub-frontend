import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/shared/lib/responsive";
import { forwardRef } from "react";

interface AdaptiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const AdaptiveInput = forwardRef<HTMLInputElement, AdaptiveInputProps>(
  ({ label, error, className, ...props }, ref) => {
    const isMobile = useIsMobile();

    return (
      <div className="space-y-2">
        {label && (
          <Label className={cn(
            "block text-sm font-medium",
            isMobile && "text-base"
          )}>
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          {...props}
          className={cn(
            error && "border-destructive",
            isMobile && "h-12 text-base",
            className
          )}
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);