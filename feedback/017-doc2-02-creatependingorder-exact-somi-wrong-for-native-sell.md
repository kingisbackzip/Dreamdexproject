# Native sell stops require an extra payment omitted by the function reference

Severity: normal
Area: docs
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 17; PDF pages 33-34

## Summary and impact

Native sell stops require an extra payment omitted by the function reference. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Read the createPendingOrder entry on https://app.testnet.dreamdex.io/docs/developers/contracts/
      functions, the InsufficientSomiPayment row on …/contracts/errors, and the stop-registry table on
      …/contracts/contract-specifications. All three say the payable value is exactly
      somiPaymentPerOrder() .
   2. Simulate a MARKET sell stop on the native SOMI/USDso registry (Shannon, registry
      0xEb97349Aa62A68507c0bE535eD88B0d028a47E1e , pool 0x259fD6559214dd5aD3752322426eA9F9fABEFff4 ) with
      msg.value = somiPaymentPerOrder() . Use an eth_call with a balance state override, so no wallet is
      needed. Script: candidates/evidence/doc2/doc2_sim.mjs .
   3. Repeat with msg.value = somiPaymentPerOrder() + delta , where delta comes from
      pool.getAutoPullRequirement(owner, false, triggerPrice, quantity, 0) .
```

## Expected

Following the reference pages (sending the exact somiPaymentPerOrder() ) creates the stop. Otherwise the reference pages should state the native pre-load exception, as the Stop Orders guide and the SDK both do.

## Actual

- value = somiPaymentPerOrder() (0.5 SOMI) reverts with InsufficientSomiPayment() .
- value = somiPaymentPerOrder() + delta (10.5 SOMI) succeeds and returns pending order id 18446744073709551669.

The reference pages contradict the Stop Orders guide and the SDK. The Errors page, which developers use to decode this exact revert, tells them the fix is to send exactly somiPaymentPerOrder() . For native sells that advice is wrong.

## Evidence

- [Original item excerpt](../evidence/pdf/017.txt) from PDF pages 33-34. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
Docs, fetched live 2026-10-31 03:58 UTC: - /docs/developers/contracts/functions: “Requires an exact
SOMI payment matching somiPaymentPerOrder() (both underpayment and overpayment revert with
InsufficientSomiPayment )” and “msg.value SOMI (native) Must equal somiPaymentPerOrder() exactly.”
- /docs/developers/contracts/errors: “0xfa0d8bfd InsufficientSomiPayment() createPendingOrder
requires msg.value == somiPaymentPerOrder() exactly (under- and over-payment both revert).” - /docs/
developers/contracts/contract-specifications: “somiPaymentPerOrder 0.1 SOMI — exact payment
required when creating a pending stop order” - They contradict /docs/trading/spot/stop-orders:
“msg.value must then be somiPaymentPerOrder() plus the native amount the order needs beyond your
withdrawable balance in that pool’s vault. Any other value reverts with InsufficientSomiPayment.” - SDK
0.32.1 src/spot/stops.ts placeSpotStopOrder : “Native-base sell … The registry requires msg.value ==
somiPayment + delta exactly.” → value = somi + delta;

eth_call on Shannon (chain 50312), run twice: block 528446748 at 03:56 UTC and block 528447557 at
03:57 UTC, 2026-10-31. Sender 0x…de5c2 with a balance override. Order: isBid=false, qty=10 SOMI,
MARKET, LTE, trigger 0.1569 USDso:

 autopull [inputToken 0x28f3…4c00, requiredAmount 10000000000000000000, delta 10000000000000000000]   somi
 500000000000000000
 exact somiPaymentPerOrder 500000000000000000n REVERT InsufficientSomiPayment
 somi+delta               10500000000000000000n OK -> 18446744073709551669n
```

## Environment

### Original reported environment

SDK version 0.32.1, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read- only) Note: SpotStopOrderRegistry is not deployed on Hideki, so the eth_call ran on the Shannon testnet (50312) registry the docs list.

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Document the native-sell pre-load exception: required value includes the registry payment and the native auto-pull delta.
