# Order-book parameter prose swaps minQuantity and lotSize

Severity: normal
Area: docs

## Steps to reproduce

1. Open the [contracts reference](https://somnia-platform-docs.vercel.app/markets/somnia-markets/contracts).
2. Compare the `getOrderBookParameters()` field list under “The shared order-book core” with `struct OrderBookParameters` under “Interface reference”.

## Expected

The prose gives the fields in the order the pool returns them (tickSize, minQuantity, lotSize), the same as the struct on the same page and the dreamDEX developer page.

## Actual

The prose lists `tickSize, lotSize, minQuantity`, but the struct lists `tickSize, minQuantity, lotSize`. Positional decoding based on the prose swaps the size increment and minimum order size. ABI-based named decoding is unaffected.

## Evidence

Source independently inspected on 1 November 2026; runtime behavior was not rerun. See [source references and verification boundaries](../evidence/round2/README.md).

[Freshly retrieved excerpts](../evidence/round2/contracts-excerpts.txt) show both orders on the same page. The historical chain values were not rechecked and are not needed to establish this documentation inconsistency.

## Environment

SDK version 0.32.1, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only)
