# Place-then-cancel documentation passes an optional orderId without a guard

Severity: normal
Area: docs

## Steps to reproduce

1. scripts/tscheck/extract.mjs extracts every `` ts block in README.md and docs/*.md of @somnia- chain/markets-sdk 0.32.1 (132 blocks) into a file with a typed prelude ( client , trader , exchange typed from the SDK). Run tsc -p tsconfig.blocks.json with strict: true (TypeScript 5.9.3, skipLibCheck`).
2. Look at the blocks at docs/SPOT.md:56 (cancel at L69) and docs/BINARY.md:334 (cancel at L347).

## Expected

The canonical place-then-cancel snippets compile under strict (the default for new TS projects) and handle a fully-filled order.

## Actual

const { orderId } = await trader.placeSpotOrder(...); await trader.cancelOrder({ pool, orderId }) gives: error TS2322: Type 'bigint | undefined' is not assignable to type 'string | bigint'. PlaceOrderResult.orderId is orderId?: bigint (dist/trade.d.ts:149), undefined when the order fully fills. The snippets don’t handle that, so at runtime a fully-filled order hands undefined to cancelOrder .

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/007.txt) from PDF pages 18-18. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

```text
scripts/tscheck/tsc-blocks-strict.out (b126 = SPOT.md:56, b017 = BINARY.md:334; map in blocks-
index.json):

 SPOT.md:56    error TS2322: Type 'bigint | undefined' is not assignable to type 'string | bigint'.
 BINARY.md:334 error TS2322: Type 'bigint | undefined' is not assignable to type 'string | bigint'.


Checked 2026-10-29: 0.32.1 is still npm latest (no new release since 2026-10-13); orderId?: bigint
still at dist/trade.d.ts:149, cancel lines still at SPOT.md:69 / BINARY.md:347. Same on 0.32.2-
canary.38575926931. For comparison, the dreamDEX developer-page snippet compiles cleanly under
strict ( scripts/tscheck/snippet.ts , exit 0). Sources: https://unpkg.com/@somnia-chain/markets-
sdk@0.32.1/docs/SPOT.md, https://unpkg.com/@somnia-chain/markets-sdk@0.32.1/docs/BINARY.md,
https://unpkg.com/@somnia-chain/markets-sdk@0.32.1/dist/trade.d.ts
```

## Environment

@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (Hideki, chain 50383), wallet: none (read- only, offline)
