# WebSocket getMarkets documentation uses an ignored filter and incorrect response values

Severity: normal
Area: docs
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 2; PDF pages 9-10

## Summary and impact

WebSocket getMarkets documentation uses an ignored filter and incorrect response values. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Read https://app.testnet.dreamdex.io/docs/developers/websocket-api/operations. Request
      example: {"id":1,"operation":"getMarkets","params":{"symbol":"SOMI:USDso"},...} . The
      successResponse shows one SOMI:USDso market with "quoteDecimals": 6 , "tickSize": "0.00001" ,
      "lotSize": "0.000001" , "minQuantity": "0.001" .
   2. Connect to wss://stg.api.dreamdex.io/v0/ws/public and send
      {"id":2,"operation":"getMarkets","params":{"symbol":"SOMI:USDso"}} .
   3. Compare with curl https://stg.api.dreamdex.io/v0/markets and the Contract Addresses page
      (USDso = 18 decimals).
```

## Expected

The example request uses a parameter the operation honours, and the example response matches the real values.

## Actual

- params.symbol is ignored: the filtered request returns all 3 testnet markets (SOMI, WBTC, WETH), identical to the unfiltered getMarkets .
- Every quote is USDso with 18 decimals (live quoteDecimals: 18 ), but the example shows quoteDecimals: 6 . Anyone who copies it mis-scales quote amounts by 1e12.
- The example tick/lot/min values ( 0.00001 / 0.000001 / 0.001 ) match no live market; live SOMI:USDso is tickSize "0.0001" , lotSize "0.01" , minQuantity "1" .

Scope: the getMarkets example only. The missing kind / stopRegistry fields in typed market structs were reported separately by others and are not claimed here.

## Evidence

- [Original item excerpt](../evidence/pdf/002.txt) from PDF pages 9-10. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

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

### Original reported environment

WS/HTTP testnet endpoints the docs document: wss://stg.api.dreamdex.io/v0/ws/public and https:// stg.api.dreamdex.io/v0 (Somnia Shannon 50312). Wallet: none (read-only)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Remove the unsupported symbol filter or implement it, and regenerate the example response from the appropriate documented network.
