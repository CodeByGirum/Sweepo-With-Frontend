/**
 * Stats Card Component
 * Purpose: Displays statistical information with icon
 * Used in: Dashboard, analytics pages
 * Features:
 * - Animated entry
 * - Hover effects
 * - Icon support
 * - Responsive design
 */

import type { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  delay?: number
}

/**
 * Stats card component for displaying metrics
 * @param title - Card title/description
 * @param value - Statistical value to display
 * @param icon - Icon component
 * @param delay - Animation delay in seconds
 */
export function StatsCard({ title, value, icon, delay = 0 }: StatsCardProps) {
  return (
    <div
      className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md p-4 transition-transform hover:translate-y-[-2px] hover:shadow-lg slide-in-bottom"
      style={{ animationDelay: `${0.1 + delay * 0.1}s` }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs text-gray-400">{title}</h3>
        {icon}
      </div>
      <p className="text-2xl font-medium text-white">{value}</p>
    </div>
  )
} 