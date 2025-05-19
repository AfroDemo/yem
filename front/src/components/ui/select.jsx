"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export function Select({ value, onValueChange, children, ...props }) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);

  const handleTriggerClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={selectRef} {...props}>
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: handleTriggerClick,
            open,
            selectedValue: value,
          });
        }
        if (child.type === SelectContent) {
          return React.cloneElement(child, {
            open,
            selectedValue: value,
            onValueChange: (newValue) => {
              onValueChange(newValue);
              setOpen(false);
            },
          });
        }
        return child;
      })}
    </div>
  );
}

export function SelectTrigger({
  children,
  open,
  onClick,
  selectedValue,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (child.type === SelectValue) {
          return React.cloneElement(child, {
            selectedValue,
          });
        }
        return child;
      })}
      <ChevronDown
        className={`h-4 w-4 text-gray-500 transition-transform ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

export function SelectValue({ placeholder, selectedValue }) {
  return (
    <span className="truncate">
      {selectedValue ? (
        <span className="capitalize">{selectedValue.replace("-", " ")}</span>
      ) : (
        placeholder
      )}
    </span>
  );
}

export function SelectContent({
  children,
  open,
  selectedValue,
  onValueChange,
  className = "",
}) {
  if (!open) return null;

  return (
    <div
      className={`absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${className}`}
    >
      <div className="py-1">
        {React.Children.map(children, (child) => {
          if (child.type === SelectItem) {
            return React.cloneElement(child, {
              selected: child.props.value === selectedValue,
              onSelect: () => onValueChange(child.props.value),
            });
          }
          return child;
        })}
      </div>
    </div>
  );
}

export function SelectItem({
  value,
  children,
  selected,
  onSelect,
  className = "",
  ...props
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative cursor-default select-none py-2 pl-8 pr-4 text-gray-900 ${
        selected ? "bg-blue-50 text-blue-900" : "hover:bg-gray-100"
      } ${className}`}
      {...props}
    >
      {selected && (
        <span className="absolute left-2 flex h-5 w-5 items-center justify-center">
          <Check className="h-4 w-4 text-blue-600" />
        </span>
      )}
      <span className="block truncate capitalize">
        {children || value.replace("-", " ")}
      </span>
    </div>
  );
}
