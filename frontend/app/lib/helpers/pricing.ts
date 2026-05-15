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

/**
 * isSaleDateActive(datesFrom, datesTo)
 *
 * Returns true when the current date falls within the sale window.
 * Rules:
 *  - If both dates are empty/null → sale is always active (no date restriction)
 *  - If only datesFrom is set → active on or after that date
 *  - If only datesTo is set   → active on or before that date
 *  - If both are set          → active when today is between them (inclusive)
 */
export function isSaleDateActive(
  datesFrom: string | null | undefined,
  datesTo: string | null | undefined
): boolean {
  const hasFrom = !!datesFrom;
  const hasTo   = !!datesTo;

  // No date restriction — always active
  if (!hasFrom && !hasTo) return true;

  const today = new Date();
  // Compare date-only (strip time) to avoid timezone edge cases
  today.setHours(0, 0, 0, 0);

  if (hasFrom) {
    const from = new Date(datesFrom!);
    from.setHours(0, 0, 0, 0);
    if (today < from) return false;
  }

  if (hasTo) {
    const to = new Date(datesTo!);
    to.setHours(0, 0, 0, 0);
    if (today > to) return false;
  }

  return true;
}
