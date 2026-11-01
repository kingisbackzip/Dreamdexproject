# Indexer reads accept malformed addresses as empty histories

Severity: normal
Area: SDK
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 11; PDF pages 23-23

## Summary and impact

Indexer reads accept malformed addresses as empty histories. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Run scripts/s21-invalid-address-errors.mjs (read-only). It passes malformed addresses ( "zz" ,
      "0x123" , "hello" ) and a mixed-case address with a wrong checksum to getFills and
      listPerpPositions (indexer path), and the same wrong-checksum address to getPerpPosition
      (chain path).
```

## Expected

- getFills documents @throws {InvalidInputError} The pool … is unusable (dist/ somniaMarketsClient.d.ts:1655).
- The same input gets the same verdict on the indexer path and the chain path.

## Actual

- getFills("zz") , getFills("0x123") and listPerpPositions("hello") return [] , which a caller cannot tell apart from “no fills” / “no positions”. A typo in a pool or account address turns into a silent empty history.
- listPerpPositions accepts the wrong-checksum address (it lowercases it) and returns 21 rows, while getPerpPosition rejects the same address with an error. One input, two verdicts depending on which read the caller picks.

Scope: the indexer path only. Malformed or non-pool addresses on chain reads surfacing as RpcError , and the inconsistent outcomes for non-pool addresses, were reported separately by others and are not claimed here.

## Evidence

- [Original item excerpt](../evidence/pdf/011.txt) from PDF pages 23-23. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
Re-run 2026-10-29 14:40 UTC, head block 36316342 (same as 2026-10-22 04:38/04:39 UTC):

 getFills("zz")                                -> OK 0 rows
 getFills("0x123")                             -> OK 0 rows
 listPerpPositions("hello")                    -> OK 0 rows
 listPerpPositions(bad-checksum 0x47537e3A…)   -> OK 21 rows
 getPerpPosition(account=bad-checksum)         -> RpcError: rpc readContract getPosition failed: Address
 "0x47537e3A3EA6E9391F3B26EA45618DB6828C8BFF" is invalid.


Raw: evidence/reverify-2026-10-29/s21.log
```

## Environment

### Original reported environment

@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (Hideki, chain 50383), wallet: none (read- only)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Validate address format consistently before indexer queries and document checksum handling across read paths.
