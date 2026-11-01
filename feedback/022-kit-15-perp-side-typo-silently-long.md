# Unknown PERP_SIDE values silently select long

Severity: major
Area: SDK
Validation status: independently reproduced offline (limited source/mocked strategy checks)
Disclosure: ordinary feedback candidate
Source item: 22; PDF pages 41-41

## Summary and impact

Unknown PERP_SIDE values silently select long. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

1. Use Node.js 24 (validated here with v24.22.1). No npm install is needed.
2. From `dreamdex-submission/`, run:

   ```sh
   node --test --test-name-pattern='022:' scripts/reproduce-offline.mjs
   ```

3. The named test checks the current defect and its documented controls against pinned upstream text. A passing test confirms the described offline behavior, not a correction.
4. See [the full test output](../evidence/validation/offline-tests.tap) and [harness boundaries](../VALIDATION.md).

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. cd strategies/perp-starter
   2. NETWORK=hideki PERP_SYMBOL=BTC-PERP PERP_SIDE=sell npx tsx src/index.ts
   3. Repeat with PERP_SIDE=bear and PERP_SIDE=short .
```

## Expected

An unrecognised value is rejected at startup (the kit already throws on non-numeric values via envNum , and on a bad NETWORK / OWNER_ADDRESS). It should never be mapped to the opposite direction.

## Actual

PERP_SIDE=sell (the spot/ccxt word for going short) and PERP_SIDE=bear both give … | long 50 USDso at 2x … and [dry-run] would place open long 0.00064 BTC @ 77592.1 . Only short (any case/whitespace) goes short. With DRY_RUN=false the bot would open a leveraged position in the opposite direction from the one intended, and arm a bracket around it. Cause: strategies/perp-starter/src/index.ts:57 : (process.env.PERP_SIDE ?? "long").trim().toLowerCase() === "short" ? "short" : "long" .

A new offline check reproduced the narrow behavior described above. Live fills, chain conditions, balances, bracket execution and financial loss were not tested.

## Evidence

- [Original item excerpt](../evidence/pdf/022.txt) from PDF pages 41-41. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).
- [New offline execution log](../evidence/validation/offline-tests.tap), test `022:`.

### Evidence as supplied in the PDF

```text
2026-10-31 02:29:07 UTC, commit 4e75896896e024c03e2033d5920514f249998cd6, keyless DRY_RUN
on Hideki:

 == PERP_SIDE='sell'
 perp-starter on BTC-PERP (BTC/USDso:USDso) | long 50 USDso at 2x | take-profit 2% stop-loss 1% | dry-run
 true
 [dry-run] would place open long 0.00064 BTC @ 77592.1
 == PERP_SIDE='SHORT'
 … | short 50 USDso at 2x … would place open short 0.00064 BTC @ 77278
 == PERP_SIDE='bear'
 … | long 50 USDso at 2x … would place open long 0.00064 BTC @ 77593.1


strategies/perp-starter/src/index.ts:57 ; README.md:11 documents only long / short , with no warning
that anything else means long.
```

## Environment

### Original reported environment

dreamdex-bot-kit commit 4e75896896e024c03e2033d5920514f249998cd6, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, DRY_RUN)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed major in the source PDF because a configuration error can select unintended behavior. The new package does not establish live financial loss, exploitability or organizer acceptance.

## Scope, duplicates and limitations

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Reject values outside the documented long/short enum before constructing a strategy or order.
