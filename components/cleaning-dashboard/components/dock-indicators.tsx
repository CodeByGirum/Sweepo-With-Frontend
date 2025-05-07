/**
 * Purpose: Display visual indicators for docking positions
 * Features: Overlay indicators for available dock positions
 * Used in: Main dashboard component
 */

"use client"

import type { DockPosition } from "../types"
import { motion, AnimatePresence } from "framer-motion"

interface DockIndicatorsProps {
  position: DockPosition | null
}

export function DockIndicators({ position }: DockIndicatorsProps) {
  if (!position) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-50">
        {position === "left" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 top-0 bottom-0 w-[100px] bg-blue-500/10 border-r-2 border-blue-500"
          />
        )}
        {position === "right" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 top-0 bottom-0 w-[100px] bg-blue-500/10 border-l-2 border-blue-500"
          />
        )}
        {position === "bottom" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 right-0 bottom-0 h-[100px] bg-blue-500/10 border-t-2 border-blue-500"
          />
        )}
      </div>
    </AnimatePresence>
  )
} 