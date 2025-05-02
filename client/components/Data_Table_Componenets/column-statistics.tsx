"use client"

import { useEffect } from "react"

import type React from "react"

import {
  BarChart2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Eye,
  EyeOff,
  Filter,
  Keyboard,
  MoreHorizontal,
  Search,
  Settings,
  Table,
  X,
} from "lucide-react"
import { useCallback, useMemo, useRef, useState } from "react"

// Import the shared Loading component
import Loading from '@/components/Loading';

// Generate more sample data for demonstration
const generateMoreData = (count: number) => {
  const baseData = {
    type: "type-a",
    nulls: 0,
    distribution: [10, 25, 45, 32, 18, 7, 3],
  }

  const newData = []
  for (let i = 0; i < count; i++) {
    newData.push({
      ...baseData,
      name: `item_${i + 8}`,
      unique: Math.floor(Math.random() * 5000),
      min: String(Math.floor(Math.random() * 1000)),
      max: String(Math.floor(Math.random() * 10000) + 1000),
      mean: String(Math.floor(Math.random() * 5000) + 500),
      quality_score: Math.random() * 0.5 + 0.5,
      distribution: [
        Math.random() * 30,
        Math.random() * 30,
        Math.random() * 30,
        Math.random() * 30,
        Math.random() * 30,
      ],
    })
  }
  return newData
}

// Sample data
const sampleData = [
  {
    name: "item_1",
    type: "type-a",
    nulls: 0,
    unique: 3254,
    min: "100",
    max: "1000",
    mean: "500",
    distribution: [10, 25, 45, 32, 18, 7, 3],
    quality_score: 0.98,
  },
  {
    name: "item_2",
    type: "type-a",
    nulls: 0,
    unique: 1,
    min: "0",
    max: "0",
    mean: "0",
    distribution: [100],
    quality_score: 0.75,
  },
  {
    name: "item_3",
    type: "type-b",
    nulls: 0,
    unique: 1,
    values: ["value-1"],
    distribution: [100],
    quality_score: 0.82,
  },
  {
    name: "item_4",
    type: "type-b",
    nulls: 0,
    unique: 1,
    values: ["value-2"],
    distribution: [100],
    quality_score: 0.85,
  },
  {
    name: "item_5",
    type: "type-b",
    nulls: 0,
    unique: 1,
    values: ["value-3"],
    distribution: [100],
    quality_score: 0.79,
  },
  {
    name: "item_6",
    type: "type-a",
    nulls: 0,
    unique: 28,
    min: "100",
    max: "200",
    mean: "150",
    distribution: [5, 15, 30, 25, 15, 7, 3],
    quality_score: 0.91,
  },
  {
    name: "item_7",
    type: "type-a",
    nulls: 0,
    unique: 10,
    min: "400",
    max: "4000",
    mean: "2000",
    distribution: [2, 8, 20, 40, 20, 8, 2],
    quality_score: 0.88,
  },
  ...generateMoreData(20), // Add more data for scrollbar demonstration
]

// Type for sort configuration
type SortConfig = {
  key: string
  direction: "asc" | "desc"
}

// Type for filter configuration
type FilterConfig = {
  column: string | "all"
  value: string
}

// Type for column visibility
type ColumnVisibility = {
  [key: string]: boolean
}

export default function DataTable() {
  // Add a new state for column widths at the top with other state variables
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({
    name: 200,
    type: 120,
    nulls: 100,
    unique: 120,
    min: 120,
    max: 120,
    mean: 120,
    quality_score: 150,
  })
  const [resizingColumn, setResizingColumn] = useState<string | null>(null)
  const [startX, setStartX] = useState(0)
  const [activeTab, setActiveTab] = useState("data")
  const [selectedColumn, setSelectedColumn] = useState("")
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({ column: "all", value: "" })
  const [filteredData, setFilteredData] = useState(sampleData)
  const [showDetails, setShowDetails] = useState(false)
  const [columnDetail, setColumnDetail] = useState<(typeof sampleData)[0] | null>(null)
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    type: true,
    nulls: true,
    unique: true,
    min: true,
    max: true,
    mean: true,
    quality_score: true,
  })
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [typeFilters, setTypeFilters] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)
  const tableBodyRef = useRef<HTMLDivElement>(null)
  const tableHeaderRef = useRef<HTMLDivElement>(null)

  // Get unique column types - memoized for performance
  const columnTypes = useMemo(() => Array.from(new Set(sampleData.map((col) => col.type))), [])

  // Function to handle sorting - memoized with useCallback
  const handleSort = useCallback(
    (key: string) => {
      let direction: "asc" | "desc" = "asc"

      // If already sorting by this column, toggle direction
      if (sortConfig && sortConfig.key === key) {
        direction = sortConfig.direction === "asc" ? "desc" : "asc"
      }

      setSortConfig({ key, direction })
    },
    [sortConfig],
  )

  // Function to handle filtering - memoized with useCallback
  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterConfig((prev) => ({ ...prev, value: e.target.value }))
    setCurrentPage(1) // Reset to first page when filtering
  }, [])

  // Function to handle filter column change - memoized with useCallback
  const handleFilterColumnChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterConfig((prev) => ({ ...prev, column: e.target.value }))
    setCurrentPage(1) // Reset to first page when changing filter column
  }, [])

  // Function to clear filter - memoized with useCallback
  const clearFilter = useCallback(() => {
    setFilterConfig({ column: "all", value: "" })
    setCurrentPage(1) // Reset to first page when clearing filter
  }, [])

  // Function to toggle column visibility - memoized with useCallback
  const toggleColumnVisibility = useCallback((column: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column],
    }))
  }, [])

  // Function to toggle type filter - memoized with useCallback
  const toggleTypeFilter = useCallback((type: string) => {
    setTypeFilters((prev) => {
      const newFilters = prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
      return newFilters
    })
    setCurrentPage(1) // Reset to first page when changing type filters
  }, [])

  // Function to view column details - memoized with useCallback
  const viewColumnDetails = useCallback((column: (typeof sampleData)[0]) => {
    setColumnDetail(column)
    setShowDetails(true)
  }, [])

  // Function to export data as CSV - memoized with useCallback
  const exportAsCSV = useCallback(() => {
    // Show loading state
    setIsLoading(true)

    // Use setTimeout to prevent UI blocking during export
    setTimeout(() => {
      try {
        // Get visible columns
        const visibleColumns = Object.entries(columnVisibility)
          .filter(([_, isVisible]) => isVisible)
          .map(([column]) => column)

        // Create CSV header
        const header = visibleColumns.join(",")

        // Create CSV rows
        const rows = filteredData.map((item) => {
          return visibleColumns
            .map((column) => {
              const value = item[column as keyof typeof item]
              // Handle arrays and objects
              if (Array.isArray(value)) return `"${value.join(";")}"`
              if (typeof value === "object" && value !== null) return `"${JSON.stringify(value)}"`
              return value || ""
            })
            .join(",")
        })

        // Combine header and rows
        const csv = [header, ...rows].join("\n")

        // Create download link
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "data_export.csv"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } finally {
        setIsLoading(false)
      }
    }, 100)
  }, [filteredData, columnVisibility])

  // Sync horizontal scroll between header and body
  useEffect(() => {
    const headerEl = tableHeaderRef.current
    const bodyEl = tableBodyRef.current

    if (!headerEl || !bodyEl) return

    const handleBodyScroll = () => {
      if (headerEl && bodyEl) {
        headerEl.scrollLeft = bodyEl.scrollLeft
      }
    }

    const handleHeaderScroll = () => {
      if (headerEl && bodyEl) {
        bodyEl.scrollLeft = headerEl.scrollLeft
      }
    }

    bodyEl.addEventListener("scroll", handleBodyScroll)
    headerEl.addEventListener("scroll", handleHeaderScroll)

    return () => {
      bodyEl.removeEventListener("scroll", handleBodyScroll)
      headerEl.removeEventListener("scroll", handleHeaderScroll)
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process shortcuts when table is in focus
      if (!tableRef.current?.contains(document.activeElement)) return

      if (e.key === "Escape") {
        if (showDetails) {
          setShowDetails(false)
          e.preventDefault()
        } else if (filterConfig.value) {
          clearFilter()
          e.preventDefault()
        }
      }

      // Ctrl+F for focus on filter
      if (e.ctrlKey && e.key === "f") {
        document.getElementById("filter-input")?.focus()
        e.preventDefault()
      }

      // Ctrl+E for export
      if (e.ctrlKey && e.key === "e") {
        exportAsCSV()
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showDetails, filterConfig.value, clearFilter, exportAsCSV])

  // Apply filtering and sorting - memoized with useMemo for performance
  const processedData = useMemo(() => {
    // Show loading state for large datasets
    if (sampleData.length > 100) {
      setIsLoading(true)
    }

    let result = [...sampleData]

    // Apply type filters
    if (typeFilters.length > 0) {
      result = result.filter((item) => typeFilters.includes(item.type))
    }

    // Apply text filtering
    if (filterConfig.value) {
      const searchTerm = filterConfig.value.toLowerCase()
      result = result.filter((item) => {
        if (filterConfig.column === "all") {
          // Search across all columns
          return Object.entries(item).some(([key, val]) => {
            if (val === null || val === undefined) return false
            if (!columnVisibility[key as keyof ColumnVisibility]) return false
            return String(val).toLowerCase().includes(searchTerm)
          })
        } else {
          // Search in specific column
          const columnValue = item[filterConfig.column as keyof typeof item]
          if (columnValue === null || columnValue === undefined) return false
          return String(columnValue).toLowerCase().includes(searchTerm)
        }
      })
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        // Get values to compare
        const aValue = a[sortConfig.key as keyof typeof a]
        const bValue = b[sortConfig.key as keyof typeof a]

        // Handle undefined/null values
        if (aValue === undefined || aValue === null) return sortConfig.direction === "asc" ? -1 : 1
        if (bValue === undefined || bValue === null) return sortConfig.direction === "asc" ? 1 : -1

        // Compare based on type
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
        }

        // Convert to string for comparison
        const aString = String(aValue).toLowerCase()
        const bString = String(bValue).toLowerCase()

        // Compare strings
        if (sortConfig.direction === "asc") {
          return aString.localeCompare(bString)
        } else {
          return bString.localeCompare(aString)
        }
      })
    }

    // Clear loading state
    setIsLoading(false)

    return result
  }, [filterConfig, sortConfig, typeFilters, columnVisibility])

  // Update filtered data when processed data changes
  useEffect(() => {
    setFilteredData(processedData)
  }, [processedData])

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return filteredData.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredData, currentPage, rowsPerPage])

  // Function to render sort indicator
  const getSortIndicator = useCallback(
    (key: string) => {
      if (!sortConfig || sortConfig.key !== key) {
        return null
      }

      return sortConfig.direction === "asc" ? (
        <ChevronUp className="h-3 w-3 ml-1" />
      ) : (
        <ChevronDown className="h-3 w-3 ml-1" />
      )
    },
    [sortConfig],
  )

  // Function to render mini bar chart for distribution
  const renderMiniBarChart = useCallback((distribution: number[]) => {
    const max = Math.max(...distribution)

    return (
      <div className="flex items-end h-4 gap-[1px]">
        {distribution.map((value, i) => (
          <div key={i} className="bg-blue-500 w-1" style={{ height: `${(value / max) * 100}%` }}></div>
        ))}
      </div>
    )
  }, [])

  // Function to render quality score
  const renderQualityScore = useCallback((score: number) => {
    let bgColor = "bg-red-500"
    if (score >= 0.9) bgColor = "bg-green-500"
    else if (score >= 0.8) bgColor = "bg-blue-500"
    else if (score >= 0.7) bgColor = "bg-yellow-500"

    return (
      <div className="flex items-center gap-1">
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div className={`${bgColor} h-1.5 rounded-full`} style={{ width: `${score * 100}%` }}></div>
        </div>
        <span>{(score * 100).toFixed(0)}%</span>
      </div>
    )
  }, [])

  // Add this function to handle the start of column resizing
  const handleResizeStart = useCallback((e: React.MouseEvent, column: string) => {
    e.preventDefault()
    setResizingColumn(column)
    setStartX(e.clientX)
  }, [])

  // Add this function to handle the column resizing process
  const handleResize = useCallback(
    (e: MouseEvent) => {
      if (!resizingColumn) return

      const diff = e.clientX - startX
      if (Math.abs(diff) < 5) return // Minimum drag distance to prevent accidental resizes

      setColumnWidths((prev) => ({
        ...prev,
        [resizingColumn]: Math.max(80, (prev[resizingColumn] || 120) + diff),
      }))
      setStartX(e.clientX)
    },
    [resizingColumn, startX],
  )

  // Add this function to handle the end of column resizing
  const handleResizeEnd = useCallback(() => {
    setResizingColumn(null)
  }, [])

  // Add this effect to handle mouse move and mouse up events during resizing
  useEffect(() => {
    if (resizingColumn) {
      document.addEventListener("mousemove", handleResize)
      document.addEventListener("mouseup", handleResizeEnd)

      // Add a class to the body to change cursor during resize
      document.body.classList.add("resizing-columns")

      return () => {
        document.removeEventListener("mousemove", handleResize)
        document.removeEventListener("mouseup", handleResizeEnd)
        document.body.classList.remove("resizing-columns")
      }
    }
  }, [resizingColumn, handleResize, handleResizeEnd])

  return (
    <div className="min-h-screen bg-[#121212] p-4">
      <div className="mx-auto max-w-7xl">
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md slide-in-bottom" ref={tableRef}>
          <div className="border-b border-[#2a2a2a] p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Table className="h-4 w-4 text-white" />
              <h2 className="text-sm font-medium text-white">Data Table Title</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowKeyboardShortcuts(true)}
                className="p-1.5 rounded hover:bg-[#2a2a2a] text-white transition-colors"
                title="Keyboard Shortcuts"
              >
                <Keyboard className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                className="p-1.5 rounded hover:bg-[#2a2a2a] text-white transition-colors"
                title="Column Visibility"
              >
                {showColumnSelector ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={exportAsCSV}
                className="p-1.5 rounded hover:bg-[#2a2a2a] text-white transition-colors"
                title="Export as CSV"
                disabled={isLoading}
              >
                <Download className="h-4 w-4" />
              </button>
              <button className="p-1.5 rounded hover:bg-[#2a2a2a] text-white transition-colors" title="More Options">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Column visibility selector */}
          {showColumnSelector && (
            <div className="border-b border-[#2a2a2a] p-3 bg-[#1a1a1a]">
              <div className="text-xs text-white mb-2">Toggle Column Visibility</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(columnVisibility).map(([column, isVisible]) => (
                  <button
                    key={column}
                    onClick={() => toggleColumnVisibility(column)}
                    className={`px-2 py-1 rounded text-xs ${
                      isVisible ? "bg-white text-[#121212]" : "bg-[#252525] text-white"
                    }`}
                  >
                    {column}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Keyboard shortcuts modal */}
          {showKeyboardShortcuts && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
              <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md p-4 max-w-md w-full modal-content">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-white">Keyboard Shortcuts</h3>
                  <button onClick={() => setShowKeyboardShortcuts(false)} className="text-white hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-white">Shortcut 1</div>
                  <div className="text-white">Action 1</div>
                  <div className="text-white">Shortcut 2</div>
                  <div className="text-white">Action 2</div>
                  <div className="text-white">Shortcut 3</div>
                  <div className="text-white">Action 3</div>
                </div>
              </div>
            </div>
          )}

          {/* Filter controls */}
          <div className="border-b border-[#2a2a2a] p-3 bg-[#1a1a1a] flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 flex-grow max-w-md">
              <Search className="h-3.5 w-3.5 text-white" />
              <input
                id="filter-input"
                type="text"
                placeholder="Filter items..."
                value={filterConfig.value}
                onChange={handleFilterChange}
                className="bg-[#252525] border border-[#333] rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-gray-500 text-white"
              />
              {filterConfig.value && (
                <button onClick={clearFilter} className="text-white hover:text-white">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white">Filter by:</span>
              <select
                value={filterConfig.column}
                onChange={handleFilterColumnChange}
                className="bg-[#252525] border border-[#333] rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gray-500 text-white"
              >
                <option value="all">All Columns</option>
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="nulls">Nulls</option>
                <option value="unique">Unique</option>
              </select>
            </div>
            <div className="text-xs text-white ml-auto">
              {filteredData.length} of {sampleData.length} items
            </div>
          </div>

          {/* Type filters */}
          <div className="border-b border-[#2a2a2a] p-3 bg-[#1a1a1a] flex flex-wrap items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-white" />
            <span className="text-xs text-white">Filter Category:</span>
            <div className="flex flex-wrap gap-2">
              {columnTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleTypeFilter(type)}
                  className={`px-2 py-0.5 rounded text-xs ${
                    typeFilters.includes(type) ? "bg-white text-[#121212]" : "bg-[#252525] text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
              {typeFilters.length > 0 && (
                <button
                  onClick={() => setTypeFilters([])}
                  className="px-2 py-0.5 rounded text-xs bg-[#252525] text-white hover:bg-[#333]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="p-4 bg-[#1a1a1a] border-b border-[#2a2a2a] flex justify-center">
              <Loading />
            </div>
          )}

          {/* Table header with horizontal scrolling */}
          <div
            className="overflow-x-hidden max-w-full"
            ref={tableHeaderRef}
            style={{
              maxHeight: "100%",
              overflowY: "hidden",
            }}
          >
            <table className="w-full text-xs" style={{ minWidth: "800px" }}>
              <thead>
                <tr className="bg-[#1a1a1a]">
                  {columnVisibility.name && (
                    <th
                      className="relative px-4 py-2 text-left font-medium text-white border-b border-[#2a2a2a] cursor-pointer hover:text-white sticky left-0 bg-[#1a1a1a] z-10"
                      onClick={() => handleSort("name")}
                      style={{ width: `${columnWidths.name}px` }}
                    >
                      <div className="flex items-center">Column 1{getSortIndicator("name")}</div>
                      <div
                        className="absolute top-0 right-0 h-full w-2 cursor-col-resize group"
                        onMouseDown={(e) => handleResizeStart(e, "name")}
                      >
                        <div className="h-full w-[1px] bg-transparent group-hover:bg-white group-active:bg-white mx-auto"></div>
                      </div>
                    </th>
                  )}
                  {columnVisibility.type && (
                    <th
                      className="relative px-4 py-2 text-left font-medium text-white border-b border-[#2a2a2a] cursor-pointer hover:text-white"
                      onClick={() => handleSort("type")}
                      style={{ width: `${columnWidths.type}px` }}
                    >
                      <div className="flex items-center">Column 2{getSortIndicator("type")}</div>
                      <div
                        className="absolute top-0 right-0 h-full w-2 cursor-col-resize group"
                        onMouseDown={(e) => handleResizeStart(e, "type")}
                      >
                        <div className="h-full w-[1px] bg-transparent group-hover:bg-white group-active:bg-white mx-auto"></div>
                      </div>
                    </th>
                  )}
                  {columnVisibility.nulls && (
                    <th
                      className="relative px-4 py-2 text-left font-medium text-white border-b border-[#2a2a2a] cursor-pointer hover:text-white"
                      onClick={() => handleSort("nulls")}
                      style={{ width: `${columnWidths.nulls}px` }}
                    >
                      <div className="flex items-center">Column 3{getSortIndicator("nulls")}</div>
                      <div
                        className="absolute top-0 right-0 h-full w-2 cursor-col-resize group"
                        onMouseDown={(e) => handleResizeStart(e, "nulls")}
                      >
                        <div className="h-full w-[1px] bg-transparent group-hover:bg-white group-active:bg-white mx-auto"></div>
                      </div>
                    </th>
                  )}
                  {columnVisibility.unique && (
                    <th
                      className="relative px-4 py-2 text-left font-medium text-white border-b border-[#2a2a2a] cursor-pointer hover:text-white"
                      onClick={() => handleSort("unique")}
                      style={{ width: `${columnWidths.unique}px` }}
                    >
                      <div className="flex items-center">Column 4{getSortIndicator("unique")}</div>
                      <div
                        className="absolute top-0 right-0 h-full w-2 cursor-col-resize group"
                        onMouseDown={(e) => handleResizeStart(e, "unique")}
                      >
                        <div className="h-full w-[1px] bg-transparent group-hover:bg-white group-active:bg-white mx-auto"></div>
                      </div>
                    </th>
                  )}
                  {columnVisibility.min && (
                    <th
                      className="relative px-4 py-2 text-left font-medium text-white border-b border-[#2a2a2a] cursor-pointer hover:text-white"
                      onClick={() => handleSort("min")}
                      style={{ width: `${columnWidths.min}px` }}
                    >
                      <div className="flex items-center">Column 5{getSortIndicator("min")}</div>
                      <div
                        className="absolute top-0 right-0 h-full w-2 cursor-col-resize group"
                        onMouseDown={(e) => handleResizeStart(e, "min")}
                      >
                        <div className="h-full w-[1px] bg-transparent group-hover:bg-white group-active:bg-white mx-auto"></div>
                      </div>
                    </th>
                  )}
                  {columnVisibility.max && (
                    <th
                      className="relative px-4 py-2 text-left font-medium text-white border-b border-[#2a2a2a] cursor-pointer hover:text-white"
                      onClick={() => handleSort("max")}
                      style={{ width: `${columnWidths.max}px` }}
                    >
                      <div className="flex items-center">Column 6{getSortIndicator("max")}</div>
                      <div
                        className="absolute top-0 right-0 h-full w-2 cursor-col-resize group"
                        onMouseDown={(e) => handleResizeStart(e, "max")}
                      >
                        <div className="h-full w-[1px] bg-transparent group-hover:bg-white group-active:bg-white mx-auto"></div>
                      </div>
                    </th>
                  )}
                  {columnVisibility.mean && (
                    <th
                      className="relative px-4 py-2 text-left font-medium text-white border-b border-[#2a2a2a] cursor-pointer hover:text-white"
                      onClick={() => handleSort("mean")}
                      style={{ width: `${columnWidths.mean}px` }}
                    >
                      <div className="flex items-center">Column 7{getSortIndicator("mean")}</div>
                      <div
                        className="absolute top-0 right-0 h-full w-2 cursor-col-resize group"
                        onMouseDown={(e) => handleResizeStart(e, "mean")}
                      >
                        <div className="h-full w-[1px] bg-transparent group-hover:bg-white group-active:bg-white mx-auto"></div>
                      </div>
                    </th>
                  )}
                  {columnVisibility.quality_score && (
                    <th
                      className="relative px-4 py-2 text-left font-medium text-white border-b border-[#2a2a2a] cursor-pointer hover:text-white"
                      onClick={() => handleSort("quality_score")}
                      style={{ width: `${columnWidths.quality_score}px` }}
                    >
                      <div className="flex items-center">Column 8{getSortIndicator("quality_score")}</div>
                      <div
                        className="absolute top-0 right-0 h-full w-2 cursor-col-resize group"
                        onMouseDown={(e) => handleResizeStart(e, "quality_score")}
                      >
                        <div className="h-full w-[1px] bg-transparent group-hover:bg-white group-active:bg-white mx-auto"></div>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
            </table>
          </div>

          {/* Table body with vertical and horizontal scrolling */}
          <div
            className="overflow-auto scrollbar-themed"
            ref={tableBodyRef}
            style={{
              maxHeight: paginatedData.length > 10 ? "400px" : "auto",
              "--scrollbar-color": "black",
            } as React.CSSProperties}
          >
            <table className="w-full text-xs" style={{ minWidth: "800px" }}>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((column, index) => (
                    <tr key={index} className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors">
                      {columnVisibility.name && (
                        <td
                          className="px-4 py-2 text-white hover:text-blue-400 cursor-pointer sticky left-0 bg-[#1e1e1e] z-10"
                          onClick={() => viewColumnDetails(column)}
                          style={{ width: columnWidths.name + "px" }}
                        >
                          <div className="flex items-center gap-1">
                            {column.name}
                            <ChevronRight className="h-3 w-3 opacity-50" />
                          </div>
                        </td>
                      )}
                      {columnVisibility.type && (
                        <td className="px-4 py-2" style={{ width: columnWidths.type + "px" }}>
                          <span
                            className={`px-1.5 py-0.5 rounded text-xs ${
                              column.type === "type-a"
                                ? "bg-blue-900/30 text-blue-300"
                                : column.type === "type-b"
                                  ? "bg-green-900/30 text-green-300"
                                  : "bg-purple-900/30 text-purple-300"
                            }`}
                          >
                            {column.type}
                          </span>
                        </td>
                      )}
                      {columnVisibility.nulls && (
                        <td className="px-4 py-2 text-white" style={{ width: columnWidths.nulls + "px" }}>
                          {column.nulls}
                        </td>
                      )}
                      {columnVisibility.unique && (
                        <td className="px-4 py-2 text-white" style={{ width: columnWidths.unique + "px" }}>
                          {column.unique}
                        </td>
                      )}
                      {columnVisibility.min && (
                        <td className="px-4 py-2 text-white" style={{ width: columnWidths.min + "px" }}>
                          {column.min || "-"}
                        </td>
                      )}
                      {columnVisibility.max && (
                        <td className="px-4 py-2 text-white" style={{ width: columnWidths.max + "px" }}>
                          {column.max || "-"}
                        </td>
                      )}
                      {columnVisibility.mean && (
                        <td className="px-4 py-2 text-white" style={{ width: columnWidths.mean + "px" }}>
                          {column.mean || "-"}
                        </td>
                      )}
                      {columnVisibility.quality_score && (
                        <td className="px-4 py-2 text-white" style={{ width: columnWidths.quality_score + "px" }}>
                          {renderQualityScore(column.quality_score)}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={Object.values(columnVisibility).filter(Boolean).length}
                      className="px-4 py-8 text-center text-white"
                    >
                      No items match your filter criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {filteredData.length > rowsPerPage && (
            <div className="border-t border-[#2a2a2a] p-3 bg-[#1a1a1a] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value))
                    setCurrentPage(1) // Reset to first page when changing rows per page
                  }}
                  className="bg-[#252525] border border-[#333] rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gray-500 text-white"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-1 rounded ${currentPage === 1 ? "text-gray-600" : "text-white hover:bg-[#2a2a2a]"}`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-white px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-1 rounded ${
                    currentPage === totalPages ? "text-gray-600" : "text-white hover:bg-[#2a2a2a]"
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {showDetails && columnDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
            <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md p-4 max-w-2xl w-full max-h-[80vh] overflow-y-auto modal-content scrollbar-themed">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-blue-400" />
                  <h3 className="text-sm font-medium text-white">Item Details</h3>
                  <span
                    className={`px-1.5 py-0.5 rounded text-xs ${
                      columnDetail.type === "type-a"
                        ? "bg-blue-900/30 text-blue-300"
                        : columnDetail.type === "type-b"
                          ? "bg-green-900/30 text-green-300"
                          : "bg-purple-900/30 text-purple-300"
                    }`}
                  >
                    {columnDetail.type}
                  </span>
                </div>
                <button onClick={() => setShowDetails(false)} className="text-white hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#252525] p-3 rounded-md">
                  <h4 className="text-xs font-medium text-white mb-2">Section 1</h4>
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <div className="text-white">Field 1:</div>
                    <div className="text-white">{columnDetail.type}</div>
                    <div className="text-white">Field 2:</div>
                    <div className="text-white">{columnDetail.nulls}</div>
                    <div className="text-white">Field 3:</div>
                    <div className="text-white">{columnDetail.unique}</div>
                    {columnDetail.min && (
                      <>
                        <div className="text-white">Field 4:</div>
                        <div className="text-white">{columnDetail.min}</div>
                      </>
                    )}
                    {columnDetail.max && (
                      <>
                        <div className="text-white">Field 5:</div>
                        <div className="text-white">{columnDetail.max}</div>
                      </>
                    )}
                    {columnDetail.mean && (
                      <>
                        <div className="text-white">Field 6:</div>
                        <div className="text-white">{columnDetail.mean}</div>
                      </>
                    )}
                    <div className="text-white">Field 7:</div>
                    <div className="text-white">{renderQualityScore(columnDetail.quality_score)}</div>
                  </div>
                </div>

                <div className="bg-[#252525] p-3 rounded-md">
                  <h4 className="text-xs font-medium text-white mb-2">Section 2</h4>
                  {columnDetail.distribution && (
                    <div className="h-24 flex items-end justify-around p-2">
                      {columnDetail.distribution.map((value, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div
                            className="bg-blue-500 w-4"
                            style={{ height: `${(value / Math.max(...columnDetail.distribution)) * 100}%` }}
                          ></div>
                          <div className="text-[10px] text-white mt-1">{i + 1}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {columnDetail.values && (
                  <div className="bg-[#252525] p-3 rounded-md">
                    <h4 className="text-xs font-medium text-white mb-2">Section 3</h4>
                    <div className="flex flex-wrap gap-1">
                      {columnDetail.values.map((value, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-[#333] rounded text-xs text-white">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-[#252525] p-3 rounded-md">
                  <h4 className="text-xs font-medium text-white mb-2">Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-2 py-1 bg-white hover:bg-gray-200 text-[#121212] rounded text-xs flex items-center gap-1">
                      <Download className="h-3 w-3" /> Action 1
                    </button>
                    <button className="px-2 py-1 bg-[#333] hover:bg-[#444] text-white rounded text-xs flex items-center gap-1">
                      <Settings className="h-3 w-3" /> Action 2
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
