# BINARY.md redeem example omits required marketId

Severity: normal
Area: docs

## Steps to reproduce

1. docs/BINARY.md:471 (https://unpkg.com/@somnia-chain/markets-sdk@0.32.1/docs/BINARY.md): await trader.redeem({ market: marketAddress, amount });
2. Compile it: scripts/tscheck/extract.mjs pulls every `` ts block from README/docs into its own file with a typed prelude; run tsc -p tsconfig.blocks.json with strict: true`.
3. Runtime: dist/binary/settlement.js:124 passes p.marketId straight into args . scripts/s12-binary- redeem-doc-params.mjs feeds the doc-shaped params to the same ABI, offline, no signing.

## Expected

The example compiles and redeems: trader.redeem({ marketId, amount, market? }) , as the JSDoc example in dist/trade.js:62 does ( trader.redeem({ marketId, amount, outcomeIdx: 0 }) ).

## Actual

- tsc: BINARY.md:468 error TS2345: Argument of type '{ market: any; amount: any; }' is not assignable to parameter of type 'RedeemParams' ( marketId missing).
- In JS the SDK reaches the encoder with marketId: undefined and throws TypeError: Cannot read properties of undefined (reading 'length') instead of an InvalidInputError naming marketId . With market set and no outcomeIdx , it first makes RPC reads to look up the outcome, then fails.

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/006.txt) from PDF pages 17-17. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

```text
encode with doc-shaped params -> TypeError: Cannot read properties of undefined (reading 'length')


Re-run 2026-10-29 14:40 UTC on 0.32.1 (still npm latest ): same TypeError (evidence/
reverify-2026-10-29/s12.log). tsc output: scripts/tscheck/tsc-blocks-strict.out (b021 = BINARY.md:468;
map in blocks-index.json), produced 2026-10-22 with TypeScript 5.9.3; the package is unchanged since.
Same on 0.32.2-canary.38575926931 (BINARY.md byte-identical).
```

## Environment

@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (Hideki, chain 50383), wallet: none (read- only, offline)
