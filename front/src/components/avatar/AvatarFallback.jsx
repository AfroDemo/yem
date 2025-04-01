const AvatarFallback = ({ children, className = "" }) => {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}
    >
      {children}
    </div>
  );
};

export default AvatarFallback;