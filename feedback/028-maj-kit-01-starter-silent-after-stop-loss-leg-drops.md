# perp-starter does not react when the protective stop leg disappears

Severity: normal
Area: SDK

## Steps to reproduce

1. Use Node.js 24 (validated here with v24.22.1). No npm install is needed.
2. From the repository root, run:

   ```sh
   node --test --test-name-pattern='028:' scripts/reproduce-offline.mjs
   ```

3. The named test checks the current defect and its documented controls against pinned upstream text. A passing test confirms the described offline behavior, not a correction.
4. See `[the full test output](../evidence/validation/offline-tests.tap)` and `[harness boundaries](../VALIDATION.md)`.

The strategy body is the real pinned upstream strategy. All perp-core helpers are mocked at its import boundary; this is not the original PDF harness and does not run the real perp-core or a contract. `DRY_RUN=false` exists only in an isolated synthetic process object with recording mocks.

1. export BOT_KIT=/path/to/dreamdex-bot-kit (commit 4e75896, after npm ci ), then cd scripts/maj- kit
2. ./run.sh perp-starter 100 HARNESS_SCENARIO=stopdrop PERP_NOTIONAL_USDSO=200 PERP_TICK_MS=500 HARNESS_STOP_MS=4200 PERP_SYMBOL=BTC-PERP DRY_RUN=false The harness runs the REAL strategies/ perp-starter/src/index.ts and the REAL perp-core. A Node resolve hook ( register.mjs + hooks.mjs ) points the strategy’s @dreamdex-bot-kit/perp-core import at perp-core-shim.ts . The shim re-exports every real perp-core function and swaps only createExchange for fake- exchange.ts , a mock exchange with no network and no key. All writes are recorded as [MOCK WRITE] .
3. Scenario: the bot opens a long and arms its bracket (TP 102000 / SL 99000). After two ticks the stop-loss leg (#12) fires at 99000 but places nothing ( dropReason NoFill / PlacementFailed). The registry deletes a fired leg and leaves its partner live and unlinked. Indexer schema docs, siblingOrderId : “A leg that fires WITHOUT filling leaves its partner live and UNLINKED”. The mark then keeps falling to 90000.

## Expected

The bot armed this bracket and says it is managing the position. When its stop-loss leg is gone and the position is still open, it should do one of three things: close the position (the mark is through the stop level), re-arm the missing leg, or at least warn loudly that the downside is unprotected. The bot already has the watched-exit code it would need ( hitStopLoss → closePosition ) for trading-key mode.

## Actual

The loop only counts the stops ( stops.length ) and checks whether a position exists. It never looks at which legs are still armed, and it never compares the mark to the stop level unless OWNER_ADDRESS is set ( watchedExits ). It prints 1 stop(s) armed on every tick while the long goes 9% through its 1% stop. The one stop still armed is the take-profit, which only fires on the way up. On Ctrl-C it then cancels that take-profit too and leaves the position with no protection at all (that exit-cancel behaviour is already reported, see dup keywords).

armed a long bracket on BTC-PERP: take-profit 102000.00 (#11), stop-loss 99000.00 (#12) long 0.001 BTC | uPnL 0.0000 | 2 stop(s) armed | mark 100000.00 long 0.001 BTC | uPnL 0.0000 | 1 stop(s) armed | mark 98000.00 long 0.001 BTC | uPnL -2.0000 | 1 stop(s) armed | mark 96000.00 ... long 0.001 BTC | uPnL -10.0000 | 1 stop(s) armed | mark 90000.00 [MOCK WRITE] cancelPerpStopOrders 11

(The mock’s position size and uPnL are static fixtures. The point is that the bot takes no action.)

Code: strategies/perp-starter/src/index.ts at 4e75896, in the watch loop ( const stops = watchedExits ? [] : await pendingStops(...) , then the if (watchedExits && live !== undefined) block). In owner-key mode no branch acts on a missing leg or on the mark. isRealStopFailure in packages/perp-core/src/stops.ts is exported but no strategy calls it.

Why the leg drops on the live testnet: self-match CancelTaker against the trader’s own resting order (Samuel1505 #10, 59 drops / 22 traders), or a slippage-bounded STOP_MARKET that finds no liquidity (NoFill).

## Evidence

Offline reproduction passed; see the linked test output.

- [Original item excerpt](../evidence/pdf/028.txt) from PDF pages 48-49. 
- [Source provenance and limitations](../evidence/README.md).
- [New offline execution log](../evidence/validation/offline-tests.tap), test `028:`.

### Recorded results

```text
• Log: evidence/candidates/maj-kit-starter-stopdrop.log
    • Harness: scripts/maj-kit/{run.sh,register.mjs,hooks.mjs,perp-core-shim.ts,fake-
      exchange.ts,package.json}
    • Run 2026-10-31 ~04:29 UTC, dreamdex-bot-kit 4e75896 (origin/main after git fetch )

Severity note: the money loss needs the registry drop to happen first, and the drop is a contract issue
already reported as critical. The kit’s own failure is that it neither detects the drop nor falls back. That
makes it normal, or major if the judges count “the default protection path silently stops protecting”.
```

## Environment

dreamdex-bot-kit commit 4e75896, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, mock exchange, no transactions)

Offline reproduction: Node.js v24.22.1; synthetic inputs; no wallet or transactions.
