import Image from "next/image";
import Link from "next/link";
import { Article } from "@/lib/types";
import { timeAgoOrDate } from "@/lib/format";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/blog/${article.slug}`} className="group block">
      <div className="relative aspect-16/10 overflow-hidden rounded-md border border-linen bg-ivory">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          sizes="(min-width: 1024px) 30vw, 90vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <p className="ncg-eyebrow mt-3 text-xs tracking-wide">{article.category}</p>
      <h3 className="ncg-h3 mt-1 text-xl leading-snug group-hover:text-wood transition-colors">
        {article.title}
      </h3>
      <p className="mt-2 text-sm text-stone line-clamp-2">{article.excerpt}</p>
      <p className="mt-2 text-xs text-stone">
        {timeAgoOrDate(article.date)} · {article.readingTimeMinutes} phút đọc
      </p>
    </Link>
  );
}
