# Default starter does not register SIGTERM cleanup

Severity: normal
Area: SDK
Validation status: user-supplied evidence only; not rerun in this packaging pass
Disclosure: ordinary feedback candidate
Source item: 21; PDF pages 40-40

## Summary and impact

Default starter does not register SIGTERM cleanup. The detailed behavior and impact below were reported in the supplied PDF; production impact and payout are not established by this package.

## Steps to reproduce

### Procedure recorded in the source PDF

Historical `scripts/`, `scratch/`, `candidates/` and raw-log paths in this procedure were not supplied. They identify the original research workspace, not executable files in this repository. Use the included replacement check where provided; otherwise recreate the stated read-only call or inspect the pinned source before relying on the claim.

```text
1. Read strategies/starter/src/index.ts:82-90 : the cancel-on-exit shutdown handler is registered
      only for SIGINT .
   2. Deploy per docs/railway.md: .env.railway sets STRATEGY=starter and scripts/railway-start.mjs
      defaults to starter . Railway stops and redeploys containers with SIGTERM, which railway-start
      forwards to the child ( scripts/railway-start.mjs , process.on("SIGTERM", () =>
      forward("SIGTERM")) ).
   3. Compare: grep -rn "SIGTERM" strategies/*/src/index.ts
```

## Expected

Like every other strategy (market-making:61, grid:32, twap:34, momentum:37, mean-reversion:37, treasury:73, yield-optimizer:78, ensemble:30, all perp bots via packages/perp-core/src/exchange.ts:182 ), starter cancels its open orders on SIGTERM. The file header promises “cancel on exit”.

## Actual

starter has no SIGTERM handler, so Node’s default action ends the process immediately and the pool.cancel(id) loop never runs. With DRY_RUN=false its live PostOnly quotes stay on the book for up to STARTER_EXPIRE_MS (default 1 hour, strategies/starter/src/config.ts:38 ) after every Railway redeploy/ stop, with nobody managing them. The new container doesn’t know their ids ( openIds lives in memory), so it can’t cancel them either and quotes a second set on top. Related, same file: ticks run from setInterval ( index.ts:77-80 ) with no in-flight guard, and shutdown doesn’t wait for a running tick. An order placed by a tick that’s mid-flight when SIGINT arrives is pushed to openIds after the cancel loop has already run, then process.exit(0) leaves it resting.

## Evidence

- [Original item excerpt](../evidence/pdf/021.txt) from PDF pages 40-40. This is extracted report text, not an original raw execution log.
- [Source provenance and limitations](../evidence/README.md).

### Evidence as supplied in the PDF

```text
• grep -rn "SIGTERM" strategies/*/src/index.ts at commit
      4e75896896e024c03e2033d5920514f249998cd6 (2026-10-31 02:20 UTC) lists every spot
      strategy except starter . strategies/starter/src/index.ts:90 is process.on("SIGINT", shutdown);
      with no SIGTERM line.
    • .env.railway STRATEGY=starter ; scripts/railway-start.mjs process.env.STRATEGY ?? "starter" and
      SIGTERM forwarding; strategies/starter/src/config.ts:38
      expireMs: num("STARTER_EXPIRE_MS", 60 * 60_000) .
    • Found by reading the code. Not run live (that would need a funded key and real orders).
```

## Environment

### Original reported environment

dreamdex-bot-kit commit 4e75896896e024c03e2033d5920514f249998cd6, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, DRY_RUN). The spot starter runs on NETWORK=testnet (Shannon) per .env.railway.

### Packaging and new checks

Prepared 1 November 2026. New executions use local source snapshots and synthetic inputs only; wallet: none, signing: none, transaction submission: none. Offline Node checks used v24.22.1. SDK `0.32.1` is the source report target, not an installed or freshly tested dependency in this pass.

## Severity rationale

Proposed normal in the source PDF for the described correctness, documentation or integration problem. An organizer must confirm intended behavior, impact, scope and duplication.

## Scope, duplicates and limitations

This item concerns adjacent spot, CCXT or bot-tool documentation/behavior. Eligibility under a perps-focused competition needs organizer confirmation. The source PDF sometimes uses a Hideki boilerplate environment for a Shannon-only operation; the actual network described in the procedure takes precedence.

The separate in-flight SIGINT/tick race mentioned in the source excerpt is not independently validated or submitted as an additional finding by this package.

No new competitor-repository sweep was performed. The PDF claims a previous 109-repository comparison; its inventory was not attached, so first-report status is unknown. Historical exclusions of other reporters' findings are preserved in the excerpt and do not prove uniqueness. Live rules, whitelist, current deadline, payout and acceptance remain unverified; see [rules status](../RULES.md).

## Suggested remediation

Handle SIGTERM through the same cleanup path as SIGINT and reconcile outstanding orders when restarting.
