# claimPerpVoucher cannot decode ClaimantNotFlat and ClaimantIsMainFunded

Severity: normal
Area: SDK
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 1; PDF pages 7-8

## Summary and impact

claimPerpVoucher cannot decode ClaimantNotFlat and ClaimantIsMainFunded. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Read the Trader.claimPerpVoucher JSDoc in dist/trade.d.ts:3419 of @somnia-chain/markets-sdk
      0.32.1 (https://unpkg.com/@somnia-chain/markets-sdk@0.32.1/dist/trade.d.ts).
   2. Offline, no signing: decode ClaimantNotFlat() = 0x3f3d2141 and ClaimantIsMainFunded() =
      0x1fac9b7d against the SDK’s bundled contractErrorsAbi with viem decodeErrorResult (script
      scripts/rv06-voucher-error-decode.mjs ).
   3. Confirm both selectors exist in the deployed VoucherDistributor implementation ( scripts/rv06b-
      voucher-selectors-onchain.mjs , read-only RPC).
```

## Expected

Both reverts decode to a ContractRevertError with errorName ClaimantNotFlat / ClaimantIsMainFunded , the same way the sibling claim errors ( AlreadyClaimed , BudgetExhausted , CampaignInactive ) already decode.

## Actual

The bundled table (546 entries) cannot decode either selector. The SDK’s own JSDoc admits it: “The SDK’s bundled error table does not name the last two yet, so they arrive with raw data and no errorName ”. Both selectors are in the deployed VoucherDistributor runtime code, so the contract can emit them. A bot or UI that branches on errorName cannot tell “close your positions first” (not flat) from “this account is main-funded”.

Scope: distinct from the SelfClaimDisabled() ( 0x3e31dcc2 ) decoding gap reported by others: different selectors and different claim conditions.

## Evidence

- [Original item excerpt](../evidence/pdf/001.txt) from PDF pages 7-8. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
Re-verified 2026-10-29 14:40 UTC, SDK 0.32.1 (still npm latest ; canary 0.32.2-canary.38575926931
has the same gap):

 bundled error entries: 546
 ClaimantNotFlat()        0x3f3d2141 -> UNDECODED (AbiErrorSignatureNotFoundError)
 ClaimantIsMainFunded()   0x1fac9b7d -> UNDECODED (AbiErrorSignatureNotFoundError)
 AlreadyClaimed()         0x646cf558 -> AlreadyClaimed
 BudgetExhausted()        0x16394a52 -> BudgetExhausted
 CampaignInactive()       0xe72b39f9 -> CampaignInactive
 VoucherDistributor -> EIP-1967 impl 0x9657f0fd53efc01cd108d93c835bb4b517732b43:
   ClaimantNotFlat selector present in runtime code: true
   ClaimantIsMainFunded selector present in runtime code: true   (block 36316281)


Raw: evidence/reverify-2026-10-29/rv06.log, rv06b.log
```

## Environment

### Original reported environment

@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (Hideki, chain 50383), wallet: none (read- only, offline decode)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Include both custom errors in the bundled error ABI and add a selector-decode regression case for each.
