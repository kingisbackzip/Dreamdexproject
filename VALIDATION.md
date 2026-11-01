# Validation and limits

## Completed in this packaging pass

- Read all 38 items from the supplied 63-page PDF and retained page-level source mapping.
- Retrieved upstream source from the exact reported GitHub commit revisions; recorded and checked Git blob hashes.
- Ran eight offline checks with Node v24.22.1: items 004, 019, 022, 023, 025, 027, 028 and 029. All eight passed, including the controls embedded in each case. See [the captured TAP log](evidence/validation/offline-tests.tap).
- Validated required sections, enums, source mapping, local Markdown links, report counts, snapshot integrity and the ordinary-feedback export. See [the package check](evidence/validation/package-check.txt).

## What the eight tests establish

| Item | Actual code exercised | Boundary |
| --- | --- | --- |
| 004 | Upstream loadEnv function | Filesystem existence and dotenv calls are synthetic; the real loop chooses only the nearest file |
| 019 | Upstream NETWORKS initializer and getNetwork | Synthetic process.env changes; no endpoint contact; accompanying source snapshots show import ordering |
| 022 | Exact upstream SIDE declaration | Enum coercion only; no order construction or execution |
| 023 | Real envNum and exact bracket arithmetic | Invalid input acceptance and resulting arithmetic only; no contract acceptance |
| 025 | Exact upstream toFillSide arrow function | Parsing choice only; no full CSV/markout report |
| 027 | Exact upstream parseTs function | Fractional/integer/ISO parsing only |
| 028 | Full real perp-starter strategy body | Imports removed; every perp-core boundary mocked; protective leg disappearance supplied as a fixture |
| 029 | Full real perp-guard strategy body | Imports removed; every perp-core boundary mocked; cross-margin risk supplied as a fixture |

The harness removes TypeScript types using Node's stripTypeScriptTypes and removes the upstream import and process-exit wrapper. It does not edit strategy conditions or branches. Each VM receives an isolated synthetic process.env. There is no real process.exit, signer, socket, RPC, timer wait or private key in the strategy execution context. Case 028 assumes the stop-drop scenario; it does not prove a contract can produce it. Case 029 proves filtered reporting/action behavior for the fixture, not the appropriateness of a particular live risk policy.

## Not completed in the initial packaging pass

Live SDK, indexer, HTTP, WebSocket, application, contract, historical receipt, compiler matrix and bundler observations were not rerun. SDK unit-check scripts are reconstructed and supplied but not executed. Exact SDK package bytes, transitive dependency lockfile, original harness files and original raw logs were not available. No new 109-repository duplicate scan was performed. Bounty rules retrieval failed; whitelist, reviewer access, deadline, public/private submission route, acceptance and payout remain organizer decisions.

The source PDF itself says the pagination symptom (009) was intermittent and did not reappear in its later nine passes. Some items concern adjacent spot networks and need scope confirmation.
