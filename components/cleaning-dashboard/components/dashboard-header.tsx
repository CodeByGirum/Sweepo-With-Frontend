/**
 * Purpose: Header component for the cleaning dashboard
 * Features: Logo, navigation links, user settings
 * Used in: Main dashboard component
 */

"use client"

import Link from "next/link"
import { BellIcon, GlobeIcon, HelpCircleIcon, MessagesSquareIcon, User2Icon } from "lucide-react"

interface DashboardHeaderProps {
  sidebarCollapsed: boolean
}

export function DashboardHeader({ sidebarCollapsed }: DashboardHeaderProps) {
  return (
    <header className="py-4 px-6 border-b border-[#2a2a2a] flex justify-between items-center transition-all fade-in">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-medium text-lg">Sweepo</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/projects" className="text-gray-400 hover:text-white text-xs transition-colors">
            Projects
          </Link>
          <Link href="/datasets" className="text-gray-400 hover:text-white text-xs transition-colors">
            Datasets
          </Link>
          <Link href="/cleandata" className="text-white text-xs transition-colors border-b border-white pb-1">
            Clean Data
          </Link>
          <Link href="/analytics" className="text-gray-400 hover:text-white text-xs transition-colors">
            Analytics
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white transition-colors">
          <GlobeIcon className="w-4 h-4" />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <BellIcon className="w-4 h-4" />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <MessagesSquareIcon className="w-4 h-4" />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <HelpCircleIcon className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2 hover:bg-[#2a2a2a] rounded-full p-1 transition-colors">
          <div className="bg-[#2a2a2a] rounded-full h-6 w-6 flex items-center justify-center">
            <User2Icon className="w-3 h-3" />
          </div>
        </button>
      </div>
    </header>
  )
} 