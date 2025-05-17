import { useSelect } from "./select"; // adjust path as needed

const SelectContent = ({ children, className = "" }) => {
  const { isOpen } = useSelect();

  if (!isOpen) return null;

  return (
    <div
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 ${className}`}
    >
      {children}
    </div>
  );
};

export default SelectContent;
