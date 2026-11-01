# Functions reference incorrectly describes testnet builder codes as disabled

Severity: normal
Area: docs
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 14; PDF pages 27-28

## Summary and impact

Functions reference incorrectly describes testnet builder codes as disabled. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

For a new check, restrict view calls to Shannon testnet 50312. Mainnet observations in the excerpt are historical supplied evidence and were not repeated here.

```text
1. Open https://app.testnet.dreamdex.io/docs/developers/contracts/functions, section
      getMaxBuilderFeeBpsTimes1k .
   2. Compare it with https://app.testnet.dreamdex.io/docs/welcome/quick-start, https://
      app.testnet.dreamdex.io/docs/developers/contracts/errors (BuilderCodesNotSupported row) and
      https://app.testnet.dreamdex.io/docs/developers/contracts/spot-router.
   3. Read the cap on chain for the testnet SpotPools listed on the Addresses page (Somnia Shannon
      testnet, chain 50312, RPC https://api.infra.testnet.somnia.network/): cast call
      0x259fD6559214dd5aD3752322426eA9F9fABEFff4 "getMaxBuilderFeeBpsTimes1k()(uint256)" --rpc-url
      https://api.infra.testnet.somnia.network/ Repeat for
      0x3605f28aA7C50e7441211e77Cb0762d49539326C and
      0xD180195da5459C7a0DEA188ed61216ec43682b50, and for the mainnet pools on https://
      api.infra.mainnet.somnia.network/.

Scope: the dreamDEX docs site’s Contracts › Functions page, which contradicts three other pages on
the same site. The bot kit’s docs/gotchas.md makes a similar testnet-cap claim about Hideki perp pools;
that was reported separately and is not claimed here.
```

## Expected

All pages state the same cap, and it matches the chain: 100000 (1%) on both networks.

## Actual

- The Functions page says: “A return value of 0 disables builder codes (every non-zero builder reverts with BuilderCodesNotSupported ). Currently 100000 (100 BPS = 1%) on mainnet and 0 on testnet.”
- Quick Start says: “The pool cap getMaxBuilderFeeBpsTimes1k() is currently 100000 (1%) on every pool on both networks”.
- Errors says: “Every mainnet and testnet pool currently runs a 100000 (100 BPS) cap, so this should not fire”.
- SpotRouter says: “Every mainnet and testnet pool currently runs a 100000 (100 BPS) cap.”
- On chain, every testnet pool checked returns 100000, so the Functions page is wrong. A builder who reads the function reference would think builder codes are disabled on testnet and skip testing them, or would expect BuilderCodesNotSupported to fire.
- The same wrong sentence is on the mainnet docs copy (https://app.dreamdex.io/docs/developers/ contracts/functions).

## Evidence

- [Original item excerpt](../evidence/pdf/014.txt) from PDF pages 27-28. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
• eth_call getMaxBuilderFeeBpsTimes1k() (selector 0x78135d52), 2026-10-31 ~02:24 UTC:
          ◦ Shannon 50312: 0x259fD655… = 100000; 0x3605f28a… = 100000; 0xD180195d… =
            100000
          ◦ Mainnet 5031: 0x035De740… = 100000; 0x47fD2f18… = 100000; 0x25bfF6B7… =
            100000; 0xa936da11… = 100000

    • Page quotes above fetched 2026-10-31 ~02:15–02:27 UTC from app.testnet.dreamdex.io/docs
      and app.dreamdex.io/docs.
```

## Environment

### Original reported environment

curl + JSON-RPC eth_call. The docs are served from the Somnia Tokyo testnet app host (Hideki, chain 50383). The pools checked are on Somnia Shannon testnet 50312 and mainnet 5031, the networks the page talks about. Wallet address: none (read-only).

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Make the function reference consistent with the configured network and its getters; avoid hard-coding tunable deployment values.
