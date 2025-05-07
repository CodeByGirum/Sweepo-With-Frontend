/**
 * Purpose: Input for adding additional context to the chat
 * Features: Expandable textarea for entering additional information
 * Used in: Chat panel component
 */

"use client"

import { useState } from "react"

interface ContextInputProps {
  onAddContext: (context: string) => void
  className?: string
}

export function ContextInput({ onAddContext, className }: ContextInputProps) {
  const [context, setContext] = useState("")

  const handleSubmit = () => {
    if (context.trim()) {
      onAddContext(context)
      setContext("")
    }
  }

  return (
    <div className={`bg-[#1a1a1a] rounded-lg p-2 text-xs ${className || ""}`}>
      <textarea
        value={context}
        onChange={(e) => setContext(e.target.value)}
        placeholder="Add additional context for the assistant..."
        className="w-full bg-[#121212] rounded p-2 text-xs text-gray-300 focus:outline-none transition-colors resize-none min-h-[60px]"
        rows={3}
      />
      <div className="flex justify-end mt-2">
        <button
          onClick={handleSubmit}
          disabled={!context.trim()}
          className="bg-[#2a2a2a] text-xs px-3 py-1 rounded hover:bg-[#3a3a3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </div>
  )
} 