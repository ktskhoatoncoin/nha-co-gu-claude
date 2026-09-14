import Image from "next/image";
import Link from "next/link";

export interface ImageCardItem {
  href: string;
  name: string;
  description: string;
  image: string;
}

export default function ImageCardGrid({ items, aspect = "aspect-[4/5]" }: { items: ImageCardItem[]; aspect?: string }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="group block">
          <div className={`relative ${aspect} overflow-hidden rounded-md`}>
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(min-width: 1024px) 18vw, 40vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-ink/0" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-display text-lg text-paper">{item.name}</h3>
            </div>
          </div>
          <p className="mt-2 text-sm text-stone line-clamp-2">{item.description}</p>
        </Link>
      ))}
    </div>
  );
}
