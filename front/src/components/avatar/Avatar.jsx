const Avatar = ({ children, className = "" }) => {
    return (
      <div
        className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
      >
        {children}
      </div>
    );
  };

export default Avatar