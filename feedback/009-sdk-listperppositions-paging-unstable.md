# listPerpPositions pagination has no stable timestamp tie-breaker

Severity: normal
Area: SDK
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 9; PDF pages 21-21

## Summary and impact

listPerpPositions pagination has no stable timestamp tie-breaker. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Read the query: dist/perp/state.js:270 (https://unpkg.com/@somnia-chain/markets-sdk@0.32.1/
      dist/perp/state.js) — PerpPosition(where: $where, order_by: { updatedAt: desc }, limit: $limit,
      offset: $offset) .
   2. Run scripts/s18-perp-positions-paging-ties.mjs (read-only). For an account with 21 open
      positions it reads the whole list ( limit: 100 ), then pages it with { limit: 1, offset: 0..22 } , 3
      times, and reports duplicates/missing ids and updatedAt tie groups.
```

## Expected

Offset paging returns each position once. The SDK’s other perp lists use a total order (for example listFundingRateHistory : “The order is total … an offset page boundary inside one timestamp does not skip or repeat a row”; listPerpOrderRejections sorts by blockNumber, id ).

## Actual

updatedAt has one-second resolution and is not unique: positions a bot updates in the same second tie, and the indexer returns tied rows in an order that can change between requests. Paging then returns one position twice and omits another. The JSDoc does not warn that paging here is approximate.

## Evidence

- [Original item excerpt](../evidence/pdf/009.txt) from PDF pages 21-21. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
2026-10-22, two invocations (head blocks 29918954 and 29919538):

 run 0: full=21 paged rows=21 unique=20
   duplicated: 0x4181dd08@1792643881 | missing: 0xdcb0ad22@1792643881
   updatedAt tie groups in the full read: {"1792643881":["0xdcb0ad22","0x4181dd08"], …}
 (second invocation) run 0: unique=19 duplicated: 0xd6cb1dd5@1792643929 … missing: 0x7058579f@1792643929 …
   tie group {"1792643938":["0x352636ab","0x4181dd08"]} came back as ["0x4181dd08","0x352636ab"] on the
 next identical request


Every duplicate/missing pair shares the same updatedAt . The symptom needs live ties, so it is
intermittent: on 2026-10-29 14:40 UTC the same account had one tie group ( {"1793284840":
["0x7058579f","0x63b47ed4"]} ) and 9 paged passes happened to return it in a stable order (evidence/
reverify-2026-10-29/s18*.log). The query itself is unchanged in 0.32.1 (still npm latest ).
```

## Environment

### Original reported environment

@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (Hideki, chain 50383), wallet: none (read- only)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

The source PDF reports successful reproduction in October 22 runs but stable ordering in nine October 29 passes. Do not describe the live symptom as deterministic without a controlled tie fixture or pinned query state.

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Add a unique id tie-breaker; explain that offset pagination over changing rows still needs a stable snapshot or cursor.
