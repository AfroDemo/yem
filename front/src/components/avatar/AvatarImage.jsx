const AvatarImage = ({ src, alt, className = "" }) => {
    return (
      <img
        src={src}
        alt={alt}
        className={`aspect-square h-full w-full ${className}`}
      />
    );
  };

  export default AvatarImage