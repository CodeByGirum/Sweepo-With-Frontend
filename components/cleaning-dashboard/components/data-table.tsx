/**
 * Purpose: Display and interact with tabular data
 * Features: Sortable columns, pagination, row selection, highlighting issues
 * Used in: Main dashboard component
 */

"use client"

import Link from "next/link"
import { ArrowLeft, ChevronsUpDown, Download, Filter, MessageSquare, PanelLeft, Settings } from "lucide-react"
import type { DataRow } from "../types"

interface DataTableProps {
  data: DataRow[]
  selectedRows: number[]
  setSelectedRows: (rows: number[]) => void
  entriesPerPage: number
  setEntriesPerPage: (entries: number) => void
  showChat: boolean
  setShowChat: (show: boolean) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  projectId: string
  filename: string
}

export function DataTable({
  data,
  selectedRows,
  setSelectedRows,
  entriesPerPage,
  setEntriesPerPage,
  showChat,
  setShowChat,
  sidebarCollapsed,
  setSidebarCollapsed,
  projectId,
  filename
}: DataTableProps) {
  // Get cell class based on issue type
  const getCellClass = (value: any, issueType: string | null) => {
    if (value === null || value === undefined) return "bg-blue-500/20 text-blue-300"
    if (issueType === "invalid_format") return "bg-purple-500/20 text-purple-300"
    if (issueType === "invalid_date") return "bg-orange-500/20 text-orange-300"
    if (issueType === "duplicate_value") return "bg-green-500/20 text-green-300"
    if (issueType === "negative_rating") return "bg-red-500/20 text-red-300"
    return ""
  }

  // Get row class based on issues
  const getRowClass = (row: DataRow) => {
    if (row.issues.length > 0) {
      return "hover:bg-[#1a1a1a]"
    }
    return "hover:bg-[#1a1a1a]"
  }

  return (
    <div className="flex-1 flex flex-col slide-in-bottom">
      {/* Table Header */}
      <div className="flex justify-between items-center p-3 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <Link
            href={`/projects/${projectId}`}
            className="text-gray-400 hover:text-white flex items-center gap-1 text-xs transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Project
          </Link>
          <span className="text-gray-600">|</span>
          <h2 className="text-sm font-medium">Data Cleaning Workstation</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>Show:</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <button
            className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors"
            onClick={() => setShowChat(!showChat)}
          >
            <MessageSquare className="h-3.5 w-3.5 text-gray-400" />
          </button>
          <button
            className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <PanelLeft className="h-3.5 w-3.5 text-gray-400" />
          </button>
          <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors">
            <Filter className="h-3.5 w-3.5 text-gray-400" />
          </button>
          <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors">
            <Settings className="h-3.5 w-3.5 text-gray-400" />
          </button>
          <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors">
            <Download className="h-3.5 w-3.5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#1a1a1a]">
              <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a] w-10">
                <input
                  type="checkbox"
                  className="rounded bg-[#2a2a2a] border-none focus:ring-0 transition-colors"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(data.map((row) => row.id))
                    } else {
                      setSelectedRows([])
                    }
                  }}
                />
              </th>
              <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                <div className="flex items-center gap-1">
                  ID
                  <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                </div>
              </th>
              <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                <div className="flex items-center gap-1">
                  Name
                  <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                </div>
              </th>
              <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                <div className="flex items-center gap-1">
                  Age
                  <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                </div>
              </th>
              <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                <div className="flex items-center gap-1">
                  Salary
                  <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                </div>
              </th>
              <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                <div className="flex items-center gap-1">
                  Email
                  <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                </div>
              </th>
              <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                <div className="flex items-center gap-1">
                  Join Date
                  <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                </div>
              </th>
              <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                <div className="flex items-center gap-1">
                  Category
                  <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                </div>
              </th>
              <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                <div className="flex items-center gap-1">
                  Score
                  <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                </div>
              </th>
              <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                <div className="flex items-center gap-1">
                  Rating
                  <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, entriesPerPage).map((row, index) => (
              <tr
                key={row.id}
                className={`border-b border-[#2a2a2a] ${getRowClass(row)} ${row.id % 2 === 0 ? "bg-[#1a1a1a]" : ""} transition-colors`}
                style={{ animationDelay: `${0.03 * index}s` }}
              >
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    className="rounded bg-[#2a2a2a] border-none focus:ring-0 transition-colors"
                    checked={selectedRows.includes(row.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows([...selectedRows, row.id])
                      } else {
                        setSelectedRows(selectedRows.filter((id) => id !== row.id))
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-gray-300">{row.id}</td>
                <td className="px-4 py-2 text-gray-300">{row.name}</td>
                <td className={`px-4 py-2 ${getCellClass(row.age, row.age === null ? "null_value" : null)}`}>
                  {row.age === null ? "null" : row.age}
                </td>
                <td className={`px-4 py-2 ${getCellClass(row.salary, row.salary === null ? "null_value" : null)}`}>
                  {row.salary === null ? "null" : row.salary}
                </td>
                <td
                  className={`px-4 py-2 ${getCellClass(row.email, row.issues.includes("invalid_format") ? "invalid_format" : null)}`}
                >
                  {row.email}
                </td>
                <td
                  className={`px-4 py-2 ${getCellClass(row.joinDate, row.issues.includes("invalid_date") ? "invalid_date" : null)}`}
                >
                  {row.joinDate}
                </td>
                <td className={`px-4 py-2 ${getCellClass(row.category, row.category === null ? "null_value" : null)}`}>
                  {row.category === null ? "null" : row.category}
                </td>
                <td className="px-4 py-2 text-gray-300">{row.score}</td>
                <td className={`px-4 py-2 ${getCellClass(row.rating, row.rating < 0 ? "negative_rating" : null)}`}>
                  {row.rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-3 border-t border-[#2a2a2a] flex justify-between items-center">
        <div className="text-xs text-gray-400">
          Showing 1-{Math.min(entriesPerPage, data.length)} of {data.length} rows
        </div>
        <div className="flex items-center gap-1">
          <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md px-2 py-1 text-xs transition-colors">
            Previous
          </button>
          <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md px-2 py-1 text-xs transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  )
} 