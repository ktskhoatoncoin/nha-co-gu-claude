import type { LucideIcon } from "lucide-react";

/**
 * V2.1 — the single place a section heading gets its icon, accent colour and
 * weight. Used by the curator sidebar, dashboard, product detail and form so
 * all section headings stay visually identical.
 *
 * Icon sizing is handled by `.ncg-section-label svg` in globals.css (0.85em),
 * which keeps the mark smaller than the text it introduces at every size.
 */
export default function SectionLabel({
  icon: Icon,
  children,
  className = "",
  as: Tag = "h3",
}: {
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3" | "p";
}) {
  return (
    <Tag className={`ncg-section-label ${className}`}>
      {Icon && <Icon aria-hidden="true" />}
      <span>{children}</span>
    </Tag>
  );
}
