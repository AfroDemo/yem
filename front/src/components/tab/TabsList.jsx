const TabsList = ({ children, className = "" }) => {
    return (
      <div
        className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}
      >
        {children}
      </div>
    );
  };

  export default TabsList