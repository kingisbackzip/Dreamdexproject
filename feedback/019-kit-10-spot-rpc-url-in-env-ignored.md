# Spot endpoint overrides in .env are captured too late to configure the bots

Severity: major
Area: SDK

## Steps to reproduce

1. Use Node.js 24 (validated here with v24.22.1). No npm install is needed.
2. From the repository root, run:

   ```sh
   node --test --test-name-pattern='019:' scripts/reproduce-offline.mjs
   ```

3. The named test checks the current defect and its documented controls against pinned upstream text. A passing test confirms the described offline behavior, not a correction.
4. See `[the full test output](../evidence/validation/offline-tests.tap)` and `[harness boundaries](../VALIDATION.md)`.

1. In a clean checkout, create a repo-root .env that uncomments the overrides .env.example offers (lines 12-14):  NETWORK=testnet RPC_URL=http://127.0.0.1:9/bad REST_API_URL=http://127.0.0.1:9/v0  
2. From strategies/grid , run exactly what every spot strategy’s src/config.ts does, then read the network the bot will use:  node --input-type=module -e 'import { loadEnv, getNetwork } from "@dreamdex-bot-kit/core"; loadEnv(); console.log(process.env.RPC_URL, getNetwork().rpcUrl, getNetwork().restApi)'

## Expected

.env.example says “Optional RPC / API overrides … only set these to use your own”, so getNetwork().rpcUrl / restApi / wsUrl should be the values from .env.

## Actual

process.env.RPC_URL is set, but the network config still holds the built-in defaults, so the bot silently keeps talking to the default RPC and REST API:

process.env.RPC_URL = http://127.0.0.1:9/bad getNetwork().rpcUrl = https://dream-rpc.somnia.network getNetwork().restApi = https://stg.api.dreamdex.io/v0

Cause: packages/core/src/config/networks.ts:38-50 reads process.env.RPC_URL ?? … inside the top-level NETWORKS object literal. That object is evaluated when @dreamdex-bot-kit/core is imported ( packages/core/ src/index.ts:19 re-exports it), which happens before the strategy’s loadEnv() call on the next line (e.g. strategies/grid/src/config.ts:9-10 , same in market-making, twap, …). The overrides only work if exported in the shell. scripts/doctor.ts:18 calls dotenv before its dynamic import, so the doctor honours the override while the bots don’t. Someone who points the doctor at a private/faster RPC sees it work and then runs a bot that ignores it.

## Evidence

Offline reproduction passed; see the linked test output.

- [Original item excerpt](../evidence/pdf/019.txt) from PDF pages 37-38. 
- [Source provenance and limitations](../evidence/README.md).
- [New offline execution log](../evidence/validation/offline-tests.tap), test `019:`.

### Recorded results

```text
• Command and output above, run 2026-10-31 02:23 UTC from strategies/grid at commit
      4e75896896e024c03e2033d5920514f249998cd6.
    • packages/core/src/config/networks.ts:38,39,40,48,49,50 ; packages/core/src/index.ts:19 ;
      strategies/grid/src/config.ts:9-10 ; .env.example:10-14 ; contrast scripts/doctor.ts:18-20 (dotenv
      before import).
```

## Environment

dreamdex-bot-kit commit 4e75896896e024c03e2033d5920514f249998cd6, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, DRY_RUN). Spot path uses NETWORK=testnet (Shannon defaults); no transactions sent.

Offline reproduction: Node.js v24.22.1; synthetic inputs; no wallet or transactions.
