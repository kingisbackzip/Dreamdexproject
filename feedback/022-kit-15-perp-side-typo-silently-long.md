# Unknown PERP_SIDE values silently select long

Severity: major
Area: SDK

## Steps to reproduce

1. Use Node.js 24 (validated here with v24.22.1). No npm install is needed.
2. From the repository root, run:

   ```sh
   node --test --test-name-pattern='022:' scripts/reproduce-offline.mjs
   ```

3. The named test checks the current defect and its documented controls against pinned upstream text. A passing test confirms the described offline behavior, not a correction.
4. See `[the full test output](../evidence/validation/offline-tests.tap)` and `[harness boundaries](../VALIDATION.md)`.

1. cd strategies/perp-starter
2. NETWORK=hideki PERP_SYMBOL=BTC-PERP PERP_SIDE=sell npx tsx src/index.ts
3. Repeat with PERP_SIDE=bear and PERP_SIDE=short .

## Expected

An unrecognised value is rejected at startup (the kit already throws on non-numeric values via envNum , and on a bad NETWORK / OWNER_ADDRESS). It should never be mapped to the opposite direction.

## Actual

PERP_SIDE=sell (the spot/ccxt word for going short) and PERP_SIDE=bear both give … | long 50 USDso at 2x … and [dry-run] would place open long 0.00064 BTC @ 77592.1 . Only short (any case/whitespace) goes short. With DRY_RUN=false the bot would open a leveraged position in the opposite direction from the one intended, and arm a bracket around it. Cause: strategies/perp-starter/src/index.ts:57 : (process.env.PERP_SIDE ?? "long").trim().toLowerCase() === "short" ? "short" : "long" .

## Evidence

Offline reproduction passed; see the linked test output.

- [Original item excerpt](../evidence/pdf/022.txt) from PDF pages 41-41. 
- [Source provenance and limitations](../evidence/README.md).
- [New offline execution log](../evidence/validation/offline-tests.tap), test `022:`.

### Recorded results

```text
2026-10-31 02:29:07 UTC, commit 4e75896896e024c03e2033d5920514f249998cd6, keyless DRY_RUN
on Hideki:

 == PERP_SIDE='sell'
 perp-starter on BTC-PERP (BTC/USDso:USDso) | long 50 USDso at 2x | take-profit 2% stop-loss 1% | dry-run
 true
 [dry-run] would place open long 0.00064 BTC @ 77592.1
 == PERP_SIDE='SHORT'
 … | short 50 USDso at 2x … would place open short 0.00064 BTC @ 77278
 == PERP_SIDE='bear'
 … | long 50 USDso at 2x … would place open long 0.00064 BTC @ 77593.1


strategies/perp-starter/src/index.ts:57 ; README.md:11 documents only long / short , with no warning
that anything else means long.
```

## Environment

dreamdex-bot-kit commit 4e75896896e024c03e2033d5920514f249998cd6, network Somnia Tokyo testnet (Hideki, chain 50383), wallet address: none (read-only, DRY_RUN)

Offline reproduction: Node.js v24.22.1; synthetic inputs; no wallet or transactions.
