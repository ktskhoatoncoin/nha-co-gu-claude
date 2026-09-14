import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHeading({
  title,
  subtitle,
  cta,
}: {
  title: string;
  subtitle?: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
      <div className="max-w-2xl">
        <h2 className="font-display text-2xl sm:text-3xl text-ink">{title}</h2>
        {subtitle && <p className="mt-2 text-stone">{subtitle}</p>}
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex items-center gap-1.5 text-sm text-wood hover:text-wood-dark shrink-0"
        >
          {cta.label}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
