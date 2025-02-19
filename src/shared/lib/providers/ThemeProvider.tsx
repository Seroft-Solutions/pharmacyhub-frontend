'use client'

import * as React from 'react'
import { ThemeProvider as NextThemeProvider } from 'next-themes'

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ 
  children,
  attribute = 'class',
  defaultTheme = 'light',
  disableTransitionOnChange = false
}: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      disableTransitionOnChange={disableTransitionOnChange}
    >
      {children}
    </NextThemeProvider>
  )
}