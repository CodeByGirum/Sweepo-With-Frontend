/**
 * Purpose: Display and interact with the chat interface
 * Features: Message display, input, context addition, docking controls
 * Used in: ChatPanelContainer component
 */

"use client"

import { useState, useRef, useEffect } from "react"
import { X, ChevronDown } from "lucide-react"
import { ChatInput } from "./chat-input"
import { ContextInput } from "./context-input"
import type { DockPosition, Message } from "../types"

interface ChatPanelProps {
  onClose: () => void
  onDockChange: (position: DockPosition) => void
  dockPosition: DockPosition
  chatRef: React.RefObject<HTMLDivElement>
  chatHeaderRef: React.RefObject<HTMLDivElement>
  resizeHandleRef: React.RefObject<HTMLDivElement>
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export function ChatPanel({
  onClose,
  onDockChange,
  dockPosition,
  chatRef,
  chatHeaderRef,
  resizeHandleRef,
  messages,
  setMessages,
  messagesEndRef
}: ChatPanelProps) {
  const [contextExpanded, setContextExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setIsTyping(true);

    // Simulate assistant response
    setTimeout(() => {
      setIsTyping(false);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'll help you clean that data right away. Let me analyze the issues first.",
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const handleAddContext = (context: string) => {
    if (!context.trim()) return;
    
    // Add context as a system message
    const contextMessage: Message = {
      id: Date.now().toString(),
      content: `Context: ${context}`,
      sender: "system",
      timestamp: new Date(),
    }
    
    setMessages([...messages, contextMessage]);
    setContextExpanded(false);
  }

  return (
    <>
      <div ref={chatHeaderRef} className="border-b border-[#2a2a2a] p-3 flex justify-between items-center cursor-move">
        <h3 className="text-sm font-medium">Chat</h3>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#1a1a1a] rounded-md mr-1">
            <button
              className={`p-1 rounded-l-md ${dockPosition === "left" ? "bg-[#2a2a2a] text-white" : "text-gray-400 hover:text-white"} transition-colors`}
              onClick={() => onDockChange("left")}
              title="Dock to left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
              </svg>
            </button>
            <button
              className={`p-1 ${dockPosition === "bottom" ? "bg-[#2a2a2a] text-white" : "text-gray-400 hover:text-white"} transition-colors`}
              onClick={() => onDockChange("bottom")}
              title="Dock to bottom"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="15" x2="21" y2="15"></line>
              </svg>
            </button>
            <button
              className={`p-1 rounded-r-md ${dockPosition === "right" ? "bg-[#2a2a2a] text-white" : "text-gray-400 hover:text-white"} transition-colors`}
              onClick={() => onDockChange("right")}
              title="Dock to right"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
            </button>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col h-full">
        {/* Context button */}
        <div className="p-2 border-b border-[#2a2a2a]">
          <button
            onClick={() => setContextExpanded(!contextExpanded)}
            className="flex items-center justify-between w-full bg-[#1a1a1a] p-2 rounded text-xs text-gray-400 hover:text-white transition-colors"
          >
            <span>Add context</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${contextExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          {contextExpanded && (
            <div className="mt-2">
              <ContextInput onAddContext={handleAddContext} className="mb-2" />
            </div>
          )}
        </div>
        
        {/* Message container with scrolling */}
        <div className="flex-1 p-3 overflow-y-auto scrollbar-thin">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col animate-fadeIn">
                <div
                  className={`${
                    message.sender === "user" 
                      ? "bg-[#1a1a1a] ml-6" 
                      : message.sender === "system"
                        ? "bg-blue-900/20 text-blue-200" 
                        : "bg-[#2a2a2a] mr-6"
                  } rounded-lg p-3 text-xs`}
                >
                  <p className="text-gray-300 whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.sender !== "system" && (
                  <span className="text-gray-500 text-xs mt-1">
                    {message.sender === "user" ? "You" : "Sweepo Assistant"} • {formatTimestamp(message.timestamp)}
                  </span>
                )}
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-500 text-xs">
                <span>Sweepo is typing</span>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            
            {/* Empty div for scrolling to bottom */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="p-4 pb-5 pt-2 relative z-10 border-t border-[#2a2a2a]">
        <ChatInput onSendMessage={handleSendMessage} textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>} className="relative z-20" />
        {/* Gradient overlay to create seamless transition */}
        <div
          className="absolute left-0 right-0 bottom-full h-8 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none"
          style={{ zIndex: 10 }}
        ></div>
      </div>

      {/* Resize handle */}
      <div
        className={`resize-handle absolute ${
          dockPosition === "left"
            ? "top-0 right-0 w-1 h-full cursor-ew-resize"
            : dockPosition === "right"
              ? "top-0 left-0 w-1 h-full cursor-ew-resize"
              : "top-0 left-0 w-full h-1 cursor-ns-resize"
        } bg-[#2a2a2a] hover:bg-blue-500 opacity-0 hover:opacity-100 transition-opacity`}
        title="Drag to resize"
        ref={resizeHandleRef}
      ></div>
    </>
  )
}

// Helper function to format timestamps
function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins === 1) return '1 min ago';
  if (diffMins < 60) return `${diffMins} mins ago`;
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
} 