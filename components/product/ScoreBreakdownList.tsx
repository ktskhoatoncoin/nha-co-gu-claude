import { ScoreBreakdown } from "@/lib/types";

const labels: Record<keyof ScoreBreakdown, string> = {
  design: "Thiết kế",
  price: "Giá",
  function: "Công năng",
  material: "Chất liệu",
  value: "Đáng tiền",
  content: "Tiềm năng nội dung",
};

export default function ScoreBreakdownList({ scores }: { scores: ScoreBreakdown }) {
  const keys = Object.keys(scores) as (keyof ScoreBreakdown)[];
  return (
    <dl className="space-y-3">
      {keys.map((key) => (
        <div key={key} className="flex items-center gap-3">
          <dt className="w-36 shrink-0 text-sm text-charcoal/80">{labels[key]}</dt>
          <div className="flex-1 h-1.5 rounded-full bg-linen overflow-hidden">
            <div className="h-full rounded-full bg-wood" style={{ width: `${(scores[key] / 10) * 100}%` }} />
          </div>
          <dd className="w-10 text-right text-sm font-medium text-ink">{scores[key]}/10</dd>
        </div>
      ))}
    </dl>
  );
}
