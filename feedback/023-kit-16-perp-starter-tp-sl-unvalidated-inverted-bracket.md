# perp-starter accepts percentages that invert or negate bracket prices

Severity: normal
Area: SDK
Validation status: independently reproduced offline (limited source/mocked strategy checks)
Disclosure: ordinary feedback candidate
Source item: 23; PDF pages 42-42

## Summary and impact

perp-starter accepts percentages that invert or negate bracket prices. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

1. Use Node.js 24 (validated here with v24.22.1). No npm install is needed.
2. From `dreamdex-submission/`, run:

   ```sh
   node --test --test-name-pattern='023:' scripts/reproduce-offline.mjs
   ```

3. The named test checks the current defect and its documented controls against pinned upstream text. A passing test confirms the described offline behavior, not a correction.
4. See [the full test output](../evidence/validation/offline-tests.tap) and [harness boundaries](../VALIDATION.md).

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. cd strategies/perp-starter
   2. NETWORK=hideki PERP_SYMBOL=BTC-PERP PERP_TAKE_PROFIT_PCT=-2 PERP_STOP_LOSS_PCT=-1 npx tsx src/
      index.ts
   3. NETWORK=hideki PERP_SYMBOL=BTC-PERP PERP_STOP_LOSS_PCT=150 npx tsx src/index.ts
```

## Expected

Percentages must be > 0 (and a stop-loss < 100), or startup fails with a clear message, the way envNum already rejects non-numbers.

## Actual

- Step 2: for a LONG at ~77,586 the “take-profit” is armed at 75,704.70 (below entry) and the “stop-loss” at 78,022.20 (above entry). Both triggers sit on the wrong side, so the take-profit closes at a loss and the stop-loss fires on a gain. No warning.
- Step 3: stop-loss -38624.80 , a negative trigger price, is passed on as the bracket’s stop. Cause: envNum ( packages/perp-core/src/config.ts:55-63 ) only checks Number.isFinite . strategies/perp- starter/src/index.ts:174-177 computes mark*(1±pct/100) without checking sign or range. A sign mistake is easy because the README talks about a stop-loss “of 1%” as a loss amount, and some UIs take the stop as a negative %.

A new offline check reproduced the narrow behavior described above. Live fills, chain conditions, balances, bracket execution and financial loss were not tested.

## Evidence

- [Original item excerpt](../evidence/pdf/023.txt) from PDF pages 42-42. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).
- [New offline execution log](../evidence/validation/offline-tests.tap), test `023:`.

### Evidence as supplied in the PDF

```text
2026-10-31 02:28:04 UTC, commit 4e75896896e024c03e2033d5920514f249998cd6, keyless DRY_RUN
on Hideki:

 == PERP_TAKE_PROFIT_PCT=-2 PERP_STOP_LOSS_PCT=-1
 … | long 50 USDso at 2x | take-profit -2% stop-loss -1% | dry-run true
 [dry-run] would place open long 0.00064 BTC @ 77585.7
 [dry-run] would arm a long bracket on BTC-PERP: take-profit 75704.70, stop-loss 78022.20, whole position,
 0.30 SOMI locked
 == PERP_STOP_LOSS_PCT=150
 [dry-run] would arm a long bracket on BTC-PERP: take-profit 78794.70, stop-loss -38624.80, whole position,
 0.30 SOMI locked
```

## Environment

### Original reported environment

dreamdex-bot-kit commit 4e75896896e024c03e2033d5920514f249998cd6, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, DRY_RUN)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

The new check confirms invalid price construction. Contract acceptance and the exact historical dry-run price values were not verified. A large take-profit percentage is not, by itself, proof of an invalid trigger.

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Validate positive take-profit and stop-loss percentages and require stop-loss below 100 before constructing prices.
