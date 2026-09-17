import { ArticleBlock } from "@/lib/types";

export default function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i} className="ncg-h2 text-2xl pt-3">
                {block.text}
              </h2>
            );
          case "list":
            return (
              <ul key={i} className="space-y-2 pl-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-2 text-charcoal/90 leading-relaxed">
                    <span className="text-wood shrink-0">–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={i} className="border-l-2 border-wood pl-4 italic text-charcoal/80">
                {block.text}
              </blockquote>
            );
          default:
            return (
              <p key={i} className="text-charcoal/90 leading-relaxed">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
