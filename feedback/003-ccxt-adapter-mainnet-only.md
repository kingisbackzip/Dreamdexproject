# CCXT adapter lacks documented network limitations and testnet configuration

Severity: normal
Area: SDK

## Steps to reproduce

1. Read https://app.testnet.dreamdex.io/docs/developers (Overview): “The CCXT binding wraps the REST endpoints (and WebSocket where supported) behind a standard interface, so existing CCXT bots work with minimal changes.”
2. Read https://app.testnet.dreamdex.io/docs/developers/http-api (“Base URLs”): the REST API has a “Testnet (Somnia Shannon) 50312 https://stg.api.dreamdex.io/v0” environment, and “To target testnet, substitute the staging base URL above”.
3. Read https://app.testnet.dreamdex.io/docs/developers/libraries/ccxt: no mention of environment, testnet, sandbox or chain.
4. Open the adapter at the branch head: https://github.com/somnia-chain/ccxt/blob/ d281cb4ddba757cb5934694ddf9ffdaa3efb2b95/ts/src/dreamdex.ts and check has.sandbox , urls and options.chainId .

## Expected

Since the docs present CCXT as a wrapper over that REST API, the adapter supports its documented testnet the ccxt way ( setSandboxMode(true) / a test URL with chainId 50312), or the CCXT page says plainly that the adapter only talks to mainnet (chain 5031).

## Actual

- has.sandbox: false (L118) and features.spot.sandbox: false (L187), so setSandboxMode(true) is unavailable.
- urls.api.rest is hard-coded to https://api.dreamdex.io (L136) and default options.chainId is 5031 (L265). No test URL entry; the file contains no stg , testnet , 50312 or 50383 string.
- createOrder and vault methods return unsigned transactions prepared by that mainnet API (example response at L841 carries "chainId": "5031" ), so a builder whose signer and RPC are on testnet gets mainnet data and mainnet transactions.
- Markets are hard-coded type: 'spot' , swap: false (L396, L399), so there is also no path to the perps network (Somnia Tokyo testnet / Hideki 50383).
- The CCXT page says none of this.

Note: the CCXT page does not itself claim testnet support; the gap is that the docs present it as a wrapper over a REST API documented for testnet, while the adapter can only reach mainnet and nothing says so.

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/003.txt) from PDF pages 11-12. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

```text
Re-verified 2026-10-29 14:54 UTC: git ls-remote https://github.com/somnia-chain/ccxt refs/heads/add-
dreamdex-exchange → d281cb4ddba757cb5934694ddf9ffdaa3efb2b95 (unchanged since 2026-05-13); file byte-
identical to the 2026-10-22 copy (md5 705fa56a…). Docs pages unchanged (rendered-text diff vs
2026-10-22 is empty). - https://github.com/somnia-chain/ccxt/blob/
d281cb4ddba757cb5934694ddf9ffdaa3efb2b95/ts/src/dreamdex.ts#L118 - https://github.com/somnia-
chain/ccxt/blob/d281cb4ddba757cb5934694ddf9ffdaa3efb2b95/ts/src/dreamdex.ts#L133-L142 - https://
github.com/somnia-chain/ccxt/blob/d281cb4ddba757cb5934694ddf9ffdaa3efb2b95/ts/src/

dreamdex.ts#L265 - https://github.com/somnia-chain/ccxt/blob/
d281cb4ddba757cb5934694ddf9ffdaa3efb2b95/ts/src/dreamdex.ts#L396-L399 Raw copy: evidence/
reverify-2026-10-22/dreamdex.ts (read from source; the alpha package was not installed or executed)
```

## Environment

CCXT fork branch somnia-chain/ccxt#add-dreamdex-exchange @ d281cb4 (unpublished alpha). Testnet per HTTP API docs: Somnia Shannon 50312; Somnia Tokyo testnet (Hideki 50383) not reachable through the adapter. Wallet: none (read-only)
