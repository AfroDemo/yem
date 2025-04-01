const Tabs = ({ defaultValue, children, className = "" }) => {
    return (
      <div className={`${className}`} defaultValue={defaultValue}>
        {children}
      </div>
    );
  };

  export default Tabs