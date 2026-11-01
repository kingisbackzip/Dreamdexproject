# Constant imports retain a large generated GraphQL document map

Severity: normal
Area: SDK

## Steps to reproduce

1. In an empty dir: npm i @somnia-chain/markets-sdk@0.32.1 viem esbuild (or Vite).
2. Create entry.mjs : import { CANDLE_INTERVALS } from "@somnia-chain/markets-sdk"; console.log(CANDLE_INTERVALS);
3. npx esbuild entry.mjs --bundle --minify --platform=browser --format=esm --outfile=out.js and check the size.
4. Repeat with isPerpMarket and SOMNIA_HIDEKI_TESTNET_ADDRESSES (script: scripts/pkg-01-treeshake- constant.sh ).

## Expected

The package declares "sideEffects": false , so importing a six-number array ( CANDLE_INTERVALS = [60, 300, 900, 3600, 14400, 86400] ) or a one-line type guard should cost a few hundred bytes, like SOMNIA_HIDEKI_TESTNET_ADDRESSES does.

## Actual

CANDLE_INTERVALS alone produces a 146,958-byte minified bundle; isPerpMarket 158,307 bytes. The output contains the whole generated GraphQL document map ( dist/gql/gql.js + dist/gql/graphql.js , every indexer query string). Vite 7 production build gives the same 147 KB chunk. Cause: dist/ candles.js (where CANDLE_INTERVALS lives) and dist/markets.js run graphql(\ …`) at module top level (e.g. const CandlesQuery = graphql(` at candles.js:135). The call is not marked /* @__PURE__ / , so bundlers must keep it, and graphql() reads from the documents object in gql.js that references every Document in graphql.js . “sideEffects”: false` only lets a bundler drop modules that nothing imports. It does not remove top-level calls inside a module that is imported.

A sideEffects flag is not a bundle-size guarantee. Treat the claimed cost as a measured packaging/developer-experience concern, subject to confirmation with the exact package and bundler versions.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/032.txt) from PDF pages 55-55. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

```text
$ npx esbuild entry.mjs --bundle --minify --platform=browser --format=esm ...
 CANDLE_INTERVALS                 -> 146958 bytes minified (bundle includes "AccountOrderRow" fragment
 etc.)
 isPerpMarket                     -> 158307 bytes minified
 SOMNIA_HIDEKI_TESTNET_ADDRESSES ->     851 bytes minified
 vite build (main.js imports only CANDLE_INTERVALS): dist/assets/index-*.js 146993 bytes
 dist/candles.js:135: const CandlesQuery = graphql(`
 package.json: "sideEffects": false


Run 2026-10-31 02:15 UTC, esbuild 0.25 / vite latest, Node v22.23.3.
```

## Environment

SDK version 0.32.1, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read- only)
