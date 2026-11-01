# dreamDEX Perps Feedback

50 feedback reports for the [dreamDEX Perps Builder Bounty](https://dorahacks.io/hackathon/dreamdex-perps-bounty/detail), covering the SDK, bot kit, documentation and application.

Each issue has its own Markdown file in [`feedback/`](feedback/) using the required format: severity, area, steps to reproduce, expected behavior, actual behavior, evidence and environment.

## Reports

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
| 039 | [Order-book parameter prose swaps minQuantity and lotSize](feedback/039-docs-orderbook-field-order.md) | normal | docs | source-verified |
| 040 | [Trailing-24h candle statistics omit the partial first hour](feedback/040-sdk-24h-partial-hour.md) | normal | SDK | offline-reproduced-limited |
| 041 | [Lowercase timeInForce silently selects a GTC limit order](feedback/041-sdk-time-in-force-case.md) | normal | SDK | offline-reproduced-limited |
| 042 | [Unknown grid-rounding direction silently rounds down](feedback/042-sdk-grid-direction.md) | normal | SDK | offline-reproduced-limited |
| 043 | [Quote helpers silently accept invalid slippage and trade-side values](feedback/043-sdk-nan-slippage.md) | normal | SDK | offline-reproduced-limited |
| 044 | [Funding helper guards accept windows that cause division by zero](feedback/044-sdk-funding-window-guards.md) | normal | SDK | offline-reproduced-limited |
| 045 | [Maximum percentage drawdown is overwritten by a larger absolute drawdown](feedback/045-backtest-drawdown-percent.md) | normal | SDK | offline-reproduced-limited |
| 046 | [Backtest CLI silently ignores misspelled top-level flags](feedback/046-backtest-unknown-cli-flags.md) | normal | SDK | offline-reproduced-limited |
| 047 | [Backtest win rate counts fee-losing round trips as wins](feedback/047-backtest-win-rate-fees.md) | normal | SDK | offline-reproduced-limited |
| 048 | [DreamFly runner defaults to mainnet while Settings defaults to testnet](feedback/048-dreamfly-network-default.md) | normal | SDK | source-verified |
| 049 | [Reactivity JSDoc contradicts the documented WebSocket endpoint selection](feedback/049-docs-reactivity-websocket.md) | normal | docs | source-verified |
| 051 | [Perp order builder accepts a fee without a builder address](feedback/051-sdk-builder-fee-validation.md) | normal | SDK | offline-reproduced-limited |
| 052 | [Perp doctor completes successfully after every market read fails](feedback/052-perp-doctor-exit-status.md) | normal | SDK | offline-reproduced-limited |
| 053 | [Indexer hooks expose previous-argument data as settled after arguments change](feedback/053-react-query-stale-arguments.md) | normal | SDK | source-verified |

## Reproduce

With Node.js 24+ and Python 3, from the repository root:

```sh
python3 scripts/validate-package.py
node --test scripts/reproduce-offline.mjs
```

No dependency installation or wallet is needed for these checks. Eight reports have passing offline reproductions: 004, 019, 022, 023, 025, 027, 028 and 029. Other results are attributed to the supplied source report. See [test boundaries](VALIDATION.md) and [evidence provenance](evidence/README.md).

The additional batch includes 11 passing offline checks and four source/documentation checks. Install the pinned dependencies with `npm install --ignore-scripts --no-audit --no-fund`, then run `node --test scripts/reproduce-round2.mjs`. See [verification details](evidence/round2/README.md).

The optional `scripts/reproduce-sdk-units.mjs` checks reports 037 and 038 using the dependencies in `package.json`; it has not been run in this validation pass.

## Security disclosures

Security vulnerabilities are excluded from this public repository and must be sent privately to **security@dreamdex.io**, as required by the bounty rules.
