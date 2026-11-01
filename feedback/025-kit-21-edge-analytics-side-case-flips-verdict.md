# edge-analytics maps uppercase and unknown buy-side values to sell

Severity: normal
Area: app

## Steps to reproduce

1. Use Node.js 24 (validated here with v24.22.1). No npm install is needed.
2. From the repository root, run:

   ```sh
   node --test --test-name-pattern='025:' scripts/reproduce-offline.mjs
   ```

3. The named test checks the current defect and its documented controls against pinned upstream text. A passing test confirms the described offline behavior, not a correction.
4. See `[the full test output](../evidence/validation/offline-tests.tap)` and `[harness boundaries](../VALIDATION.md)`.

1. cd tools/edge-analytics
2. Make a one-fill trade log in the documented csv-logger shape and a mid log (files in evidence/ candidates/kit20-23/ea/ ): t_buy.csv / t_BUY.csv / t_long.csv : 1730000000,hideki,P,<side>,fill,1,100,1,100,0x, ; m2.csv : mids 100.05 at t0 and t0+1s, 100.30 at t0+10s, 100.50 at t0+60s.
3. npx tsx src/index.ts --trades t_<side>.csv --mid m2.csv for each side.

## Expected

BUY and buy give the same report. A side the tool does not recognise ( long , short , blank, a typo) is rejected or at least warned about, not silently read as a sell. The README lists only bid/buy and ask/sell. Perp bots in this same kit name sides long / short ( packages/perp-core/src/orders.ts:28 ).

## Actual

== side=buy    captured spread: median 5.00 bps | 60s net +50.0 bps | VERDICT: Positive marked-to-mid edge == side=BUY    captured spread: median -5.00 bps | 60s net -50.0 bps | VERDICT: NEGATIVE EDGE ... change the edge. == side=long   captured spread: median -5.00 bps | 60s net -50.0 bps | VERDICT: NEGATIVE EDGE ... change the edge.

toFillSide is s === "bid" || s === "buy" ? "buy" : "sell" . It is case-sensitive and has no error branch, so every unknown value becomes a sell, every sign flips, and a profitable maker is told it has negative edge (and the reverse) with no warning.

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

## Evidence

Offline reproduction passed; see the linked test output.

- [Original item excerpt](../evidence/pdf/025.txt) from PDF pages 45-45. 
- [Source provenance and limitations](../evidence/README.md).
- [New offline execution log](../evidence/validation/offline-tests.tap), test `025:`.

### Recorded results

```text
• tools/edge-analytics/src/csv.ts:73-74, 107 ; README tools/edge-analytics/README.md:89-90 at
      commit 4e75896896e024c03e2033d5920514f249998cd6.
    • Output: evidence/candidates/kit20-23/ea-side.log , 2026-10-31 ~03:55 UTC. Run twice, same
      result.
```

## Environment

dreamdex-bot-kit commit 4e75896896e024c03e2033d5920514f249998cd6, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, DRY_RUN). Local tool only, no network.

Offline reproduction: Node.js v24.22.1; synthetic inputs; no wallet or transactions.
