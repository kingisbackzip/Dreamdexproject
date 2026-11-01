# perp-maker rounds sell quotes down and can move an ask below the mark

Severity: normal
Area: SDK
Source item: 024; PDF pages 43-44
Validation status: independently checked locally on 1 November 2026

## Summary and impact

perp-maker computes a sell quote above its mark, but placePerp applies the same downward tick alignment to both buy and sell prices.

Up to a tick of intended sell-side edge can be lost. Whether such an ask rests, fills or is rejected depends on the actual book; no execution or profitability measurement is claimed.

## Steps to reproduce

1. Use Node.js 24 and Python 3 from the repository root.
2. Install the separate pinned review environment:

   ```sh
   npm ci --prefix review --ignore-scripts --no-audit --no-fund
   ```

3. Run the case against the actual published SDK or pinned upstream source:

   ```sh
   node --test --test-name-pattern='024:' scripts/revalidate-selected.mjs
   ```

A passing test confirms the documented behavior, not a repair.

## Expected

Round maker bids down and asks up to preserve their intended price bounds.

## Actual

The real maker ask expression with mark=0.16891, half-spread=15 bps and inventory skew=10 bps prepares approximately 0.1689945. Calling the real placePerp in dry-run mode with a synthetic 0.0001 tick logs a short ask at 0.1689, below the mark. A reference ceil yields 0.1690, preserving the lower bound.

## Evidence

- [Executable check](../scripts/revalidate-selected.mjs)
- [Captured test output](../evidence/revalidation/tests.tap)
- [Environment, integrity and execution boundaries](../VALIDATION.md)
- [Full source review and decision table](../REVALIDATION.md)

## Environment

SDK `@somnia-chain/markets-sdk@0.32.1`, viem `2.24.0`, Node.js `24.22.1`. Bot source is pinned to `somnia-chain/dreamdex-bot-kit@4e75896896e024c03e2033d5920514f249998cd6`, the upstream default head observed during review. Fixtures use no live account, signer or network. Original source report: `kingisbackzip/codex@1187c9174f73321b28917f8e7aa8854172ddc728/dreamdex-submission`, item 024.

## Severity rationale

Normal Feedback: a bounded correctness, documentation or input-handling problem. No critical or major security claim is made. Intended behavior, scope, prior reports and any award remain organizer decisions.

## Scope, duplicates and limitations

The quote, market tick, inventory skew and book context are synthetic. The production maker expression, alignment and dry-run placement path execute unchanged. No mainnet or testnet order was placed.

The review inspected the public bot-kit issue/PR list but did not establish first-report priority or perform an exhaustive submission-wide duplicate search. Current bounty terms and deadline could not be authenticated because the event page returned HTTP 405 to retrieval.

## Suggested remediation

Make tick alignment depend on order direction and intent. For resting maker asks, ceil to the tick; retain floor for bids and review taker price bounds separately.
