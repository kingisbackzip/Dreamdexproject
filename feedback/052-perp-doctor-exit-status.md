# Perp doctor completes successfully after every market read fails

Severity: normal
Area: SDK

## Steps to reproduce

1. Install the pinned dependencies from the repository root: `npm install --ignore-scripts --no-audit --no-fund` (SDK 0.32.1, viem 2.24.0).
2. With Node.js 24+, run `node --test --test-name-pattern='R2-19:' scripts/reproduce-round2.mjs`.
3. Inspect the named assertions and the [captured result](../evidence/round2/tests.tap). A passing test reproduces the reported behavior.

The harness executes the actual source branch/function with synthetic boundaries; it does not send an order or connect to a node.

## Expected

The doctor is the documented "run this first" readiness check. If no market can be read, it should end with a clear failure summary and a non-zero exit code, so `npm run perp:doctor && npm start`, or a CI or Docker healthcheck, stops there.

## Actual

When each market read throws, `main()` logs the error, continues, and resolves. The top-level success handler calls `process.exit(0)`. The offline harness reproduces this with a synthetic failing market and the real doctor body. A readiness command therefore signals success even though its market check failed.

## Evidence

Independently reproduced offline on 1 November 2026: test `R2-19` in the [included harness](../scripts/reproduce-round2.mjs), with [execution output](../evidence/round2/tests.tap).

See [source versions and test boundaries](../evidence/round2/README.md).

## Environment

SDK: `@somnia-chain/markets-sdk@0.32.1`, viem `2.24.0`; Node.js 24.22.1.

Network context: Somnia Tokyo testnet (Hideki, chain 50383); this reproduction runs offline. Wallet address: none; no signing or transactions.

Bot kit commit: `4e75896896e024c03e2033d5920514f249998cd6`.
