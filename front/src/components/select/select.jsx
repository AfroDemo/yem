import { useState, createContext, useContext } from "react";

const SelectContext = createContext();

const Select = ({ children, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ isOpen, setIsOpen }}>
      <div className={`relative ${className}`}>{children}</div>
    </SelectContext.Provider>
  );
};

export default Select;
export const useSelect = () => useContext(SelectContext);
