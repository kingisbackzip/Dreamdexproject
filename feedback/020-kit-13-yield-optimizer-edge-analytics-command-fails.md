# yield-optimizer reporting command targets a package outside the workspaces

Severity: normal
Area: docs

## Steps to reproduce

1. Fresh clone, npm ci at the repo root (as README says).
2. Run the “Reporting” command from strategies/yield-optimizer/README.md:104-108 : npm start -w dreamdex-edge-analytics -- --trades data/yo-trades.csv --mid data/yo-mids.csv --yield-log data/ yo-yield.csv

## Expected

edge-analytics runs over the yield-optimizer CSVs.

## Actual

npm error No workspaces found: npm error   --workspace=dreamdex-edge-analytics

rc=1, from the repo root or from strategies/yield-optimizer . tools/edge-analytics (package name dreamdex-edge-analytics ) isn’t a workspace: root package.json:7-11 lists only packages/* , strategies/* , advanced/* . So the root install also doesn’t install its deps ( tools/edge-analytics/node_modules is absent), and the Dockerfile/.dockerignore leave tools out of the image. The working path ( cd tools/edge- analytics && npm install && npm run analyze -- … , per tools/edge-analytics/README.md:26,77) isn’t what the strategy README says.

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/020.txt) from PDF pages 39-39. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

```text
• 2026-10-31 02:27:26 UTC, commit 4e75896896e024c03e2033d5920514f249998cd6: output
      above, rc=1.
    • strategies/yield-optimizer/README.md:105 , package.json:7-11 , tools/edge-analytics/package.json
      (“name”: “dreamdex-edge-analytics”), .dockerignore ( tools ).
```

## Environment

dreamdex-bot-kit commit 4e75896896e024c03e2033d5920514f249998cd6, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, DRY_RUN). Local command only, no network.
