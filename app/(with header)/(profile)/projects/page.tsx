'use client'

import { useState, useMemo, useRef, useEffect } from "react"
import {
  Search,
  Plus,
  BarChart2,
  Filter,
  Grid,
  List,
  Star,
  Clock,
  ChevronDown,
  X,
  Check,
  SortAsc,
  SortDesc,
  Calendar,
  Tag,
} from "lucide-react"
import { AdvancedPageTransition } from "@/components/advanced-page-transition"
import { ProjectsSection } from "@/components/projects-section"
import { StatsCard } from "@/components/stats-card"
import type { ProjectData } from "@/components/project-card"
import { ProjectCardSkeleton } from "@/components/project-card-skeleton"
import { GetFile } from "@/utils/fileActions"
import { toggleFavoriteStatus } from "@/utils/favoriteActions"
import { projectType } from "@/utils/types"
import Modals from "@/components/dashboardUi/Modals"

type ViewMode = "grid" | "list"
type StatusFilter = "all" | "planning" | "in-progress" | "completed"
type TagFilter = string | null
type SortOption = "name" | "progress" | "date"
type SortDirection = "asc" | "desc"
type CategoryFilter = "all" | "favorites" | "recent"

const Dashboard = () => {
  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  // Filter states
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [tagFilter, setTagFilter] = useState<TagFilter>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [loading, setLoading] = useState(true)
  const [showOverlay, setShowOverlay] = useState<boolean>(false)
  const [step, setStep] = useState<number>(1)
  const [revalidateProjects, setRevalidateProjects] = useState<boolean>(false)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")
  const [recentProjects, setRecentProjects] = useState<ProjectData[]>([])

  // Filter dropdown ref for click outside detection
  const filterDropdownRef = useRef<HTMLDivElement>(null)

  // Project data with converted fields
  const [projects, setProjects] = useState<ProjectData[]>([])

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      
      // Get the sort direction based on current filter settings
      const apiSortOrder = sortBy === "date" ? sortDirection : undefined;
      const resp = await GetFile(apiSortOrder)
      
      if(resp?.data.status) {
        // Convert existing project data to new format
        const convertedProjects = resp.data.result.map((project: projectType) => {
          // Determine status based on progress
          let status: "Planning" | "In Progress" | "Completed"
          if (project.progress === 0) {
            status = "Planning"
          } else if (project.progress === 100) {
            status = "Completed"
          } else {
            status = "In Progress"
          }
          
          // Convert category to tags array
          const tags = [project.category]
          
          // Extract timestamp information (fallback to created_at if available)
          let createdAt = new Date().toISOString();
          if (project.timestamp) {
            createdAt = project.timestamp;
          } else if (project.created_at) {
            createdAt = project.created_at;
          }
          
          // Store numeric timestamp for sorting if available
          const timestampOrder = project.timestamp_order || new Date(createdAt).getTime();
          
          return {
            id: project.file_id,
            title: project.original_name,
            description: project.description,
            progress: project.progress,
            status: project.status || status,
            tags: project.tags || tags,
            favorited: project.favorited || false,
            createdAt: createdAt,
            timestampOrder: timestampOrder
          }
        })
        
        setProjects(convertedProjects)
        
        // Set recent projects (5 most recent based on timestamp)
        const sortedByDate = [...convertedProjects].sort((a, b) => {
          return b.timestampOrder - a.timestampOrder;
        })
        setRecentProjects(sortedByDate.slice(0, 5))
      } else {
        setProjects([])
        setRecentProjects([])
      }
      
      setLoading(false)
    }
    
    fetchProjects()
  }, [revalidateProjects, sortBy, sortDirection])

  // Toggle favorite status for a project
  const toggleFavorite = async (id: string) => {
    // Optimistically update UI
    setProjects(
      projects.map((project) => (project.id === id ? { ...project, favorited: !project.favorited } : project))
    )
    
    // Update in backend
    const result = await toggleFavoriteStatus(id)
    
    // If failed, revert the change
    if (!result.success) {
      setProjects(
        projects.map((project) => (project.id === id ? { ...project, favorited: !project.favorited } : project))
      )
    }
  }

  // Get all unique tags from projects
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    projects.forEach((project) => {
      project.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  }, [projects])

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilters(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filter and sort projects based on current filters
  const filteredProjects = useMemo(() => {
    let result = [...projects]

    // Filter by category (all, favorites, recent)
    if (categoryFilter === "favorites") {
      result = result.filter((project) => project.favorited)
    } else if (categoryFilter === "recent") {
      return [...recentProjects]
    }

    // Filter by favorites (legacy)
    if (showFavoritesOnly) {
      result = result.filter((project) => project.favorited)
    }

    // Filter by status
    if (statusFilter !== "all") {
      const normalizedStatus =
        statusFilter === "planning" ? "Planning" : statusFilter === "in-progress" ? "In Progress" : "Completed"

      result = result.filter((project) => project.status === normalizedStatus)
    }

    // Filter by tag
    if (tagFilter) {
      result = result.filter((project) => project.tags.includes(tagFilter))
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Sort projects
    result.sort((a, b) => {
      let comparison = 0

      if (sortBy === "name") {
        comparison = a.title.localeCompare(b.title)
      } else if (sortBy === "progress") {
        comparison = a.progress - b.progress
      } else if (sortBy === "date") {
        // Use timestamp for date sorting
        comparison = (a.timestampOrder || 0) - (b.timestampOrder || 0);
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    return result
  }, [projects, statusFilter, tagFilter, searchQuery, showFavoritesOnly, sortBy, sortDirection, categoryFilter, recentProjects])

  // Group projects by status
  const planningProjects = filteredProjects.filter((p) => p.status === "Planning")
  const inProgressProjects = filteredProjects.filter((p) => p.status === "In Progress")
  const completedProjects = filteredProjects.filter((p) => p.status === "Completed")

  // Count of favorited projects
  const favoritedProjectsCount = projects.filter((p) => p.favorited).length

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter("all")
    setTagFilter(null)
    setSearchQuery("")
    setShowFavoritesOnly(false)
    setCategoryFilter("all")
    setSortBy("name")
    setSortDirection("asc")
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <AdvancedPageTransition type="perspective" duration={0.5}>
      <div className="flex flex-col min-h-screen bg-[#121212] text-[80%]">
        {/* Main Content */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-56 bg-[#121212] border-r border-[#2a2a2a] p-4 fade-in">
            <div className="mb-6">
              <h3 className="text-[10px] uppercase text-gray-500 font-medium mb-2">CATEGORIES</h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setCategoryFilter("all")
                    setStatusFilter("all")
                  }}
                  className={`w-full flex items-center gap-2 text-[10px] ${categoryFilter === "all" ? "text-white bg-[#2a2a2a]" : "text-gray-400 hover:bg-[#1e1e1e]"} py-1.5 px-2 rounded transition-colors text-left`}
                >
                  <Grid className="h-3 w-3" />
                  <span>All Projects</span>
                  <span className="ml-auto bg-[#3a3a3a] text-[10px] px-1.5 rounded">{projects.length}</span>
                </button>
                <button
                  onClick={() => setCategoryFilter("favorites")}
                  className={`w-full flex items-center gap-2 text-[10px] ${categoryFilter === "favorites" ? "text-white bg-[#2a2a2a]" : "text-gray-400 hover:bg-[#1e1e1e]"} py-1.5 px-2 rounded transition-colors text-left`}
                >
                  <Star className="h-3 w-3" fill={categoryFilter === "favorites" ? "currentColor" : "none"} />
                  <span>Favorites</span>
                  <span className="ml-auto bg-[#3a3a3a] text-[10px] px-1.5 rounded">{favoritedProjectsCount}</span>
                </button>
                <button
                  onClick={() => setCategoryFilter("recent")}
                  className={`w-full flex items-center gap-2 text-[10px] ${categoryFilter === "recent" ? "text-white bg-[#2a2a2a]" : "text-gray-400 hover:bg-[#1e1e1e]"} py-1.5 px-2 rounded transition-colors text-left`}
                >
                  <Clock className="h-3 w-3" />
                  <span>Recent</span>
                  <span className="ml-auto bg-[#3a3a3a] text-[10px] px-1.5 rounded">{recentProjects.length}</span>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-[10px] uppercase text-gray-500 font-medium mb-2">STATUS</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`w-full flex items-center gap-2 text-[10px] ${statusFilter === "all" ? "text-white bg-[#2a2a2a]" : "text-gray-400 hover:bg-[#1e1e1e]"} py-1.5 px-2 rounded transition-colors text-left`}
                >
                  <span className="h-2 w-2 rounded-full bg-[#3a3a3a]"></span>
                  <span>All</span>
                  <span className="ml-auto bg-[#3a3a3a] text-[10px] px-1.5 rounded">{projects.length}</span>
                </button>
                <button
                  onClick={() => setStatusFilter("planning")}
                  className={`w-full flex items-center gap-2 text-[10px] ${statusFilter === "planning" ? "text-white bg-[#2a2a2a]" : "text-gray-400 hover:bg-[#1e1e1e]"} py-1.5 px-2 rounded transition-colors text-left`}
                >
                  <span className="h-2 w-2 rounded-full bg-[#3a3a3a]"></span>
                  <span>Planning</span>
                  <span className="ml-auto bg-[#3a3a3a] text-[10px] px-1.5 rounded">
                    {projects.filter((p) => p.status === "Planning").length}
                  </span>
                </button>
                <button
                  onClick={() => setStatusFilter("in-progress")}
                  className={`w-full flex items-center gap-2 text-[10px] ${statusFilter === "in-progress" ? "text-white bg-[#2a2a2a]" : "text-gray-400 hover:bg-[#1e1e1e]"} py-1.5 px-2 rounded transition-colors text-left`}
                >
                  <span className="h-2 w-2 rounded-full bg-[#3a3a3a]"></span>
                  <span>In Progress</span>
                  <span className="ml-auto bg-[#3a3a3a] text-[10px] px-1.5 rounded">
                    {projects.filter((p) => p.status === "In Progress").length}
                  </span>
                </button>
                <button
                  onClick={() => setStatusFilter("completed")}
                  className={`w-full flex items-center gap-2 text-[10px] ${statusFilter === "completed" ? "text-white bg-[#2a2a2a]" : "text-gray-400 hover:bg-[#1e1e1e]"} py-1.5 px-2 rounded transition-colors text-left`}
                >
                  <span className="h-2 w-2 rounded-full bg-[#3a3a3a]"></span>
                  <span>Completed</span>
                  <span className="ml-auto bg-[#3a3a3a] text-[10px] px-1.5 rounded">
                    {projects.filter((p) => p.status === "Completed").length}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] uppercase text-gray-500 font-medium mb-2">TAGS</h3>
              <div className="space-y-1">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                    className={`w-full flex items-center gap-2 text-[10px] ${tagFilter === tag ? "text-white bg-[#2a2a2a]" : "text-gray-400 hover:bg-[#1e1e1e]"} py-1.5 px-2 rounded transition-colors text-left`}
                  >
                    <span>{tag}</span>
                    <span className="ml-auto bg-[#3a3a3a] text-[10px] px-1.5 rounded">
                      {projects.filter((p) => p.tags.includes(tag)).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 p-6 overflow-auto bg-[#121212] text-white">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatsCard
                title="Total Projects"
                value={projects.length}
                icon={<BarChart2 className="h-3.5 w-3.5 text-gray-400" />}
                delay={0}
              />
              <StatsCard
                title="In Planning"
                value={projects.filter((p) => p.status === "Planning").length}
                icon={<BarChart2 className="h-3.5 w-3.5 text-gray-400" />}
                delay={1}
              />
              <StatsCard
                title="In Progress"
                value={projects.filter((p) => p.status === "In Progress").length}
                icon={<BarChart2 className="h-3.5 w-3.5 text-gray-400" />}
                delay={2}
              />
              <StatsCard
                title="Completed"
                value={projects.filter((p) => p.status === "Completed").length}
                icon={<BarChart2 className="h-3.5 w-3.5 text-gray-400" />}
                delay={3}
              />
            </div>

            {/* Projects Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-base font-medium">Projects</h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`${viewMode === "grid" ? "bg-[#2a2a2a]" : "bg-[#1a1a1a]"} p-1 rounded transition-colors hover:bg-[#3a3a3a]`}
                    aria-label="Grid view"
                  >
                    <Grid className={`h-3 w-3 ${viewMode === "grid" ? "text-white" : "text-gray-400"}`} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`${viewMode === "list" ? "bg-[#2a2a2a]" : "bg-[#1a1a1a]"} p-1 rounded transition-colors hover:bg-[#3a3a3a]`}
                    aria-label="List view"
                  >
                    <List className={`h-3 w-3 ${viewMode === "list" ? "text-white" : "text-gray-400"}`} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search projects"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 pl-8 pr-3 text-[10px] w-64 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                  />
                  <Search className="absolute left-2.5 top-1.5 h-3 w-3 text-gray-400" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1.5 text-gray-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <div className="relative" ref={filterDropdownRef}>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`${showFilters ? "bg-[#2a2a2a] text-white" : "bg-[#1a1a1a] text-gray-400"} border border-[#2a2a2a] rounded-md p-1.5 flex items-center gap-1 transition-colors hover:bg-[#2a2a2a] hover:text-white`}
                  >
                    <Filter className="h-3 w-3" />
                    <span className="text-[10px]">Filter</span>
                    <ChevronDown className="h-2.5 w-2.5" />
                  </button>

                  {/* Filter Dropdown */}
                  {showFilters && (
                    <div className="absolute right-0 mt-1 w-64 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md shadow-lg z-10">
                      <div className="p-3">
                        <h4 className="text-[10px] font-medium mb-2">Sort by</h4>
                        <div className="space-y-1 mb-3">
                          <button
                            onClick={() => setSortBy("name")}
                            className="w-full flex items-center justify-between text-[10px] text-gray-300 py-1 px-2 hover:bg-[#2a2a2a] rounded transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <Tag className="h-3 w-3 text-gray-400" />
                              <span>Name</span>
                            </div>
                            {sortBy === "name" && <Check className="h-3 w-3 text-blue-400" />}
                          </button>
                          <button
                            onClick={() => setSortBy("progress")}
                            className="w-full flex items-center justify-between text-[10px] text-gray-300 py-1 px-2 hover:bg-[#2a2a2a] rounded transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <BarChart2 className="h-3 w-3 text-gray-400" />
                              <span>Progress</span>
                            </div>
                            {sortBy === "progress" && <Check className="h-3 w-3 text-blue-400" />}
                          </button>
                          <button
                            onClick={() => setSortBy("date")}
                            className="w-full flex items-center justify-between text-[10px] text-gray-300 py-1 px-2 hover:bg-[#2a2a2a] rounded transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span>Date</span>
                            </div>
                            {sortBy === "date" && <Check className="h-3 w-3 text-blue-400" />}
                          </button>
                        </div>

                        <h4 className="text-[10px] font-medium mb-2">Direction</h4>
                        <div className="space-y-1 mb-3">
                          <button
                            onClick={() => setSortDirection("asc")}
                            className="w-full flex items-center justify-between text-[10px] text-gray-300 py-1 px-2 hover:bg-[#2a2a2a] rounded transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <SortAsc className="h-3 w-3 text-gray-400" />
                              <span>Ascending</span>
                            </div>
                            {sortDirection === "asc" && <Check className="h-3 w-3 text-blue-400" />}
                          </button>
                          <button
                            onClick={() => setSortDirection("desc")}
                            className="w-full flex items-center justify-between text-[10px] text-gray-300 py-1 px-2 hover:bg-[#2a2a2a] rounded transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <SortDesc className="h-3 w-3 text-gray-400" />
                              <span>Descending</span>
                            </div>
                            {sortDirection === "desc" && <Check className="h-3 w-3 text-blue-400" />}
                          </button>
                        </div>

                        <div className="pt-2 border-t border-[#2a2a2a]">
                          <button
                            onClick={resetFilters}
                            className="w-full text-[10px] text-blue-400 hover:text-blue-300 py-1"
                          >
                            Reset all filters
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button 
                  className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md py-1.5 px-3 text-[10px] font-medium flex items-center gap-1 transition-colors"
                  onClick={() => setShowOverlay(true)}
                >
                  <Plus className="h-3 w-3" />
                  <span>New project</span>
                </button>
              </div>
            </div>

            {/* Project Categories */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ProjectCardSkeleton key={index} />
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md p-6 text-center">
                <p className="text-gray-400 text-[11px]">No projects found matching your filters.</p>
                <button onClick={resetFilters} className="mt-2 text-[10px] text-blue-400 hover:text-blue-300">
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                {planningProjects.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[10px] uppercase text-gray-500 font-medium">Planning</h3>
                      <span className="text-[10px] text-gray-500">{planningProjects.length}</span>
                    </div>
                    <ProjectsSection
                      title="Planning"
                      projects={planningProjects.map(p => ({
                        ...p,
                        date: formatDate(p.createdAt || new Date().toISOString())
                      }))}
                      delay={0}
                      viewMode={viewMode}
                      onFavoriteToggle={toggleFavorite}
                    />
                  </div>
                )}
                {inProgressProjects.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[10px] uppercase text-gray-500 font-medium">In Progress</h3>
                      <span className="text-[10px] text-gray-500">{inProgressProjects.length}</span>
                    </div>
                    <ProjectsSection
                      title="In Progress"
                      projects={inProgressProjects.map(p => ({
                        ...p,
                        date: formatDate(p.createdAt || new Date().toISOString())
                      }))}
                      delay={0.1}
                      viewMode={viewMode}
                      onFavoriteToggle={toggleFavorite}
                    />
                  </div>
                )}
                {completedProjects.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[10px] uppercase text-gray-500 font-medium">Completed</h3>
                      <span className="text-[10px] text-gray-500">{completedProjects.length}</span>
                    </div>
                    <ProjectsSection
                      title="Completed"
                      projects={completedProjects.map(p => ({
                        ...p,
                        date: formatDate(p.createdAt || new Date().toISOString())
                      }))}
                      delay={0.2}
                      viewMode={viewMode}
                      onFavoriteToggle={toggleFavorite}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
        
        {/* The Overlay Div - reusing existing modals */}
        {showOverlay && (
          <Modals 
            setShowOverlay={setShowOverlay}
            step={step} 
            setStep={setStep}
            revalidateProjects={revalidateProjects}
            setRevalidateProjects={setRevalidateProjects}
          />
        )}
      </div>
    </AdvancedPageTransition>
  )
}

export default Dashboard