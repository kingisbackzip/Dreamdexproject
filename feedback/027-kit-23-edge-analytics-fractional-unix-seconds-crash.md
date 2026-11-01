# edge-analytics rejects fractional Unix-second timestamps

Severity: normal
Area: app

## Steps to reproduce

1. Use Node.js 24 (validated here with v24.22.1). No npm install is needed.
2. From the repository root, run:

   ```sh
   node --test --test-name-pattern='027:' scripts/reproduce-offline.mjs
   ```

3. The named test checks the current defect and its documented controls against pinned upstream text. A passing test confirms the described offline behavior, not a correction.
4. See `[the full test output](../evidence/validation/offline-tests.tap)` and `[harness boundaries](../VALIDATION.md)`.

1. cd tools/edge-analytics
2. Trade log with ts=1730000000.250 and a mid log with ts in the same format ( evidence/candidates/ kit20-23/ea/t.csv , m.csv ).
3. npx tsx src/index.ts --trades t.csv --mid m.csv

## Expected

The README says “ ts accepts unix seconds, unix milliseconds, or ISO-8601”. Unix seconds with a fractional part (what Python’s time.time() and most pollers write) parse as seconds, or fail with a one- line message naming the row.

## Actual

Error: unparseable timestamp: 1730000000.250 at parseTs (…/tools/edge-analytics/src/csv.ts:…)

followed by a Node stack trace, exit code 1. parseTs only treats /^\d+$/ as numeric and passes everything else to Date.parse , which returns NaN for a decimal number string.

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

## Evidence

Offline reproduction passed; see the linked test output.

- [Original item excerpt](../evidence/pdf/027.txt) from PDF pages 47-47. 
- [Source provenance and limitations](../evidence/README.md).
- [New offline execution log](../evidence/validation/offline-tests.tap), test `027:`.

### Recorded results

```text
• tools/edge-analytics/src/csv.ts:24-33 ; tools/edge-analytics/README.md:89 at commit
      4e75896896e024c03e2033d5920514f249998cd6.
    • Run at 2026-10-31 03:59:09 UTC (and earlier at ~03:54 UTC), rc=1 both times.
```

## Environment

dreamdex-bot-kit commit 4e75896896e024c03e2033d5920514f249998cd6, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, DRY_RUN). Local tool only, no network.

Offline reproduction: Node.js v24.22.1; synthetic inputs; no wallet or transactions.
