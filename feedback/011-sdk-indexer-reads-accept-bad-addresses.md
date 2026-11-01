# Indexer reads accept malformed addresses as empty histories

Severity: normal
Area: SDK

## Steps to reproduce

1. Run scripts/s21-invalid-address-errors.mjs (read-only). It passes malformed addresses ( "zz" , "0x123" , "hello" ) and a mixed-case address with a wrong checksum to getFills and listPerpPositions (indexer path), and the same wrong-checksum address to getPerpPosition (chain path).

## Expected

- getFills documents @throws {InvalidInputError} The pool … is unusable (dist/ somniaMarketsClient.d.ts:1655).
- The same input gets the same verdict on the indexer path and the chain path.

## Actual

- getFills("zz") , getFills("0x123") and listPerpPositions("hello") return [] , which a caller cannot tell apart from “no fills” / “no positions”. A typo in a pool or account address turns into a silent empty history.
- listPerpPositions accepts the wrong-checksum address (it lowercases it) and returns 21 rows, while getPerpPosition rejects the same address with an error. One input, two verdicts depending on which read the caller picks.

Scope: the indexer path only. Malformed or non-pool addresses on chain reads surfacing as RpcError , and the inconsistent outcomes for non-pool addresses, were reported separately by others and are not claimed here.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/011.txt) from PDF pages 23-23. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

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

@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (Hideki, chain 50383), wallet: none (read- only)
