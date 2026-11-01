# Balance and amount helpers silently ignore invalid quantum values

Severity: normal
Area: SDK

## Steps to reproduce

1. From the repository root, run `npm install --ignore-scripts --no-audit --no-fund` to install the exact direct SDK/viem versions in package.json.
2. Run `node scripts/reproduce-sdk-units.mjs`. The script performs only pure SDK conversions; it creates no client and makes no RPC calls.
3. Compare the numbered output to the historical evidence below. This additional script has not been executed in this validation pass.

1. Install @somnia-chain/markets-sdk@0.32.1 (no network needed).
2. Take the Hideki 1000PEPE perp. Its indexer Market row has quoteDecimals: 18 and tickSize: "100000000000" , which is 0.0000001 USDso. In JS, String(0.0000001) is "1e-7" .
3. Run node scripts/sdk2-quantum-silent.mjs . It calls floorRawBalance(raw, 18, q) and ceilRawAmount(raw, 18, q) for q in "0.0000001" , "1e-7" , "0" , "-0.0000001" , "abc" , and calls snapRawToGrid with step 0n and a negative step for comparison.

## Expected

The JSDoc promises a result that is “a whole multiple of quantum ”. ceilRawAmount exists so that a minimum is never sent below the pool’s grid (“a minimum rounded DOWN falls below what the pool requires and the order is rejected”). A quantum the helper cannot parse, or one that is zero or negative, should throw InvalidInputError , as the sibling snapRawToGrid / roundPriceToTick do for an invalid step. It should not return a value that is not on the grid.

## Actual

Only the plain-decimal "0.0000001" is applied. For "1e-7" , "0" , "-0.0000001" and "abc" , both helpers swallow the parseUnits error ( catch { step = 0n } in dist/units.js ) and fall back to the unquantized value. ceilRawAmount returns the raw input unchanged and off the tick grid, and floorRawBalance returns full 18-decimal precision. Nothing tells the caller that the quantum was ignored. "1e-7" is exactly what String(n) produces for this market’s tick (and for any step below 1e-6), so a caller building the quantum from a number hits this path without any warning.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/038.txt) from PDF pages 62-63. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

```text
node scripts/sdk2-quantum-silent.mjs , run twice with identical output (md5 0a99a990…), 2026-10-31
~03:54 UTC. This is a pure function. The tick comes from the indexer Market row for 1000PEPE
( tickSize 100000000000 , quoteDecimals 18 ).

 String(0.0000001) = "1e-7"
 quantum "0.0000001"   floorRawBalance=0.0034567 ceilRawAmount=3456800000000000n on-grid=true
 quantum "1e-7"        floorRawBalance=0.003456789012345678 ceilRawAmount=3456789012345678n on-grid=false
 quantum "0"           floorRawBalance=0.003456789012345678 ceilRawAmount=3456789012345678n on-grid=false
 quantum "-0.0000001" floorRawBalance=0.003456789012345678 ceilRawAmount=3456789012345678n on-grid=false
 quantum "abc"         floorRawBalance=0.003456789012345678 ceilRawAmount=3456789012345678n on-grid=false
 snapRawToGrid(raw, 0n, "up") throws InvalidInputError: @somnia-chain/markets-sdk: invalid grid step 0
 snapRawToGrid(raw, -100000000000n, "up") throws InvalidInputError: @somnia-chain/markets-sdk: invalid grid
 step -100000000000


Source: dist/units.js floorRawBalance (lines ~447-460), which uses try { step = parseUnits(quantum,
decimals) } catch { step = 0n } if (step <= 0n) return balanceFloor(raw, decimals) . ceilRawAmount uses
the same pattern. Suggested fix: throw InvalidInputError on an unparseable or non-positive quantum,
or accept exponent notation, which viem parseUnits rejects.
```

## Environment

SDK version 0.32.1, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read- only)
