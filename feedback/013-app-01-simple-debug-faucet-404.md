# Simple Swap faucet documentation points to a missing route

Severity: normal
Area: docs

## Steps to reproduce

1. Open https://app.testnet.dreamdex.io/docs/trading/spot/simple-swap (the same text is on https:// app.dreamdex.io/docs/trading/spot/simple-swap).
2. Read the “Testing on testnet” note: “mint test tokens (USDso / WETH / WBTC) from the in-app faucet at /simple/debug (no nav link — append the path manually)”.
3. Do what it says: curl -s -o /dev/null -w "%{http_code}\n" https://app.testnet.dreamdex.io/simple/ debug , or open the URL in a browser.
4. Optional: list the app’s route table in the shipped Next.js bundle (the chunk containing "/trade/ perps/[[...market]]" ). It has /simple and /simple-b but no /simple/debug and no other faucet route.

## Expected

A faucet page where a testnet user can mint USDso / WETH / WBTC, or docs that point to the faucet that actually exists.

## Actual

- https://app.testnet.dreamdex.io/simple/debug → HTTP 404, and the page body says “Page not found”.
- https://app.dreamdex.io/simple/debug → HTTP 200, but it’s a soft 404 that also renders “Page not found”.
- /faucet and /debug return 404 on both hosts.
- The app’s route list has /simple and /simple-b but no /simple/debug . A user who follows the docs can’t get test tokens this way.

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/013.txt) from PDF pages 26-26. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

```text
• Docs text (testnet and mainnet docs, fetched 2026-10-31 02:20 UTC): “Testing on testnet. On
      chain 50312 , get STT for gas from the Somnia testnet faucet , and mint test tokens (USDso /
      WETH / WBTC) from the in-app faucet at /simple/debug (no nav link — append the path
      manually).”
    • curl https://app.testnet.dreamdex.io/simple/debug → 404 . Body contains “Page not found” (5
      occurrences). 2026-10-31 ~02:20 UTC, checked again ~02:25 UTC.
    • curl https://app.dreamdex.io/simple/debug → 200 . Body contains “Page not found”. Same times.
    • Route table from the app bundle (2026-10-31 ~02:25 UTC): “/” “/admin” … “/perps/[[…market]]”
      “/portfolio” … “/simple” “/simple-b” “/staking” “/stats/[[…tab]]” “/trade/[[…pair]]” “/trade/perps/
      [[…market]]” … (no /simple/debug).
```

## Environment

curl, plus Next.js bundle inspection. Network: Somnia Tokyo testnet (Hideki, chain 50383) app host app.testnet.dreamdex.io. The docs note itself refers to chain 50312. Wallet address: none (read-only).
