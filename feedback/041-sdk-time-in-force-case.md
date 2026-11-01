# Lowercase timeInForce silently selects a GTC limit order

Severity: normal
Area: SDK

## Steps to reproduce

1. Install the pinned dependencies from the repository root: `npm install --ignore-scripts --no-audit --no-fund` (SDK 0.32.1, viem 2.24.0).
2. With Node.js 24+, run `node --test --test-name-pattern='R2-04:' scripts/reproduce-round2.mjs`.
3. Inspect the named assertions and the [captured result](../evidence/round2/tests.tap). A passing test reproduces the reported behavior.

The harness executes the actual source branch/function with synthetic boundaries; it does not send an order or connect to a node.

## Expected

`timeInForce` that is not one of `"GTC" | "IOC" | "FOK" | "PO"` throws `InvalidInputError`, as `createOrder` already does for a missing limit price or a sub-lot amount. Or it is normalized case-insensitively. It should never become a different order type.

## Actual

The shipped order-type selection maps `IOC` to MARKET (2), `FOK` to FILL_OR_KILL (1), and `PO` to POST_ONLY (3). Lowercase equivalents fall through to LIMIT (0), without validation. This creates GTC semantics rather than the requested immediate or post-only semantics.

The test executes the exact selection branch. It does not submit an order or demonstrate a live fill. These invalid strings are outside the TypeScript union but remain possible at JavaScript/configuration boundaries.

## Evidence

Independently reproduced offline on 1 November 2026: test `R2-04` in the [included harness](../scripts/reproduce-round2.mjs), with [execution output](../evidence/round2/tests.tap).

See [source versions and test boundaries](../evidence/round2/README.md).

## Environment

SDK: `@somnia-chain/markets-sdk@0.32.1`, viem `2.24.0`; Node.js 24.22.1.

Network context: Somnia Tokyo testnet (Hideki, chain 50383); this reproduction runs offline. Wallet address: none; no signing or transactions.
