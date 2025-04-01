const CardFooter = ({ children, className = "" }) => {
    return (
      <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>
    );
  };

  export default CardFooter