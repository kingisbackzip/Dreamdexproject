# Unified market and funding fields diverge from the promised CCXT conventions

Severity: normal
Area: SDK
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 12; PDF pages 24-25

## Summary and impact

Unified market and funding fields diverge from the promised CCXT conventions. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Run scripts/s22-ccxt-field-semantics.mjs (read-only).
   2. Inspect exchange.markets["ETH/USDso:USDso"] , exchange.fetchTicker("ETH/USDso:USDso") and
       exchange.fetchFundingRateHistory(...) .
```

## Expected

docs/EXCHANGE.md:5-6: “if you’ve driven a venue through ccxt, nothing here will surprise you, down to the field names”. In ccxt’s unified structures a swap market carries swap / spot , linear / inverse and contractSize ; ticker.percentage is in percent (−0.37 means −0.37%); fundingRate is the rate charged per funding interval.

## Actual

- The perp market struct has only id, chainId, symbol, type, base, quote, settle, active, contract, precision, limits, indexed, perpStatus, info . All 21 perp markets lack contractSize , linear , swap , spot , inverse , taker / maker . The standard ccxt notional amount * market.contractSize * price gives NaN .
- ticker.fundingRate and every fetchFundingRateHistory row are per 8 hours (dist/unified/ structs.d.ts:446), while every live pool settles each 3600 s; a ccxt carry/arb calculation that treats it as per-interval overstates funding ×8. These conventions are stated only in the struct JSDoc; EXCHANGE.md, the page that makes the ccxt promise, never lists them.

Scope: the market struct fields and the funding-rate interval. ticker.percentage units and missing ccxt fields on fetchPositions / fetchMyTrades rows were reported separately by others and are not claimed here.

## Evidence

- [Original item excerpt](../evidence/pdf/012.txt) from PDF pages 24-25. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
Re-run 2026-10-29 14:40 UTC, head block 36316343 (same shape as 2026-10-22 04:38/04:39 UTC):

 fetchMarkets()["ETH/USDso:USDso"] keys:
 id,chainId,symbol,type,base,quote,settle,active,contract,precision,limits,indexed,perpStatus,info
   ccxt unified keys missing: spot,swap,future,option,margin,linear,inverse,contractSize,taker,maker
   typical ccxt notional = amount * market.contractSize * price -> NaN
 perp markets: 21; with contractSize: 0; with linear: 0
 fetchTicker.fundingRate=0.0001; per-interval rate (fundingIntervalSec=3600) = 0.0000125; ticker value is
 the per-8h rate
 fetchFundingRateHistory rows fundingRate=0.0001,0.0001 (also per-8h; settlement every 3600s)


Raw: evidence/reverify-2026-10-29/s22.log. Sources: https://unpkg.com/@somnia-chain/markets-
sdk@0.32.1/docs/EXCHANGE.md, https://unpkg.com/@somnia-chain/markets-sdk@0.32.1/dist/unified/
structs.d.ts
```

## Environment

### Original reported environment

@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (Hideki, chain 50383), wallet: none (read- only)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

The missing market metadata and funding interval are distinct subclaims under the CCXT compatibility promise. The organizer may triage them separately or request a split; neither is a proven loss scenario.

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Document the CCXT differences or populate compatible market metadata and an explicitly named funding interval. Treat field-shape and funding-convention subclaims separately during triage.
