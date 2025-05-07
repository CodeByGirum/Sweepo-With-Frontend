import type React from "react"
/**
 * Purpose: Type definitions for the cleaning dashboard
 * Features: Centralized type definitions for all dashboard components
 * Used in: All dashboard components
 */

export type DockPosition = "right" | "left" | "bottom" | "none"

export type Message = {
  id: string
  content: string
  sender: "user" | "assistant" | "system"
  timestamp: Date
}

export type DataRow = {
  id: number
  name: string
  age: number | null
  salary: number | null
  email: string
  joinDate: string
  category: string | null
  score: number
  rating: number
  originalRowIndex: number
  issues: string[]
}

export type IssueCount = {
  null_value: number
  invalid_format: number
  invalid_date: number
  duplicate_value: number
  negative_rating: number
}

export type CleaningAction = {
  id: string
  label: string
  icon: React.ReactNode
} 