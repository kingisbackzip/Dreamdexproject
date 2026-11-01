# Stop-registry default configuration differs from documented deployment values

Severity: normal
Area: docs
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 16; PDF pages 31-32

## Summary and impact

Stop-registry default configuration differs from documented deployment values. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

For a new check, restrict view calls to Shannon testnet 50312. Mainnet observations in the excerpt are historical supplied evidence and were not repeated here.

```text
1. Open https://app.testnet.dreamdex.io/docs/developers/contracts/contract-specifications and scroll
      to “Stop Order Registries” → “Default configuration”.

   2. Read the four values on every registry the same page lists (4 on mainnet, chain 5031; 3 on the
      Shannon testnet, chain 50312) with plain view calls:

       cast call 0x68c8f6fb1EA19A28F25358Ff00b8Ed8E1216df30 "somiPaymentPerOrder()(uint256)" --rpc-url
       https://api.infra.mainnet.somnia.network
       cast call 0x68c8f6fb1EA19A28F25358Ff00b8Ed8E1216df30 "gasBufferBps()(uint256)"       --rpc-url
       https://api.infra.mainnet.somnia.network
       cast call 0xEb97349Aa62A68507c0bE535eD88B0d028a47E1e "somiPaymentPerOrder()(uint256)" --rpc-url
       https://dream-rpc.somnia.network


      (Script that reads all 7 registries: candidates/evidence/doc2/doc2_spotstop.mjs .)
```

## Expected

The table matches the deployed registries. The page calls somiPaymentPerOrder the “exact payment required when creating a pending stop order”, so a wrong value here makes createPendingOrder revert.

## Actual

All 7 registries the page lists return somiPaymentPerOrder = 0.5 SOMI (5× the documented 0.1) and gasBufferBps = 3000 (the docs say 5000). slippageToleranceBps = 500 and minStopDistanceBps = 0 do match. No registry runs the documented “default”. If a developer sends the documented 0.1 SOMI, the call reverts with InsufficientSomiPayment() (0xfa0d8bfd), since under-payment and over-payment both revert. An eth_call on the Shannon SOMI registry with exactly somiPaymentPerOrder() showed the registry read the 0.5 SOMI value (see doc2-02).

## Evidence

- [Original item excerpt](../evidence/pdf/016.txt) from PDF pages 31-32. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
Docs page (fetched live 2026-10-31 03:58 UTC), https://app.testnet.dreamdex.io/docs/developers/
contracts/contract-specifications: > “Default configuration … slippageToleranceBps 500 (5%) …
somiPaymentPerOrder 0.1 SOMI — exact payment required when creating a pending stop order
minStopDistanceBps 0 (disabled) … gasBufferBps 5000 (50%) — per-iteration gas headroom for the
trigger loop. These are admin-tunable per registry.”

Chain reads, 2026-10-31 03:57 UTC, run twice with the same results (mainnet block 452646043,
Shannon block 528447557):

 mainnet SOMI   0x68c8…df30 somiPaymentPerOrder=0.5 slippageToleranceBps=500 minStopDistanceBps=0
 gasBufferBps=3000
 mainnet USDC.e 0xD53E…100c somiPaymentPerOrder=0.5 slippageToleranceBps=500 minStopDistanceBps=0
 gasBufferBps=3000
 mainnet WBTC   0xed32…52bd somiPaymentPerOrder=0.5 slippageToleranceBps=500 minStopDistanceBps=0
 gasBufferBps=3000

 mainnet WETH   0x9653…633d somiPaymentPerOrder=0.5 slippageToleranceBps=500 minStopDistanceBps=0
 gasBufferBps=3000
 shannon SOMI   0xEb97…7E1e somiPaymentPerOrder=0.5 slippageToleranceBps=500 minStopDistanceBps=0
 gasBufferBps=3000
 shannon WBTC   0x53d5…7aaD somiPaymentPerOrder=0.5 slippageToleranceBps=500 minStopDistanceBps=0
 gasBufferBps=3000
 shannon WETH   0xf822…598F somiPaymentPerOrder=0.5 slippageToleranceBps=500 minStopDistanceBps=0
 gasBufferBps=3000


The page does say “admin-tunable”, but labelling a value no deployment uses as the “default” is
misleading for a value that has to be paid exactly. Suggested fix: show the live values, or drop the
numbers and point to the getters.
```

## Environment

### Original reported environment

SDK version 0.32.1, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read- only) Note: the registries this page documents are on Somnia mainnet (5031) and Shannon testnet (50312), so the reads above were made there (view calls only).

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Link to registry getters or publish deployment-specific values with a date and an explicit warning that they are tunable.
