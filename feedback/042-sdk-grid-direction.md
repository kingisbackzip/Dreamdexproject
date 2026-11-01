# Unknown grid-rounding direction silently rounds down

Severity: normal
Area: SDK

## Steps to reproduce

1. Install the pinned dependencies from the repository root: `npm install --ignore-scripts --no-audit --no-fund` (SDK 0.32.1, viem 2.24.0).
2. With Node.js 24+, run `node --test --test-name-pattern='R2-05:' scripts/reproduce-round2.mjs`.
3. Inspect the named assertions and the [captured result](../evidence/round2/tests.tap). A passing test reproduces the reported behavior.

## Expected

`direction` is typed `"down" | "up"`, and the JSDoc stresses that "Rounding the wrong way is a real loss rather than a formatting choice" and "Pass the direction you mean". A value outside the union should throw `InvalidInputError`, as these helpers already do for a non-positive step or price.

## Actual

`dist/units.js:569` is `return direction === "up" ? down + step : down;`. Every value other than the exact lowercase `"up"` takes the floor branch, including `"UP"`, `"Up"`, `"ceil"`, `undefined` and `""`. For a crossing buy limit (the case the docs say must round UP so it still sweeps the levels it was priced to reach), a typo or a config value like `"UP"` quietly puts the limit one tick lower. The IOC then under-fills, or fails with `ImmediateOrCancelNoFill`, and nothing points at the cause. `roundPriceToTick` passes the value straight through, so it behaves the same way.

## Evidence

Independently reproduced offline on 1 November 2026: test `R2-05` in the [included harness](../scripts/reproduce-round2.mjs), with [execution output](../evidence/round2/tests.tap).

See [source versions and test boundaries](../evidence/round2/README.md).

## Environment

SDK: `@somnia-chain/markets-sdk@0.32.1`, viem `2.24.0`; Node.js 24.22.1.

Network context: Somnia Tokyo testnet (Hideki, chain 50383); this reproduction runs offline. Wallet address: none; no signing or transactions.
