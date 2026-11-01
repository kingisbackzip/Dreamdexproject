# Backtest overrides silently accept unknown configuration keys

Severity: normal
Area: docs
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 26; PDF pages 46-46

## Summary and impact

Backtest overrides silently accept unknown configuration keys. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Fix a window: S=$(( ($(date +%s)-3*86400)*1000 )); U=$(( ($(date +%s)-3600)*1000 ))
   2. npx tsx scripts/backtest.ts run grid --network testnet --interval 1h --since $S --until $U --
      quiet with, in turn: no --set ; --set GRID_STEP_BPS=200 (the variable name the user has in .env); --
      set stepbps=200 (wrong case); --set stepBps=200 .
```

## Expected

An override that matches no config key is an error (or at least a warning that lists the valid keys), as -- set stepBps=abc already is for a bad value. docs/backtesting.md presents --set as the way to “Override strategy knobs without editing .env”.

## Actual

(none)                    grid +2.61   40 trades   pnl=2.6067 --set GRID_STEP_BPS=200   grid +2.61   40 trades   pnl=2.6067 --set stepbps=200         grid +2.61   40 trades   pnl=2.6067 --set stepBps=200         grid -0.02    8 trades   pnl=-0.0195

The first two overrides are dropped with no message and exit code 0. The table looks like a 200 bps grid result but is the default 30 bps grid. applyConfigOverrides copies unknown keys on purpose (“Allow unknown keys for forward-compat; strategies ignore extras”), and nothing tells the user. Neither docs/ backtesting.md nor the CLI help says that keys are camelCase config fields rather than the .env names.

## Evidence

- [Original item excerpt](../evidence/pdf/026.txt) from PDF pages 46-46. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
• packages/backtest/src/config-overrides.ts:20-23 ; docs/backtesting.md:19,51 ; strategies/grid/src/
      config.ts:31 ( stepBps: num("GRID_STEP_BPS", 30) ) at commit
      4e75896896e024c03e2033d5920514f249998cd6.
    • Output: evidence/candidates/kit20-23/bt-set.log , 2026-10-31 03:57 UTC, Shannon testnet REST
      candles (WETH:USDso 1h, 71 candles). Repeated with --days 1 : --set bogusKey=5 also runs clean.
```

## Environment

### Original reported environment

dreamdex-bot-kit commit 4e75896896e024c03e2033d5920514f249998cd6, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, DRY_RUN). The backtest reads public candles from the spot REST API ( --network testnet ). Hideki is not accepted by the backtest CLI.

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Reject unrecognized override keys and print the effective applied overrides alongside the backtest result.
