import { cn } from "@/lib/utils";
import { useIsMobile } from "@/shared/lib/responsive";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface AdaptiveFormProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitText?: string;
  className?: string;
  loading?: boolean;
  error?: string;
  card?: boolean;
}

export function AdaptiveForm({
  children,
  onSubmit,
  submitText = "Submit",
  className,
  loading,
  error,
  card = true
}: AdaptiveFormProps) {
  const isMobile = useIsMobile();

  const formContent = (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className={cn(
        "space-y-4",
        isMobile && "space-y-6"
      )}>
        {children}
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button
        type="submit"
        className={cn(
          "w-full",
          isMobile && "h-12 text-base"
        )}
        disabled={loading}
      >
        {loading ? "Loading..." : submitText}
      </Button>
    </form>
  );

  if (card) {
    return (
      <Card className={cn(
        "p-6",
        isMobile && "p-4",
        className
      )}>
        {formContent}
      </Card>
    );
  }

  return (
    <div className={className}>
      {formContent}
    </div>
  );
}