import { useSelect } from "./select"; // adjust path as needed

const SelectTrigger = ({ children, className = "" }) => {
  const { isOpen, setIsOpen } = useSelect();

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

export default SelectTrigger;