# Pending-order identifier documentation contradicts its registry-local uniqueness

Severity: normal
Area: docs
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 18; PDF pages 35-36

## Summary and impact

Pending-order identifier documentation contradicts its registry-local uniqueness. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Open https://app.testnet.dreamdex.io/docs/developers/contracts/types.
   2. Compare the OrderId description at the top with the StoredPendingOrder.orderId field description
      at the bottom.
   3. Check the chain: fetch the receipts of these three Hideki transactions and decode the
      PendingOrderCreated log. topic0 is 0x3c81b59a…02df3 , the same topic0 the Events page documents.
           ◦ 0xe9911ad0df4595dc87b8bda7768ed7efad812eae086eb1ee6889698da9745e31 (BTC-PERP registry
             0x52e2cceb…15ef )
           ◦ 0xe4a60cba217a2e0f9db76edcca6a5972318a410db579f2911b33c6ec6d71db91 (ETH-PERP registry
             0x44bfa5b2…3a34 )
           ◦ 0x56ec06f9938f1b611edf68358011ca511ddc2f47ab55a55d262366c1dec68287 (SOL-PERP registry
             0x85a0879d…fa53 )
      Script: candidates/evidence/doc2/doc2_rcpt.mjs .
```

## Expected

One consistent statement. The chain behaves as the OrderId paragraph says: a pending-order id is unique only per registry/market and must always be paired with its registry.

## Actual

The same page says both. The StoredPendingOrder table, where integrators look up the id they key stop orders on, says “Globally unique pending-order identifier”. Code that trusts that line and keys stops by id alone, across markets, will mix orders up. All three receipts above emit PendingOrderCreated with the same orderId = 18446744073709551617 from three different registries. Across the first 6,000 indexed StopOrder rows, 298 ids appear in more than one registry.

## Evidence

- [Original item excerpt](../evidence/pdf/018.txt) from PDF pages 35-36. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
Docs, fetched live 2026-10-31 03:58 UTC, https://app.testnet.dreamdex.io/docs/developers/contracts/
types: - “OrderId (type) … An OrderId is unique only within a single market. The same value can refer to
different orders across markets, and resting and pending/stop orders are numbered independently.
Always pair an OrderId with its market to identify an order.” - “StoredPendingOrder (struct) … orderId
OrderId Globally unique pending-order identifier”

Chain (Hideki, chain 50383), receipts read 2026-10-31 03:59 UTC:

 0xe9911ad0df block 16388582 emitter 0x52e2ccebaec9332672c247e9a90aa3d61fb615ef topic0 0x3c81b59a…02df3
 orderId 18446744073709551617
 0xe4a60cba21 block 16455972 emitter 0x44bfa5b28684e8d2156d15b85902da18f02b3a34 topic0 0x3c81b59a…02df3
 orderId 18446744073709551617
 0x56ec06f993 block 17103616 emitter 0x85a0879d19777c343eb317a890d5058ab92b8f5d topic0 0x3c81b59a…02df3
 orderId 18446744073709551617

Indexer cross-check (https://hideki-dev.smk.somnia.host/v1/graphql, StopOrder , first 6,000 rows by
createdAt): 298 orderIdRaw values are shared by 2 or more registries. The indexer’s own primary key is
 "<registry>_<orderId>" . Sample: candidates/evidence/doc2/stop_collisions.json .

Caveat: these registries are the perps PerpStopOrderRegistry (same PendingOrderCreated signature and
topic0 as the documented SpotStopOrderRegistry event). The doc contradiction holds on its own.
Suggested fix: change the field text to “Pending-order id, unique within this registry”.
```

## Environment

### Original reported environment

SDK version 0.32.1, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read- only)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Describe the id as registry-local and use (registry, orderId) as the cross-market identifier.
