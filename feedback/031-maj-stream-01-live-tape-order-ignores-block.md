# Live fills in different blocks with the same timestamp are sorted by log index

Severity: normal
Area: SDK
Source item: 031; PDF pages 53-54
Validation status: independently checked locally on 1 November 2026

## Summary and impact

The shipped MaterializerStore sorts recent fills by timestamp descending and then logIndex descending. A log index restarts in each block, so that order can disagree with chain chronology.

Latest-fill selection can select an older event. A consumer stopping at a last-seen ID may need a different cursor strategy. No live inversion percentage or observed skipped-fill count is claimed.

## Steps to reproduce

1. Use Node.js 24 and Python 3 from the repository root.
2. Install the separate pinned review environment:

   ```sh
   npm ci --prefix review --ignore-scripts --no-audit --no-fund
   ```

3. Run the case against the actual published SDK or pinned upstream source:

   ```sh
   node --test --test-name-pattern='031:' scripts/revalidate-selected.mjs
   ```

A passing test confirms the documented behavior, not a repair.

## Expected

For a newest-first live tape, compare blockNumber and logIndex in chain order, using validated event provenance or the block/index key.

## Actual

The real SDK MaterializerStore receives synthetic fills 100_17 and 101_6 at the same second. recentFills returns 100_17 first, although block 101 is newer. Giving the newer fill a later timestamp restores the expected order in the control.

## Evidence

- [Executable check](../scripts/revalidate-selected.mjs)
- [Captured test output](../evidence/revalidation/tests.tap)
- [Environment, integrity and execution boundaries](../VALIDATION.md)
- [Full source review and decision table](../REVALIDATION.md)

## Environment

SDK `@somnia-chain/markets-sdk@0.32.1`, viem `2.24.0`, Node.js `24.22.1`. Bot source is pinned to `somnia-chain/dreamdex-bot-kit@4e75896896e024c03e2033d5920514f249998cd6`, the upstream default head observed during review. Fixtures use no live account, signer or network. Original source report: `kingisbackzip/codex@1187c9174f73321b28917f8e7aa8854172ddc728/dreamdex-submission`, item 031.

## Severity rationale

Normal Feedback: a bounded correctness, documentation or input-handling problem. No critical or major security claim is made. Intended behavior, scope, prior reports and any award remain organizer decisions.

## Scope, duplicates and limitations

The actual store and comparator execute, with synthetic fill rows inserted at the store boundary. No WebSocket, indexer, live market stream or watchTrades integration was rerun.

The review inspected the public bot-kit issue/PR list but did not establish first-report priority or perform an exhaustive submission-wide duplicate search. Current bounty terms and deadline could not be authenticated because the event page returned HTTP 405 to retrieval.

## Suggested remediation

Use blockNumber then logIndex descending for live chain-derived fills, and apply the same ordering consistently to tape selection and pruning.
