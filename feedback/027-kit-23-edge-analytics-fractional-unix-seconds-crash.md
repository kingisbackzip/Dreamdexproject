# edge-analytics rejects fractional Unix-second timestamps

Severity: normal
Area: app
Validation status: independently reproduced offline (limited source/mocked strategy checks)
Disclosure: ordinary feedback candidate
Source item: 27; PDF pages 47-47

## Summary and impact

edge-analytics rejects fractional Unix-second timestamps. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

1. Use Node.js 24 (validated here with v24.22.1). No npm install is needed.
2. From `dreamdex-submission/`, run:

   ```sh
   node --test --test-name-pattern='027:' scripts/reproduce-offline.mjs
   ```

3. The named test checks the current defect and its documented controls against pinned upstream text. A passing test confirms the described offline behavior, not a correction.
4. See [the full test output](../evidence/validation/offline-tests.tap) and [harness boundaries](../VALIDATION.md).

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. cd tools/edge-analytics
   2. Trade log with ts=1730000000.250 and a mid log with ts in the same format ( evidence/candidates/
      kit20-23/ea/t.csv , m.csv ).
   3. npx tsx src/index.ts --trades t.csv --mid m.csv
```

## Expected

The README says “ ts accepts unix seconds, unix milliseconds, or ISO-8601”. Unix seconds with a fractional part (what Python’s time.time() and most pollers write) parse as seconds, or fail with a one- line message naming the row.

## Actual

Error: unparseable timestamp: 1730000000.250 at parseTs (…/tools/edge-analytics/src/csv.ts:…)

followed by a Node stack trace, exit code 1. parseTs only treats /^\d+$/ as numeric and passes everything else to Date.parse , which returns NaN for a decimal number string.

A new offline check reproduced the narrow behavior described above. Live fills, chain conditions, balances, bracket execution and financial loss were not tested.

## Evidence

- [Original item excerpt](../evidence/pdf/027.txt) from PDF pages 47-47. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).
- [New offline execution log](../evidence/validation/offline-tests.tap), test `027:`.

### Evidence as supplied in the PDF

```text
• tools/edge-analytics/src/csv.ts:24-33 ; tools/edge-analytics/README.md:89 at commit
      4e75896896e024c03e2033d5920514f249998cd6.
    • Run at 2026-10-31 03:59:09 UTC (and earlier at ~03:54 UTC), rc=1 both times.
```

## Environment

### Original reported environment

dreamdex-bot-kit commit 4e75896896e024c03e2033d5920514f249998cd6, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, DRY_RUN). Local tool only, no network.

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Parse finite fractional second values explicitly or return a concise input error identifying the affected CSV row.
