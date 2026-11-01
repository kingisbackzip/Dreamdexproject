# Declared viem peer range includes versions incompatible with SDK declarations

Severity: normal
Area: SDK
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 34; PDF pages 57-57

## Summary and impact

Declared viem peer range includes versions incompatible with SDK declarations. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. npm i @somnia-chain/markets-sdk@0.32.1 viem@2.23.0 typescript@5.9 @types/node@22 . This satisfies
      the declared peer range viem: ^2.18.5 , and npm reports no peer conflict.
   2. a.ts : import { SomniaMarkets } from "@somnia-chain/markets-sdk"; export const x = SomniaMarkets;
   3. npx tsc --noEmit --strict --module nodenext --moduleResolution nodenext a.ts (default
      skipLibCheck: false ).
   4. Repeat with viem 2.18.5 and 2.24.0 (script: scripts/pkg-03-viem-peer-types.sh ).
```

## Expected

Every viem version inside the declared peer range type-checks against the SDK’s declarations, or the peer floor is raised to the first version that does.

## Actual

viem 2.18.5 and 2.23.0 fail with TS2694 in the SDK’s own declaration file. viem 2.24.0 and later pass. With skipLibCheck: true the build passes, but the authorizationList field silently becomes any . A related range mismatch: the optional peer @somnia-chain/reactivity@^0.2.1 (needed for the /reactivity subpath) declares viem: ^2.48.2 , so the combined real floor is much higher than the SDK’s ^2.18.5. Runtime reads do work on viem 2.18.5; only the types and the reactivity peer are affected.

## Evidence

- [Original item excerpt](../evidence/pdf/034.txt) from PDF pages 57-57. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
== viem 2.18.5
 node_modules/@somnia-chain/markets-sdk/dist/syncStatus.d.ts(321,43): error TS2694: Namespace '".../viem/
 _types/index"' has no exported member 'SignedAuthorizationList'.
 == viem 2.23.0
 node_modules/@somnia-chain/markets-sdk/dist/syncStatus.d.ts(321,43): error TS2694: ... no exported member
 'SignedAuthorizationList'.
 == viem 2.24.0
 (no SDK type errors)
 $ npm view @somnia-chain/markets-sdk@0.32.1 peerDependencies -> viem: '^2.18.5'
 $ npm view @somnia-chain/reactivity@0.2.1 peerDependencies     -> { viem: '^2.48.2' }


Run 2026-10-31 02:20 UTC, TypeScript 5.9.3, Node v22.23.3.
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

Raise the minimum viem version to the first declaration-compatible release and test the peer floor with skipLibCheck disabled.
