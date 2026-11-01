# Missing runtime requirements allow unsupported Node installations

Severity: normal
Area: SDK

## Steps to reproduce

1. npm i @somnia-chain/markets-sdk@0.32.1 viem . package.json has no engines field, so npm installs on any Node with no warning.
2. Under Node 18.20.4, run a read-only script: new SomniaMarkets({ chain: hidekiTestnet, indexerUrl: "https://hideki-dev.smk.somnia.host/v1/ graphql", addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES }) , then client.listPerpMarkets() (indexer) and client.getHeadBlock() (chain).
3. Under Node 20.17.0, require("@somnia-chain/markets-sdk") from a .cjs file. (script: scripts/pkg-02- node-engines.sh )

## Expected

The minimum supported Node version is declared in engines (so npm warns, or fails with engine-strict) and is stated the same way in every doc. A runtime that is too old gets a clear error, not a TypeError from inside the transport.

## Actual

- Node 18: indexer reads work, so the setup looks fine. The first chain read then throws a raw TypeError from dist/client.js:62 ( globalThis.crypto.randomUUID() ; globalThis.crypto is not defined by default on Node 18). It is not wrapped in an SDK error class.
- Node 20.17: require() fails with ERR_REQUIRE_ESM . The package is ESM-only ( "type":"module" , no require condition), and neither the README nor the docs say so. require works only on Node >=20.19 / 22.12.
- The docs disagree on the floor: docs/tutorials/stream-a-live-order-book.md:11 says “Node.js 22 or newer”, while docs/reference/networks-and-endpoints.md:120 describes running “on Node.js 20”.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/033.txt) from PDF pages 56-56. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

```text
$ node -p 'require("./node_modules/@somnia-chain/markets-sdk/package.json").engines'
 undefined
 $ npx -y node@18.20.4 n18.mjs
 v18.20.4
 indexer read ok: 21 perp markets
 chain read FAILED: TypeError - Cannot read properties of undefined (reading 'randomUUID')
     at openConnection (.../markets-sdk/dist/client.js:62:57)
 $ npx -y node@20.17.0 r.cjs
 FAIL @somnia-chain/markets-sdk ERR_REQUIRE_ESM require() of ES Module .../dist/index.js ... not supported.
 (Node 22.23.3: same script prints head block 37599072; require() works)


Run 2026-10-31 02:18–02:20 UTC.
```

## Environment

SDK version 0.32.1, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read- only)
