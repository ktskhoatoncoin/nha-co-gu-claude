import { getGuTier, tierStyles } from "@/lib/curator/scoring";

export default function GuScoreDisplay({
  score,
  size = "md",
  showTier = true,
}: {
  score: number;
  size?: "sm" | "md" | "lg";
  showTier?: boolean;
}) {
  const tier = getGuTier(score);

  if (size === "sm") {
    return (
      <span className="inline-flex items-baseline gap-1" aria-label={`GU Score ${score} trên 100`}>
        <span className={`ncg-h3 ncg-figure text-base leading-none ${tierStyles[tier]}`}>{score}</span>
        <span className="ncg-label text-[10px] text-stone">/100</span>
      </span>
    );
  }

  if (size === "lg") {
    return (
      <div aria-label={`GU Score ${score} trên 100, xếp loại ${tier}`}>
        <p className="ncg-eyebrow text-[11px] tracking-[0.18em]">GU Score</p>
        <p className="mt-1 flex items-baseline gap-1.5">
          <span className={`ncg-h1 ncg-figure text-6xl leading-none ${tierStyles[tier]}`}>{score}</span>
          <span className="ncg-label text-lg text-stone">/100</span>
        </p>
        {showTier && <p className="ncg-label mt-2 text-sm text-charcoal">{tier}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-1.5" aria-label={`GU Score ${score} trên 100`}>
      <span className={`ncg-h2 ncg-figure text-2xl leading-none ${tierStyles[tier]}`}>{score}</span>
      <span className="ncg-label text-xs text-stone">/100</span>
      {showTier && <span className="ncg-label ml-1 text-xs text-stone">{tier}</span>}
    </div>
  );
}
