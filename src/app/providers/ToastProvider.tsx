"use client"

import { Toaster } from "@/components/ui/toaster"
import { ToastProvider as ToastContextProvider } from "@/components/ui/toast-context"
import { ReactNode } from "react"

interface ToastProviderProps {
  children: ReactNode
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <ToastContextProvider>
      {children}
      <Toaster />
    </ToastContextProvider>
  )
}
