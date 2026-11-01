/** Reconstructed pure-function checks for PDF items 037-038.
 * Install the exact direct dependencies in package.json first.
 * This script was supplied, but not executed in the packaging environment.
 * No client, wallet, signer, socket or RPC is created.
 */
import { fromHuman, floorRawBalance, ceilRawAmount, snapRawToGrid } from '@somnia-chain/markets-sdk';

function capture(fn) {
  try { return { ok: true, value: String(fn()) }; }
  catch (error) { return { ok: false, error: error.name, message: error.message }; }
}

console.log('037: number/string conversion comparison; SDK pinned to 0.32.1 by package.json');
for (const [number, decimal, decimals, expected] of [
  [1.005, '1.005', 2, 101n],
  [2.675, '2.675', 2, 268n],
  [-1.005, '-1.005', 2, -101n],
  [0.0000005, '0.0000005', 6, 1n],
  [0.00000025, '0.00000025', 7, 3n],
  [1.0000005, '1.0000005', 6, 1000001n],
]) {
  console.log(JSON.stringify({ number: String(number), decimal, decimals,
    decimalHalfAwayExpected: String(expected),
    numberResult: capture(() => fromHuman(number, decimals)),
    stringResult: capture(() => fromHuman(decimal, decimals)),
  }));
}

console.log('038: quantum input handling; no market data query is used');
const raw = 3456789012345678n, step = 100000000000n;
for (const quantum of ['0.0000001', '1e-7', '0', '-0.0000001', 'abc']) {
  const floor = capture(() => floorRawBalance(raw, 18, quantum));
  const ceil = capture(() => ceilRawAmount(raw, 18, quantum));
  console.log(JSON.stringify({ quantum, floor, ceil,
    ceilOnGrid: ceil.ok ? BigInt(ceil.value) % step === 0n : null,
  }));
}
for (const invalid of [0n, -step]) {
  console.log(JSON.stringify({ snapStep: String(invalid), result: capture(() => snapRawToGrid(raw, invalid, 'up')) }));
}
