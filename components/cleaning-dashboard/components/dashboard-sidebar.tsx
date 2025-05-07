/**
 * Purpose: Sidebar for the cleaning dashboard
 * Features: Collapsible sidebar with datasets, issues, and legend
 * Used in: Main dashboard component
 */

"use client"

import { Search, ChevronLeft, ChevronRight, ChevronsUpDown, FileText } from "lucide-react"
import { motion } from "framer-motion"
import type { IssueCount } from "../types"

interface DashboardSidebarProps {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  issueCount: IssueCount
  filename?: string
}

function ToggleButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#1a1a1a] border-r border-t border-b border-[#2a2a2a] p-1 rounded-r-md z-10 transition-all hover:bg-[#2a2a2a]"
      onClick={onClick}
    >
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </motion.button>
  )
}

export function DashboardSidebar({ sidebarCollapsed, setSidebarCollapsed, issueCount, filename = "dataset.csv" }: DashboardSidebarProps) {
  return (
    <motion.div
      initial={{ width: sidebarCollapsed ? 0 : 224 }}
      animate={{ width: sidebarCollapsed ? 0 : 224 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`${sidebarCollapsed ? "w-0 overflow-hidden" : "w-56"} border-r border-[#2a2a2a] flex flex-col transition-all duration-300 ease-in-out fade-in`}
    >
      {/* Sidebar Header with Collapse Button */}
      <div className="p-3 border-b border-[#2a2a2a] flex justify-between items-center">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
          />
          <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-gray-400" />
        </div>
        <button
          className="ml-2 text-gray-400 hover:text-white transition-colors"
          onClick={() => setSidebarCollapsed(true)}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Datasets */}
      <div className="p-3 border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium flex items-center">
            Datasets <span className="text-gray-500 ml-1">(3)</span>
          </h3>
          <button className="text-gray-400 hover:text-white transition-colors">
            <ChevronsUpDown className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs bg-[#2a2a2a] rounded-md px-2 py-1.5 transition-colors hover:bg-[#3a3a3a]">
            <FileText className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-white truncate">{filename}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 hover:bg-[#1a1a1a] rounded-md px-2 py-1.5 transition-colors">
            <FileText className="h-3.5 w-3.5" />
            <span>50x50_table.csv</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 hover:bg-[#1a1a1a] rounded-md px-2 py-1.5 transition-colors">
            <FileText className="h-3.5 w-3.5" />
            <span>bad_data.csv</span>
          </div>
        </div>
      </div>

      {/* Issues */}
      <div className="p-3 border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium flex items-center">
            Issues <span className="text-gray-500 ml-1">({Object.values(issueCount).reduce((a, b) => a + b, 0)})</span>
          </h3>
          <button className="text-gray-400 hover:text-white transition-colors">
            <ChevronsUpDown className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400 hover:bg-[#1a1a1a] rounded-md px-2 py-1.5 transition-colors">
            <span>Column Issues</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400 hover:bg-[#1a1a1a] rounded-md px-2 py-1.5 transition-colors">
            <span>Row Issues</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-3 mt-auto border-t border-[#2a2a2a]">
        <h3 className="text-xs font-medium mb-2">Legend</h3>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-sm bg-blue-500/20"></div>
            <span className="text-blue-300">Null Value</span>
            <span className="ml-auto text-gray-500">{issueCount.null_value}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-sm bg-purple-500/20"></div>
            <span className="text-purple-300">Invalid Format</span>
            <span className="ml-auto text-gray-500">{issueCount.invalid_format}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-sm bg-orange-500/20"></div>
            <span className="text-orange-300">Invalid Date</span>
            <span className="ml-auto text-gray-500">{issueCount.invalid_date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-sm bg-green-500/20"></div>
            <span className="text-green-300">Duplicate Value</span>
            <span className="ml-auto text-gray-500">{issueCount.duplicate_value}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-sm bg-red-500/20"></div>
            <span className="text-red-300">Invalid Value</span>
            <span className="ml-auto text-gray-500">{issueCount.negative_rating}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Export the ToggleButton as a named export on the DashboardSidebar object
DashboardSidebar.ToggleButton = ToggleButton 