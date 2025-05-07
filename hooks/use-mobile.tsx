/**
 * Mobile Detection Hook
 * Purpose: Detects and tracks mobile device viewport state
 * Used in: Responsive components and layouts
 * Features:
 * - Viewport width detection
 * - Media query listener
 * - Automatic state updates
 * - Cleanup on unmount
 */

import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Custom hook for detecting mobile viewport state
 * @returns Boolean indicating if current viewport is mobile-sized
 * @description
 * - Uses window.matchMedia to detect viewport width
 * - Updates state when viewport changes
 * - Returns true if viewport width is less than MOBILE_BREAKPOINT
 * - Handles cleanup of event listeners
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
