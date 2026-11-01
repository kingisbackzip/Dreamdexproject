# perp-starter accepts percentages that invert or negate bracket prices

Severity: normal
Area: SDK
Source item: 023; PDF pages 42-42
Validation status: independently checked locally on 1 November 2026

## Summary and impact

envNum checks finiteness but not the valid domain for take-profit and stop-loss percentages. The strategy computes bracket prices from those accepted values.

Configuration mistakes reach bracket arithmetic without a useful validation error and can invert the user's exit levels.

## Steps to reproduce

1. Use Node.js 24 and Python 3 from the repository root.
2. Install the separate pinned review environment:

   ```sh
   npm ci --prefix review --ignore-scripts --no-audit --no-fund
   ```

3. Run the case against the actual published SDK or pinned upstream source:

   ```sh
   node --test --test-name-pattern='023:' scripts/reproduce-offline.mjs
   ```

A passing test confirms the documented behavior, not a repair.

## Expected

Reject negative/zero bracket percentages and stop-loss values that make a price nonpositive before preparing a bracket.

## Actual

Using the actual envNum and bracket expressions with mark=100, take-profit=-2 and stop-loss=-1 yields take-profit=98 and stop-loss=101. stop-loss=150 yields a negative lower trigger. The default-positive control keeps the bracket in the intended directions.

## Evidence

- [Executable check](../scripts/reproduce-offline.mjs)
- [Captured test output](../evidence/revalidation/tests.tap)
- [Environment, integrity and execution boundaries](../VALIDATION.md)
- [Full source review and decision table](../REVALIDATION.md)

## Environment

SDK `@somnia-chain/markets-sdk@0.32.1`, viem `2.24.0`, Node.js `24.22.1`. Bot source is pinned to `somnia-chain/dreamdex-bot-kit@4e75896896e024c03e2033d5920514f249998cd6`, the upstream default head observed during review. Fixtures use no live account, signer or network. Original source report: `kingisbackzip/codex@1187c9174f73321b28917f8e7aa8854172ddc728/dreamdex-submission`, item 023.

## Severity rationale

Normal Feedback: a bounded correctness, documentation or input-handling problem. No critical or major security claim is made. Intended behavior, scope, prior reports and any award remain organizer decisions.

## Scope, duplicates and limitations

No contract acceptance of an inverted/negative trigger, live bracket submission, trigger firing or loss was tested.

The review inspected the public bot-kit issue/PR list but did not establish first-report priority or perform an exhaustive submission-wide duplicate search. Current bounty terms and deadline could not be authenticated because the event page returned HTTP 405 to retrieval.

## Suggested remediation

Add range validation in the strategy, describe percentage units, and validate the computed positive trigger prices.
