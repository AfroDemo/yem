import * as React from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

const DialogContext = React.createContext();

export function Dialog({ children, open, onOpenChange }) {
  const [isOpen, setIsOpen] = React.useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <DialogContext.Provider value={{ isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent({ children, className }) {
  const { isOpen, onOpenChange } = React.useContext(DialogContext);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-lg p-6 shadow-lg w-full max-w-lg ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export function DialogHeader({ children }) {
  return (
    <div className="flex justify-between items-start mb-4">{children}</div>
  );
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-semibold">{children}</h2>;
}

export function DialogClose({ children }) {
  const { onOpenChange } = React.useContext(DialogContext);

  return (
    <button
      className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
      onClick={() => onOpenChange(false)}
    >
      {children || <X className="h-4 w-4" />}
    </button>
  );
}

// Optional components you might want to add
export function DialogDescription({ children }) {
  return <p className="text-sm text-gray-500 mt-2">{children}</p>;
}

export function DialogFooter({ children }) {
  return <div className="mt-6 flex justify-end gap-2">{children}</div>;
}
