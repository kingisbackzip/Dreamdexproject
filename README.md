# dreamDEX Perps — Feedback Reports

A review-ready collection of **36 feedback reports** covering the dreamDEX SDK, bot kit, application and documentation. Each report includes reproduction steps, expected and actual behavior, impact, suggested remediation and page-level evidence provenance.

**Validation:** eight reports have passing offline reproductions against pinned upstream code. The other 28 retain evidence from the supplied report and have not been independently reproduced here. Severity labels are proposals for reviewer assessment.

## Start here

- Browse the [report index](#report-index) below.
- Read [validation results and limits](VALIDATION.md) and [evidence provenance](evidence/README.md).
- Use [SUBMISSION.md](SUBMISSION.md) for the Feedback-track submission description and [RULES.md](RULES.md) for the recorded scope requirements.

The public collection contains 23 SDK, 11 documentation and 2 application reports: 2 proposed major and 34 normal. Original report IDs are preserved; two security-sensitive reports are reserved for private disclosure and are excluded from this repository.

## Reproduce the checks

Requirements: **Node.js 24+** and **Python 3**. These checks need no dependency installation, RPC access, wallet or transactions.

```sh
git clone https://github.com/kingisbackzip/Dreamdexproject.git
cd Dreamdexproject
python3 scripts/validate-package.py
node --test scripts/reproduce-offline.mjs
```

The validator checks report structure, evidence links, counts and 12 upstream source blob hashes. The test harness covers reports **004, 019, 022, 023, 025, 027, 028 and 029**, with synthetic inputs and mocked service boundaries. Passing checks establish the documented code behavior, not live exploitability or bounty acceptance.

An additional SDK unit reproduction script is provided for reports 037 and 038; it has not been run in this validation pass. Its optional dependencies are pinned in `package.json`.

## Repository contents

| Path | Contents |
| --- | --- |
| `feedback/` | One self-contained Markdown report per issue |
| `evidence/pdf/` | Source-report excerpts with original page mapping |
| `evidence/upstream/` | Commit-pinned source snapshots and licenses |
| `evidence/validation/` | Captured verification output |
| `scripts/` | Package validator and reproduction harnesses |
| `manifest.json` | Machine-readable report inventory |

## Submission status

Prepared for review in the [dreamDEX Perps bounty](https://dorahacks.io/hackathon/dreamdex-perps-bounty/detail). Publishing this repository does not submit a DoraHacks Build or send a disclosure email. Current eligibility, scope, duplicates and acceptance require organizer review. The source report targets SDK 0.32.1 and Somnia Tokyo / Hideki (chain 50383); see individual reports for version-specific and adjacent-network limitations.

## Report index

| ID | Feedback report | Severity | Area | Validation |
| --- | --- | --- | --- | --- |
| 001 | [claimPerpVoucher cannot decode ClaimantNotFlat and ClaimantIsMainFunded](feedback/001-sdk-claim-errors-not-decoded.md) | normal | SDK | supplied-evidence-only |
| 002 | [WebSocket getMarkets documentation uses an ignored filter and incorrect response values](feedback/002-ws-getmarkets-example.md) | normal | docs | supplied-evidence-only |
| 003 | [CCXT adapter lacks documented network limitations and testnet configuration](feedback/003-ccxt-adapter-mainnet-only.md) | normal | SDK | supplied-evidence-only |
| 004 | [perp-core stops loading environment files before reaching the repository root](feedback/004-kit-perp-loadenv-ignores-root-env.md) | normal | SDK | offline-reproduced-limited |
| 005 | [Railway environment template defeats automatic Hideki selection for perps](feedback/005-kit-railway-perp-network-testnet.md) | normal | SDK | supplied-evidence-only |
| 006 | [BINARY.md redeem example omits required marketId](feedback/006-sdk-binary-redeem-doc-wrong-param.md) | normal | docs | supplied-evidence-only |
| 007 | [Place-then-cancel documentation passes an optional orderId without a guard](feedback/007-sdk-doc-snippets-orderid-optional.md) | normal | docs | supplied-evidence-only |
| 008 | [Margin preview reports sufficient above the account position cap](feedback/008-sdk-preview-margin-ignores-max-position-size.md) | normal | SDK | supplied-evidence-only |
| 009 | [listPerpPositions pagination has no stable timestamp tie-breaker](feedback/009-sdk-listperppositions-paging-unstable.md) | normal | SDK | supplied-evidence-only |
| 010 | [History reads silently return only 20,000 rows for a larger limit](feedback/010-sdk-limit-silent-20000-cap.md) | normal | SDK | supplied-evidence-only |
| 011 | [Indexer reads accept malformed addresses as empty histories](feedback/011-sdk-indexer-reads-accept-bad-addresses.md) | normal | SDK | supplied-evidence-only |
| 012 | [Unified market and funding fields diverge from the promised CCXT conventions](feedback/012-sdk-ccxt-market-ticker-field-semantics.md) | normal | SDK | supplied-evidence-only |
| 013 | [Simple Swap faucet documentation points to a missing route](feedback/013-app-01-simple-debug-faucet-404.md) | normal | docs | supplied-evidence-only |
| 014 | [Functions reference incorrectly describes testnet builder codes as disabled](feedback/014-app-02-builder-cap-testnet-zero-contradiction.md) | normal | docs | supplied-evidence-only |
| 016 | [Stop-registry default configuration differs from documented deployment values](feedback/016-doc2-01-spot-stop-registry-defaults-stale.md) | normal | docs | supplied-evidence-only |
| 017 | [Native sell stops require an extra payment omitted by the function reference](feedback/017-doc2-02-creatependingorder-exact-somi-wrong-for-native-sell.md) | normal | docs | supplied-evidence-only |
| 018 | [Pending-order identifier documentation contradicts its registry-local uniqueness](feedback/018-doc2-03-pending-order-id-globally-unique-contradiction.md) | normal | docs | supplied-evidence-only |
| 019 | [Spot endpoint overrides in .env are captured too late to configure the bots](feedback/019-kit-10-spot-rpc-url-in-env-ignored.md) | major | SDK | offline-reproduced-limited |
| 020 | [yield-optimizer reporting command targets a package outside the workspaces](feedback/020-kit-13-yield-optimizer-edge-analytics-command-fails.md) | normal | docs | supplied-evidence-only |
| 021 | [Default starter does not register SIGTERM cleanup](feedback/021-kit-14-starter-ignores-sigterm-orphans-orders.md) | normal | SDK | supplied-evidence-only |
| 022 | [Unknown PERP_SIDE values silently select long](feedback/022-kit-15-perp-side-typo-silently-long.md) | major | SDK | offline-reproduced-limited |
| 023 | [perp-starter accepts percentages that invert or negate bracket prices](feedback/023-kit-16-perp-starter-tp-sl-unvalidated-inverted-bracket.md) | normal | SDK | offline-reproduced-limited |
| 024 | [perp-maker rounds asks down toward or below the mark](feedback/024-kit-20-perp-maker-ask-rounds-down-below-mark.md) | normal | SDK | supplied-evidence-only |
| 025 | [edge-analytics maps uppercase and unknown buy-side values to sell](feedback/025-kit-21-edge-analytics-side-case-flips-verdict.md) | normal | app | offline-reproduced-limited |
| 026 | [Backtest overrides silently accept unknown configuration keys](feedback/026-kit-22-backtest-set-unknown-key-silently-ignored.md) | normal | docs | supplied-evidence-only |
| 027 | [edge-analytics rejects fractional Unix-second timestamps](feedback/027-kit-23-edge-analytics-fractional-unix-seconds-crash.md) | normal | app | offline-reproduced-limited |
| 028 | [perp-starter does not react when the protective stop leg disappears](feedback/028-maj-kit-01-starter-silent-after-stop-loss-leg-drops.md) | normal | SDK | offline-reproduced-limited |
| 029 | [perp-guard symbol filtering suppresses account-wide risk reporting](feedback/029-maj-kit-02-guard-symbol-set-silently-ignores-cross-margin-risk.md) | normal | SDK | offline-reproduced-limited |
| 031 | [Live fills from different blocks in one second are sorted by log index alone](feedback/031-maj-stream-01-live-tape-order-ignores-block.md) | normal | SDK | supplied-evidence-only |
| 032 | [Constant imports retain a large generated GraphQL document map](feedback/032-pkg-01-treeshake-constant-pulls-graphql-map.md) | normal | SDK | supplied-evidence-only |
| 033 | [Missing runtime requirements allow unsupported Node installations](feedback/033-pkg-02-no-engines-node18-crash.md) | normal | SDK | supplied-evidence-only |
| 034 | [Declared viem peer range includes versions incompatible with SDK declarations](feedback/034-pkg-03-viem-peer-range-too-low-for-types.md) | normal | SDK | supplied-evidence-only |
| 035 | [Documented package subpaths fail under TypeScript node10 resolution](feedback/035-pkg-04-subpath-types-unresolvable-module-commonjs.md) | normal | SDK | supplied-evidence-only |
| 036 | [MIGRATING.md links to an absent packaged changelog and stale release status](feedback/036-pkg-05-migrating-links-missing-changelog.md) | normal | docs | supplied-evidence-only |
| 037 | [fromHuman number rounding differs from the documented decimal rounding rule](feedback/037-sdk2-01-fromhuman-number-not-half-away-from-zero.md) | normal | SDK | supplied-evidence-only |
| 038 | [Balance and amount helpers silently ignore invalid quantum values](feedback/038-sdk2-02-floor-ceil-quantum-invalid-silently-ignored.md) | normal | SDK | supplied-evidence-only |
