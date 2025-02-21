import { cn } from "@/lib/utils";
import { useIsMobile } from "@/shared/lib/responsive";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { forwardRef } from "react";

interface SelectOption {
  label: string;
  value: string;
}

interface AdaptiveSelectProps {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const AdaptiveSelect = forwardRef<HTMLButtonElement, AdaptiveSelectProps>(
  ({ options, label, placeholder, error, className, value, onChange }, ref) => {
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
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger 
            ref={ref}
            className={cn(
              error && "border-destructive",
              isMobile && "h-12 text-base",
              className
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className={cn(
                  isMobile && "h-12 text-base"
                )}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);