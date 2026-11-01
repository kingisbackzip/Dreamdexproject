# Funding helper guards accept windows that cause division by zero

Severity: normal
Area: SDK

## Steps to reproduce

1. Install the pinned dependencies from the repository root: `npm install --ignore-scripts --no-audit --no-fund` (SDK 0.32.1, viem 2.24.0).
2. With Node.js 24+, run `node --test --test-name-pattern='R2-07:' scripts/reproduce-round2.mjs`.
3. Inspect the named assertions and the [captured result](../evidence/round2/tests.tap). A passing test reproduces the reported behavior.

## Expected

The funding helpers share one validation contract: `assertWindow` throws a descriptive `RangeError` ("fundingWindowSec must be positive … cannot be defaulted"), and `intervalsPerWindow` validates its interval the same way. Any input that passes the guard should give a consistent, finite answer across the sibling helpers. Invalid intervals and targets should get the same descriptive error, not a raw engine error and not a wrong boolean.

## Actual

- `assertWindow` checks only `isFinite && > 0`. `normalizeFundingRate` then does `BigInt(Math.trunc(fundingWindowSec))`, so a window of 0.5 s passes the guard and fails with the engine's `RangeError: Division by zero` in `fundingRate8h` and `fundingRate1h`. With the same window, `annualizedFundingRate` returns 6307.2 (630,720% APR) and `intervalsPerWindow` returns 2.
- For a non-integer window, the siblings disagree. `fundingRate8h` truncates 28800.9 to 28800, but `annualizedFundingRate` divides by 28800.9, so `8h × 1095` and the APR helper differ for the same input.
- `normalizeFundingRate` / `fundingRatePerInterval` never validate `targetSec`. NaN gives `RangeError: The number NaN cannot be converted to a BigInt`, and 0 or negative values return 0 or a sign-flipped rate.
- `isFundingStale` validates nothing. A NaN interval (for example, a row missing `fundingIntervalSec`) or a non-integer `interval × threshold` (3601 × 1.5) throws the raw BigInt conversion `RangeError`. An interval of 0 or below, or a threshold of 0, reports funding settled 60 s ago as stale (`true`), which is the "funding is not accruing" alarm.

Impact is limited: on-chain windows are integer 28800 s. The harm is to UIs and bots that feed these helpers from parsed, defaulted or partial indexer data, where they get raw engine errors or a false stale alarm instead of the SDK's own descriptive error.

## Evidence

Independently reproduced offline on 1 November 2026: test `R2-07` in the [included harness](../scripts/reproduce-round2.mjs), with [execution output](../evidence/round2/tests.tap).

See [source versions and test boundaries](../evidence/round2/README.md).

## Environment

SDK: `@somnia-chain/markets-sdk@0.32.1`, viem `2.24.0`; Node.js 24.22.1.

Network context: Somnia Tokyo testnet (Hideki, chain 50383); this reproduction runs offline. Wallet address: none; no signing or transactions.
