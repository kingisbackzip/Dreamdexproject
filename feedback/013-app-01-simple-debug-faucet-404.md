# Simple Swap faucet documentation points to a missing route

Severity: normal
Area: docs
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 13; PDF pages 26-26

## Summary and impact

Simple Swap faucet documentation points to a missing route. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Open https://app.testnet.dreamdex.io/docs/trading/spot/simple-swap (the same text is on https://
      app.dreamdex.io/docs/trading/spot/simple-swap).
   2. Read the “Testing on testnet” note: “mint test tokens (USDso / WETH / WBTC) from the in-app
      faucet at /simple/debug (no nav link — append the path manually)”.
   3. Do what it says: curl -s -o /dev/null -w "%{http_code}\n" https://app.testnet.dreamdex.io/simple/
      debug , or open the URL in a browser.
   4. Optional: list the app’s route table in the shipped Next.js bundle (the chunk containing "/trade/
      perps/[[...market]]" ). It has /simple and /simple-b but no /simple/debug and no other faucet
      route.
```

## Expected

A faucet page where a testnet user can mint USDso / WETH / WBTC, or docs that point to the faucet that actually exists.

## Actual

- https://app.testnet.dreamdex.io/simple/debug → HTTP 404, and the page body says “Page not found”.
- https://app.dreamdex.io/simple/debug → HTTP 200, but it’s a soft 404 that also renders “Page not found”.
- /faucet and /debug return 404 on both hosts.
- The app’s route list has /simple and /simple-b but no /simple/debug . A user who follows the docs can’t get test tokens this way.

## Evidence

- [Original item excerpt](../evidence/pdf/013.txt) from PDF pages 26-26. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

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

### Original reported environment

curl, plus Next.js bundle inspection. Network: Somnia Tokyo testnet (Hideki, chain 50383) app host app.testnet.dreamdex.io. The docs note itself refers to chain 50312. Wallet address: none (read-only).

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Point testnet users to an available faucet route or remove the obsolete in-app path.
