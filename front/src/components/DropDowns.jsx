"use client"

import React, { useState, useRef, useEffect } from 'react'

export function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        if (triggerRef.current && !triggerRef.current.contains(event.target)) {
          setIsOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Find trigger and content in children
  let trigger = null
  let content = null
  
  React.Children.forEach(children, child => {
    if (child.type === DropdownMenuTrigger) {
      trigger = child
    } else if (child.type === DropdownMenuContent) {
      content = child
    }
  })

  return (
    <div className="relative">
      {trigger && React.cloneElement(trigger, {
        isOpen,
        onClick: () => setIsOpen(!isOpen),
        ref: triggerRef
      })}
      
      {isOpen && content && React.cloneElement(content, {
        ref: contentRef,
        isOpen,
        onClose: () => setIsOpen(false)
      })}
    </div>
  )
}

export function DropdownMenuTrigger({ children, isOpen, onClick, ref, asChild }) {
  if (asChild) {
    const onlyChild = React.Children.only(children)
    return React.cloneElement(onlyChild, {
      onClick,
      ref
    })
  }

  return (
    <button
      ref={ref}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({ children, align = 'start', isOpen, ref }) {
  const alignmentClasses = {
    start: 'left-0',
    end: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  }

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${alignmentClasses[align]}`}
    >
      <div className="py-1">
        {children}
      </div>
    </div>
  )
}

export function DropdownMenuItem({ children, className = '', ...props }) {
  return (
    <button
      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}