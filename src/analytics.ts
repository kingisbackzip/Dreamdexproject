export type HealthLevel = "no-position" | "healthy" | "watch" | "low";

const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;

/** Convert a funding fraction per protocol window into simple annualized percent. */
export function annualizedFundingPercent(ratePerWindow: number, windowSeconds: number): number {
  if (!Number.isFinite(ratePerWindow) || !Number.isFinite(windowSeconds) || windowSeconds <= 0) {
    throw new Error("Funding rate and window must be finite; window must be positive.");
  }
  return ratePerWindow * (SECONDS_PER_YEAR / windowSeconds) * 100;
}

/** Equity divided by maintenance margin. Infinity means there is no open-risk requirement. */
export function maintenanceHealthRatio(equity: bigint, maintenanceRequirement: bigint): number {
  if (maintenanceRequirement < 0n) throw new Error("Maintenance requirement cannot be negative.");
  if (maintenanceRequirement === 0n) return Number.POSITIVE_INFINITY;
  return Number(equity) / Number(maintenanceRequirement);
}

/** Conservative display bucket; the contract's own marginStatus remains authoritative. */
export function classifyHealth(ratio: number): HealthLevel {
  if (ratio === Number.POSITIVE_INFINITY) return "no-position";
  if (ratio < 1.1) return "low";
  if (ratio < 1.5) return "watch";
  return "healthy";
}

export function basisPointSpread(bid: number | undefined, ask: number | undefined): number | undefined {
  if (bid === undefined || ask === undefined || bid <= 0 || ask <= 0 || ask < bid) return undefined;
  const midpoint = (bid + ask) / 2;
  return ((ask - bid) / midpoint) * 10_000;
}
