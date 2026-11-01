# WebSocket getMarkets documentation uses an ignored filter and incorrect response values

Severity: normal
Area: docs

## Steps to reproduce

1. Read https://app.testnet.dreamdex.io/docs/developers/websocket-api/operations. Request example: {"id":1,"operation":"getMarkets","params":{"symbol":"SOMI:USDso"},...} . The successResponse shows one SOMI:USDso market with "quoteDecimals": 6 , "tickSize": "0.00001" , "lotSize": "0.000001" , "minQuantity": "0.001" .
2. Connect to wss://stg.api.dreamdex.io/v0/ws/public and send {"id":2,"operation":"getMarkets","params":{"symbol":"SOMI:USDso"}} .
3. Compare with curl https://stg.api.dreamdex.io/v0/markets and the Contract Addresses page (USDso = 18 decimals).

## Expected

The example request uses a parameter the operation honours, and the example response matches the real values.

## Actual

- params.symbol is ignored: the filtered request returns all 3 testnet markets (SOMI, WBTC, WETH), identical to the unfiltered getMarkets .
- Every quote is USDso with 18 decimals (live quoteDecimals: 18 ), but the example shows quoteDecimals: 6 . Anyone who copies it mis-scales quote amounts by 1e12.
- The example tick/lot/min values ( 0.00001 / 0.000001 / 0.001 ) match no live market; live SOMI:USDso is tickSize "0.0001" , lotSize "0.01" , minQuantity "1" .

Scope: the getMarkets example only. The missing kind / stopRegistry fields in typed market structs were reported separately by others and are not claimed here.

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/002.txt) from PDF pages 9-10. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

```text
Re-verified 2026-10-29 14:39 UTC (docs unchanged since 2026-10-20):

 >> {"id":2,"operation":"getMarkets","params":{"symbol":"SOMI:USDso"}}
 << {"id":2,"status":200,"payload":{"markets":
 [{...,"quoteDecimals":18,...,"symbol":"SOMI:USDso","tickSize":"0.0001"}, {..."WBTC:USDso"...},
 {..."WETH:USDso"...}]}}
    symbols: ['SOMI:USDso', 'WBTC:USDso', 'WETH:USDso'] quoteDecimals: {18}
 >> {"id":3,"operation":"getMarkets"}      -> same 3 markets
 GET https://stg.api.dreamdex.io/v0/markets:
 SOMI:USDso quoteDecimals 18 tick 0.0001 lot 0.01    min 1
 WBTC:USDso quoteDecimals 18 tick 0.1    lot 0.00001 min 0.0001
 WETH:USDso quoteDecimals 18 tick 0.01   lot 0.0001 min 0.001


Raw: evidence/reverify-2026-10-29/ws-errors-run.txt, rest-markets.json
```

## Environment

WS/HTTP testnet endpoints the docs document: wss://stg.api.dreamdex.io/v0/ws/public and https:// stg.api.dreamdex.io/v0 (Somnia Shannon 50312). Wallet: none (read-only)
