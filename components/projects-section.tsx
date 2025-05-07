/**
 * Projects Section Component
 * Purpose: Displays a collection of projects in either grid or list view
 * Used in: Dashboard, project listing pages
 * Features:
 * - Grid/List view toggle
 * - Loading skeletons
 * - Empty state handling
 * - Responsive layout
 */

import { ProjectCard, type ProjectData } from "./project-card"
import { ProjectCardSkeleton } from "./project-card-skeleton"
import { ProjectListItem } from "./project-list-item"

interface ProjectsSectionProps {
  title: string
  projects: ProjectData[]
  isLoading?: boolean
  delay?: number
  viewMode: "grid" | "list"
  onFavoriteToggle?: (id: string) => void
}

/**
 * Projects section component for displaying multiple projects
 * @param title - Section title
 * @param projects - Array of projects to display
 * @param isLoading - Loading state flag
 * @param delay - Animation delay in seconds
 * @param viewMode - Display mode (grid/list)
 * @param onFavoriteToggle - Callback for favorite status changes
 */
export function ProjectsSection({
  title,
  projects,
  isLoading = false,
  delay = 0,
  viewMode,
  onFavoriteToggle,
}: ProjectsSectionProps) {
  return (
    <div className="mb-6 slide-in-bottom" style={{ animationDelay: `${0.6 + delay}s` }}>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            // Show skeletons when loading
            Array.from({ length: 2 }).map((_, index) => <ProjectCardSkeleton key={index} />)
          ) : projects.length > 0 ? (
            // Show projects if available
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} onFavoriteToggle={onFavoriteToggle} />
            ))
          ) : (
            // Show empty state
            <div className="col-span-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-md p-6 text-center">
              <p className="text-gray-400 text-sm">No {title.toLowerCase()} projects found.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {isLoading ? (
            // Show skeletons when loading
            Array.from({ length: 2 }).map((_, index) => <ProjectCardSkeleton key={index} />)
          ) : projects.length > 0 ? (
            // Show projects if available
            projects.map((project) => (
              <ProjectListItem key={project.id} project={project} onFavoriteToggle={onFavoriteToggle} />
            ))
          ) : (
            // Show empty state
            <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md p-6 text-center">
              <p className="text-gray-400 text-sm">No {title.toLowerCase()} projects found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 