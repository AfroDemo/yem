"use client"

import { createContext, useContext, useState } from 'react'

// Context for tooltip state management
const TooltipContext = createContext(null)

export function TooltipProvider({ children }) {
  const [tooltipContent, setTooltipContent] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  return (
    <TooltipContext.Provider 
      value={{ tooltipContent, setTooltipContent, isOpen, setIsOpen, position, setPosition }}
    >
      {children}
    </TooltipContext.Provider>
  )
}

export function Tooltip({ children }) {
  return <>{children}</>
}

export function TooltipTrigger({ children }) {
  const { setTooltipContent, setIsOpen, setPosition } = useContext(TooltipContext)

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    })
    setIsOpen(true)
  }

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={handleMouseEnter}
      onBlur={() => setIsOpen(false)}
      className="inline-block"
    >
      {children}
    </span>
  )
}

export function TooltipContent({ children }) {
  const { isOpen, position } = useContext(TooltipContext)
  const [contentRef, setContentRef] = useState(null)

  // Calculate position with viewport boundary checks
  const calculatePosition = () => {
    if (!contentRef) return { left: position.x, top: position.y - 5 }

    const rect = contentRef.getBoundingClientRect()
    let left = position.x - rect.width / 2
    let top = position.y - rect.height - 10

    // Adjust if tooltip would go off screen
    if (left < 10) left = 10
    if (left + rect.width > window.innerWidth - 10) {
      left = window.innerWidth - rect.width - 10
    }
    if (top < 10) top = position.y + 20 // Flip to bottom if no space above

    return { left, top }
  }

  const positionStyles = calculatePosition()

  return isOpen ? (
    <div
      ref={setContentRef}
      className={`
        fixed z-50 max-w-xs px-3 py-2 text-sm bg-gray-800 text-white rounded-md shadow-lg
        transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}
      `}
      style={{
        left: `${positionStyles.left}px`,
        top: `${positionStyles.top}px`,
        transform: 'translateX(-50%)'
      }}
    >
      {children}
      <div 
        className="absolute w-3 h-3 bg-gray-800 rotate-45 -bottom-1 left-1/2 -translate-x-1/2"
        style={{ transform: 'translateX(-50%) rotate(45deg)' }}
      />
    </div>
  ) : null
}