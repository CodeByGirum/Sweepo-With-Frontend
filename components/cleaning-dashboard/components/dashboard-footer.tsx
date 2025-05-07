/**
 * Purpose: Footer component for the cleaning dashboard
 * Features: Copyright information, links to terms/privacy
 * Used in: Main dashboard component
 */

"use client"

import Link from "next/link"

export function DashboardFooter() {
  return (
    <footer className="py-3 px-6 border-t border-[#2a2a2a] text-gray-500 text-xs fade-in">
      <div className="flex justify-between items-center">
        <div>
          <span>© 2023 Sweepo. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <span>Showing 1-20 of 20 items</span>
        </div>
      </div>
    </footer>
  )
} 