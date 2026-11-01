# perp-starter accepts percentages that invert or negate bracket prices

Severity: normal
Area: SDK

## Steps to reproduce

1. Use Node.js 24 (validated here with v24.22.1). No npm install is needed.
2. From the repository root, run:

   ```sh
   node --test --test-name-pattern='023:' scripts/reproduce-offline.mjs
   ```

3. The named test checks the current defect and its documented controls against pinned upstream text. A passing test confirms the described offline behavior, not a correction.
4. See `[the full test output](../evidence/validation/offline-tests.tap)` and `[harness boundaries](../VALIDATION.md)`.

1. cd strategies/perp-starter
2. NETWORK=hideki PERP_SYMBOL=BTC-PERP PERP_TAKE_PROFIT_PCT=-2 PERP_STOP_LOSS_PCT=-1 npx tsx src/ index.ts
3. NETWORK=hideki PERP_SYMBOL=BTC-PERP PERP_STOP_LOSS_PCT=150 npx tsx src/index.ts

## Expected

Percentages must be > 0 (and a stop-loss < 100), or startup fails with a clear message, the way envNum already rejects non-numbers.

## Actual

- Step 2: for a LONG at ~77,586 the “take-profit” is armed at 75,704.70 (below entry) and the “stop-loss” at 78,022.20 (above entry). Both triggers sit on the wrong side, so the take-profit closes at a loss and the stop-loss fires on a gain. No warning.
- Step 3: stop-loss -38624.80 , a negative trigger price, is passed on as the bracket’s stop. Cause: envNum ( packages/perp-core/src/config.ts:55-63 ) only checks Number.isFinite . strategies/perp- starter/src/index.ts:174-177 computes mark*(1±pct/100) without checking sign or range. A sign mistake is easy because the README talks about a stop-loss “of 1%” as a loss amount, and some UIs take the stop as a negative %.

The new check confirms invalid price construction. Contract acceptance and the exact historical dry-run price values were not verified. A large take-profit percentage is not, by itself, proof of an invalid trigger.

## Evidence

Offline reproduction passed; see the linked test output.

- [Original item excerpt](../evidence/pdf/023.txt) from PDF pages 42-42. 
- [Source provenance and limitations](../evidence/README.md).
- [New offline execution log](../evidence/validation/offline-tests.tap), test `023:`.

### Recorded results

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

dreamdex-bot-kit commit 4e75896896e024c03e2033d5920514f249998cd6, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, DRY_RUN)

Offline reproduction: Node.js v24.22.1; synthetic inputs; no wallet or transactions.
