"use client";

import React from "react";

export function RadioGroup({
  value,
  onValueChange,
  children,
  className = "",
  ...props
}) {
  return (
    <div
      role="radiogroup"
      className={`flex flex-col space-y-3 ${className}`}
      {...props}
    >
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
  checked = false,
  onSelect,
  children,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <div className={`flex items-start space-x-3 ${className}`} {...props}>
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        id={id}
        onClick={onSelect}
        disabled={disabled}
        className={`
          mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center 
          transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
          ${
            checked
              ? "border-primary bg-primary"
              : "border-gray-300 hover:border-gray-400 bg-white"
          } 
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {checked && (
          <span className="block w-2.5 h-2.5 rounded-full bg-white"></span>
        )}
      </button>
      <label
        id={`${id}-label`}
        htmlFor={id}
        className={`flex flex-col text-base ${
          disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {children}
      </label>
    </div>
  );
}
