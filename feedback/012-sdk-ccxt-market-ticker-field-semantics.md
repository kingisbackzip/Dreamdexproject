# Unified market and funding fields diverge from the promised CCXT conventions

Severity: normal
Area: SDK

## Steps to reproduce

1. Run scripts/s22-ccxt-field-semantics.mjs (read-only).
2. Inspect exchange.markets["ETH/USDso:USDso"] , exchange.fetchTicker("ETH/USDso:USDso") and exchange.fetchFundingRateHistory(...) .

## Expected

docs/EXCHANGE.md:5-6: “if you’ve driven a venue through ccxt, nothing here will surprise you, down to the field names”. In ccxt’s unified structures a swap market carries swap / spot , linear / inverse and contractSize ; ticker.percentage is in percent (−0.37 means −0.37%); fundingRate is the rate charged per funding interval.

## Actual

- The perp market struct has only id, chainId, symbol, type, base, quote, settle, active, contract, precision, limits, indexed, perpStatus, info . All 21 perp markets lack contractSize , linear , swap , spot , inverse , taker / maker . The standard ccxt notional amount * market.contractSize * price gives NaN .
- ticker.fundingRate and every fetchFundingRateHistory row are per 8 hours (dist/unified/ structs.d.ts:446), while every live pool settles each 3600 s; a ccxt carry/arb calculation that treats it as per-interval overstates funding ×8. These conventions are stated only in the struct JSDoc; EXCHANGE.md, the page that makes the ccxt promise, never lists them.

Scope: the market struct fields and the funding-rate interval. ticker.percentage units and missing ccxt fields on fetchPositions / fetchMyTrades rows were reported separately by others and are not claimed here.

The missing market metadata and funding interval are distinct subclaims under the CCXT compatibility promise. The organizer may triage them separately or request a split; neither is a proven loss scenario.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/012.txt) from PDF pages 24-25. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

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

@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (Hideki, chain 50383), wallet: none (read- only)
