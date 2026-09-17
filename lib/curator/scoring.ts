import { GuScoreBreakdown } from "@/lib/curator/types";

/** Weights sum to 1.0. Changing these changes every product's GU Score,
 *  so they live in exactly one place. */
export const GU_SCORE_WEIGHTS: Record<keyof GuScoreBreakdown, number> = {
  visual: 0.3,
  style: 0.25,
  quality: 0.2,
  value: 0.15,
  editorial: 0.1,
};

export const scoreLabels: Record<keyof GuScoreBreakdown, string> = {
  visual: "Visual",
  style: "Style",
  quality: "Quality",
  value: "Value",
  editorial: "Editorial",
};

export const scoreDescriptions: Record<keyof GuScoreBreakdown, string> = {
  visual: "Sản phẩm có đẹp trong ảnh và ngoài đời không",
  style: "Mức độ rõ ràng về phong cách, dễ phối hay không",
  quality: "Chất liệu, hoàn thiện, độ bền cảm nhận được",
  value: "Mức giá có tương xứng với thứ nhận được không",
  editorial: "Tiềm năng kể chuyện, lên bài, lên hình",
};

export const scoreKeys = Object.keys(GU_SCORE_WEIGHTS) as (keyof GuScoreBreakdown)[];

/** Weighted GU Score on a 0–100 scale, rounded to a whole number. */
export function computeGuScore(scores: GuScoreBreakdown): number {
  const total = scoreKeys.reduce((sum, key) => sum + clampScore(scores[key]) * GU_SCORE_WEIGHTS[key], 0);
  return Math.round(total);
}

export function clampScore(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export type GuTier = "Exceptional" | "Highly Recommended" | "Good" | "Consider" | "Not Recommended";

export function getGuTier(score: number): GuTier {
  if (score >= 90) return "Exceptional";
  if (score >= 80) return "Highly Recommended";
  if (score >= 70) return "Good";
  if (score >= 60) return "Consider";
  return "Not Recommended";
}

/** Tier styling stays typographic and neutral — no neon score badges. */
export const tierStyles: Record<GuTier, string> = {
  Exceptional: "text-wood",
  "Highly Recommended": "text-ink",
  Good: "text-charcoal",
  Consider: "text-stone",
  "Not Recommended": "text-stone",
};
