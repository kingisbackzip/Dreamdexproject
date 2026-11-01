# perp-starter does not alert or recover when one protective stop leg disappears

Severity: normal
Area: SDK
Source item: 028; PDF pages 48-49
Validation status: independently checked locally on 1 November 2026

## Summary and impact

In the owner-key path, a remaining pending stop is counted and logged without identifying whether the protective stop-loss leg has disappeared. The strategy's mark-based exit checks are confined to the trading-key path.

A user can continue seeing an armed-stop status while the protective leg is absent. This is a resilience Feedback item under the stated fixture.

## Steps to reproduce

1. Use Node.js 24 and Python 3 from the repository root.
2. Install the separate pinned review environment:

   ```sh
   npm ci --prefix review --ignore-scripts --no-audit --no-fund
   ```

3. Run the case against the actual published SDK or pinned upstream source:

   ```sh
   node --test --test-name-pattern='028:' scripts/reproduce-offline.mjs
   ```

A passing test confirms the documented behavior, not a repair.

## Expected

Track the bracket leg identities and warn, re-arm, or follow a documented fallback policy when the protective leg disappears while a position remains open.

## Actual

The real strategy body, with mocked perp-core boundaries, arms a two-leg bracket. The fixture subsequently returns only one leg while the synthetic mark falls through the stop level. The loop logs one stop armed without fallback close or re-arm.

## Evidence

- [Executable check](../scripts/reproduce-offline.mjs)
- [Captured test output](../evidence/revalidation/tests.tap)
- [Environment, integrity and execution boundaries](../VALIDATION.md)
- [Full source review and decision table](../REVALIDATION.md)

## Environment

SDK `@somnia-chain/markets-sdk@0.32.1`, viem `2.24.0`, Node.js `24.22.1`. Bot source is pinned to `somnia-chain/dreamdex-bot-kit@4e75896896e024c03e2033d5920514f249998cd6`, the upstream default head observed during review. Fixtures use no live account, signer or network. Original source report: `kingisbackzip/codex@1187c9174f73321b28917f8e7aa8854172ddc728/dreamdex-submission`, item 028.

## Severity rationale

Normal Feedback: a bounded correctness, documentation or input-handling problem. No critical or major security claim is made. Intended behavior, scope, prior reports and any award remain organizer decisions.

## Scope, duplicates and limitations

Every core/client call is mocked. The stop-disappearance event is supplied by the fixture; this run does not establish a chain mechanism that drops the leg or prove real trading loss. The original historical logs are not treated as fresh evidence.

The review inspected the public bot-kit issue/PR list but did not establish first-report priority or perform an exhaustive submission-wide duplicate search. Current bounty terms and deadline could not be authenticated because the event page returned HTTP 405 to retrieval.

## Suggested remediation

Retain stop-loss/take-profit IDs and reconcile each leg and the position. Emit a clear unprotected-position warning and implement an explicit recovery policy.
