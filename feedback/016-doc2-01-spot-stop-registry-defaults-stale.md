# Stop-registry default configuration differs from documented deployment values

Severity: normal
Area: docs

## Steps to reproduce

### Original reproduction procedure

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

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/016.txt) from PDF pages 31-32. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

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

SDK version 0.32.1, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read- only) Note: the registries this page documents are on Somnia mainnet (5031) and Shannon testnet (50312), so the reads above were made there (view calls only).
