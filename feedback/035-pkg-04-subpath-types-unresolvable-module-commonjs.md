# Documented package subpaths fail under TypeScript node10 resolution

Severity: normal
Area: SDK

## Steps to reproduce

1. npm i @somnia-chain/markets-sdk@0.32.1 viem typescript@5.9 @types/node@22 . 
2. b.ts , using the import pair from the hosted perps page (https://app.testnet.dreamdex.io/docs/ developers/perps-testnet) plus /native :  import { SomniaMarkets, SOMNIA_HIDEKI_TESTNET_ADDRESSES } from "@somnia-chain/markets-sdk"; import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains"; import { createNative } from "@somnia-chain/markets-sdk/native";  
3. npx tsc --noEmit --strict --skipLibCheck --esModuleInterop --target es2022 --module commonjs b.ts , then again with --module nodenext or --moduleResolution bundler (script: scripts/pkg-04-ts- node10-subpaths.sh ).

## Expected

The subpath types resolve the same way the root entry does (the root resolves through the top-level "types" field). Typically a typesVersions map gives node10 resolution the subpaths, or the docs state that moduleResolution must be node16/nodenext/bundler.

## Actual

The root import resolves, but both subpaths fail with TS2307 under --module commonjs . That is node10 resolution, TypeScript’s default for CommonJS projects, and node10 ignores exports . package.json has no typesVersions . At runtime on Node 22, require("@somnia-chain/markets-sdk/chains") works, so only the type build is blocked. The README and docs don’t mention any tsconfig requirement. The same file passes under nodenext and bundler.

## Evidence

Results below are from the source report; not independently rerun.

- [Original item excerpt](../evidence/pdf/035.txt) from PDF pages 58-58. 
- [Source provenance and limitations](../evidence/README.md).

### Recorded results

```text
$ npx tsc --noEmit --strict --skipLibCheck --esModuleInterop --target es2022 --module commonjs b.ts
 b.ts(2,31): error TS2307: Cannot find module '@somnia-chain/markets-sdk/chains' or its corresponding type
 declarations.
   There are types at '.../markets-sdk/dist/chains/index.d.ts', but this result could not be resolved under
 your current 'moduleResolution' setting. Consider updating to 'node16', 'nodenext', or 'bundler'.
 b.ts(3,30): error TS2307: Cannot find module '@somnia-chain/markets-sdk/native' ...
 exit 2
 --module nodenext --moduleResolution nodenext -> exit 0 ; --moduleResolution bundler -> exit 0
 package.json typesVersions: undefined
 node -e 'require("@somnia-chain/markets-sdk/chains")' -> works on v22.23.3


Run 2026-10-31 02:22 UTC, TypeScript 5.9.3.
```

## Environment

SDK version 0.32.1, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read- only)
