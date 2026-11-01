# perp-guard symbol filtering suppresses account-wide risk reporting

Severity: normal
Area: SDK

## Steps to reproduce

1. Use Node.js 24 (validated here with v24.22.1). No npm install is needed.
2. From the repository root, run:

   ```sh
   node --test --test-name-pattern='029:' scripts/reproduce-offline.mjs
   ```

3. The named test checks the current defect and its documented controls against pinned upstream text. A passing test confirms the described offline behavior, not a correction.
4. See `[the full test output](../evidence/validation/offline-tests.tap)` and `[harness boundaries](../VALIDATION.md)`.

The strategy body is the real pinned upstream strategy. All perp-core helpers are mocked at its import boundary; this is not the original PDF harness and does not run the real perp-core or a contract. `DRY_RUN=false` exists only in an isolated synthetic process object with recording mocks.

1. export BOT_KIT=/path/to/dreamdex-bot-kit (commit 4e75896, after npm ci ), then cd scripts/maj- kit
2. ./run.sh perp-guard 100 HARNESS_SCENARIO=guard PERP_GUARD_POLL_MS=1000 HARNESS_STOP_MS=3500 PERP_SYMBOL=BTC-PERP DRY_RUN=false
3. ./run.sh perp-guard 100 HARNESS_SCENARIO=guard PERP_GUARD_POLL_MS=1000 HARNESS_STOP_MS=1500 PERP_SYMBOL= DRY_RUN=false The harness runs the real perp-guard and real perp-core against a mock exchange: an ETH-PERP long only, and account health 1.05x maintenance (equity 1050 / mmReq 1000), which is below the 1.15 flatten threshold.

## Expected

getMarginAccount is account-wide (cross), so health 1.05 is real liquidation risk whatever PERP_SYMBOL says. The guard should act, or at least print the health and say that the risk sits in a market it was told not to watch.

## Actual

- With PERP_SYMBOL=BTC-PERP : the guard prints only its banner. It runs four cycles with no line at all and no write. In strategies/perp-guard/src/index.ts at 4e75896 the loop reads the account-wide healthRatio(snapshot) , then positionIn(BTC) is undefined, and if (!position) continue; skips it before anything is logged.
- With PERP_SYMBOL blank: ETH-PERP: long 10 ... health 1.050x ... closing the position → [MOCK WRITE] placePerpOrder isBid=false .

The root .env.example tells users to set PERP_SYMBOL for perp-starter, perp-maker and perp-funding, and loadEnv() walks up to that one root .env . So a guard started next to another perp bot inherits the symbol. The README does call blank “the safer default”, but nothing at runtime says the guard is blind.

## Evidence

Offline reproduction passed; see the linked test output.

- [Original item excerpt](../evidence/pdf/029.txt) from PDF pages 50-50. 
- [Source provenance and limitations](../evidence/README.md).
- [New offline execution log](../evidence/validation/offline-tests.tap), test `029:`.

### Recorded results

```text
• Log: evidence/candidates/maj-kit-guard-symbol.log
    • Harness: scripts/maj-kit/* (same as maj-kit-01)
    • Run 2026-10-31 ~04:28 UTC, commit 4e75896
```

## Environment

dreamdex-bot-kit commit 4e75896, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, mock exchange, no transactions)

Offline reproduction: Node.js v24.22.1; synthetic inputs; no wallet or transactions.
