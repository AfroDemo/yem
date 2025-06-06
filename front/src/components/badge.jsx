const Badge = ({ children, variant = "default", className = "" }) => {
    const baseClasses =
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
    const variantClasses = {
      default:
        "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      outline:
        "border-border bg-background hover:bg-accent hover:text-accent-foreground",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    }[variant];
  
    return (
      <span className={`${baseClasses} ${variantClasses} ${className}`}>
        {children}
      </span>
    );
  };

  export default Badge