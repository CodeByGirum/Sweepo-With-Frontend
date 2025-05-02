/**
 * Transition Provider Component
 * Purpose: Manages page transition settings globally
 * Used in: App layout, page transitions
 * Features:
 * - Global transition state management
 * - Transition type configuration
 * - Duration control
 * - Context-based state sharing
 */

'use client'

import { type ReactNode, createContext, useContext, useState } from "react"

type TransitionType = "fade" | "slide" | "scale" | "flip" | "rotate" | "perspective"

interface TransitionContextType {
  transitionType: TransitionType
  setTransitionType: (type: TransitionType) => void
  transitionDuration: number
  setTransitionDuration: (duration: number) => void
}

/**
 * Default transition context values
 */
const TransitionContext = createContext<TransitionContextType>({
  transitionType: "fade",
  setTransitionType: () => {},
  transitionDuration: 0.5,
  setTransitionDuration: () => {},
})

/**
 * Hook to access transition context
 * @returns Transition context values and setters
 */
export const useTransition = () => useContext(TransitionContext)

/**
 * Provider component for managing page transitions
 * @param children - Child components to receive transition context
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const [transitionType, setTransitionType] = useState<TransitionType>("fade")
  const [transitionDuration, setTransitionDuration] = useState(0.3)

  return (
    <TransitionContext.Provider
      value={{
        transitionType,
        setTransitionType,
        transitionDuration,
        setTransitionDuration,
      }}
    >
      {children}
    </TransitionContext.Provider>
  )
} 