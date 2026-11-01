# Margin preview reports sufficient above the account position cap

Severity: normal
Area: SDK
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 8; PDF pages 19-20

## Summary and impact

Margin preview reports sufficient above the account position cap. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Run scripts/s15-preview-margin-gates.mjs (read-only, no key). On ETH/USDso:USDso, for a funded
      public account ( 0x47537E3A3ea6e9391F3B26Ea45618db6828c8bfF ), at a tick-aligned mark price, it reads
       client.getMaxPerpOrderSize({ pool, marginBank, account, isBid: true, price }) .
   2. It then calls client.previewPerpOrderMargin({ pool, marginBank, account, isBid: true, quantity,
      price }) with quantity = maxPositionSize + |position| + lotSize , one lot above what
       getMaxPerpOrderSize allows.
```

## Expected

The JSDoc (dist/somniaMarketsClient.d.ts:3982) says the preview computes “what a perp order will lock and whether the pool will accept it”, and sufficient means every gate passes. The per-account position cap is a pool gate (the order reverts MaxPositionSizeExceeded() ), and the SDK already models it in getMaxPerpOrderSize ( limitedBy: "maxPositionSize" ). So the preview should return sufficient: false with a position-cap flag, or the JSDoc should say it checks margin only.

## Actual

Same account, same price, same block range: getMaxPerpOrderSize caps the bid at 517.781 ETH with limitedBy=maxPositionSize , while previewPerpOrderMargin for 517.7811 ETH returns sufficient: true (lock ≈ 47,070 USDso). A form or bot that gates submit on sufficient , as the JSDoc recommends, sends an order that reverts on the position cap. In the source, previewPerpOrderMargin / perpOrderMarginQuote (dist/perp/margin.js) have no position-cap check; only getMaxPerpOrderSize applies the _enforceMaxPositionSize rule (comment at dist/perp/margin.js:1443).

Scope: only the position-cap gate. The preview’s missing quantity/grid validation (zero, negative, off-lot, below-minimum) was reported separately by others and is not claimed here.

## Evidence

- [Original item excerpt](../evidence/pdf/008.txt) from PDF pages 19-20. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
Re-run 2026-10-29 14:40 UTC, head block 36316342:

 ETH lotSize 100000000000000 minQuantity 4000000000000000 maxPositionSize 399561200000000000000 position
 -118219800000000000000 price 2343310000000000000000
 q=maxPositionSize + |position| + 1 lot bid sufficient=true lockAmount=47070571781650000000000
 block=36316426
 getMaxPerpOrderSize bid maxQuantity=517781000000000000000 limitedBy=maxPositionSize (same account, same
 price)


Also reproduced 2026-10-22 04:37 and 04:38 UTC (blocks 29918613-29919419). Raw: evidence/
reverify-2026-10-29/s15.log
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

Either include position-cap evaluation in sufficient or document that this preview checks margin gates only.
