import { describe, expect, it } from "vitest";

import {
  annualizedFundingPercent,
  basisPointSpread,
  classifyHealth,
  maintenanceHealthRatio,
} from "../src/analytics.js";

describe("market analytics", () => {
  it("annualizes an 8-hour funding rate", () => {
    expect(annualizedFundingPercent(0.0001, 28_800)).toBeCloseTo(10.95, 8);
  });

  it("treats zero maintenance requirement as no open-position risk", () => {
    const ratio = maintenanceHealthRatio(1_000_000n, 0n);
    expect(ratio).toBe(Number.POSITIVE_INFINITY);
    expect(classifyHealth(ratio)).toBe("no-position");
  });

  it("flags a thin maintenance buffer", () => {
    expect(classifyHealth(1.09)).toBe("low");
    expect(classifyHealth(1.3)).toBe("watch");
    expect(classifyHealth(2)).toBe("healthy");
  });

  it("computes a midpoint-normalized spread", () => {
    expect(basisPointSpread(99, 101)).toBeCloseTo(200, 8);
    expect(basisPointSpread(undefined, 101)).toBeUndefined();
    expect(basisPointSpread(102, 101)).toBeUndefined();
  });
});
