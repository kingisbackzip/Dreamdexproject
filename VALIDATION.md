# Validation and execution boundaries

Reviewed locally on 1 November 2026. [All 38 report decisions](REVALIDATION.md) and the [machine-readable manifest](review-manifest.json) distinguish selected Feedback from exclusions and holds.

## Fresh checks

- **20/20 behavioral tests passed** on Node.js 24.22.1. [Captured TAP output](evidence/revalidation/tests.tap).
- The source package was fetched at `kingisbackzip/codex@1187c9174f73321b28917f8e7aa8854172ddc728`; all retrieved file blobs matched that inventory.
- The current upstream bot-kit default head was independently read through GitHub and was `4e75896896e024c03e2033d5920514f249998cd6`, matching the relevant original snapshots. Additional snapshots were fetched at that exact revision. [Per-file upstream hashes and URLs](evidence/upstream/manifest.json).
- A pre-existing local installation of SDK 0.32.1 and viem 2.24.0 was reused. The SDK's **632 files** were compared byte-for-byte with the locally cached npm tarball, whose SHA-512 matched the pinned lockfile integrity. No package reinstall or new npm freshness claim is made. [Execution provenance](evidence/revalidation/provenance.json).
- Actual shipped SDK functions/store code were exercised for conversion, quantization, quote and fill ordering. Extra tests check known omissions and exclusion reasons.
- The original 8-case harness was rerun against exact source snapshots. It strips TypeScript types and replaces import/core boundaries with isolated synthetic fixtures. It does not run a real exchange, protocol or strategy deployment.
- The public bot-kit issue/PR list was read. This is not an exhaustive duplicate or first-reporter check.

## What the tests establish

| IDs | Execution | Boundary |
| --- | --- | --- |
| 001 | Actual error table and shipped JSDoc | Known acknowledged omission; excluded |
| 004, 019, 022, 023, 025, 027 | Actual pinned declarations/functions | Configuration, parsing and arithmetic only; 004 is intended nearest-file behavior |
| 005 | Actual Railway entrypoint with mocked spawn/process | Explicit network preservation and no-network default; no child service or endpoint |
| 008 | Actual SDK pure margin quote and JSDoc | Synthetic cap supplied outside quote; not a live rejection or full preview-wrapper test |
| 009 | Actual shipped GraphQL query text | Missing tie breaker only; no current pagination symptom reproduced |
| 020, 026 | Actual pinned package/docs/source | Workspace and intentionally permissive override behavior |
| 021 | Full real starter body with mocked core/process/timers | Signal registration and synthetic SIGINT cleanup; no orphaned real order |
| 024 | Real maker ask expression, alignPrice and placePerp dry-run | Synthetic mark, tick and inventory skew; no matching, fill or PnL |
| 028, 029 | Full real strategy bodies with all perp-core calls mocked | Stop-drop/risk fixtures only; no live protocol event or required cross-market policy established |
| 031 | Actual SDK MaterializerStore.recentFills | Synthetic fill rows at the store boundary; no stream or watchTrades integration |
| 036 | Actual shipped migration document and files | Missing local changelog link; low-value suggestion excluded |
| 037, 038 | Actual public SDK helper functions | Pure conversion and invalid-input behavior only |

Each passing assertion is an observed behavior or control; some support **excluding** a report. No upstream fix is implemented here. The original harness header was clarified, while tested source branches were preserved.

## Private review

The two held items were inspected. The SDK unsigned-encoding check was independently rerun locally; its detailed output and script are omitted from this public package. The contract observation's saved chain evidence was reviewed, but no fresh RPC call was made. Neither item proves loss, live exploit execution or a breached mandatory contract invariant in this review.

## Not established

Historical live HTTP, WebSocket, indexer, chain and compiler/bundler matrix observations were not all rerun. No current contracts, account balance, market state, signer, order, transaction or mainnet interaction was used by the 20 public checks. The legacy stale-close tests were not rerun; their model is not a deployed-contract reproduction.

The official event page returned HTTP 405 to retrieval. The current deadline, whitelist, acceptance criteria, duplicate priority and payout were not independently authenticated. The developer page currently identifies SDK 0.32.1 and Hideki/Tokyo chain 50383: https://app.testnet.dreamdex.io/docs/developers/perps-testnet . Repository publication is separate from official DoraHacks or private organizer submission.

## Reproduce

```sh
npm ci --prefix review --ignore-scripts --no-audit --no-fund
npm run check:feedback
```

The root package keeps the older local model's dependencies. The separate `review/` lockfile pins the SDK/viem versions used in this validation.
