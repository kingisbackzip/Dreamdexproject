# claimPerpVoucher cannot decode ClaimantNotFlat and ClaimantIsMainFunded

Severity: normal
Area: SDK

## Steps to reproduce

1. Inspect the `Trader.claimPerpVoucher` JSDoc in [`@somnia-chain/markets-sdk@0.32.1/dist/trade.d.ts`](https://unpkg.com/@somnia-chain/markets-sdk@0.32.1/dist/trade.d.ts), around line 3419.
2. Using viem's `decodeErrorResult` and the SDK's bundled `contractErrorsAbi`, decode `ClaimantNotFlat()` (`0x3f3d2141`) and `ClaimantIsMainFunded()` (`0x1fac9b7d`). This step is offline and requires no signing.
3. As controls, decode `AlreadyClaimed()` (`0x646cf558`), `BudgetExhausted()` (`0x16394a52`) and `CampaignInactive()` (`0xe72b39f9`) with the same ABI.
4. For the reported deployment check, use read-only `eth_getCode` on Hideki at block `36316281` for VoucherDistributor implementation `0x9657f0fd53efc01cd108d93c835bb4b517732b43` and inspect the runtime bytecode for both selectors. Selector presence alone does not prove that a revert path is reachable.

## Expected

Both reverts decode to a ContractRevertError with errorName ClaimantNotFlat / ClaimantIsMainFunded , the same way the sibling claim errors ( AlreadyClaimed , BudgetExhausted , CampaignInactive ) already decode.

## Actual

The bundled table (546 entries) cannot decode either selector. The SDK’s own JSDoc admits it: “The SDK’s bundled error table does not name the last two yet, so they arrive with raw data and no errorName ”. Both selectors are in the deployed VoucherDistributor runtime code, so the contract can emit them. A bot or UI that branches on errorName cannot tell “close your positions first” (not flat) from “this account is main-funded”.

Scope: distinct from the SelfClaimDisabled() ( 0x3e31dcc2 ) decoding gap reported by others: different selectors and different claim conditions.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/001.txt) from PDF pages 7-8. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

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

@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (Hideki, chain 50383), wallet: none (read- only, offline decode)
