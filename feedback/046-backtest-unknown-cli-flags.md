# Backtest CLI silently ignores misspelled top-level flags

Severity: normal
Area: SDK

## Steps to reproduce

1. Install the pinned dependencies from the repository root: `npm install --ignore-scripts --no-audit --no-fund` (SDK 0.32.1, viem 2.24.0).
2. With Node.js 24+, run `node --test --test-name-pattern='R2-09:' scripts/reproduce-round2.mjs`.
3. Inspect the named assertions and the [captured result](../evidence/round2/tests.tap). A passing test reproduces the reported behavior.

## Expected

Step 1 exits with "Unknown flag --taker-fee-bp" (the usage text already lists the accepted flags).

## Actual

The actual CLI parser returns `takerFeeBps: 0` for `--taker-fee-bp 30`, and `takerFeeBps: 30` for `--taker-fee-bps 30`. Unknown top-level flags are stored and then ignored.

This is distinct from report 026: that issue concerns strategy `--set` keys in `applyConfigOverrides`; this one concerns the top-level `parseArgs` flag allowlist.

## Evidence

Independently reproduced offline on 1 November 2026: test `R2-09` in the [included harness](../scripts/reproduce-round2.mjs), with [execution output](../evidence/round2/tests.tap).

See [source versions and test boundaries](../evidence/round2/README.md).

## Environment

SDK: `@somnia-chain/markets-sdk@0.32.1`, viem `2.24.0`; Node.js 24.22.1.

Network context: Somnia Tokyo testnet (Hideki, chain 50383); this reproduction runs offline. Wallet address: none; no signing or transactions.

Bot kit commit: `4e75896896e024c03e2033d5920514f249998cd6`.
