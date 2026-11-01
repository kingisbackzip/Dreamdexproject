# MIGRATING.md links to an absent packaged changelog and stale release status

Severity: normal
Area: docs
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 36; PDF pages 59-59

## Summary and impact

MIGRATING.md links to an absent packaged changelog and stale release status. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. npm i @somnia-chain/markets-sdk@0.32.1 , then open node_modules/@somnia-chain/markets-sdk/docs/
      MIGRATING.md .
   2. Follow the two [changelog](../CHANGELOG.md) links (lines 8 and 13).
   3. List the package root and check https://unpkg.com/@somnia-chain/markets-sdk@0.32.1/
      CHANGELOG.md.
   4. Compare the text with npm view @somnia-chain/markets-sdk time dist-tags (script: scripts/pkg-05-
      migrating-changelog.sh ).
```

## Expected

The changelog that MIGRATING.md relies on (“Everything else is in the changelog”; “Check the target version in the changelog”) ships with the package or is linked at a reachable URL, and the release status text is current.

## Actual

- The package root contains only LICENSE README.md dist docs package.json src . CHANGELOG.md is not in the files list, so both links are dead locally and on unpkg (HTTP 404). The repository link is also 404 (already reported), so non-breaking changes between versions have no published record.
- MIGRATING.md says “The 0.32.0 series is available as prereleases”, but 0.32.0 was published 2026-10-12 and 0.32.1 is latest (published 2026-10-13).

## Evidence

- [Original item excerpt](../evidence/pdf/036.txt) from PDF pages 59-59. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
docs/MIGRATING.md:8: [changelog](../CHANGELOG.md).
 docs/MIGRATING.md:13: version in the [changelog](../CHANGELOG.md); prereleases can add migrations
 $ ls node_modules/@somnia-chain/markets-sdk -> LICENSE README.md dist docs package.json src
 unpkg CHANGELOG.md: HTTP 404
 npm time: "0.32.0": 2026-10-12, "0.32.1": 2026-10-13 ; dist-tags.latest: '0.32.1'


Run 2026-10-31 02:21 UTC.
```

## Environment

### Original reported environment

SDK version 0.32.1, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read- only)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Ship the referenced changelog or link to an available versioned resource, and update migration release-status wording.
