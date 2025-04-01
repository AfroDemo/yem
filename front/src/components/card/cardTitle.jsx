const CardTitle = ({ children, className = "" }) => {
    return (
      <h3
        className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      >
        {children}
      </h3>
    );
  };

  export default CardTitle