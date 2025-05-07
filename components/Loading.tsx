/**
 * Loading Component
 * 
 * Purpose: 
 * Provides a standardized loading animation across the application.
 * Ensures consistent user experience during data fetching and processing operations.
 * 
 * Used in:
 * - Page transitions
 * - Data fetching operations
 * - Form submissions
 * - Processing operations
 * 
 * Features:
 * - Clean, minimalist design
 * - Animated blocks-shuffle animation
 * - Customizable size
 * - Accessible (includes aria-label)
 * - Consistent with application theme
 */

'use client';

import React from 'react'

/**
 * Loading spinner component
 * Renders an animated SVG-based loading indicator with three animated blocks
 * The animation uses CSS keyframes to create a shuffling block pattern
 * 
 * @returns JSX.Element - The rendered loading component
 */
export default function Loading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-20 w-full">
      <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Loading content" role="status">
        <style>
          {`.spinner_9y7u{animation:spinner_fUkk 2.4s linear infinite;animation-delay:-2.4s}
          .spinner_DF2s{animation-delay:-1.6s}
          .spinner_q27e{animation-delay:-.8s}
          @keyframes spinner_fUkk{
            8.33%{x:13px;y:1px}
            25%{x:13px;y:1px}
            33.3%{x:13px;y:13px}
            50%{x:13px;y:13px}
            58.33%{x:1px;y:13px}
            75%{x:1px;y:13px}
            83.33%{x:1px;y:1px}
          }`}
        </style>
        <rect className="spinner_9y7u" x="1" y="1" rx="1" width="10" height="10" fill="#ffffff"/>
        <rect className="spinner_9y7u spinner_DF2s" x="1" y="1" rx="1" width="10" height="10" fill="#ffffff"/>
        <rect className="spinner_9y7u spinner_q27e" x="1" y="1" rx="1" width="10" height="10" fill="#ffffff"/>
      </svg>
    </div>
  )
} 