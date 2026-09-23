function SectionHeader({
  eyebrow,
  title,
  description,
  children,
  className = "",
}) {
  return (
    <section className={`ds-section-header ${className}`.trim()}>
      <div>
        <p className="ds-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {description ? (
        <p className="ds-section-header-description">{description}</p>
      ) : null}
      {children}
    </section>
  );
}

export default SectionHeader;
