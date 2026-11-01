# Margin-preview documentation overstates its position-cap guarantees

Severity: normal
Area: docs
Source item: 008; PDF pages 19-20
Validation status: independently checked locally on 1 November 2026

## Summary and impact

The SDK describes previewPerpOrderMargin as determining whether the pool will accept an order, while its pure margin quote does not include the account position-cap gate. Report this as a documentation and preflight boundary, rather than a demonstrated contract bypass.

An integrator can mistake a margin quote for a complete placement preflight. The supplied report describes a live rejection; that observation was not rerun.

## Steps to reproduce

1. Use Node.js 24 and Python 3 from the repository root.
2. Install the separate pinned review environment:

   ```sh
   npm ci --prefix review --ignore-scripts --no-audit --no-fund
   ```

3. Run the case against the actual published SDK or pinned upstream source:

   ```sh
   node --test --test-name-pattern='008:' scripts/revalidate-selected.mjs
   ```

A passing test confirms the documented behavior, not a repair.

## Expected

Describe sufficient as margin/gate sufficiency for the modeled checks, or include the position-cap check before promising general pool acceptance.

## Actual

The actual perpOrderMarginQuote returns sufficient=true for quantity 101 with ample synthetic collateral even when the test supplies a separate synthetic cap of 100. The shipped preview JSDoc promises pool acceptance. The synthetic cap is deliberately outside the quote inputs; this test establishes the API boundary, not a live cap rejection.

## Evidence

- [Executable check](../scripts/revalidate-selected.mjs)
- [Captured test output](../evidence/revalidation/tests.tap)
- [Environment, integrity and execution boundaries](../VALIDATION.md)
- [Full source review and decision table](../REVALIDATION.md)

## Environment

SDK `@somnia-chain/markets-sdk@0.32.1`, viem `2.24.0`, Node.js `24.22.1`. Bot source is pinned to `somnia-chain/dreamdex-bot-kit@4e75896896e024c03e2033d5920514f249998cd6`, the upstream default head observed during review. Fixtures use no live account, signer or network. Original source report: `kingisbackzip/codex@1187c9174f73321b28917f8e7aa8854172ddc728/dreamdex-submission`, item 008.

## Severity rationale

Normal Feedback: a bounded correctness, documentation or input-handling problem. No critical or major security claim is made. Intended behavior, scope, prior reports and any award remain organizer decisions.

## Scope, duplicates and limitations

The executed function is the real pure quote, not the full RPC preview wrapper. No current pool cap, transaction simulation, receipt, gas loss or rejected live order was verified.

The review inspected the public bot-kit issue/PR list but did not establish first-report priority or perform an exhaustive submission-wide duplicate search. Current bounty terms and deadline could not be authenticated because the event page returned HTTP 405 to retrieval.

## Suggested remediation

Narrow the JSDoc and direct integrators to getMaxPerpOrderSize for cap sizing, or add an explicit cap gate and result flag.
