# Offline validation

Eight checks passed against pinned upstream code. [Test output](evidence/validation/offline-tests.tap) · [Package checks](evidence/validation/package-check.txt)

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

