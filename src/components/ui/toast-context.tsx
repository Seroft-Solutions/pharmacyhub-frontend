"use client"

import * as React from "react"
import { ToastActionElement, ToastProps } from "./toast"

type ToastContextType = {
  toasts: Toast[]
  addToast: (toast: Toast) => void
  removeToast: (id: string) => void
}

export type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive"
  duration?: number
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Toast) => {
    setToasts((prev) => [...prev, toast])
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  // Clean up toasts after they expire
  React.useEffect(() => {
    const interval = setInterval(() => {
      setToasts((toasts) => {
        return toasts.filter((toast) => {
          if (toast.duration === undefined || toast.duration === Infinity) {
            return true
          }
          return false
        })
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  
  return {
    toasts: context.toasts,
    toast: (props: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9)
      context.addToast({ id, ...props })
    },
    dismiss: (id: string) => {
      context.removeToast(id)
    }
  }
}
