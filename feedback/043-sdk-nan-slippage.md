# Quote helpers silently accept invalid slippage and trade-side values

Severity: normal
Area: SDK

## Steps to reproduce

1. Install the pinned dependencies from the repository root: `npm install --ignore-scripts --no-audit --no-fund` (SDK 0.32.1, viem 2.24.0).
2. With Node.js 24+, run `node --test --test-name-pattern='R2-06:' scripts/reproduce-round2.mjs`.
3. Inspect the named assertions and the [captured result](../evidence/round2/tests.tap). A passing test reproduces the reported behavior.

Also run `node --test --test-name-pattern=R2-17: scripts/reproduce-round2.mjs` for the side-validation case.

## Expected

The JSDoc describes this as the pre-trade guard: false when "the in-band liquidity can't cover the size — the caller should refuse the order rather than fill deep". A slippage that is not a finite, non-negative number should throw `InvalidInputError` or return `false`. A safety check should fail closed. `estimateMarketOrder` documents `null` for a non-positive amount, and should return `null` (or throw) for NaN too.

## Actual

For a synthetic book with bids `[[99,1]]` and asks `[[101,1],[150,1],[200,1]]`, a 3-unit buy returns false for slippage 0.01 but true for NaN or undefined. The NaN bound makes price-band comparisons false, so available depth alone determines success. This is a local quote-validation error; no live execution or loss was tested.

A second missing guard affects `side`: only the exact string `buy` consumes asks. With bids `[[99,10]]` and asks `[[101,0.1],[120,10]]`, a one-unit buy estimates 118.10 and fails a 5% slippage check. Passing `BUY` instead estimates 99.00 and passes by consuming bids. Both functions should validate side before choosing the book side.

## Evidence

Independently reproduced offline on 1 November 2026: tests `R2-06` and `R2-17` in the [included harness](../scripts/reproduce-round2.mjs), with [execution output](../evidence/round2/tests.tap).

See [source versions and test boundaries](../evidence/round2/README.md).

## Environment

SDK: `@somnia-chain/markets-sdk@0.32.1`, viem `2.24.0`; Node.js 24.22.1.

Network context: Somnia Tokyo testnet (Hideki, chain 50383); this reproduction runs offline. Wallet address: none; no signing or transactions.
