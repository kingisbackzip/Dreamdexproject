# dreamDEX Perps — reviewed Feedback package

Eight normal Feedback candidates selected after reviewing all 38 source reports. The strongest bounded correctness reports are **024 (maker ask rounding)** and **031 (live-fill ordering)**. The remaining selected items describe documentation accuracy, input handling and stop-monitor resilience; their limits are stated individually.

[All 38 decisions](REVALIDATION.md) · [Validation and integrity](VALIDATION.md) · [Submission text](SUBMISSION.md)

| ID | Report | Area | Proposed severity |
| --- | --- | --- | --- |
| 008 | [Margin-preview documentation overstates its position-cap guarantees](feedback/008-sdk-preview-margin-ignores-max-position-size.md) | docs | normal |
| 022 | [perp-starter silently maps unrecognized PERP_SIDE values to long](feedback/022-kit-15-perp-side-typo-silently-long.md) | SDK | normal |
| 023 | [perp-starter accepts percentages that invert or negate bracket prices](feedback/023-kit-16-perp-starter-tp-sl-unvalidated-inverted-bracket.md) | SDK | normal |
| 024 | [perp-maker rounds sell quotes down and can move an ask below the mark](feedback/024-kit-20-perp-maker-ask-rounds-down-below-mark.md) | SDK | normal |
| 028 | [perp-starter does not alert or recover when one protective stop leg disappears](feedback/028-maj-kit-01-starter-silent-after-stop-loss-leg-drops.md) | SDK | normal |
| 031 | [Live fills in different blocks with the same timestamp are sorted by log index](feedback/031-maj-stream-01-live-tape-order-ignores-block.md) | SDK | normal |
| 037 | [fromHuman rounding documentation overpromises decimal half-away behavior for numbers](feedback/037-sdk2-01-fromhuman-number-not-half-away-from-zero.md) | docs | normal |
| 038 | [Quantum helpers silently fall back when a quantum is invalid or unsupported](feedback/038-sdk2-02-floor-ceil-quantum-invalid-silently-ignored.md) | SDK | normal |

## Reproduce

From the repository root, with Node.js 24 and Python 3:

```sh
npm ci --prefix review --ignore-scripts --no-audit --no-fund
npm run check:feedback
```

The review dependencies have a separate lockfile and do not replace the legacy example's SDK version. The checks execute pinned upstream text in isolated mock contexts or actual SDK pure/store functions. They create no wallet, signer, RPC/WebSocket connection or order. Tests assert observed behavior, including reasons to exclude some reports; they are not upstream repair tests.

The captured run passed **20/20 tests**. The installed SDK's 632 package files were also compared byte-for-byte with its cached integrity-verified npm tarball.

## Submission status

Prepared and published to this GitHub repository at the owner's request. No DoraHacks form, email or organizer message has been sent. Eligibility, duplicate priority, final severity and awards have not been confirmed. No critical/exploitable contract finding is claimed. See the decision table for deferred items and the two private holds, whose detailed evidence is not included here.

## Earlier work

The original [stale-close local model](REPORT.md), source and tests are retained as historical work. They are not part of the selected eight and do not prove deployed contract behavior.

## License

MIT. Upstream snapshots retain their source licenses and exact commit/blob provenance.
