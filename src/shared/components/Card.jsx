function Card({ as: Component = "div", children, className = "", ...props }) {
  return (
    <Component className={`ds-card ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

export default Card;