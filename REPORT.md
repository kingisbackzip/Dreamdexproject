# [Major] Stale close quantity can reverse a Perps position

## Summary

`closePosition()` reads `preview.closedQuantity` and stores it as `wanted`. It later reads
the position side and the order book before submitting `wanted` as a standard market order.
The order has no atomic reduce-only constraint.

If another action reduces the position between those reads and submission, `wanted` can be
larger than the remaining position. The excess does not stop at zero: it opens a position
in the opposite direction.

## Affected version

- Repository: `somnia-chain/dreamdex-bot-kit`
- Branch: `main`
- Commit: `25798660bbe4674a6f83a960b202852896e2fed4`
- File: `packages/perp-core/src/orders.ts`
- Verified unchanged on 21 October 2026

Affected sequence:

1. [`previewPerpClosePnl()` captures the quantity](https://github.com/somnia-chain/dreamdex-bot-kit/blob/25798660bbe4674a6f83a960b202852896e2fed4/packages/perp-core/src/orders.ts#L240-L258).
2. [`positionIn()` later determines only the closing side](https://github.com/somnia-chain/dreamdex-bot-kit/blob/25798660bbe4674a6f83a960b202852896e2fed4/packages/perp-core/src/orders.ts#L276-L284).
3. [The stale `wanted` quantity is submitted as a MARKET order](https://github.com/somnia-chain/dreamdex-bot-kit/blob/25798660bbe4674a6f83a960b202852896e2fed4/packages/perp-core/src/orders.ts#L289-L297).

## Severity

Suggested severity: **Major**.

The function is presented as a close/reduce primitive and is used by the starter, funding,
and guard strategies. Under a realistic overlap with a manual close, another bot instance,
or a triggered exit, it can create fresh leveraged exposure instead of reducing exposure.
That can cause unexpected margin use, trading loss, fees, funding payments, or liquidation.

No privileged access is required. The affected account only needs two legitimate actions
to overlap. The reproduction does not require a live chain or fabricated responses from
the protocol.

## Deterministic reproduction

Run:

```bash
npm install
npm test
```

The first regression test models this valid interleaving:

| Step | Signed position | Action |
|---|---:|---|
| 1 | `+10` | close preview returns `closedQuantity = 10` |
| 2 | `+10` | position read confirms long |
| 3 | `+2` | another legitimate sell closes 8 while the book is fetched |
| 4 | `-8` | stale close submits a normal sell for 10 |

The submitted SDK order has `quantity = 10`, `orderType = MARKET`, and no reduce-only field.
The test therefore ends at an unintended short position of 8 rather than flat.

## Root cause

This is a time-of-check/time-of-use error across multiple asynchronous reads and a write.
Re-reading and clamping in JavaScript narrows the window but cannot remove it: the position
can change after the last read and before transaction execution.

## Recommended remediation

Use an on-chain atomic close/reduce-only operation that clamps execution to the live
position at transaction execution time. The required invariant is:

```text
abs(position_after) <= abs(position_before)
and sign(position_after) never flips
```

If the protocol cannot express this for an immediate order, the bot should not label a
normal opposite-side market order as an unconditional close. As defense in depth:

1. cancel or coordinate competing exit mechanisms before closing;
2. re-read and clamp immediately before submission;
3. serialize close attempts per account and market; and
4. reconcile the resulting position after the receipt.

Only the first recommendation—atomic on-chain enforcement—fully closes the race.

## Safety

The included proof is a local state model. It uses no private key, RPC endpoint, wallet,
live order, or real funds.
