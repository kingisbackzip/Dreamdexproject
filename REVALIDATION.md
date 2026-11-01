# Revalidation decisions for all 38 source reports

Reviewed on 1 November 2026 against `kingisbackzip/codex@1187c9174f73321b28917f8e7aa8854172ddc728/dreamdex-submission`. All 38 report texts and supplied provenance were inspected. **Eight bounded normal Feedback reports are selected; the other 30 are not submitted as confirmed findings.** This is a completed repository review, not a claim that every historical live observation was independently rerun.

`submit-normal` means worth presenting for maintainer Feedback review, not a guarantee of eligibility, novelty or payout. The most concrete selected defects are maker ask rounding (024) and same-second live-fill ordering (031). Items 008 and 037 are documentation-contract reports; 022, 023 and 038 concern invalid or unsupported input handling; 028 concerns resilience under a synthetic missing-leg fixture.

The 20 passing tests include **exclusion controls** and observations held for scope confirmation. A passing test is not an automatic bounty recommendation. No critical finding, contract exploit, real trading loss or first-report priority was established.

| ID | Decision | What was revalidated | Reason and next requirement |
| --- | --- | --- | --- |
| 001 | exclude-known | SDK/JSDoc checked | The two missing error names are explicitly acknowledged in the shipped JSDoc. Reconfirmed the omission; do not present it as a newly discovered defect. |
| 002 | defer-scope | historical evidence only | Spot WebSocket example and deployment values were not rerun; confirm the current example, responses and perps-bounty scope. |
| 003 | defer-scope | historical source evidence | A mainnet-only spot adapter does not itself promise testnet/perps support. A documentation improvement needs scope/expectation confirmation; no mainnet testing performed. |
| 004 | exclude-intended | fresh actual-function test | The source explicitly says nearest .env. The passing test confirms that behavior, not a violation of its stated contract; root/child merging is a feature request. |
| 005 | exclude-current-guide | fresh entrypoint test and current guide | The current perps guide supplies NETWORK=hideki and accurately limits auto-selection to an unset NETWORK. Preserving an explicitly set testnet is expected; clearer template warnings may help. |
| 006 | defer-scope | historical evidence only | Binary/Event Contract documentation, rather than a demonstrated perps defect; needs scope confirmation and a fresh compile/runtime check. |
| 007 | defer-scope | historical evidence only | The cited spot/binary place-then-cancel snippets require a fresh strict compile and perps relevance before inclusion. |
| [008](feedback/008-sdk-preview-margin-ignores-max-position-size.md) | submit-normal | fresh SDK quote plus JSDoc check | Submit the documentation/preflight boundary only. The pure quote and synthetic cap do not establish a fresh live rejection. |
| 009 | defer-reproduction | fresh static query check | Non-total offset ordering is present, but the reported duplicate/omission was intermittent and not rerun against the indexer. Needs a deterministic snapshot or captured responses. |
| 010 | defer-reproduction | historical live evidence only | Needs fresh request/response proof that the current service truncates at 20,000 and a documented completion/truncation contract. |
| 011 | defer-policy | historical evidence only | Returning no rows for a filter string may be intentional. Confirm input validation promises and reproduce without conflating checksum normalization with authorization. |
| 012 | defer-contract | historical evidence only | The SDK's documented per-8-hour convention is not itself wrong. Establish exactly which CCXT compatibility guarantees apply and reproduce missing-field impact. |
| 013 | defer-scope | historical HTTP observation | A spot faucet link/route needs a fresh docs/HTTP check and scope confirmation. The historical 404 is not current evidence. |
| 014 | defer-scope | historical docs/chain comparison | Spot deployment cap values can change; needs same-block reads and current documentation, plus scope confirmation. |
| 015 | hold-private | saved chain evidence reviewed; no fresh RPC | A private contract-policy observation. The saved state does not establish that the relevant limit must apply to the observed path. Do not assert a vulnerability or copy its detailed evidence publicly. |
| 016 | defer-scope | historical deployment comparison | Spot/default registry values are mutable. No fresh chain comparison performed, and prior mainnet observations do not authorize new mainnet testing. |
| 017 | defer-scope | historical spot simulation | A spot/native-payment documentation issue requiring a fresh local simulation and confirmed perps-bounty scope. |
| 018 | defer-reproduction | historical receipts and docs | Identifier documentation could merit normal feedback, but current wording and same-network/registry receipt provenance must be independently checked. |
| 019 | defer-scope | fresh initializer test | The .env import-order problem reproduces in spot core. Worth normal tooling feedback if adjacent scope is accepted; no major/security impact was established. |
| 020 | defer-scope | fresh source/workspace check | The analytics workspace command is inconsistent with root workspace patterns. Worth normal documentation feedback if tooling scope is accepted; no new CLI install/run performed. |
| 021 | defer-scope | fresh full starter-body mock test | SIGINT cleanup is registered and SIGTERM cleanup is not. Worth normal spot-bot reliability feedback if scope is accepted; no real order was orphaned. |
| [022](feedback/022-kit-15-perp-side-typo-silently-long.md) | submit-normal | fresh exact declaration test | Fail-open handling of invalid configuration reproduces. Downgrade original major proposal: unsupported values and live loss are not an exploit demonstration. |
| [023](feedback/023-kit-16-perp-starter-tp-sl-unvalidated-inverted-bracket.md) | submit-normal | fresh actual arithmetic test | Finite but invalid bracket percentages produce inverted/nonpositive prices. Contract acceptance and trigger execution remain untested. |
| [024](feedback/024-kit-20-perp-maker-ask-rounds-down-below-mark.md) | submit-normal | fresh real dry-run placement path | The actual maker expression and placement alignment floor a synthetic sell ask below its mark. Strong bounded correctness finding; no live PnL claim. |
| 025 | defer-scope | fresh actual parser test | Unknown/uppercase buy values map to sell. Useful normal parser feedback if analytics tooling is in scope; full CSV/markout results were not rerun. |
| 026 | exclude-intended | fresh source review | The source deliberately allows unknown keys for forward compatibility. Validation/warnings may improve UX, but do not call the existing behavior an accidental bug. |
| 027 | defer-scope | fresh actual parser test | Fractional Unix-second strings fail while integer/ISO controls pass. Confirm supported timestamp grammar and tooling scope before claiming a defect. |
| [028](feedback/028-maj-kit-01-starter-silent-after-stop-loss-leg-drops.md) | submit-normal | fresh full strategy-body mock test | Submit the missing-leg warning/recovery gap under an explicitly synthetic stop-drop fixture. No live stop-drop mechanism or loss was revalidated. |
| 029 | exclude-feature-request | fresh full strategy-body mock test | The configured symbol filter intentionally limits markets. Account-wide warnings may help, but closing an excluded market is not an established correctness requirement. |
| 030 | hold-private | fresh actual SDK unsigned encoding recheck | A private SDK runtime-validation observation reproduces locally. The inputs are outside the TypeScript union; live acceptance, trigger execution and loss remain unproven. Detailed encoding evidence stays out of this public export. |
| [031](feedback/031-maj-stream-01-live-tape-order-ignores-block.md) | submit-normal | fresh actual SDK store test | Real recentFills ordering places an older block first for same-second fixtures. Strong bounded SDK correctness finding; historical percentages were removed. |
| 032 | defer-benchmark | historical bundler observation | Needs a pinned fresh bundler/config/metafile baseline. sideEffects=false alone is not a size guarantee; confirm current advertised expectations. |
| 033 | defer-support-policy | package metadata inspected; no old-Node matrix | The missing engines field is real metadata, but unsupported/EOL Node behavior is not automatically a defect. Establish the supported runtime/ESM contract. |
| 034 | defer-compiler-matrix | historical compile evidence only | A peer-range type mismatch would be useful if reproduced. Only viem 2.24.0 was used here; the claimed 2.18.5/2.23.0 failures were not independently rerun. |
| 035 | exclude-legacy-resolution | published exports inspected | Legacy node10 resolution ignores exports. Without promised legacy support, modern node16/nodenext/bundler requirements are a documentation concern, not proof the subpaths are broken. |
| 036 | exclude-low-value | fresh shipped-file check | The missing linked changelog is confirmed. Retain as a low-priority packaging suggestion, rather than adding a standalone perps-bounty claim. |
| [037](feedback/037-sdk2-01-fromhuman-number-not-half-away-from-zero.md) | submit-normal | fresh actual SDK conversion tests | Submit as documentation accuracy: IEEE-754/toFixed behavior is expected, but the stated decimal half-away rule overpromises. Decimal strings are the workaround. |
| [038](feedback/038-sdk2-02-floor-ceil-quantum-invalid-silently-ignored.md) | submit-normal | fresh actual SDK quantum tests | Submit as API hardening: bad or unsupported quantum silently disables quantization. Exponent notation is outside the promised decimal-string grammar. |

## Legacy stale-close report

The existing [REPORT.md](REPORT.md) and `src/`/`test/` example are retained. Its operation ordering is consistent with the current bot source, but its fill model implements the assumed reversal itself. That is not a deployed-contract or end-to-end reproduction. It remains a hypothesis pending an actual upstream-function plus protocol/local-fork test; it is not added to the eight selected reports. The old test suite was not rerun during this report-only review.

## Scope and disclosure

The public repository omits the two held private report texts, their excerpts, transaction/encoding details and revalidation script. Saved chain evidence was reviewed, not refreshed over RPC in this pass. Private organizer triage is still needed for the SDK validation observation; the contract-policy observation is not ready for a vulnerability claim.

The review read the public bot-kit issue/PR list. It did not perform or authenticate the source report's claimed exhaustive multi-repository duplicate sweep. The event page returned HTTP 405 to the retrieval service, so live deadlines, whitelist, bounty terms and the official submission route remain unverified. This commit publishes a GitHub Feedback package; it is not evidence of a DoraHacks entry or an organizer notification.
