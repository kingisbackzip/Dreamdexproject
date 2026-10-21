import { describe, expect, it } from "vitest";

import {
  affectedClosePosition,
  applyNormalFill,
  applyReduceOnlyFill,
  positionFromSigned,
} from "../src/repro.js";

const SYMBOL = "WBTC/USDso:USDso";
const POOL = "0x0000000000000000000000000000000000000001" as const;

describe("dreamdex-bot-kit stale close reproduction", () => {
  it("turns a 2-unit long into an unintended 8-unit short", async () => {
    let livePosition = 10n;

    const order = await affectedClosePosition({
      symbol: SYMBOL,
      pool: POOL,
      previewPerpClosePnl: async () => ({ priceable: true, closedQuantity: livePosition }),
      fetchPositions: async () => {
        const position = positionFromSigned(SYMBOL, livePosition);
        return position ? [position] : [];
      },
      fetchOrderBook: async () => {
        // A manual close, another bot, or a triggered stop reduces the position
        // after closePosition captured its quantity but before it submits.
        livePosition = applyNormalFill(livePosition, false, 8n);
        return { bids: [[100, 100]], asks: [[101, 100]] };
      },
      placePerpOrder: async (submitted) => {
        livePosition = applyNormalFill(livePosition, submitted.isBid, submitted.quantity);
      },
    });

    expect(order?.quantity).toBe(10n);
    expect(order).not.toHaveProperty("reduceOnly");
    expect(livePosition).toBe(-8n);
  });

  it("closes normally when the position does not change", async () => {
    let livePosition = 10n;
    await affectedClosePosition({
      symbol: SYMBOL,
      pool: POOL,
      previewPerpClosePnl: async () => ({ priceable: true, closedQuantity: livePosition }),
      fetchPositions: async () => [positionFromSigned(SYMBOL, livePosition)!],
      fetchOrderBook: async () => ({ bids: [[100, 100]], asks: [[101, 100]] }),
      placePerpOrder: async (submitted) => {
        livePosition = applyNormalFill(livePosition, submitted.isBid, submitted.quantity);
      },
    });

    expect(livePosition).toBe(0n);
  });

  it("shows that atomic reduce-only semantics prevent reversal", () => {
    const partiallyClosedLong = 2n;
    expect(applyReduceOnlyFill(partiallyClosedLong, false, 10n)).toBe(0n);
  });
});
