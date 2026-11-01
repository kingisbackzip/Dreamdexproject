# edge-analytics maps uppercase and unknown buy-side values to sell

Severity: normal
Area: app
Validation status: independently reproduced offline (limited source/mocked strategy checks)
Disclosure: ordinary feedback candidate
Source item: 25; PDF pages 45-45

## Summary and impact

edge-analytics maps uppercase and unknown buy-side values to sell. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

1. Use Node.js 24 (validated here with v24.22.1). No npm install is needed.
2. From `dreamdex-submission/`, run:

   ```sh
   node --test --test-name-pattern='025:' scripts/reproduce-offline.mjs
   ```

3. The named test checks the current defect and its documented controls against pinned upstream text. A passing test confirms the described offline behavior, not a correction.
4. See [the full test output](../evidence/validation/offline-tests.tap) and [harness boundaries](../VALIDATION.md).

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. cd tools/edge-analytics
   2. Make a one-fill trade log in the documented csv-logger shape and a mid log (files in evidence/
      candidates/kit20-23/ea/ ): t_buy.csv / t_BUY.csv / t_long.csv :
      1730000000,hideki,P,<side>,fill,1,100,1,100,0x, ; m2.csv : mids 100.05 at t0 and t0+1s, 100.30 at
      t0+10s, 100.50 at t0+60s.
   3. npx tsx src/index.ts --trades t_<side>.csv --mid m2.csv for each side.
```

## Expected

BUY and buy give the same report. A side the tool does not recognise ( long , short , blank, a typo) is rejected or at least warned about, not silently read as a sell. The README lists only bid/buy and ask/sell. Perp bots in this same kit name sides long / short ( packages/perp-core/src/orders.ts:28 ).

## Actual

== side=buy    captured spread: median 5.00 bps | 60s net +50.0 bps | VERDICT: Positive marked-to-mid edge == side=BUY    captured spread: median -5.00 bps | 60s net -50.0 bps | VERDICT: NEGATIVE EDGE ... change the edge. == side=long   captured spread: median -5.00 bps | 60s net -50.0 bps | VERDICT: NEGATIVE EDGE ... change the edge.

toFillSide is s === "bid" || s === "buy" ? "buy" : "sell" . It is case-sensitive and has no error branch, so every unknown value becomes a sell, every sign flips, and a profitable maker is told it has negative edge (and the reverse) with no warning.

A new offline check reproduced the narrow behavior described above. Live fills, chain conditions, balances, bracket execution and financial loss were not tested.

## Evidence

- [Original item excerpt](../evidence/pdf/025.txt) from PDF pages 45-45. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).
- [New offline execution log](../evidence/validation/offline-tests.tap), test `025:`.

### Evidence as supplied in the PDF

```text
• tools/edge-analytics/src/csv.ts:73-74, 107 ; README tools/edge-analytics/README.md:89-90 at
      commit 4e75896896e024c03e2033d5920514f249998cd6.
    • Output: evidence/candidates/kit20-23/ea-side.log , 2026-10-31 ~03:55 UTC. Run twice, same
      result.
```

## Environment

### Original reported environment

dreamdex-bot-kit commit 4e75896896e024c03e2033d5920514f249998cd6, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, DRY_RUN). Local tool only, no network.

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Normalize recognized case variants and reject unknown side strings rather than defaulting to sell.
