# perp-starter silently maps unrecognized PERP_SIDE values to long

Severity: normal
Area: SDK
Source item: 022; PDF pages 41-41
Validation status: independently checked locally on 1 November 2026

## Summary and impact

The startup expression recognizes only normalized short; every other nonempty value selects long. Invalid configuration can therefore select a direction instead of failing clearly.

A mistaken environment value can change the selected direction. Live order creation, execution and financial loss are not established.

## Steps to reproduce

1. Use Node.js 24 and Python 3 from the repository root.
2. Install the separate pinned review environment:

   ```sh
   npm ci --prefix review --ignore-scripts --no-audit --no-fund
   ```

3. Run the case against the actual published SDK or pinned upstream source:

   ```sh
   node --test --test-name-pattern='022:' scripts/reproduce-offline.mjs
   ```

A passing test confirms the documented behavior, not a repair.

## Expected

Accept long/short case-insensitively and reject other nonempty values at startup.

## Actual

The exact upstream SIDE declaration maps sell and bear to long; SHORT with surrounding whitespace remains short. The default remains long.

## Evidence

- [Executable check](../scripts/reproduce-offline.mjs)
- [Captured test output](../evidence/revalidation/tests.tap)
- [Environment, integrity and execution boundaries](../VALIDATION.md)
- [Full source review and decision table](../REVALIDATION.md)

## Environment

SDK `@somnia-chain/markets-sdk@0.32.1`, viem `2.24.0`, Node.js `24.22.1`. Bot source is pinned to `somnia-chain/dreamdex-bot-kit@4e75896896e024c03e2033d5920514f249998cd6`, the upstream default head observed during review. Fixtures use no live account, signer or network. Original source report: `kingisbackzip/codex@1187c9174f73321b28917f8e7aa8854172ddc728/dreamdex-submission`, item 022.

## Severity rationale

Normal Feedback: a bounded correctness, documentation or input-handling problem. No critical or major security claim is made. Intended behavior, scope, prior reports and any award remain organizer decisions.

## Scope, duplicates and limitations

sell and bear are outside the documented configuration vocabulary. This is an input-validation Feedback item, not an authorization bypass or an externally triggered exploit. The original major proposal is reduced to normal.

The review inspected the public bot-kit issue/PR list but did not establish first-report priority or perform an exhaustive submission-wide duplicate search. Current bounty terms and deadline could not be authenticated because the event page returned HTTP 405 to retrieval.

## Suggested remediation

Validate the normalized value against an explicit long/short allowlist before selecting it.
