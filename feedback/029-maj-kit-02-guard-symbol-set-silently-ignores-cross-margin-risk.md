# perp-guard symbol filtering suppresses account-wide risk reporting

Severity: normal
Area: SDK
Validation status: independently reproduced offline (limited source/mocked strategy checks)
Disclosure: ordinary feedback candidate
Source item: 29; PDF pages 50-50

## Summary and impact

perp-guard symbol filtering suppresses account-wide risk reporting. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

1. Use Node.js 24 (validated here with v24.22.1). No npm install is needed.
2. From `dreamdex-submission/`, run:

   ```sh
   node --test --test-name-pattern='029:' scripts/reproduce-offline.mjs
   ```

3. The named test checks the current defect and its documented controls against pinned upstream text. A passing test confirms the described offline behavior, not a correction.
4. See [the full test output](../evidence/validation/offline-tests.tap) and [harness boundaries](../VALIDATION.md).

The strategy body is the real pinned upstream strategy. All perp-core helpers are mocked at its import boundary; this is not the original PDF harness and does not run the real perp-core or a contract. `DRY_RUN=false` exists only in an isolated synthetic process object with recording mocks.

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. export BOT_KIT=/path/to/dreamdex-bot-kit (commit 4e75896, after npm ci ), then cd scripts/maj-
      kit
   2. ./run.sh perp-guard 100 HARNESS_SCENARIO=guard PERP_GUARD_POLL_MS=1000 HARNESS_STOP_MS=3500
      PERP_SYMBOL=BTC-PERP DRY_RUN=false
   3. ./run.sh perp-guard 100 HARNESS_SCENARIO=guard PERP_GUARD_POLL_MS=1000 HARNESS_STOP_MS=1500
      PERP_SYMBOL= DRY_RUN=false The harness runs the real perp-guard and real perp-core against a
      mock exchange: an ETH-PERP long only, and account health 1.05x maintenance (equity 1050 /
      mmReq 1000), which is below the 1.15 flatten threshold.
```

## Expected

getMarginAccount is account-wide (cross), so health 1.05 is real liquidation risk whatever PERP_SYMBOL says. The guard should act, or at least print the health and say that the risk sits in a market it was told not to watch.

## Actual

- With PERP_SYMBOL=BTC-PERP : the guard prints only its banner. It runs four cycles with no line at all and no write. In strategies/perp-guard/src/index.ts at 4e75896 the loop reads the account-wide healthRatio(snapshot) , then positionIn(BTC) is undefined, and if (!position) continue; skips it before anything is logged.
- With PERP_SYMBOL blank: ETH-PERP: long 10 ... health 1.050x ... closing the position → [MOCK WRITE] placePerpOrder isBid=false .

The root .env.example tells users to set PERP_SYMBOL for perp-starter, perp-maker and perp-funding, and loadEnv() walks up to that one root .env . So a guard started next to another perp bot inherits the symbol. The README does call blank “the safer default”, but nothing at runtime says the guard is blind.

A new offline check reproduced the narrow behavior described above. Live fills, chain conditions, balances, bracket execution and financial loss were not tested.

## Evidence

- [Original item excerpt](../evidence/pdf/029.txt) from PDF pages 50-50. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).
- [New offline execution log](../evidence/validation/offline-tests.tap), test `029:`.

### Evidence as supplied in the PDF

```text
• Log: evidence/candidates/maj-kit-guard-symbol.log
    • Harness: scripts/maj-kit/* (same as maj-kit-01)
    • Run 2026-10-31 ~04:28 UTC, commit 4e75896
```

## Environment

### Original reported environment

dreamdex-bot-kit commit 4e75896, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, mock exchange, no transactions)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Always report account-wide margin health and identify exposure excluded by a symbol filter; make the filter limitation visible at startup.
