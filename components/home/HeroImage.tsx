"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

/**
 * The Hero image doubles as an "image map" reference sheet with small text
 * inside it, so it needs a full-size, undistorted lightbox rather than the
 * usual crop-to-fill hero treatment. Kept as its own client component so
 * Hero.tsx itself can stay a server component.
 */
export default function HeroImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative aspect-square w-full overflow-hidden rounded-lg cursor-zoom-in"
        aria-label={`${alt} — bấm để xem ảnh lớn`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 90vw"
          className="object-contain"
        />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-xs text-paper opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn className="size-3.5" />
          Xem lớn
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Đóng"
            className="fixed right-4 top-4 z-[110] rounded-full bg-paper/10 p-2.5 text-paper hover:bg-paper/20 transition-colors"
          >
            <X className="size-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative aspect-square w-[min(92vw,92vh)]"
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="92vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
