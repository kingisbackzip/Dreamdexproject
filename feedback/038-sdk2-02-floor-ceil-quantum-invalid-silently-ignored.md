# Balance and amount helpers silently ignore invalid quantum values

Severity: normal
Area: SDK
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 38; PDF pages 62-63

## Summary and impact

Balance and amount helpers silently ignore invalid quantum values. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

1. From `dreamdex-submission/`, run `npm install --ignore-scripts --no-audit --no-fund` to install the exact direct SDK/viem versions in package.json.
2. Run `node scripts/reproduce-sdk-units.mjs`. The script performs only pure SDK conversions; it creates no client and makes no RPC calls.
3. Compare the numbered output to the historical evidence below. This reconstructed script has not been executed here because the SDK dependencies were not available locally.

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Install @somnia-chain/markets-sdk@0.32.1 (no network needed).
   2. Take the Hideki 1000PEPE perp. Its indexer Market row has quoteDecimals: 18 and tickSize:
      "100000000000" , which is 0.0000001 USDso. In JS, String(0.0000001) is "1e-7" .
   3. Run node scripts/sdk2-quantum-silent.mjs . It calls floorRawBalance(raw, 18, q) and
       ceilRawAmount(raw, 18, q) for q in "0.0000001" , "1e-7" , "0" , "-0.0000001" , "abc" , and calls
       snapRawToGrid with step 0n and a negative step for comparison.
```

## Expected

The JSDoc promises a result that is “a whole multiple of quantum ”. ceilRawAmount exists so that a minimum is never sent below the pool’s grid (“a minimum rounded DOWN falls below what the pool requires and the order is rejected”). A quantum the helper cannot parse, or one that is zero or negative, should throw InvalidInputError , as the sibling snapRawToGrid / roundPriceToTick do for an invalid step. It should not return a value that is not on the grid.

## Actual

Only the plain-decimal "0.0000001" is applied. For "1e-7" , "0" , "-0.0000001" and "abc" , both helpers swallow the parseUnits error ( catch { step = 0n } in dist/units.js ) and fall back to the unquantized value. ceilRawAmount returns the raw input unchanged and off the tick grid, and floorRawBalance returns full 18-decimal precision. Nothing tells the caller that the quantum was ignored. "1e-7" is exactly what String(n) produces for this market’s tick (and for any step below 1e-6), so a caller building the quantum from a number hits this path without any warning.

## Evidence

- [Original item excerpt](../evidence/pdf/038.txt) from PDF pages 62-63. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

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

### Original reported environment

SDK version 0.32.1, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read- only)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Reject unparseable or non-positive quantum input explicitly, or intentionally support exponent notation with equivalent grid behavior.
