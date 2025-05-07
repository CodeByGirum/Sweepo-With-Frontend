/**
 * Purpose: Display and handle cleaning action buttons
 * Features: Renders action buttons with animations, handles click events
 * Used in: Main dashboard component
 */

"use client"

import { Undo2, X } from "lucide-react"
import { motion } from "framer-motion"
import type { CleaningAction } from "../types"

interface CleaningActionsProps {
  onActionClick: (actionId: string, actionLabel: string) => void
}

export function CleaningActions({ onActionClick }: CleaningActionsProps) {
  // Clean data actions
  const cleaningActions: CleaningAction[] = [
    { id: "undo", label: "Undo All", icon: <Undo2 className="h-3.5 w-3.5" /> },
    { id: "null-category", label: "Remove Rows with Null Values in Category", icon: <X className="h-3.5 w-3.5" /> },
    { id: "invalid-email", label: "Remove Rows with Invalid Email Format", icon: <X className="h-3.5 w-3.5" /> },
    { id: "duplicate-email", label: "Remove Duplicate Email Entries", icon: <X className="h-3.5 w-3.5" /> },
    {
      id: "invalid-date-separator",
      label: "Remove Rows with Invalid Date Separator in Join Date",
      icon: <X className="h-3.5 w-3.5" />,
    },
    {
      id: "invalid-date-components",
      label: "Remove Rows with Invalid Date Components in Join Date",
      icon: <X className="h-3.5 w-3.5" />,
    },
    { id: "negative-ratings", label: "Remove Rows with Negative Ratings", icon: <X className="h-3.5 w-3.5" /> },
    { id: "null-age", label: "Remove Rows with Null Values in Age", icon: <X className="h-3.5 w-3.5" /> },
    { id: "null-salary", label: "Remove Rows with Null Values in Salary", icon: <X className="h-3.5 w-3.5" /> },
  ]

  return (
    <div className="border-b border-[#2a2a2a] p-2 flex items-center gap-1 overflow-x-auto slide-in-bottom">
      {cleaningActions.map((action, index) => (
        <motion.button
          key={action.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs whitespace-nowrap flex items-center gap-1 transition-colors"
          onClick={() => onActionClick(action.id, action.label)}
        >
          {action.icon}
          <span>{action.label}</span>
        </motion.button>
      ))}
    </div>
  )
} 