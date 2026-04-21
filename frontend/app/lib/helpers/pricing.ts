/**
 * getDiscountPercent(salePrice, regularPrice)
 *
 * Returns the discount as a whole-number percentage (e.g. 27 for 27% off),
 * or null when the discount cannot be meaningfully displayed.
 *
 * Returns null when:
 *  - Either input is null / undefined / NaN / Infinity
 *  - regularPrice ≤ 0 (can't divide by zero or negative base)
 *  - salePrice ≤ 0 (free / negative prices are not a standard discount)
 *  - salePrice ≥ regularPrice (no discount, or price increase)
 *  - Computed percent is 0 or negative
 *  - Computed percent exceeds 100 (data error)
 */
export function getDiscountPercent(
  salePrice: number | null | undefined,
  regularPrice: number | null | undefined
): number | null {
  // Reject null / undefined
  if (salePrice == null || regularPrice == null) return null;

  const sale    = Number(salePrice);
  const regular = Number(regularPrice);

  // Reject NaN, Infinity, non-finite
  if (!Number.isFinite(sale) || !Number.isFinite(regular)) return null;

  // Reject zero or negative base price
  if (regular <= 0) return null;

  // Reject zero or negative sale price
  if (sale <= 0) return null;

  // Reject when sale price is not actually lower
  if (sale >= regular) return null;

  const percent = Math.round((1 - sale / regular) * 100);

  // Reject 0%, negative, or implausibly high values
  if (percent <= 0 || percent > 100) return null;

  return percent;
}
