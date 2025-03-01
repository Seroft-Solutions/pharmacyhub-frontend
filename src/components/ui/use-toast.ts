"use client"

import { Toast, useToast as useToastContext } from "./toast-context"

export type ToastProps = {
  title?: string
  description?: string
  action?: React.ReactNode
  duration?: number
  variant?: "default" | "destructive"
}

export function useToast() {
  const { toast, dismiss } = useToastContext()

  return {
    toast: (props: ToastProps) => {
      const { title, description, action, variant = "default", duration = 5000 } = props
      toast({ title, description, action, variant, duration })
    },
    dismiss
  }
}

export type { Toast }
