const CardDescription = ({ children, className = "" }) => {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
  );
};

export default CardDescription;