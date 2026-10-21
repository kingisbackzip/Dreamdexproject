# DreamDEX Perps stale-close reproduction

This repository contains a deterministic, no-network reproduction of a position-reversal
bug in `dreamdex-bot-kit`'s Perps close flow.

`closePosition()` snapshots a close quantity, performs later asynchronous reads, and then
submits that original quantity as a normal market order. If the position is reduced during
that window, the stale order can cross through zero and create a new position in the
opposite direction.

The reproduction uses the official `@somnia-chain/markets-sdk` order type and the same
operation ordering as the affected implementation. It sends no transaction and requires
no wallet.

## Reproduce

```bash
npm install
npm test
```

Expected regression-test result:

```text
initial position       +10 long
concurrent reduction    -8 sell
live position           +2 long
stale close order      -10 sell
final position           -8 short  <-- unintended reversal
```

See [REPORT.md](REPORT.md) for affected code, impact, root cause, and remediation.

## Scope

- Upstream: [`somnia-chain/dreamdex-bot-kit`](https://github.com/somnia-chain/dreamdex-bot-kit)
- Affected commit verified: `25798660bbe4674a6f83a960b202852896e2fed4`
- Verification date: 21 October 2026
- Suggested severity: **Major**

This is a local state-machine reproduction for maintainers. Do not test it with real funds.

## License

MIT
