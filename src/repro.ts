import { ORDER_TYPE, type PlacePerpOrderParams } from "@somnia-chain/markets-sdk";

export type PositionSide = "long" | "short";

export type Position = {
  symbol: string;
  side: PositionSide;
  quantity: bigint;
};

export type Book = {
  bids: Array<[number, number]>;
  asks: Array<[number, number]>;
};

export interface AffectedCloseDependencies {
  symbol: string;
  pool: `0x${string}`;
  previewPerpClosePnl(): Promise<{ priceable: boolean; closedQuantity: bigint }>;
  fetchPositions(): Promise<Position[]>;
  fetchOrderBook(): Promise<Book>;
  placePerpOrder(order: PlacePerpOrderParams): Promise<void>;
}

/**
 * Minimal extraction of dreamdex-bot-kit's affected close sequence.
 *
 * The important ordering is preserved: the quantity comes from the first
 * preview, the side from a later position read, and an additional book read
 * occurs before the market order is submitted.
 */
export async function affectedClosePosition(
  deps: AffectedCloseDependencies,
): Promise<PlacePerpOrderParams | undefined> {
  const preview = await deps.previewPerpClosePnl();
  if (!preview.priceable || preview.closedQuantity <= 0n) return undefined;

  const wanted = preview.closedQuantity;
  const position = (await deps.fetchPositions()).find((item) => item.symbol === deps.symbol);
  if (!position) return undefined;

  const closingIsBid = position.side === "short";
  const book = await deps.fetchOrderBook();
  const touch = closingIsBid ? book.asks[0]?.[0] : book.bids[0]?.[0];
  if (touch === undefined) return undefined;

  const order: PlacePerpOrderParams = {
    pool: deps.pool,
    isBid: closingIsBid,
    price: BigInt(Math.round(touch * 1e18)),
    quantity: wanted,
    orderType: ORDER_TYPE.MARKET,
  };
  await deps.placePerpOrder(order);
  return order;
}

/** Positive is long, negative is short. A normal fill may cross through zero. */
export function applyNormalFill(position: bigint, isBid: boolean, quantity: bigint): bigint {
  return isBid ? position + quantity : position - quantity;
}

/** The safety property expected from an atomic reduce-only close. */
export function applyReduceOnlyFill(position: bigint, isBid: boolean, quantity: bigint): bigint {
  if (position > 0n && !isBid) return position - (quantity < position ? quantity : position);
  if (position < 0n && isBid) {
    const shortQuantity = -position;
    return position + (quantity < shortQuantity ? quantity : shortQuantity);
  }
  return position;
}

export function positionFromSigned(symbol: string, signedQuantity: bigint): Position | undefined {
  if (signedQuantity === 0n) return undefined;
  return {
    symbol,
    side: signedQuantity > 0n ? "long" : "short",
    quantity: signedQuantity > 0n ? signedQuantity : -signedQuantity,
  };
}
