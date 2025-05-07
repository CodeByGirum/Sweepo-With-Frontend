/**
 * Project Card Skeleton Component
 * Purpose: Loading placeholder for project cards
 * Used in: Project sections during data loading
 * Features:
 * - Animated loading state
 * - Matches project card layout
 * - Responsive design
 */

export function ProjectCardSkeleton() {
  return (
    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md overflow-hidden animate-pulse">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="h-4 w-32 bg-[#2a2a2a] rounded mb-2"></div>
            <div className="h-3 w-24 bg-[#2a2a2a] rounded"></div>
          </div>
          <div className="h-4 w-4 bg-[#2a2a2a] rounded"></div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <div className="h-3 w-16 bg-[#2a2a2a] rounded"></div>
            <div className="h-3 w-6 bg-[#2a2a2a] rounded"></div>
          </div>
          <div className="h-1 w-full bg-[#2a2a2a] rounded-full">
            <div className="h-1 bg-[#3a3a3a] rounded-full" style={{ width: "30%" }}></div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-1">
            <div className="h-5 w-16 bg-[#2a2a2a] rounded"></div>
            <div className="h-5 w-12 bg-[#2a2a2a] rounded"></div>
          </div>
          <div className="h-3 w-20 bg-[#2a2a2a] rounded"></div>
        </div>
      </div>
    </div>
  )
} 