/**
 * Purpose: Container for chat panel with positioning and resizing capability
 * Features: Dockable panel, resize handles, drag and drop
 * Used in: Main dashboard component
 */

"use client"

import React, { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChatPanel } from "./chat-panel"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import type { DockPosition, Message } from "../types"

interface ChatPanelContainerProps {
  show: boolean
  dockPosition: DockPosition
  width?: number
  height?: number
  chatRef: React.RefObject<HTMLDivElement | null>
  chatHeaderRef: React.RefObject<HTMLDivElement | null>
  resizeHandleRef: React.RefObject<HTMLDivElement | null>
  onClose: () => void
  onDockChange: (position: DockPosition) => void
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

export function ChatPanelContainer({
  show,
  dockPosition,
  width = 320,
  height = 300,
  chatRef,
  chatHeaderRef,
  resizeHandleRef,
  onClose,
  onDockChange,
  messages,
  setMessages,
}: ChatPanelContainerProps) {
  const startResizeRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dockIndicators, setDockIndicators] = useState<{left: boolean, right: boolean, bottom: boolean}>({
    left: false,
    right: false,
    bottom: false
  });
  
  // Chat position animation variants
  const chatVariants: Record<DockPosition, any> = {
    left: {
      initial: { x: -300, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -300, opacity: 0 },
    },
    right: {
      initial: { x: 300, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 300, opacity: 0 },
    },
    bottom: {
      initial: { y: 300, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 300, opacity: 0 },
    },
    none: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    }
  };
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Handle resize functionality
  useEffect(() => {
    // Handle resize drag start
    const handleResizeStart = (e: MouseEvent) => {
      e.preventDefault();
      const rect = chatRef.current?.getBoundingClientRect();
      
      if (rect) {
        startResizeRef.current = {
          x: e.clientX,
          y: e.clientY,
          width: rect.width,
          height: rect.height
        };
        
        document.addEventListener('mousemove', handleResizeMove);
        document.addEventListener('mouseup', handleResizeEnd);
      }
    };
    
    // Handle resize drag move
    const handleResizeMove = (e: MouseEvent) => {
      e.preventDefault();
      if (!startResizeRef.current || !chatRef.current) return;
      
      const dx = e.clientX - startResizeRef.current.x;
      const dy = e.clientY - startResizeRef.current.y;
      
      if (dockPosition === 'left') {
        const newWidth = startResizeRef.current.width + dx;
        chatRef.current.style.width = `${Math.max(250, newWidth)}px`;
      } else if (dockPosition === 'right') {
        const newWidth = startResizeRef.current.width - dx;
        chatRef.current.style.width = `${Math.max(250, newWidth)}px`;
      } else if (dockPosition === 'bottom') {
        const newHeight = startResizeRef.current.height - dy;
        chatRef.current.style.height = `${Math.max(200, newHeight)}px`;
      }
    };
    
    // Handle resize end
    const handleResizeEnd = () => {
      startResizeRef.current = null;
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
    
    const resizeHandle = resizeHandleRef.current;
    
    if (resizeHandle) {
      resizeHandle.addEventListener('mousedown', handleResizeStart);
    }
    
    return () => {
      if (resizeHandle) {
        resizeHandle.removeEventListener('mousedown', handleResizeStart);
      }
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [chatRef, dockPosition, resizeHandleRef]);
  
  // Handle drag and drop functionality
  useEffect(() => {
    const header = chatHeaderRef.current;
    if (!header || !chatRef.current) return;
    
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    
    const handleMouseDown = (e: MouseEvent) => {
      // Ignore if clicking on a button
      if ((e.target as HTMLElement).closest('button')) return;
      
      setIsDragging(true);
      startX = e.clientX;
      startY = e.clientY;
      
      const chatElement = chatRef.current;
      if (!chatElement) return;
      
      const rect = chatElement.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !chatRef.current) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const chatElement = chatRef.current;
      
      // Calculate new position
      const newLeft = startLeft + deltaX;
      const newTop = startTop + deltaY;
      
      // Check proximity to edges for docking indicators
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Show docking indicators based on proximity
      const newDockIndicators = {
        left: newLeft < 50,
        right: newLeft + chatElement.offsetWidth > windowWidth - 50,
        bottom: newTop + chatElement.offsetHeight > windowHeight - 50
      };
      
      setDockIndicators(newDockIndicators);
      
      // Update position
      chatElement.style.position = 'fixed';
      chatElement.style.left = `${newLeft}px`;
      chatElement.style.top = `${newTop}px`;
      chatElement.style.zIndex = '999';
    };
    
    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Check if should dock based on indicators
      if (dockIndicators.left) {
        onDockChange('left');
      } else if (dockIndicators.right) {
        onDockChange('right');
      } else if (dockIndicators.bottom) {
        onDockChange('bottom');
      }
      
      // Reset indicators
      setDockIndicators({ left: false, right: false, bottom: false });
      
      // Reset any fixed positioning
      if (chatRef.current) {
        chatRef.current.style.position = '';
        chatRef.current.style.left = '';
        chatRef.current.style.top = '';
        chatRef.current.style.zIndex = '';
      }
    };
    
    header.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      header.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [chatRef, chatHeaderRef, isDragging, dockIndicators, onDockChange]);
  
  if (!show) return null;

  return (
    <>
      {/* Docking indicators */}
      {isDragging && (
        <>
          <div 
            className="fixed left-0 top-0 w-1 h-full bg-blue-500 transition-opacity z-50"
            style={{ opacity: dockIndicators.left ? 1 : 0.3 }}
          />
          <div 
            className="fixed right-0 top-0 w-1 h-full bg-blue-500 transition-opacity z-50"
            style={{ opacity: dockIndicators.right ? 1 : 0.3 }}
          />
          <div 
            className="fixed left-0 bottom-0 w-full h-1 bg-blue-500 transition-opacity z-50"
            style={{ opacity: dockIndicators.bottom ? 1 : 0.3 }}
          />
        </>
      )}
      
      <motion.div
        ref={chatRef}
        variants={chatVariants[dockPosition]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        className={`bg-[#121212] border-[#2a2a2a] flex flex-col ${
          dockPosition === "left"
            ? "border-r h-full"
            : dockPosition === "right"
            ? "border-l h-full"
            : "border-t h-64 w-full"
        } resize-transition`}
        style={{ 
          width: dockPosition !== "bottom" ? width : "auto", 
          height: dockPosition === "bottom" ? height : "auto"
        }}
      >
        <ChatPanel
          onClose={onClose}
          onDockChange={onDockChange}
          dockPosition={dockPosition}
          chatRef={chatRef as unknown as React.RefObject<HTMLDivElement>}
          chatHeaderRef={chatHeaderRef as unknown as React.RefObject<HTMLDivElement>}
          messages={messages}
          setMessages={setMessages}
          messagesEndRef={messagesEndRef}
        />
        
        {/* Resize handle */}
        <div
          className={`absolute ${
            dockPosition === "left"
              ? "top-0 right-0 w-1 h-full cursor-ew-resize"
              : dockPosition === "right"
              ? "top-0 left-0 w-1 h-full cursor-ew-resize"
              : "top-0 left-0 w-full h-1 cursor-ns-resize"
          } bg-[#2a2a2a] hover:bg-blue-500 opacity-0 hover:opacity-100 transition-opacity`}
          ref={resizeHandleRef}
        />
      </motion.div>
    </>
  )
} 