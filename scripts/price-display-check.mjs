import assert from "node:assert/strict";

function getDisplayOriginalPrice(price, originalPrice) {
  if (!Number.isFinite(price) || price <= 0) return null;
  if (originalPrice == null || !Number.isFinite(originalPrice) || originalPrice <= price) return null;
  return originalPrice;
}

const cases = [
  [349000, 429000, 429000],
  [349000, null, null],
  [349000, 349000, null],
  [349000, 299000, null],
  [0, 429000, null],
  [NaN, 429000, null],
  [349000, NaN, null],
];

for (const [price, originalPrice, expected] of cases) {
  assert.equal(getDisplayOriginalPrice(price, originalPrice), expected);
}

console.log(`price-display-check: PASS (${cases.length} cases)`);
