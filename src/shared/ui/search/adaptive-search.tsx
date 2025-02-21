import { cn } from "@/lib/utils";
import { useIsMobile } from "@/shared/lib/responsive";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "@/shared/lib/hooks/use-debounced-callback";

interface AdaptiveSearchProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
  debounceMs?: number;
}

export function AdaptiveSearch({
  onSearch,
  placeholder = "Search...",
  className,
  initialValue = "",
  debounceMs = 300
}: AdaptiveSearchProps) {
  const isMobile = useIsMobile();
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const debouncedSearch = useDebouncedCallback((searchValue: string) => {
    onSearch(searchValue);
  }, debounceMs);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <div className={cn(
      "relative flex items-center gap-2",
      isMobile && isFocused && "fixed inset-x-0 top-0 z-50 bg-background p-4",
      className
    )}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "pl-9 pr-8",
            isMobile && "h-12 text-base"
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}