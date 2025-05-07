/**
 * Purpose: Toast component types
 * Used in: Application-wide notifications
 * Notes: Provides type definitions for toast components
 */

import { ReactNode } from "react"

export interface ToastProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: "default" | "destructive"
}

export type ToastActionElement = React.ReactElement 