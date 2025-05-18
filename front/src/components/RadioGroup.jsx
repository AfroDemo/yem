"use client";

import React from "react";

export function RadioGroup({ value, onValueChange, children, className = "" }) {
  return (
    <div role="radiogroup" className={`flex flex-col space-y-2 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            checked: child.props.value === value,
            onSelect: () => onValueChange(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
}

export function RadioGroupItem({
  value,
  id,
  checked,
  onSelect,
  children,
  disabled = false,
}) {
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        id={id}
        onClick={onSelect}
        disabled={disabled}
        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
          checked
            ? "border-primary bg-primary"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {checked && <div className="w-2 h-2 rounded-full bg-white"></div>}
      </button>
      <label
        htmlFor={id}
        className={`flex items-center text-sm ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {children}
      </label>
    </div>
  );
}
