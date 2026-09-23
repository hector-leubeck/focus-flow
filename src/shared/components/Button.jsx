function Button({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  ...props
}) {
  return (
    <button
      className={`ds-button ds-button-${variant} ds-button-${size} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;