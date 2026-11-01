# Live fills from different blocks in one second are sorted by log index alone

Severity: normal
Area: SDK
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 31; PDF pages 53-54

## Summary and impact

Live fills from different blocks in one second are sorted by log index alone. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. new SomniaMarkets({ chain: hidekiTestnet, wsRpcUrl: hidekiTestnet.rpcUrls.default.webSocket[0],
      indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql" }) , loadMarkets() .
   2. client.watchMarket(<BTC/USDso:USDso pool 0x4181dd08e73bbcdd1ba3e615a18f6abd941b94c0>) .
   3. Every 10 s read client.getLiveFills(pool, { limit: 400 }) and exchange.watchTrades("BTC/
      USDso:USDso", 50) . Check each adjacent pair against its id ( ${blockNumber}_${logIndex} ).
   4. Script: candidates/scripts/maj-stream-05-tape-order.mjs . Second pass, which prints timestamps
      and runs a cursor consumer: candidates/scripts/maj-stream-05b-tape-cursor.mjs .
```

## Expected

The docs say getLiveFills returns “the most recent fills on one pool, newest first”. The watchTrades JSDoc example says “ [0] is always the latest”. Rows should be ordered by (blockNumber, logIndex) descending.

## Actual

The store sorts with cmpFillDesc (dist/store.js:1501). It compares timestamp , which has 1-second resolution, and breaks ties on logIndex only. blockNumber is never compared. Hideki produces about 10 blocks per second, so fills from different blocks within one second come out ordered by logIndex. A fill from an older block with a higher logIndex is placed ahead of a newer one. For example, 37684362_17 comes before 37684363_6 , and 37681897_27 before 37681900_14 .

Effects: - The tape is not newest-first. On a busy pool, 7 to 10% of adjacent pairs are inverted. - watchTrades(...)[0] is sometimes not the latest fill, so last-trade price can be up to about 1 s stale. - A consumer that walks the newest-first tape down to its last-seen id (a common pattern, and what “[0] is always the latest” invites) never processes some fills.

## Evidence

- [Original item excerpt](../evidence/pdf/031.txt) from PDF pages 53-54. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
• Run 1, 2026-10-31 04:37 to 04:39 UTC, BTC pool, blocks about 37681797 to 37683028. 10 of 10
      samples had inversions, 174 inversions in total (14 to 25 per sample out of 200 to 307 rows).
      watchTrades[0] was not the max (block, logIndex) in 1 of 10 calls: [0]=37682937_42 while
      37682941_12 was present.
    • Run 2, 2026-10-31 04:40 to 04:41 UTC: 28 inversions in 293 tape rows. All 28 have identical
      timestamp on both rows (for example 37684362_17 and 37684363_6 both at ts 1793421689), which
      confirms the tie-break root cause. A newest-first cursor consumer on watchTrades(…,100) over 87
      calls processed 181 of 193 trades and never processed 12 (6.2%), for example 37683681_12 ,
      37683683_9 , 37683771_7 .
    • Earlier run (fills-run1, 04:26 to 04:32 UTC, blocks 37675600 to 37679193): 30 inversions in BTC’s
      400-row tape. The set of fills itself was complete: 319 of 319 on-chain OrderFilled logs present, 0
      duplicates, 0 extras. Only the order is wrong.
    • Raw output: evidence/stream/tape-order-run1-summary.txt , evidence/stream/tape-cursor-run1.txt ,
      evidence/stream/fills-run1.txt .
```

## Environment

### Original reported environment

SDK version 0.32.1, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read- only)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Use blockNumber and logIndex as the chain-order tie-breakers and test several blocks sharing one timestamp.
