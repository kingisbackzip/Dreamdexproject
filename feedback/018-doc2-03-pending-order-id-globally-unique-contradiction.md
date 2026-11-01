# Pending-order identifier documentation contradicts its registry-local uniqueness

Severity: normal
Area: docs

## Steps to reproduce

1. Open https://app.testnet.dreamdex.io/docs/developers/contracts/types.
2. Compare the OrderId description at the top with the StoredPendingOrder.orderId field description at the bottom.
3. Check the chain: fetch the receipts of these three Hideki transactions and decode the PendingOrderCreated log. topic0 is 0x3c81b59a…02df3 , the same topic0 the Events page documents. ◦ 0xe9911ad0df4595dc87b8bda7768ed7efad812eae086eb1ee6889698da9745e31 (BTC-PERP registry 0x52e2cceb…15ef ) ◦ 0xe4a60cba217a2e0f9db76edcca6a5972318a410db579f2911b33c6ec6d71db91 (ETH-PERP registry 0x44bfa5b2…3a34 ) ◦ 0x56ec06f9938f1b611edf68358011ca511ddc2f47ab55a55d262366c1dec68287 (SOL-PERP registry 0x85a0879d…fa53 ) Script: candidates/evidence/doc2/doc2_rcpt.mjs .

## Expected

One consistent statement. The chain behaves as the OrderId paragraph says: a pending-order id is unique only per registry/market and must always be paired with its registry.

## Actual

The same page says both. The StoredPendingOrder table, where integrators look up the id they key stop orders on, says “Globally unique pending-order identifier”. Code that trusts that line and keys stops by id alone, across markets, will mix orders up. All three receipts above emit PendingOrderCreated with the same orderId = 18446744073709551617 from three different registries. Across the first 6,000 indexed StopOrder rows, 298 ids appear in more than one registry.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/018.txt) from PDF pages 35-36. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

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

SDK version 0.32.1, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read- only)
