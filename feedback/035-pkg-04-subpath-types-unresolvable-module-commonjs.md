# Documented package subpaths fail under TypeScript node10 resolution

Severity: normal
Area: SDK
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 35; PDF pages 58-58

## Summary and impact

Documented package subpaths fail under TypeScript node10 resolution. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. npm i @somnia-chain/markets-sdk@0.32.1 viem typescript@5.9 @types/node@22 .

   2. b.ts , using the import pair from the hosted perps page (https://app.testnet.dreamdex.io/docs/
      developers/perps-testnet) plus /native :

       import { SomniaMarkets, SOMNIA_HIDEKI_TESTNET_ADDRESSES } from "@somnia-chain/markets-sdk";
       import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains";
       import { createNative } from "@somnia-chain/markets-sdk/native";


   3. npx tsc --noEmit --strict --skipLibCheck --esModuleInterop --target es2022 --module commonjs
      b.ts , then again with --module nodenext or --moduleResolution bundler (script: scripts/pkg-04-ts-
      node10-subpaths.sh ).
```

## Expected

The subpath types resolve the same way the root entry does (the root resolves through the top-level "types" field). Typically a typesVersions map gives node10 resolution the subpaths, or the docs state that moduleResolution must be node16/nodenext/bundler.

## Actual

The root import resolves, but both subpaths fail with TS2307 under --module commonjs . That is node10 resolution, TypeScript’s default for CommonJS projects, and node10 ignores exports . package.json has no typesVersions . At runtime on Node 22, require("@somnia-chain/markets-sdk/chains") works, so only the type build is blocked. The README and docs don’t mention any tsconfig requirement. The same file passes under nodenext and bundler.

## Evidence

- [Original item excerpt](../evidence/pdf/035.txt) from PDF pages 58-58. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

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

### Original reported environment

SDK version 0.32.1, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read- only)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Document node16/nodenext/bundler resolution, or publish a typesVersions fallback for the supported legacy resolution mode.
