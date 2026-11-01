# History reads silently return only 20,000 rows for a larger limit

Severity: normal
Area: SDK
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 10; PDF pages 22-22

## Summary and impact

History reads silently return only 20,000 rows for a larger limit. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Run scripts/s19-limit-validation.mjs (read-only). It calls getFills(pool, { limit }) ,
      listPerpOrderRejections({ limit }) and listPerpPositions(account, { limit }) with limit =
      50000 , -1 , 1.5 , "5" .
```

## Expected

These behave like listPerpPositionChanges , which throws InvalidInputError("Perp position change page limit must be an integer from 1 to 1000") (dist/perp/history.js:532) before any network call. At minimum, a limit above the server cap is clamped in a documented way or flagged as truncated.

## Actual

- limit: 50000 returns exactly 20000 rows with no sign the result was cut ( getFills , listPerpOrderRejections ). The SDK’s own truncation rule (“ rows.length === limit means truncated”) cannot catch it, because 20000 ≠ 50000. A caller asking for “everything up to 50000” silently gets a partial history.

Scope: the silent 20000 cap only. Malformed limits surfacing as IndexerError instead of InvalidInputError , the funding-history reads and non-finite limits were reported separately and are not claimed here.

## Evidence

- [Original item excerpt](../evidence/pdf/010.txt) from PDF pages 22-22. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
Re-run 2026-10-29 14:40 UTC (same results as 2026-10-22 04:38 and 04:41 UTC):

 getFills(limit=50000) -> OK 20000 rows in 1077 ms
 listPerpOrderRejections(limit=50000) -> OK 20000 rows in 499 ms


Raw: evidence/reverify-2026-10-29/s19.log
```

## Environment

### Original reported environment

@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (Hideki, chain 50383), wallet: none (read- only)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Validate a documented page-size range and expose truncation or continuation explicitly.
