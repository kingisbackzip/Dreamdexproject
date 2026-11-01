# Trailing-24h candle statistics omit the partial first hour

Severity: normal
Area: SDK

## Steps to reproduce

1. Install the pinned dependencies from the repository root: `npm install --ignore-scripts --no-audit --no-fund` (SDK 0.32.1, viem 2.24.0).
2. With Node.js 24+, run `node --test --test-name-pattern='R2-03:' scripts/reproduce-round2.mjs`.
3. Inspect the named assertions and the [captured result](../evidence/round2/tests.tap). A passing test reproduces the reported behavior.

## Expected

The client JSDoc says it returns "a market's trailing-24h stats (volume, trades, price change, high/low/open)". `volume24h`, `trades24h` and `openPrice24h` should describe `[now − 24h, now]`, give or take one 60 s bucket.

## Actual

The SDK fetches 3600-second candles and filters them by `bucketStart >= nowSec - 86400`. When the cutoff is between hour boundaries, the overlapping first bucket is excluded. The remaining window begins at the next hour, omitting up to 3599 seconds and potentially changing volume, trades, open and price change.

The offline fixture verifies the filter and a boundary-aligned control. Historical live volume percentages are not asserted by this test.

## Evidence

Independently reproduced offline on 1 November 2026: test `R2-03` in the [included harness](../scripts/reproduce-round2.mjs), with [execution output](../evidence/round2/tests.tap).

See [source versions and test boundaries](../evidence/round2/README.md).

## Environment

SDK: `@somnia-chain/markets-sdk@0.32.1`, viem `2.24.0`; Node.js 24.22.1.

Network context: Somnia Tokyo testnet (Hideki, chain 50383); this reproduction runs offline. Wallet address: none; no signing or transactions.
