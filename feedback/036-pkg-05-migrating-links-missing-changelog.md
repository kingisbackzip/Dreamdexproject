# MIGRATING.md links to an absent packaged changelog and stale release status

Severity: normal
Area: docs

## Steps to reproduce

1. npm i @somnia-chain/markets-sdk@0.32.1 , then open node_modules/@somnia-chain/markets-sdk/docs/ MIGRATING.md .
2. Follow the two `[changelog](../CHANGELOG.md)` links (lines 8 and 13).
3. List the package root and check https://unpkg.com/@somnia-chain/markets-sdk@0.32.1/ CHANGELOG.md.
4. Compare the text with npm view @somnia-chain/markets-sdk time dist-tags (script: scripts/pkg-05- migrating-changelog.sh ).

## Expected

The changelog that MIGRATING.md relies on (“Everything else is in the changelog”; “Check the target version in the changelog”) ships with the package or is linked at a reachable URL, and the release status text is current.

## Actual

- The package root contains only LICENSE README.md dist docs package.json src . CHANGELOG.md is not in the files list, so both links are dead locally and on unpkg (HTTP 404). The repository link is also 404 (already reported), so non-breaking changes between versions have no published record.
- MIGRATING.md says “The 0.32.0 series is available as prereleases”, but 0.32.0 was published 2026-10-12 and 0.32.1 is latest (published 2026-10-13).

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/036.txt) from PDF pages 59-59. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

```text
docs/MIGRATING.md:8: [changelog](../CHANGELOG.md).
 docs/MIGRATING.md:13: version in the [changelog](../CHANGELOG.md); prereleases can add migrations
 $ ls node_modules/@somnia-chain/markets-sdk -> LICENSE README.md dist docs package.json src
 unpkg CHANGELOG.md: HTTP 404
 npm time: "0.32.0": 2026-10-12, "0.32.1": 2026-10-13 ; dist-tags.latest: '0.32.1'


Run 2026-10-31 02:21 UTC.
```

## Environment

SDK version 0.32.1, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read- only)
