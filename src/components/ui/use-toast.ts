import { useToast as useToastPrimitive } from "@/components/ui/toast";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  duration?: number;
  variant?: "default" | "destructive";
};

export function useToast() {
  const { toast } = useToastPrimitive();

  return {
    toast: (props: ToastProps) => {
      const { title, description, action, variant = "default", duration = 5000 } = props;
      
      return toast({
        title,
        description,
        action,
        variant,
        duration,
      });
    },
  };
}

export type { Toast } from "@/components/ui/toast";
