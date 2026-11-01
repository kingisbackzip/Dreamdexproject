# Place-then-cancel documentation passes an optional orderId without a guard

Severity: normal
Area: docs
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 7; PDF pages 18-18

## Summary and impact

Place-then-cancel documentation passes an optional orderId without a guard. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. scripts/tscheck/extract.mjs extracts every `` ts block in README.md and docs/*.md of @somnia-
      chain/markets-sdk 0.32.1 (132 blocks) into a file with a typed prelude
      ( client , trader , exchange typed from the SDK). Run tsc -p tsconfig.blocks.json with strict:
      true (TypeScript 5.9.3, skipLibCheck`).
   2. Look at the blocks at docs/SPOT.md:56 (cancel at L69) and docs/BINARY.md:334 (cancel at L347).
```

## Expected

The canonical place-then-cancel snippets compile under strict (the default for new TS projects) and handle a fully-filled order.

## Actual

const { orderId } = await trader.placeSpotOrder(...); await trader.cancelOrder({ pool, orderId }) gives: error TS2322: Type 'bigint | undefined' is not assignable to type 'string | bigint'. PlaceOrderResult.orderId is orderId?: bigint (dist/trade.d.ts:149), undefined when the order fully fills. The snippets don’t handle that, so at runtime a fully-filled order hands undefined to cancelOrder .

## Evidence

- [Original item excerpt](../evidence/pdf/007.txt) from PDF pages 18-18. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

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

### Original reported environment

@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (Hideki, chain 50383), wallet: none (read- only, offline)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Guard or explain optional orderId before cancellation; type-check the published examples in strict mode.
