# perp-maker rounds asks down toward or below the mark

Severity: normal
Area: SDK
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 24; PDF pages 43-44

## Summary and impact

perp-maker rounds asks down toward or below the mark. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Read the quote path: strategies/perp-maker/src/index.ts:142-143 builds askPx = mark * (1 + half
      - skew) , then placePerp sends alignPrice(adjusted, …) ( packages/perp-core/src/orders.ts:159 ),
      and alignPrice is (price / tick) * tick ( packages/perp-core/src/markets.ts:149 ). It floors for both
      sides; no side is passed.
   2. Take XLM-PERP’s live params on Hideki (tickSize 0.0001; tick ≈ 5.9 bps of the ~0.169 mark; ADA-
      PERP is 5.2 bps, PUMP 2.4, WLD 2.5).
   3. Run the perp-maker math through the real alignPrice , from strategies/perp-maker : npx tsx maker-
      ask-sweep.mts (script at evidence/candidates/kit20-23/maker-ask-sweep.mts ). It uses the default
      PERP_MM_HALF_SPREAD_BPS=15 , PERP_MM_INVENTORY_SKEW_BPS=10 , inventory at the cap (lean = +1, so
      only the ask is quoted and it should sit 5 bps above the mark), and then
      PERP_MM_HALF_SPREAD_BPS=3 with no inventory.
   4. Read-only check against the live markets: NETWORK=hideki DRY_RUN=true npx tsx k20.mts (same
      scratch folder) prints the dry-run quote line for each market.
```

## Expected

A maker’s sell price rounds UP to the tick and its buy price rounds DOWN, so rounding only widens the quote and never moves it toward or through the mark. The SDK’s own reference says the same: “A buy price rounds down, a sell price rounds up” (Somnia Markets TypeScript reference, units-and-scales). The kit’s own spot example does it too ( examples/02-modular-typescript/src/utils/price.ts:39 : bid floor, ask ceil).

## Actual

The ask is floored, so up to one whole tick of the intended edge is lost. On XLM that tick is bigger than the 5 bps the default config leaves on the ask at full inventory, so the ask lands below the mark:

defaults (half 15bps, skew 10bps), inventory at +cap: ask sent BELOW the mark in 155/1000 marks (0.1689..0.1690 step 1e-7), worst -0.92 bps PERP_MM_HALF_SPREAD_BPS=3, flat: ask sent BELOW the mark in 493/1000 marks (0.1689..0.1690 step 1e-7), worst -2.92 bps example mark=0.16891 intended ask=0.1689945 sent ask=0.1689

At the live marks, the default lean-long ask meant to be +5.0 bps went out at +0.78 bps on XLM, +1.61 on ADA, +4.72 on PUMP and +4.19 on WLD ( [dry-run] would place quote short 54 XLM @ 0.169 , live mark 0.16898674). A ceil would have sent 0.1691. The bid is floored too, which is the right way for a bid, so the spread is skewed toward selling cheap. When the ask is under the best bid, POST_ONLY reverts and the quote is skipped. When it is not, the bot rests a sell below fair value.

## Evidence

- [Original item excerpt](../evidence/pdf/024.txt) from PDF pages 43-44. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
• strategies/perp-maker/src/index.ts:142-143 , packages/perp-core/src/orders.ts:159 , packages/perp-
      core/src/markets.ts:146-150 (“Align a price DOWN”) at commit
      4e75896896e024c03e2033d5920514f249998cd6.

   • Output: evidence/candidates/kit20-23/maker-ask-sweep.log (2026-10-31 03:58 UTC) and k20.log
     (live dry-run, 2026-10-31 03:51 UTC). Market params come from perpMarkets() on the Hideki
     indexer, read at 2026-10-31 ~03:48 UTC.
   • Checked twice: the sweep was run, then the example was corrected and run again; the live dry-
     run agrees with the sweep.
   • Not covered by the existing book-ignoring maker report: that one is about the mark against the
     book. This one is about which way prices round on the tick grid.
```

## Environment

### Original reported environment

dreamdex-bot-kit commit 4e75896896e024c03e2033d5920514f249998cd6, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, DRY_RUN)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Align bid prices down and ask prices up, and retain side through the order-alignment path.
