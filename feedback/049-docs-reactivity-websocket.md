# Reactivity JSDoc contradicts the documented WebSocket endpoint selection

Severity: normal
Area: docs

## Steps to reproduce

1. Install SDK 0.32.1.
2. Compare `dist/reactivity/index.d.ts` around line 101 with `docs/REACTIVITY.md` around lines 37 and 155.
3. Read the two conflicting endpoint descriptions in the [captured excerpts](../evidence/round2/reactivity-excerpts.txt).

## Expected

The IDE JSDoc and integration guide should agree about whether watch subscriptions reuse the client WebSocket or select the chain default endpoint.

## Actual

The JSDoc promises the markets client’s already-open WebSocket. The guide explicitly says `watch` opens a separate socket using `chain.rpcUrls.default.webSocket[0]`. An integrator relying on the JSDoc can incorrectly expect a configured `wsRpcUrl` to apply. This report is limited to the documentation contradiction; separate sockets are documented behavior, not independently claimed as a defect.

## Evidence

Source independently inspected on 1 November 2026; runtime behavior was not rerun. See [source references and verification boundaries](../evidence/round2/README.md).

## Environment

SDK 0.32.1 (+ @somnia-chain/reactivity 0.2.1, viem 2.57.7, Node 22), Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only)
