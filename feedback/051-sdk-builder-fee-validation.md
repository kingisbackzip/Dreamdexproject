# Perp order builder accepts a fee without a builder address

Severity: normal
Area: SDK

## Steps to reproduce

1. Install the pinned dependencies from the repository root: `npm install --ignore-scripts --no-audit --no-fund` (SDK 0.32.1, viem 2.24.0).
2. With Node.js 24+, run `node --test --test-name-pattern='R2-18:' scripts/reproduce-round2.mjs`.
3. Inspect the named assertions and the [captured result](../evidence/round2/tests.tap). A passing test reproduces the reported behavior.

## Expected

The two perp entry points should validate the same way. The contracts docs (errors page, `0x6d10926b InvalidBuilder()`) say: "builderFeeBpsTimes1k != 0 while builder == address(0)". That input can never succeed on-chain, so `buildPlacePerpOrder` / `placePerpOrder` should throw `InvalidInputError("builderFeeBpsTimes1k needs a builder")` the way the stop path already does.

## Actual

The actual unsigned `buildPlacePerpOrder` encodes builder address zero with `builderFeeBpsTimes1k = 5000n`. The stop-order builder rejects the same missing-builder configuration with “builderFeeBpsTimes1k needs a builder”.

This test establishes inconsistent client-side validation. It does not submit, simulate or measure gas loss on a reverting transaction.

## Evidence

Independently reproduced offline on 1 November 2026: test `R2-18` in the [included harness](../scripts/reproduce-round2.mjs), with [execution output](../evidence/round2/tests.tap).

See [source versions and test boundaries](../evidence/round2/README.md).

## Environment

SDK: `@somnia-chain/markets-sdk@0.32.1`, viem `2.24.0`; Node.js 24.22.1.

Network context: Somnia Tokyo testnet (Hideki, chain 50383); this reproduction runs offline. Wallet address: none; no signing or transactions.
