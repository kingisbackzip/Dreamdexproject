# perp-core stops loading environment files before reaching the repository root

Severity: normal
Area: SDK
Validation status: independently reproduced offline (limited source/mocked strategy checks)
Disclosure: ordinary feedback candidate
Source item: 4; PDF pages 13-14

## Summary and impact

perp-core stops loading environment files before reaching the repository root. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

1. Use Node.js 24 (validated here with v24.22.1). No npm install is needed.
2. From `dreamdex-submission/`, run:

   ```sh
   node --test --test-name-pattern='004:' scripts/reproduce-offline.mjs
   ```

3. The named test checks the current defect and its documented controls against pinned upstream text. A passing test confirms the described offline behavior, not a correction.
4. See [the full test output](../evidence/validation/offline-tests.tap) and [harness boundaries](../VALIDATION.md).

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Use the kit’s documented layout: root .env holds PRIVATE_KEY / NETWORK / OWNER_ADDRESS ; per-
      strategy knobs go in the strategy’s own .env (docs/getting-started.md:32-33; .env.example:34
      “Strategy knobs are in each strategy’s own .env.example”).
   2. Create <root>/.env with NETWORK=testnet and PERP_NOTIONAL_USDSO=20 , and <root>/strategies/perp-
      starter/.env with PERP_SYMBOL=ETH-PERP .
   3. From strategies/perp-starter (the cwd npm start -w perp-starter uses), call perp-core
      loadConfig() ; for comparison call the spot core’s loadEnv() from the same directory (scripts
      scratch/envtest.ts , scratch/envtest-core.ts ).
```

## Expected

Same behaviour as the spot/EC core ( packages/core/src/env.ts ): every .env from cwd up to the root is loaded, nearest wins. perp-core’s own doc comment says the loader exists “so a strategy in strategies/ picks up the repo-root .env”.

## Actual

perp-core loads only the first .env it finds and returns; the root file is never read:

perp-core: {"network":"hideki","symbol":"ETH-PERP","PERP_NOTIONAL_USDSO":null} core     : {"NETWORK":"testnet","PERP_SYMBOL":"ETH-PERP","PERP_NOTIONAL_USDSO":"20"}

With no error message: root PRIVATE_KEY is ignored (bot runs read-only or fails “PRIVATE_KEY is required”), root NETWORK is ignored (falls back to hideki), and in the worst case a root OWNER_ADDRESS is dropped while a local PRIVATE_KEY is present, so the bot trades the bot key’s own account instead of the linked dreamDEX account.

Scope: the loader behaviour only. The missing per-strategy .env.example files for the perp strategies were reported separately by others and are not claimed here.

A new offline check reproduced the narrow behavior described above. Live fills, chain conditions, balances, bracket execution and financial loss were not tested.

## Evidence

- [Original item excerpt](../evidence/pdf/004.txt) from PDF pages 13-14. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).
- [New offline execution log](../evidence/validation/offline-tests.tap), test `004:`.

### Evidence as supplied in the PDF

```text
• https://github.com/somnia-chain/dreamdex-bot-kit/blob/
      25798660bbe4674a6f83a960b202852896e2fed4/packages/perp-core/src/config.ts#L33-L47 —
      doc comment at L33-34 promises the root .env ; L41 if (existsSync(candidate)) return void
      dotenv({ path: candidate }); returns after the first hit.
    • https://github.com/somnia-chain/dreamdex-bot-kit/blob/
      25798660bbe4674a6f83a960b202852896e2fed4/packages/core/src/env.ts#L20-L33 — collects all
      .env files, loads each with override: false (L32).
    • Re-verified 2026-10-29 14:54 UTC: main is still 25798660bbe4674a6f83a960b202852896e2fed4
      (no commits since 2026-10-12); L41 and L32 unchanged. Original run 2026-10-22 04:31 UTC on a
      fresh worktree ( npm ci , build).
```

## Environment

### Original reported environment

dreamdex-bot-kit @ 25798660bbe4674a6f83a960b202852896e2fed4, Somnia Tokyo testnet (Hideki, chain 50383), wallet: none (read-only, DRY_RUN)

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Load the complete environment-file chain with nearest-file precedence, preserving already exported environment variables.
