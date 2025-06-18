"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SimpleTooltipProps {
  content: string
  children: ReactNode
  className?: string
}

export function SimpleTooltip({ content, children, className }: SimpleTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isTooltipHovered, setIsTooltipHovered] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleTriggerEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(true)
  }

  const handleTriggerLeave = () => {
    timeoutRef.current = setTimeout(() => {
      if (!isTooltipHovered) {
        setIsVisible(false)
      }
    }, 100)
  }

  const handleTooltipEnter = () => {
    setIsTooltipHovered(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleTooltipLeave = () => {
    setIsTooltipHovered(false)
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, 100)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className={cn("relative inline-block", className)}>
      <div onMouseEnter={handleTriggerEnter} onMouseLeave={handleTriggerLeave}>
        {children}
      </div>
      <div
        className={cn(
          "absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg transition-opacity duration-200 z-50 max-w-md min-w-32 text-left leading-relaxed select-text whitespace-normal break-words",
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onMouseEnter={handleTooltipEnter}
        onMouseLeave={handleTooltipLeave}
      >
        {content}
        <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
      </div>
    </div>
  )
}
