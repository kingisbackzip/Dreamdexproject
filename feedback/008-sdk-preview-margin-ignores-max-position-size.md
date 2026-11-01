# Margin preview reports sufficient above the account position cap

Severity: normal
Area: SDK

## Steps to reproduce

1. Run scripts/s15-preview-margin-gates.mjs (read-only, no key). On ETH/USDso:USDso, for a funded public account ( 0x47537E3A3ea6e9391F3B26Ea45618db6828c8bfF ), at a tick-aligned mark price, it reads client.getMaxPerpOrderSize({ pool, marginBank, account, isBid: true, price }) .
2. It then calls client.previewPerpOrderMargin({ pool, marginBank, account, isBid: true, quantity, price }) with quantity = maxPositionSize + |position| + lotSize , one lot above what getMaxPerpOrderSize allows.

## Expected

The JSDoc (dist/somniaMarketsClient.d.ts:3982) says the preview computes “what a perp order will lock and whether the pool will accept it”, and sufficient means every gate passes. The per-account position cap is a pool gate (the order reverts MaxPositionSizeExceeded() ), and the SDK already models it in getMaxPerpOrderSize ( limitedBy: "maxPositionSize" ). So the preview should return sufficient: false with a position-cap flag, or the JSDoc should say it checks margin only.

## Actual

Same account, same price, same block range: getMaxPerpOrderSize caps the bid at 517.781 ETH with limitedBy=maxPositionSize , while previewPerpOrderMargin for 517.7811 ETH returns sufficient: true (lock ≈ 47,070 USDso). A form or bot that gates submit on sufficient , as the JSDoc recommends, sends an order that reverts on the position cap. In the source, previewPerpOrderMargin / perpOrderMarginQuote (dist/perp/margin.js) have no position-cap check; only getMaxPerpOrderSize applies the _enforceMaxPositionSize rule (comment at dist/perp/margin.js:1443).

Scope: only the position-cap gate. The preview’s missing quantity/grid validation (zero, negative, off-lot, below-minimum) was reported separately by others and is not claimed here.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/008.txt) from PDF pages 19-20. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

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

@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (Hideki, chain 50383), wallet: none (read- only)
