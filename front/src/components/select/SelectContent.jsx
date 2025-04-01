const SelectContent = ({ children, className = "" }) => {
  return (
    <div
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 ${className}`}
    >
      {children}
    </div>
  );
};

export default SelectContent;