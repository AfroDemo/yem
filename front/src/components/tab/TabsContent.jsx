const TabsContent = ({ children, value, className = "" }) => {
    return (
      <div
        className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      >
        {children}
      </div>
    );
  };

  export default TabsContent