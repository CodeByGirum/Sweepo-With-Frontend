/**
 * Utility Functions
 * Purpose: Provides common utility functions for class name management
 * Used in: Component styling and class name composition
 * Features:
 * - Class name merging
 * - Conditional class application
 * - Tailwind CSS integration
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names and merges Tailwind CSS classes
 * @param inputs - Array of class names or class name objects
 * @returns Merged class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
