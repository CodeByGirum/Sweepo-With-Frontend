/**
 * Purpose: Input component for chat messages
 * Features: Message typing, auto-resize, sending
 * Used in: Chat panel component
 */

"use client"

import React, { useState, useEffect, KeyboardEvent, RefObject } from "react"
import { Send } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (content: string) => void
  className?: string
  textareaRef?: RefObject<HTMLTextAreaElement>
}

export function ChatInput({ onSendMessage, className, textareaRef: externalRef }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const internalRef = React.useRef<HTMLTextAreaElement>(null)
  
  // Use external ref if provided, otherwise use internal ref
  const textareaRef = externalRef || internalRef

  // Auto-resize textarea as content grows
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      const newHeight = Math.min(textarea.scrollHeight, 150)
      textarea.style.height = `${newHeight}px`
    }
  }, [message, textareaRef])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
      
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  return (
    <div className={`relative flex items-center bg-[#1a1a1a] rounded-lg ${className}`}>
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask, search, build anything..."
        className="w-full bg-transparent py-3 pl-4 pr-12 text-xs text-gray-300 focus:outline-none transition-colors resize-none min-h-[40px] max-h-[150px] overflow-y-auto"
        rows={1}
      />
      <button
        onClick={handleSendMessage}
        disabled={!message.trim()}
        className="absolute right-2 p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  )
} 