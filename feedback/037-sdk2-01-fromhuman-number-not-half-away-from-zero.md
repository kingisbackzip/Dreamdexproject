# fromHuman rounding documentation overpromises decimal half-away behavior for numbers

Severity: normal
Area: docs
Source item: 037; PDF pages 60-61
Validation status: independently checked locally on 1 November 2026

## Summary and impact

The documentation calls number rounding half-away-from-zero. The implementation's toFixed path rounds binary floating-point values, so decimal-looking number/string pairs can produce different raw values.

A caller relying on the documented decimal rule can obtain a different raw amount depending on input type. Exact decimal strings are the available workaround.

## Steps to reproduce

1. Use Node.js 24 and Python 3 from the repository root.
2. Install the separate pinned review environment:

   ```sh
   npm ci --prefix review --ignore-scripts --no-audit --no-fund
   ```

3. Run the case against the actual published SDK or pinned upstream source:

   ```sh
   node --test --test-name-pattern='037:' scripts/revalidate-selected.mjs
   ```

A passing test confirms the documented behavior, not a repair.

## Expected

State the floating-point limitation precisely, or round from the number's decimal representation when the intended contract is decimal half-away-from-zero.

## Actual

With actual SDK 0.32.1, fromHuman(1.005,2)=100n while fromHuman('1.005',2)=101n. Five number/string pairs reproduce the discrepancy, including 5e-7 at six decimals converting to 0n versus 1n. A 1.0000005 control converts equally.

## Evidence

- [Executable check](../scripts/revalidate-selected.mjs)
- [Captured test output](../evidence/revalidation/tests.tap)
- [Environment, integrity and execution boundaries](../VALIDATION.md)
- [Full source review and decision table](../REVALIDATION.md)

## Environment

SDK `@somnia-chain/markets-sdk@0.32.1`, viem `2.24.0`, Node.js `24.22.1`. Bot source is pinned to `somnia-chain/dreamdex-bot-kit@4e75896896e024c03e2033d5920514f249998cd6`, the upstream default head observed during review. Fixtures use no live account, signer or network. Original source report: `kingisbackzip/codex@1187c9174f73321b28917f8e7aa8854172ddc728/dreamdex-submission`, item 037.

## Severity rationale

Normal Feedback: a bounded correctness, documentation or input-handling problem. No critical or major security claim is made. Intended behavior, scope, prior reports and any award remain organizer decisions.

## Scope, duplicates and limitations

The JavaScript toFixed result is expected floating-point behavior. This submission is a documentation-contract issue; it does not claim a new JavaScript vulnerability, loss or a general failure of SDK conversions.

The review inspected the public bot-kit issue/PR list but did not establish first-report priority or perform an exhaustive submission-wide duplicate search. Current bounty terms and deadline could not be authenticated because the event page returned HTTP 405 to retrieval.

## Suggested remediation

Document binary rounding and recommend exact strings at boundaries, or implement a consistent decimal-rounding rule before parseUnits.
