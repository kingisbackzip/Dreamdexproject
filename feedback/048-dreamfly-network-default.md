# DreamFly runner defaults to mainnet while Settings defaults to testnet

Severity: normal
Area: SDK

## Steps to reproduce

1. Inspect [runner.py](../evidence/round2/runner.py): `--network` defaults to `os.environ.get("NETWORK") or "mainnet"`.
2. Inspect [settings.py](../evidence/round2/settings.py): absent NETWORK defaults to `testnet`.
3. Follow the runner’s `Settings.from_env({**os.environ, "NETWORK": a.network})` call: it overrides the settings default with the argparse value. No chain access is needed.

## Expected

Runner default = testnet, matching `Settings.network = "testnet"`, `docs/configuration.md:10` (`NETWORK` default `testnet`), `docs/getting-started.md:35` ("The defaults are safe: NETWORK=testnet"), `.env.example:10`.

## Actual

```
flybot/live/runner.py:625:    ap.add_argument("--network", default=os.environ.get("NETWORK") or "mainnet", choices=list(NETWORKS),
Settings.from_env({}).network -> testnet
```
The runner passes `NETWORK=mainnet` into `Settings.from_env`, so the settings default is never reached.

## Evidence

Source independently inspected on 1 November 2026; runtime behavior was not rerun. See [source references and verification boundaries](../evidence/round2/README.md).

Pinned commit: `d33b7225d9de2bd4da98052b7feecc67cac59cef`. The claim is the static default mismatch, not a completed mainnet trade.

## Environment

- Repo: somnia-chain/dreamdex-dreamfly @ d33b7225d9de2bd4da98052b7feecc67cac59cef
- Somnia Tokyo testnet (Hideki, chain 50383) context; static/config bug, no chain access needed
- Wallet address: none (read-only)
