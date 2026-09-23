function IconButton({ label, children, className = "", ...props }) {
  return (
    <button
      className={`ds-icon-button ${className}`.trim()}
      type="button"
      aria-label={label}
      {...props}
    >
      {children}
    </button>
  );
}

export default IconButton;