# fromHuman number rounding differs from the documented decimal rounding rule

Severity: normal
Area: SDK
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 37; PDF pages 60-61

## Summary and impact

fromHuman number rounding differs from the documented decimal rounding rule. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

1. From `dreamdex-submission/`, run `npm install --ignore-scripts --no-audit --no-fund` to install the exact direct SDK/viem versions in package.json.
2. Run `node scripts/reproduce-sdk-units.mjs`. The script performs only pure SDK conversions; it creates no client and makes no RPC calls.
3. Compare the numbered output to the historical evidence below. This reconstructed script has not been executed here because the SDK dependencies were not available locally.

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Install @somnia-chain/markets-sdk@0.32.1 (no network, no keys needed).
   2. Read the fromHuman JSDoc in dist/units.d.ts : “A number carrying more fraction digits than
       decimals is ROUNDED to scale (half-away-from-zero, via toFixed ): fromHuman(0.1234567, 6) is
       123457n .”
   3. Run node scripts/sdk2-fromhuman-half.mjs , which calls fromHuman with exact decimal halves as a
      number and as a string.
```

## Expected

Half-away-from-zero, as documented: fromHuman(1.005, 2) = 101n , fromHuman(2.675, 2) = 268n , fromHuman(-1.005, 2) = -101n , fromHuman(0.0000005, 6) = 1n , fromHuman(0.00000025, 7) = 3n . The number and string forms of the same literal should give the same raw amount.

## Actual

For these inputs the number path rounds toward zero, because Number.prototype.toFixed rounds the double’s binary expansion (1.005 is stored as 1.00499999…). The string path, given the same literal, rounds half-away-from-zero. So one value typed by a user produces two different raw amounts depending on its JS type. 0.0000005 at 6 decimals (half of one raw unit) becomes 0n , so a non-zero human amount silently converts to zero.

## Evidence

- [Original item excerpt](../evidence/pdf/037.txt) from PDF pages 60-61. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
node scripts/sdk2-fromhuman-half.mjs , run twice with identical output (md5 14ab64ea…), 2026-10-31
~03:54 UTC. This is a pure function, so no block is involved:

 fromHuman(1.005, 2) = 100n expected(half-away) 101n MISMATCH | fromHuman("1.005", 2) = 101n
 fromHuman(5e-7, 6) = 0n expected(half-away) 1n MISMATCH | fromHuman("5e-7", 6) = throws
 InvalidDecimalNumberError
 fromHuman(2.5e-7, 7) = 2n expected(half-away) 3n MISMATCH | fromHuman("2.5e-7", 7) = throws
 InvalidDecimalNumberError
 fromHuman(-1.005, 2) = -100n expected(half-away) -101n MISMATCH | fromHuman("-1.005", 2) = -101n
 fromHuman(2.675, 2) = 267n expected(half-away) 268n MISMATCH | fromHuman("2.675", 2) = 268n
 fromHuman(1.0000005, 6) = 1000001n expected(half-away) 1000001n ok | fromHuman("1.0000005", 6) =
 1000001n
 fromHuman(0.0000015, 6) = 2n expected(half-away) 2n ok | fromHuman("0.0000015", 6) = 2n


humanToDecimalString ’s own JSDoc says toFixed “prints the float’s binary expansion rather than the
number the caller wrote”, but the over-precision branch still uses it. Suggested fix: when String(n) is
plain decimal notation, round that string half-away-from-zero (the string path already does this).
Otherwise, document the rounding as “toFixed (binary) rounding, not half-away-from-zero”.

This is not the already-reported “string input is rounded, not rejected” issue. That one is about strings.
This one is about the number path contradicting its stated rounding mode and the string path.
```

## Environment

### Original reported environment

SDK version 0.32.1, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read- only)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

JavaScript numeric literals are binary floats, not exact decimal halves. The disagreement with the claimed decimal rounding rule is the issue; do not describe the binary value itself as an exact decimal.

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Round the decimal representation consistently where intended, or describe binary toFixed rounding precisely and recommend decimal-string input.
