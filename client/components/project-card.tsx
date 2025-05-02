/**
 * Project Card Component
 * Purpose: Displays project information in a card format
 * Used in: Project listing pages, dashboard
 * Features:
 * - Project status visualization
 * - Progress tracking
 * - Favorite toggle
 * - Tags display
 * - Quick access to project details
 */

"use client"

import type React from "react"
import Link from "next/link"
import { Settings, Star, Calendar } from "lucide-react"

/**
 * Project data structure for card display
 */
export interface ProjectData {
  id: string
  title: string
  description: string
  progress: number
  status: "Planning" | "In Progress" | "Completed"
  tags: string[]
  icon?: React.ReactNode
  favorited?: boolean
  createdAt?: string
  date?: string
  timestampOrder?: number
}

interface ProjectCardProps {
  project: ProjectData
  className?: string
  onFavoriteToggle?: (id: string) => void
}

/**
 * Project card component for displaying project information
 * @param project - Project data to display
 * @param className - Additional CSS classes
 * @param onFavoriteToggle - Callback for favorite status changes
 */
export function ProjectCard({
  project,
  className = "",
  onFavoriteToggle,
}: ProjectCardProps) {
  /**
   * Returns color class based on project status
   * @param status - Current project status
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planning":
        return "text-yellow-500"
      case "In Progress":
        return "text-blue-500"
      case "Completed":
        return "text-green-500"
      default:
        return "text-violet-500"
    }
  }

  /**
   * Returns progress bar color based on project status
   * @param status - Current project status
   */
  const getProgressBarColor = (status: string) => {
    switch (status) {
      case "Planning":
        return "bg-yellow-500"
      case "In Progress":
        return "bg-blue-500"
      case "Completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div
      className={`bg-[#1e1e1e] border border-[#2a2a2a] rounded-md overflow-hidden group hover:border-gray-500 transition-all hover:translate-y-[-2px] hover:shadow-lg ${className}`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-sm font-medium text-white">{project.title}</h3>
            <p className="text-gray-400 text-xs">{project.description}</p>
            {project.date && (
              <div className="flex items-center mt-1 text-[9px] text-gray-400">
                <Calendar className="h-2.5 w-2.5 mr-1" />
                <span>{project.date}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`${project.favorited ? "bg-[#3a3a3a] text-yellow-400" : "bg-[#2a2a2a] text-gray-400 opacity-0 group-hover:opacity-100"} transition-all p-1 rounded hover:bg-[#3a3a3a]`}
              onClick={() => onFavoriteToggle?.(project.id)}
              aria-label={project.favorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className="h-3 w-3" fill={project.favorited ? "currentColor" : "none"} />
            </button>
            {project.icon || <Settings className="h-3.5 w-3.5 text-gray-400" />}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-400">Progress</span>
            <span className="text-xs text-white">{project.progress}%</span>
          </div>
          <div className="h-1 w-full bg-[#2a2a2a] rounded-full">
            <div
              className={`h-1 rounded-full transition-all ${getProgressBarColor(project.status)}`}
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-1">
            <span
              className={`bg-[#2a2a2a] ${getStatusColor(project.status)} text-[10px] px-2 py-0.5 rounded transition-colors hover:bg-[#3a3a3a]`}
            >
              {project.status}
            </span>
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-[#2a2a2a] text-[10px] px-2 py-0.5 rounded transition-colors hover:bg-[#3a3a3a]"
              >
                {tag}
              </span>
            ))}
          </div>
          <Link 
            href={`/errordetection/${project.id}`} 
            className="text-[10px] text-gray-400 hover:text-white transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
} 