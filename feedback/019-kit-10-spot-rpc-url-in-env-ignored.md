# Spot endpoint overrides in .env are captured too late to configure the bots

Severity: major
Area: SDK
Validation status: independently reproduced offline (limited source/mocked strategy checks)
Disclosure: ordinary feedback candidate
Source item: 19; PDF pages 37-38

## Summary and impact

Spot endpoint overrides in .env are captured too late to configure the bots. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

1. Use Node.js 24 (validated here with v24.22.1). No npm install is needed.
2. From `dreamdex-submission/`, run:

   ```sh
   node --test --test-name-pattern='019:' scripts/reproduce-offline.mjs
   ```

3. The named test checks the current defect and its documented controls against pinned upstream text. A passing test confirms the described offline behavior, not a correction.
4. See [the full test output](../evidence/validation/offline-tests.tap) and [harness boundaries](../VALIDATION.md).

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. In a clean checkout, create a repo-root .env that uncomments the overrides .env.example offers
      (lines 12-14):

       NETWORK=testnet
       RPC_URL=http://127.0.0.1:9/bad
       REST_API_URL=http://127.0.0.1:9/v0


   2. From strategies/grid , run exactly what every spot strategy’s src/config.ts does, then read the
      network the bot will use:

       node --input-type=module -e 'import { loadEnv, getNetwork } from "@dreamdex-bot-kit/core";
       loadEnv(); console.log(process.env.RPC_URL, getNetwork().rpcUrl, getNetwork().restApi)'
```

## Expected

.env.example says “Optional RPC / API overrides … only set these to use your own”, so getNetwork().rpcUrl / restApi / wsUrl should be the values from .env.

## Actual

process.env.RPC_URL is set, but the network config still holds the built-in defaults, so the bot silently keeps talking to the default RPC and REST API:

process.env.RPC_URL = http://127.0.0.1:9/bad getNetwork().rpcUrl = https://dream-rpc.somnia.network getNetwork().restApi = https://stg.api.dreamdex.io/v0

Cause: packages/core/src/config/networks.ts:38-50 reads process.env.RPC_URL ?? … inside the top-level NETWORKS object literal. That object is evaluated when @dreamdex-bot-kit/core is imported ( packages/core/ src/index.ts:19 re-exports it), which happens before the strategy’s loadEnv() call on the next line (e.g. strategies/grid/src/config.ts:9-10 , same in market-making, twap, …). The overrides only work if exported in the shell. scripts/doctor.ts:18 calls dotenv before its dynamic import, so the doctor honours the override while the bots don’t. Someone who points the doctor at a private/faster RPC sees it work and then runs a bot that ignores it.

A new offline check reproduced the narrow behavior described above. Live fills, chain conditions, balances, bracket execution and financial loss were not tested.

## Evidence

- [Original item excerpt](../evidence/pdf/019.txt) from PDF pages 37-38. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).
- [New offline execution log](../evidence/validation/offline-tests.tap), test `019:`.

### Evidence as supplied in the PDF

```text
• Command and output above, run 2026-10-31 02:23 UTC from strategies/grid at commit
      4e75896896e024c03e2033d5920514f249998cd6.
    • packages/core/src/config/networks.ts:38,39,40,48,49,50 ; packages/core/src/index.ts:19 ;
      strategies/grid/src/config.ts:9-10 ; .env.example:10-14 ; contrast scripts/doctor.ts:18-20 (dotenv
      before import).
```

## Environment

### Original reported environment

dreamdex-bot-kit commit 4e75896896e024c03e2033d5920514f249998cd6, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, DRY_RUN). Spot path uses NETWORK=testnet (Shannon defaults); no transactions sent.

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed major in the source PDF because a configuration error can select unintended behavior. The new package does not establish live financial loss, exploitability or organizer acceptance.

## Scope, duplicates and limitations

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Resolve endpoint overrides after loading .env, or build network objects lazily. Test both shell and .env configuration paths.
