# Quantum helpers silently fall back when a quantum is invalid or unsupported

Severity: normal
Area: SDK
Source item: 038; PDF pages 62-63
Validation status: independently checked locally on 1 November 2026

## Summary and impact

floorRawBalance and ceilRawAmount catch quantum parsing errors or nonpositive steps and return unquantized values, without signaling that the requested grid was ignored.

A caller can unknowingly use an unquantized amount after passing a bad grid string. No chain rejection or financial loss was reproduced.

## Steps to reproduce

1. Use Node.js 24 and Python 3 from the repository root.
2. Install the separate pinned review environment:

   ```sh
   npm ci --prefix review --ignore-scripts --no-audit --no-fund
   ```

3. Run the case against the actual published SDK or pinned upstream source:

   ```sh
   node --test --test-name-pattern='038:' scripts/revalidate-selected.mjs
   ```

A passing test confirms the documented behavior, not a repair.

## Expected

Reject an invalid/nonpositive quantum with a clear error or document and expose the fallback explicitly.

## Actual

For raw=3456789012345678n, decimals=18 and quantum='0.0000001', ceilRawAmount returns an on-grid result. For '1e-7', '0', '-0.0000001' and 'abc', the actual helper returns the off-grid raw input unchanged. snapRawToGrid rejects a zero step in the control.

## Evidence

- [Executable check](../scripts/revalidate-selected.mjs)
- [Captured test output](../evidence/revalidation/tests.tap)
- [Environment, integrity and execution boundaries](../VALIDATION.md)
- [Full source review and decision table](../REVALIDATION.md)

## Environment

SDK `@somnia-chain/markets-sdk@0.32.1`, viem `2.24.0`, Node.js `24.22.1`. Bot source is pinned to `somnia-chain/dreamdex-bot-kit@4e75896896e024c03e2033d5920514f249998cd6`, the upstream default head observed during review. Fixtures use no live account, signer or network. Original source report: `kingisbackzip/codex@1187c9174f73321b28917f8e7aa8854172ddc728/dreamdex-submission`, item 038.

## Severity rationale

Normal Feedback: a bounded correctness, documentation or input-handling problem. No critical or major security claim is made. Intended behavior, scope, prior reports and any award remain organizer decisions.

## Scope, duplicates and limitations

The documented argument is a decimal string. Exponent notation is not a promised supported input; its result illustrates the silent error path. Invalid-input tolerance is an API-hardening issue, not a contract exploit.

The review inspected the public bot-kit issue/PR list but did not establish first-report priority or perform an exhaustive submission-wide duplicate search. Current bounty terms and deadline could not be authenticated because the event page returned HTTP 405 to retrieval.

## Suggested remediation

Throw InvalidInputError for malformed and nonpositive quantum values, or provide an explicit, documented opt-in for unquantized fallback.
