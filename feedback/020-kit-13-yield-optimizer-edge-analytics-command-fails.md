# yield-optimizer reporting command targets a package outside the workspaces

Severity: normal
Area: docs
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 20; PDF pages 39-39

## Summary and impact

yield-optimizer reporting command targets a package outside the workspaces. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Fresh clone, npm ci at the repo root (as README says).
   2. Run the “Reporting” command from strategies/yield-optimizer/README.md:104-108 : npm start -w
      dreamdex-edge-analytics -- --trades data/yo-trades.csv --mid data/yo-mids.csv --yield-log data/
      yo-yield.csv
```

## Expected

edge-analytics runs over the yield-optimizer CSVs.

## Actual

npm error No workspaces found: npm error   --workspace=dreamdex-edge-analytics

rc=1, from the repo root or from strategies/yield-optimizer . tools/edge-analytics (package name dreamdex-edge-analytics ) isn’t a workspace: root package.json:7-11 lists only packages/* , strategies/* , advanced/* . So the root install also doesn’t install its deps ( tools/edge-analytics/node_modules is absent), and the Dockerfile/.dockerignore leave tools out of the image. The working path ( cd tools/edge- analytics && npm install && npm run analyze -- … , per tools/edge-analytics/README.md:26,77) isn’t what the strategy README says.

## Evidence

- [Original item excerpt](../evidence/pdf/020.txt) from PDF pages 39-39. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
• 2026-10-31 02:27:26 UTC, commit 4e75896896e024c03e2033d5920514f249998cd6: output
      above, rc=1.
    • strategies/yield-optimizer/README.md:105 , package.json:7-11 , tools/edge-analytics/package.json
      (“name”: “dreamdex-edge-analytics”), .dockerignore ( tools ).
```

## Environment

### Original reported environment

dreamdex-bot-kit commit 4e75896896e024c03e2033d5920514f249998cd6, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, DRY_RUN). Local command only, no network.

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Use the documented standalone tool directory and install command, or add the tool to the root workspaces with a matching script.
