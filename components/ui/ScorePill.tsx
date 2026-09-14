export default function ScorePill({ score, size = "sm" }: { score: number; size?: "sm" | "lg" }) {
  const isLarge = size === "lg";
  return (
    <div
      className={`inline-flex items-baseline gap-1 rounded-full border border-linen bg-paper ${
        isLarge ? "px-4 py-2" : "px-2.5 py-1"
      }`}
      aria-label={`Điểm Nhà Có Gu ${score} trên 10`}
    >
      <span className={`font-display text-wood ${isLarge ? "text-2xl" : "text-sm"}`}>{score.toFixed(1)}</span>
      <span className={`text-stone ${isLarge ? "text-sm" : "text-[10px]"}`}>/10</span>
    </div>
  );
}
