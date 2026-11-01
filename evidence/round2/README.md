# Additional feedback verification

Checked 1 November 2026. SDK 0.32.1, viem 2.24.0, Node.js 24.22.1. Eleven offline cases passed in [tests.tap](tests.tap). Run with installed repository dependencies:

```sh
node --test scripts/reproduce-round2.mjs
```

The test names use the item numbers from the new source report, not the repository report IDs. Source observations are preserved in [observations.json](observations.json); their historical script/log paths are not attachments. Fresh tests take precedence over unverified historical figures.

- Items 03, 05, 06, 07, 17: execute actual installed SDK pure functions with synthetic inputs.
- Item 04: executes the exact shipped order-type selection branch, not the entire exchange or a transaction.
- Items 08, 11: execute the actual bot-kit metrics function after TypeScript stripping.
- Item 09: executes the actual top-level argument parser, without running a market backtest.
- Item 18: builds and decodes unsigned calldata with the actual SDK; no simulation or submission.
- Item 19: executes the real doctor body with mocked network/configuration functions and one failing market. Its exit handler is inspected in source.
- Items 02, 12, 13, 20: documentation/source verification; no fresh chain or React-render test.

Bot-kit sources: [commit 4e75896896e024c03e2033d5920514f249998cd6](https://github.com/somnia-chain/dreamdex-bot-kit/tree/4e75896896e024c03e2033d5920514f249998cd6). DreamFly sources: [commit d33b7225d9de2bd4da98052b7feecc67cac59cef](https://github.com/somnia-chain/dreamdex-dreamfly/tree/d33b7225d9de2bd4da98052b7feecc67cac59cef). Retained source snapshots are unmodified. SDK source-file SHA-256 values are in [sdk-sha256.json](sdk-sha256.json). No private key, signing or live transaction was used.
