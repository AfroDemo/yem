"use client"

import React, { useState } from 'react'

export function RadioGroup({ defaultValue, onValueChange, children, className = '' }) {
  const [value, setValue] = useState(defaultValue)

  const handleChange = (newValue) => {
    setValue(newValue)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isSelected: child.props.value === value,
            onSelect: () => handleChange(child.props.value)
          })
        }
        return child
      })}
    </div>
  )
}

export function RadioGroupItem({ value, id, children, isSelected, onSelect }) {
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        role="radio"
        aria-checked={isSelected}
        id={id}
        onClick={onSelect}
        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
          isSelected ? 'border-primary' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {isSelected && <div className="w-2 h-2 rounded-full bg-primary"></div>}
      </button>
      {children}
    </div>
  )
}