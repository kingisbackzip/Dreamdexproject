# Missing runtime requirements allow unsupported Node installations

Severity: normal
Area: SDK
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 33; PDF pages 56-56

## Summary and impact

Missing runtime requirements allow unsupported Node installations. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. npm i @somnia-chain/markets-sdk@0.32.1 viem . package.json has no engines field, so npm installs on
      any Node with no warning.
   2. Under Node 18.20.4, run a read-only script:
      new SomniaMarkets({ chain: hidekiTestnet, indexerUrl: "https://hideki-dev.smk.somnia.host/v1/
      graphql", addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES }) , then client.listPerpMarkets() (indexer)
      and client.getHeadBlock() (chain).
   3. Under Node 20.17.0, require("@somnia-chain/markets-sdk") from a .cjs file. (script: scripts/pkg-02-
      node-engines.sh )
```

## Expected

The minimum supported Node version is declared in engines (so npm warns, or fails with engine-strict) and is stated the same way in every doc. A runtime that is too old gets a clear error, not a TypeError from inside the transport.

## Actual

- Node 18: indexer reads work, so the setup looks fine. The first chain read then throws a raw TypeError from dist/client.js:62 ( globalThis.crypto.randomUUID() ; globalThis.crypto is not defined by default on Node 18). It is not wrapped in an SDK error class.
- Node 20.17: require() fails with ERR_REQUIRE_ESM . The package is ESM-only ( "type":"module" , no require condition), and neither the README nor the docs say so. require works only on Node >=20.19 / 22.12.
- The docs disagree on the floor: docs/tutorials/stream-a-live-order-book.md:11 says “Node.js 22 or newer”, while docs/reference/networks-and-endpoints.md:120 describes running “on Node.js 20”.

## Evidence

- [Original item excerpt](../evidence/pdf/033.txt) from PDF pages 56-56. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

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

### Original reported environment

SDK version 0.32.1, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read- only)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Declare and test the supported Node floor and module-loading modes, and return an actionable error on unsupported runtimes.
