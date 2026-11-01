# History reads silently return only 20,000 rows for a larger limit

Severity: normal
Area: SDK

## Steps to reproduce

1. Run scripts/s19-limit-validation.mjs (read-only). It calls getFills(pool, { limit }) , listPerpOrderRejections({ limit }) and listPerpPositions(account, { limit }) with limit = 50000 , -1 , 1.5 , "5" .

## Expected

These behave like listPerpPositionChanges , which throws InvalidInputError("Perp position change page limit must be an integer from 1 to 1000") (dist/perp/history.js:532) before any network call. At minimum, a limit above the server cap is clamped in a documented way or flagged as truncated.

## Actual

- limit: 50000 returns exactly 20000 rows with no sign the result was cut ( getFills , listPerpOrderRejections ). The SDK’s own truncation rule (“ rows.length === limit means truncated”) cannot catch it, because 20000 ≠ 50000. A caller asking for “everything up to 50000” silently gets a partial history.

Scope: the silent 20000 cap only. Malformed limits surfacing as IndexerError instead of InvalidInputError , the funding-history reads and non-finite limits were reported separately and are not claimed here.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/010.txt) from PDF pages 22-22. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

```text
Re-run 2026-10-29 14:40 UTC (same results as 2026-10-22 04:38 and 04:41 UTC):

 getFills(limit=50000) -> OK 20000 rows in 1077 ms
 listPerpOrderRejections(limit=50000) -> OK 20000 rows in 499 ms


Raw: evidence/reverify-2026-10-29/s19.log
```

## Environment

@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (Hideki, chain 50383), wallet: none (read- only)
