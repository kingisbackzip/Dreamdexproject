# DreamDEX Perps Market Monitor

A small, read-only TypeScript monitor built with the official
[`@somnia-chain/markets-sdk`](https://www.npmjs.com/package/@somnia-chain/markets-sdk).
It discovers live DreamDEX perpetual markets on Somnia Hideki testnet and reports:

- live mark and index prices, with stale-mark detection;
- open interest and funding per protocol-defined window;
- best bid/ask and spread;
- next funding time; and
- optional cross-margin health for a public account address.

It is an independent developer project, not an official DreamDEX application.

## Read-only by design

The monitor cannot trade. It accepts no private key, constructs no signer, and calls only
SDK read methods. `OWNER_ADDRESS` is optional and must be a public address. Never put a seed
phrase or private key in this project.

## Run

Requirements: Node.js 22+.

```bash
npm install
cp .env.example .env
npm run monitor
```

Machine-readable output:

```bash
npm run monitor -- --json
```

To include account health, set a public address in `.env`:

```dotenv
OWNER_ADDRESS=0xYourPublicAddress
```

To inspect one perp, set its SDK symbol after running once to list the discovered symbols:

```dotenv
PERP_SYMBOL=WBTC/USDso:USDso
```

## Verify

```bash
npm run check
```

The test suite verifies funding annualization, maintenance-health buckets, and order-book
spread math. CI runs type-checking and tests on every push and pull request.

## Design notes

- Funding is annualized using each pool's live `fundingWindowSec`; it is not hard-coded.
- A stale mark is never presented as a valid zero price.
- The contract-provided `marginStatus` is shown separately from the monitor's conservative
  display bucket.
- This repository intentionally contains no wallet secrets.

## License

MIT
