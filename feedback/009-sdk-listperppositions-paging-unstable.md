# listPerpPositions pagination has no stable timestamp tie-breaker

Severity: normal
Area: SDK

## Steps to reproduce

1. Read the query: dist/perp/state.js:270 (https://unpkg.com/@somnia-chain/markets-sdk@0.32.1/ dist/perp/state.js) — PerpPosition(where: $where, order_by: { updatedAt: desc }, limit: $limit, offset: $offset) .
2. Run scripts/s18-perp-positions-paging-ties.mjs (read-only). For an account with 21 open positions it reads the whole list ( limit: 100 ), then pages it with { limit: 1, offset: 0..22 } , 3 times, and reports duplicates/missing ids and updatedAt tie groups.

## Expected

Offset paging returns each position once. The SDK’s other perp lists use a total order (for example listFundingRateHistory : “The order is total … an offset page boundary inside one timestamp does not skip or repeat a row”; listPerpOrderRejections sorts by blockNumber, id ).

## Actual

updatedAt has one-second resolution and is not unique: positions a bot updates in the same second tie, and the indexer returns tied rows in an order that can change between requests. Paging then returns one position twice and omits another. The JSDoc does not warn that paging here is approximate.

The source PDF reports successful reproduction in October 22 runs but stable ordering in nine October 29 passes. Do not describe the live symptom as deterministic without a controlled tie fixture or pinned query state.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/009.txt) from PDF pages 21-21. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

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

@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (Hideki, chain 50383), wallet: none (read- only)
