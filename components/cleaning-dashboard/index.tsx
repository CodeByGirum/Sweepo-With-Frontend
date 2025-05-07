/**
 * Purpose: Main entry point for the Cleaning Dashboard
 * Features: Combines all dashboard components into a complete UI
 * Used in: Clean data page
 */

"use client"

import { useState, useRef, useEffect } from "react"
import { AdvancedPageTransition } from "@/components/advanced-page-transition"
import { useTransition } from "@/components/transition-provider"
import { DashboardHeader } from "./components/dashboard-header"
import { DashboardFooter } from "./components/dashboard-footer"
import { DashboardSidebar } from "./components/dashboard-sidebar"
import { CleaningActions } from "./components/cleaning-actions"
import { DataTable } from "./components/data-table"
import { ChatPanelContainer } from "./components/chat-panel-container"
import { DockIndicators } from "./components/dock-indicators"
import { GetIssues } from "@/utils/errorDetectionActions"
import { useRouter } from "next/navigation"
import type { Message, DockPosition, DataRow, IssueCount } from "./types"

interface CleaningDashboardProps {
  fileId: string
  hideHeader?: boolean
  hideFooter?: boolean
}

export function CleaningDashboard({ fileId, hideHeader = false, hideFooter = false }: CleaningDashboardProps) {
  const router = useRouter()
  // Get transition settings from context
  const { transitionType, transitionDuration } = useTransition()

  // Dataset state
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<DataRow[]>([])
  const [originalName, setOriginalName] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  // State for UI components
  const [showChat, setShowChat] = useState(true)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [entriesPerPage, setEntriesPerPage] = useState(20)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [chatWidth, setChatWidth] = useState(320)
  const [chatHeight, setChatHeight] = useState(300)
  const [dockPosition, setDockPosition] = useState<DockPosition>("right")
  const [issueCount, setIssueCount] = useState<IssueCount>({
    null_value: 0,
    invalid_format: 0,
    invalid_date: 0,
    duplicate_value: 0,
    negative_rating: 0
  })

  // Dragging state
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Resizing state
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 })
  const [resizeStartDimensions, setResizeStartDimensions] = useState({ width: 0, height: 0 })

  // Visual indicators for docking
  const [dockIndicator, setDockIndicator] = useState<DockPosition | null>(null)

  // Refs for DOM elements
  const chatRef = useRef<HTMLDivElement | null>(null)
  const chatHeaderRef = useRef<HTMLDivElement | null>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement | null>(null)

  // Chat messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! Would you please help me clean my data?",
      sender: "user",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "2",
      content:
        'The actions taken will significantly clean the dataset by removing rows with null values, invalid formats, and duplicate entries across critical columns such as "Category", "Email", "Join Date", "Rating", "Age", and "Salary". This will enhance the quality and reliability of the data for further analysis.\n\nWould you like me to proceed with the cleaning operations?',
      sender: "assistant",
      timestamp: new Date(Date.now() - 30000),
    },
  ])

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!fileId) return
      
      setIsLoading(true)
      try {
        const response = await GetIssues(fileId)
        
        // Transform the data to fit our DataRow type
        const transformedData = response.records.map((record: any, index: number) => {
          // Determine issues for this row
          const issues: string[] = []
          
          // Check for null values
          Object.entries(record).forEach(([key, value]) => {
            if (value === null) issues.push("null_value")
          })
          
          // Email validation
          if (record.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) {
            issues.push("invalid_format")
          }
          
          // Date validation
          if (record.join_date && !/^\d{4}-\d{2}-\d{2}$/.test(record.join_date)) {
            issues.push("invalid_date")
          }
          
          // Convert to our data model
          return {
            id: index + 1,
            name: record.name || "",
            age: record.age,
            salary: record.salary,
            email: record.email || "",
            joinDate: record.join_date || "",
            category: record.category,
            score: record.score || 0,
            rating: record.rating || 0,
            originalRowIndex: index,
            issues
          }
        })
        
        setData(transformedData)
        setOriginalName(response.original_name)
        setDescription(response.description)
        
        // Calculate issue counts
        setIssueCount({
          null_value: transformedData.filter((row: DataRow) => row.issues.includes("null_value")).length,
          invalid_format: transformedData.filter((row: DataRow) => row.issues.includes("invalid_format")).length,
          invalid_date: transformedData.filter((row: DataRow) => row.issues.includes("invalid_date")).length,
          duplicate_value: transformedData.filter((row: DataRow) => row.issues.includes("duplicate_value")).length,
          negative_rating: transformedData.filter((row: DataRow) => row.issues.includes("negative_rating")).length
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        // Add error message to chat
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: "There was an error loading your data. Please try again or contact support if the issue persists.",
          sender: "assistant",
          timestamp: new Date()
        }])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [fileId])

  // Handle cleaning action click
  const handleCleaningAction = (actionId: string, actionLabel: string) => {
    // Create a message describing the action
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `Apply action: ${actionLabel}`,
      sender: "user",
      timestamp: new Date(),
    }

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage])

    // Create appropriate response based on action type
    let responseContent = ""
    let affectedRows = 0

    switch (actionId) {
      case "null-category":
        affectedRows = data.filter(row => row.category === null).length
        responseContent = `I've removed all rows with null values in the Category column. ${affectedRows} rows were affected.`
        setData(data.filter(row => row.category !== null))
        break
      case "invalid-email":
        affectedRows = data.filter(row => row.issues.includes("invalid_format")).length
        responseContent = `I've removed all rows with invalid email formats. ${affectedRows} rows were affected.`
        setData(data.filter(row => !row.issues.includes("invalid_format")))
        break
      case "duplicate-email":
        // Find duplicate emails
        const emailCounts: Record<string, number> = {}
        data.forEach(row => {
          if (row.email && row.email !== "") {
            emailCounts[row.email] = (emailCounts[row.email] || 0) + 1
          }
        })
        
        const duplicateEmails = Object.keys(emailCounts).filter(email => emailCounts[email] > 1)
        const uniqueEmails = new Set<string>()
        
        // Filter out duplicates, keeping the first occurrence
        const filteredData = data.filter(row => {
          if (!row.email || row.email === "" || !duplicateEmails.includes(row.email)) return true
          if (uniqueEmails.has(row.email)) return false
          
          uniqueEmails.add(row.email)
          return true
        })
        
        affectedRows = data.length - filteredData.length
        responseContent = `I've removed duplicate email entries, keeping only the first occurrence. ${affectedRows} rows were affected.`
        setData(filteredData)
        break
      case "invalid-date-separator":
      case "invalid-date-components":
        affectedRows = data.filter(row => row.issues.includes("invalid_date")).length
        responseContent = `I've removed rows with invalid date formats in the Join Date column. ${affectedRows} rows were affected.`
        setData(data.filter(row => !row.issues.includes("invalid_date")))
        break
      case "negative-ratings":
        affectedRows = data.filter(row => row.rating < 0).length
        responseContent = `I've removed rows with negative ratings. ${affectedRows} rows were affected.`
        setData(data.filter(row => row.rating >= 0))
        break
      case "null-age":
        affectedRows = data.filter(row => row.age === null).length
        responseContent = `I've removed all rows with null values in the Age column. ${affectedRows} rows were affected.`
        setData(data.filter(row => row.age !== null))
        break
      case "null-salary":
        affectedRows = data.filter(row => row.salary === null).length
        responseContent = `I've removed all rows with null values in the Salary column. ${affectedRows} rows were affected.`
        setData(data.filter(row => row.salary !== null))
        break
      case "undo":
        responseContent = "I've undone all cleaning actions. The dataset will be restored to its original state."
        // Re-fetch the original data
        fetchData()
        break
      default:
        responseContent = "I've applied the selected cleaning action. The dataset has been updated."
    }

    // Recalculate issue counts
    setIssueCount({
      null_value: data.filter((row: DataRow) => row.issues.includes("null_value")).length,
      invalid_format: data.filter((row: DataRow) => row.issues.includes("invalid_format")).length,
      invalid_date: data.filter((row: DataRow) => row.issues.includes("invalid_date")).length,
      duplicate_value: data.filter((row: DataRow) => row.issues.includes("duplicate_value")).length,
      negative_rating: data.filter((row: DataRow) => row.issues.includes("negative_rating")).length
    })

    // Add assistant response after a short delay to simulate processing
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Show chat if it's hidden
      if (!showChat) {
        setShowChat(true)
      }
    }, 500)
  }

  // Function to refetch original data
  const fetchData = async () => {
    if (!fileId) return
    
    setIsLoading(true)
    try {
      const response = await GetIssues(fileId)
      
      // Transform the data to fit our DataRow type
      const transformedData = response.records.map((record: any, index: number) => {
        // Determine issues for this row
        const issues: string[] = []
        
        // Check for null values
        Object.entries(record).forEach(([key, value]) => {
          if (value === null) issues.push("null_value")
        })
        
        // Email validation
        if (record.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) {
          issues.push("invalid_format")
        }
        
        // Date validation
        if (record.join_date && !/^\d{4}-\d{2}-\d{2}$/.test(record.join_date)) {
          issues.push("invalid_date")
        }
        
        // Convert to our data model
        return {
          id: index + 1,
          name: record.name || "",
          age: record.age,
          salary: record.salary,
          email: record.email || "",
          joinDate: record.join_date || "",
          category: record.category,
          score: record.score || 0,
          rating: record.rating || 0,
          originalRowIndex: index,
          issues
        }
      })
      
      setData(transformedData)
      
      // Calculate issue counts
      setIssueCount({
        null_value: transformedData.filter((row: DataRow) => row.issues.includes("null_value")).length,
        invalid_format: transformedData.filter((row: DataRow) => row.issues.includes("invalid_format")).length,
        invalid_date: transformedData.filter((row: DataRow) => row.issues.includes("invalid_date")).length,
        duplicate_value: transformedData.filter((row: DataRow) => row.issues.includes("duplicate_value")).length,
        negative_rating: transformedData.filter((row: DataRow) => row.issues.includes("negative_rating")).length
      })
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to show dock indicators while dragging
  const showDockIndicator = (e: MouseEvent) => {
    if (!isDragging) return null

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const posX = e.clientX - dragOffset.x
    const posY = e.clientY - dragOffset.y

    // Define threshold for edge detection (pixels from edge)
    const threshold = 100

    if (posX < threshold) {
      return "left"
    } else if (windowWidth - (posX + chatWidth) < threshold) {
      return "right"
    } else if (windowHeight - (posY + chatHeight) < threshold) {
      return "bottom"
    }

    return null
  }

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>
  }

  return (
    <AdvancedPageTransition type={transitionType} duration={transitionDuration}>
      <div className="flex flex-col min-h-screen bg-[#121212] text-white">
        {/* Header */}
        {!hideHeader && <DashboardHeader sidebarCollapsed={sidebarCollapsed} />}

        {/* Main Content */}
        <div className="flex flex-1">
          {/* Sidebar Toggle Button (visible when sidebar is collapsed) */}
          {sidebarCollapsed && <DashboardSidebar.ToggleButton onClick={() => setSidebarCollapsed(false)} />}

          {/* Sidebar */}
          <DashboardSidebar
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            issueCount={issueCount}
            filename={originalName}
          />

          {/* Main Content Area with dynamic layout based on chat position */}
          <div className="flex-1 flex flex-col">
            {/* Cleaning Actions */}
            <CleaningActions onActionClick={handleCleaningAction} />

            {/* Main Content with dynamic layout based on chat position */}
            <div
              className={`flex-1 ${dockPosition === "bottom" ? "flex flex-col" : "flex flex-row"}`}
              ref={mainContentRef}
            >
              {/* Left Chat Panel (when docked to left) */}
              <ChatPanelContainer
                show={showChat && dockPosition === "left"}
                dockPosition="left"
                width={chatWidth}
                chatRef={chatRef as React.RefObject<HTMLDivElement>}
                chatHeaderRef={chatHeaderRef as React.RefObject<HTMLDivElement>}
                resizeHandleRef={resizeHandleRef as React.RefObject<HTMLDivElement>}
                onClose={() => setShowChat(false)}
                onDockChange={setDockPosition}
                messages={messages}
                setMessages={setMessages}
              />

              {/* Data Table Section */}
              <DataTable
                data={data}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                showChat={showChat}
                setShowChat={setShowChat}
                setSidebarCollapsed={setSidebarCollapsed}
                sidebarCollapsed={sidebarCollapsed}
                projectId="1" // TODO: Get from context
                filename={originalName}
              />

              {/* Right Chat Panel (when docked to right) */}
              <ChatPanelContainer
                show={showChat && dockPosition === "right"}
                dockPosition="right"
                width={chatWidth}
                chatRef={chatRef as React.RefObject<HTMLDivElement>}
                chatHeaderRef={chatHeaderRef as React.RefObject<HTMLDivElement>}
                resizeHandleRef={resizeHandleRef as React.RefObject<HTMLDivElement>}
                onClose={() => setShowChat(false)}
                onDockChange={setDockPosition}
                messages={messages}
                setMessages={setMessages}
              />
            </div>

            {/* Bottom Chat Panel (when docked to bottom) */}
            <ChatPanelContainer
              show={showChat && dockPosition === "bottom"}
              dockPosition="bottom"
              height={chatHeight}
              chatRef={chatRef as React.RefObject<HTMLDivElement>}
              chatHeaderRef={chatHeaderRef as React.RefObject<HTMLDivElement>}
              resizeHandleRef={resizeHandleRef as React.RefObject<HTMLDivElement>}
              onClose={() => setShowChat(false)}
              onDockChange={setDockPosition}
              messages={messages}
              setMessages={setMessages}
            />
          </div>
        </div>

        {/* Footer */}
        {!hideFooter && <DashboardFooter />}

        {/* Dock indicators */}
        <DockIndicators position={dockIndicator} />
      </div>
    </AdvancedPageTransition>
  )
} 