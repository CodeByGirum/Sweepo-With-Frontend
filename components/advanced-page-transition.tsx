/**
 * Advanced Page Transition Component
 * Purpose: Provides animated transitions between pages
 * Used in: Page layouts, route transitions
 * Features:
 * - Multiple transition types
 * - Customizable duration
 * - Server-side rendering support
 * - Smooth animations
 */

"use client"

import { type ReactNode, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

type TransitionType = "fade" | "slide" | "scale" | "flip" | "rotate" | "perspective"

interface AdvancedPageTransitionProps {
  children: ReactNode
  type?: TransitionType
  duration?: number
  delay?: number
}

export function AdvancedPageTransition({
  children,
  type = "fade",
  duration = 0.3,
  delay = 0,
}: AdvancedPageTransitionProps) {
  const pathname = usePathname()
  const [renderKey, setRenderKey] = useState(pathname)

  useEffect(() => {
    setRenderKey(pathname)
  }, [pathname])

  // Define variants for different transition types
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { x: 20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -20, opacity: 0 },
    },
    scale: {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.95, opacity: 0 },
    },
    flip: {
      initial: { rotateY: 10, opacity: 0 },
      animate: { rotateY: 0, opacity: 1 },
      exit: { rotateY: -10, opacity: 0 },
    },
    rotate: {
      initial: { rotate: 2, opacity: 0 },
      animate: { rotate: 0, opacity: 1 },
      exit: { rotate: -2, opacity: 0 },
    },
    perspective: {
      initial: { opacity: 0, y: 10, rotateX: 5 },
      animate: { opacity: 1, y: 0, rotateX: 0 },
      exit: { opacity: 0, y: -10, rotateX: -5 },
    },
  }

  // Get the selected variant
  const selectedVariant = variants[type]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={renderKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={selectedVariant}
        transition={{
          duration,
          delay,
          ease: "easeInOut",
        }}
        style={{ width: "100%", height: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
