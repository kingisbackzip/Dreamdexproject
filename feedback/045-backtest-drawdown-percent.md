# Maximum percentage drawdown is overwritten by a larger absolute drawdown

Severity: normal
Area: SDK

## Steps to reproduce

1. Install the pinned dependencies from the repository root: `npm install --ignore-scripts --no-audit --no-fund` (SDK 0.32.1, viem 2.24.0).
2. With Node.js 24+, run `node --test --test-name-pattern='R2-08:' scripts/reproduce-round2.mjs`.
3. Inspect the named assertions and the [captured result](../evidence/round2/tests.tap). A passing test reproduces the reported behavior.

## Expected

`maxDrawdownPct = 0.5` (100 → 50 is a 50% drawdown; the later 1000 → 900 is 10%).

## Actual

```
maxDrawdown 100 maxDrawdownPct 0.1
```
The review table would show `maxDrawdn 10.0%` for an equity curve that halved.

## Evidence

Independently reproduced offline on 1 November 2026: test `R2-08` in the [included harness](../scripts/reproduce-round2.mjs), with [execution output](../evidence/round2/tests.tap).

See [source versions and test boundaries](../evidence/round2/README.md).

## Environment

SDK: `@somnia-chain/markets-sdk@0.32.1`, viem `2.24.0`; Node.js 24.22.1.

Network context: Somnia Tokyo testnet (Hideki, chain 50383); this reproduction runs offline. Wallet address: none; no signing or transactions.

Bot kit commit: `4e75896896e024c03e2033d5920514f249998cd6`.
