# Railway environment template defeats automatic Hideki selection for perps

Severity: normal
Area: SDK
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 5; PDF pages 15-16

## Summary and impact

Railway environment template defeats automatic Hideki selection for perps. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Read .env.railway:1-7 : “Import: Railway service → Variables → RAW Editor → paste this file”, then
      STRATEGY=starter , NETWORK=testnet , DRY_RUN=true . docs/railway.md:95 promises “a perp service
      with no NETWORK runs on Hideki” (also docs/perps.md:78-79).
   2. Simulate the Railway service after that import with a perp strategy (non-key placeholder,
      DRY_RUN, nothing can be sent): PRIVATE_KEY=0x00 STRATEGY=perp-guard NETWORK=testnet
      DRY_RUN=true node scripts/railway-start.mjs , then the same with NETWORK unset.
   3. See what NETWORK=testnet means for perps: NETWORK=testnet npx tsx scripts/perp-doctor.ts (no
      key).
```

## Expected

Following the Railway guide as written, a perp-* service runs on Hideki (where app accounts, trading- key links and Perps Arena live), or railway-start warns that NETWORK=testnet points a perp bot at Shannon.

## Actual

[railway-start] strategy=perp-guard network=testnet dryRun=true wallet=derived-from-key   # NETWORK=testnet from the imported file [railway-start] strategy=perp-guard network=hideki dryRun=true wallet=derived-from-key    # NETWORK unset

railway-start redirects perps to Hideki only when process.env.NETWORK is empty. The documented import sets NETWORK=testnet as a service variable (and the Dockerfile copies the same file in as .env ), so every service the guide sets up has a NETWORK , and the redirect docs/railway.md relies on is never reached. The bot runs on Shannon ( network : testnet (chain 50312) ): different indexer and market list (19 markets incl. SWSOL/SWBNB/SWDOGE-PERP vs 21 on Hideki). With OWNER_ADDRESS the Hideki app link is not found; without it the bot trades the key’s Shannon account. Nothing warns.

Scope: the Railway deploy path ( .env.railway , the Dockerfile copy, railway-start’s redirect, docs/ railway.md’s promise). The local quickstart / root .env.example network defaults are separate issues reported by others.

## Evidence

- [Original item excerpt](../evidence/pdf/005.txt) from PDF pages 15-16. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
• https://github.com/somnia-chain/dreamdex-bot-kit/blob/
      25798660bbe4674a6f83a960b202852896e2fed4/scripts/railway-start.mjs#L73-L78 — if
      (strategy.startsWith("perp-") && !process.env.NETWORK?.trim()) process.env.NETWORK = "hideki";
    • https://github.com/somnia-chain/dreamdex-bot-kit/blob/
      25798660bbe4674a6f83a960b202852896e2fed4/.env.railway#L1-L7 — import instruction and
      NETWORK=testnet
    • https://github.com/somnia-chain/dreamdex-bot-kit/blob/
      25798660bbe4674a6f83a960b202852896e2fed4/Dockerfile#L15 — COPY .env.railway .env
    • https://github.com/somnia-chain/dreamdex-bot-kit/blob/
      25798660bbe4674a6f83a960b202852896e2fed4/docs/railway.md#L95 — perp network promise

    • https://github.com/somnia-chain/dreamdex-bot-kit/blob/
      25798660bbe4674a6f83a960b202852896e2fed4/packages/perp-core/src/config.ts#L152-L153 —
      NETWORK=testnet accepted as a perp network (Shannon)
    • Re-verified 2026-10-29 14:54 UTC: main still 25798660; lines unchanged. Run logs from
      2026-10-22 04:37 UTC.
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

Avoid setting a shared NETWORK value in the deployment template, or validate the network against the chosen strategy before starting it.
