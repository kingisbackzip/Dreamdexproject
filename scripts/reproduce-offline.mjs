/** Execute pinned upstream function/strategy text in isolated mock contexts.
 * No dependencies, real env, keys, sockets, signers or exchange clients.
 * The full-strategy cases mock all perp-core boundaries, not the real core.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';

const snapshot = (commit, path) => readFileSync(new URL(`../evidence/upstream/${commit}/${path}`, import.meta.url), 'utf8');
const latest = path => snapshot('4e758968', path);
const config = latest('packages/perp-core/src/config.ts');
const starter = latest('strategies/perp-starter/src/index.ts');
const csv = latest('tools/edge-analytics/src/csv.ts');
const strip = source => stripTypeScriptTypes(source, { mode: 'strip' });
function fn(source, name) {
  const match = source.match(new RegExp(`(?:export )?(?:async )?function ${name}\\b[\\s\\S]*?\\n}`));
  assert.ok(match, `upstream function ${name} exists`);
  return strip(match[0].replace(/^export /, ''));
}
function realm(env = {}, extra = {}) {
  return vm.createContext({ process: { env: { ...env } }, ...extra });
}

test('004: actual loadEnv stops at nearest file; parent-only control loads root', () => {
  const source = snapshot('25798660', 'packages/perp-core/src/config.ts');
  for (const local of [true, false]) {
    const seen = [];
    const context = realm({}, {
      existsSync: path => path === '/root/.env' || (local && path === '/root/strategy/.env'),
      join: (a, b) => `${a}/${b}`,
      dirname: p => p === '/root/strategy' ? '/root' : '/',
      dotenv: arg => seen.push(arg?.path),
    });
    vm.runInContext(`let envLoaded = false; ${fn(source, 'loadEnv')} loadEnv('/root/strategy');`, context);
    assert.deepEqual(seen, [local ? '/root/strategy/.env' : '/root/.env']);
  }
});

test('019: real NETWORKS initializer captures defaults before env update; pre-import control honors overrides', () => {
  const source = latest('packages/core/src/config/networks.ts');
  const declaration = source.match(/export const NETWORKS[^=]*= [\s\S]*?\n};/)[0];
  const executable = strip(declaration.replace(/^export /, '')) + '\n' + fn(source, 'getNetwork');
  const later = realm({ NETWORK: 'testnet' });
  vm.runInContext(executable, later);
  later.process.env.RPC_URL = 'http://127.0.0.1:9/synthetic';
  later.process.env.REST_API_URL = 'http://127.0.0.1:9/v0';
  assert.equal(vm.runInContext('getNetwork().rpcUrl', later), 'https://dream-rpc.somnia.network');
  assert.notEqual(vm.runInContext('getNetwork().restApi', later), later.process.env.REST_API_URL);
  const before = realm({ NETWORK: 'testnet', RPC_URL: 'http://127.0.0.1:9/synthetic' });
  vm.runInContext(executable, before);
  assert.equal(vm.runInContext('getNetwork().rpcUrl', before), before.process.env.RPC_URL);
});

test('022: actual PERP_SIDE expression maps sell/bear to long; SHORT control stays short', () => {
  const declaration = starter.match(/^const SIDE = .*;$/m)[0];
  for (const [input, expected] of [['sell', 'long'], ['bear', 'long'], [' SHORT ', 'short'], ['long', 'long']]) {
    assert.equal(vm.runInContext(strip(declaration) + '\nSIDE', realm({ PERP_SIDE: input })), expected);
  }
});

test('023: actual envNum accepts bad percentage ranges and actual bracket math inverts prices', () => {
  const take = starter.match(/^const TAKE_PROFIT_PCT = .*;$/m)[0];
  const stop = starter.match(/^const STOP_LOSS_PCT = .*;$/m)[0];
  const up = starter.match(/^  const up = .*;$/m)[0];
  const down = starter.match(/^  const down = .*;$/m)[0];
  const calc = `${fn(config, 'envNum')} ${take} ${stop} const mark = 100; ${up} ${down} [up, down]`;
  const [invertedUp, invertedDown] = vm.runInContext(calc, realm({ PERP_TAKE_PROFIT_PCT: '-2', PERP_STOP_LOSS_PCT: '-1' }));
  assert.equal(invertedUp, 98n * 10n ** 18n);
  assert.equal(invertedDown, 101n * 10n ** 18n);
  const [, negativeDown] = vm.runInContext(calc, realm({ PERP_STOP_LOSS_PCT: '150' }));
  assert.equal(negativeDown, -50n * 10n ** 18n);
  const [healthyUp, healthyDown] = vm.runInContext(calc, realm());
  assert.ok(healthyUp > 100n * 10n ** 18n && healthyDown < 100n * 10n ** 18n);
});

test('025: actual toFillSide maps BUY/long/unknown to sell; canonical buy control passes', () => {
  const declaration = csv.match(/const toFillSide = [\s\S]*?;/)[0];
  const context = realm();
  vm.runInContext(strip(declaration), context);
  for (const [input, expected] of [['buy', 'buy'], ['bid', 'buy'], ['BUY', 'sell'], ['long', 'sell'], ['typo', 'sell']]) {
    context.input = input;
    assert.equal(vm.runInContext('toFillSide(input)', context), expected);
  }
});

test('027: actual parseTs rejects fractional seconds; integer and ISO controls pass', () => {
  const context = realm();
  vm.runInContext(fn(csv, 'parseTs'), context);
  assert.equal(vm.runInContext("parseTs('1730000000')", context), 1730000000000);
  assert.equal(vm.runInContext("parseTs('1730000000250')", context), 1730000000250);
  assert.equal(vm.runInContext("parseTs('2024-10-27T03:33:20.250Z')", context), 1730000000250);
  assert.throws(() => vm.runInContext("parseTs('1730000000.250')", context), /unparseable timestamp/);
});

const market = symbol => ({ symbol: `${symbol}/USDso:USDso`, display: `${symbol}-PERP`, info: { baseSymbol: symbol } });
async function runStrategy(name, { symbol = '', scenario = '' } = {}) {
  let ticks = 0;
  const logs = [], actions = [];
  const btc = market('BTC'), eth = market('ETH');
  const position = { symbol: eth.symbol, side: 'long', contracts: 10, unrealizedPnl: -2 };
  const exchange = { walletAddress: '0x0000000000000000000000000000000000000001', fetchPositions: async () => [position] };
  const ctx = { config: { dryRun: false, symbol, owner: undefined }, exchange };
  const helpers = {
    ORDER_TYPE: { MARKET: 1 }, loadEnv() {}, createExchange: () => ctx,
    onStop: () => () => ticks >= 4,
    sleep: async () => { ticks++; }, shutdown: async () => {},
    envNum: (key, fallback) => fallback,
    requireMarket: async (_exchange, query) => query.startsWith('ETH') ? eth : btc,
    perpMarkets: async () => [btc, eth],
    positionIn: async (_exchange, m) => name === 'perp-starter' || m.symbol === eth.symbol ? position : undefined,
    tradingKeyCheck: async () => ({ ok: true }), preflight: async () => ({ ok: true, message: 'synthetic preflight' }),
    ensureLeverage: async () => ({ dryRun: true }), somiPerStop: async () => 150000000000000000n,
    markOf: () => 100000,
    liveMark: async () => name === 'perp-starter' ? [100000, 100000, 98000, 96000, 90000][ticks] : 100,
    pendingStops: async () => ticks === 0 ? [] : ticks === 1 ? [{ orderIdRaw: 11n }, { orderIdRaw: 12n }] : [{ orderIdRaw: 11n }],
    armBracket: async () => { actions.push('armBracket'); return { sent: true }; },
    cancelStops: async () => { actions.push('cancelStops'); },
    closePosition: async () => { actions.push('closePosition'); },
    marginSnapshot: async () => ({ equity: 1050, mmReq: 1000, status: 0 }),
    healthRatio: snapshot => snapshot.equity / snapshot.mmReq,
  };
  const context = realm({ DRY_RUN: 'false', PERP_SYMBOL: symbol }, {
    ...helpers,
    console: { log: (...args) => logs.push(args.join(' ')), error: (...args) => logs.push(args.join(' ')) },
  });
  let source = latest(`strategies/${name}/src/index.ts`);
  source = source.replace(/^import \{[\s\S]*?\} from "@dreamdex-bot-kit\/perp-core";\n/m, '');
  assert.ok(source.includes('main().then('));
  source = source.slice(0, source.lastIndexOf('main().then(')) + 'globalThis.completion = main();';
  vm.runInContext(strip(source), context);
  await context.completion;
  return { actions, logs, ticks, scenario };
}

test('028: real strategy with synthetic dropped stop logs one armed leg below stop; no fallback close or rearm', async () => {
  const { actions, logs, ticks } = await runStrategy('perp-starter', { scenario: 'stopdrop' });
  assert.equal(ticks, 4);
  assert.equal(actions.filter(a => a === 'armBracket').length, 1);
  assert.equal(actions.filter(a => a === 'closePosition').length, 0);
  assert.ok(logs.some(line => line.includes('1 stop(s) armed') && line.includes('90000.00')));
});

test('029: real guard with BTC-only filter hides synthetic ETH health; unfiltered control closes', async () => {
  const filtered = await runStrategy('perp-guard', { symbol: 'BTC-PERP' });
  assert.equal(filtered.actions.filter(a => a === 'closePosition').length, 0);
  assert.equal(filtered.logs.filter(line => line.includes('health 1.050')).length, 0);
  const all = await runStrategy('perp-guard');
  assert.ok(all.actions.includes('closePosition'));
  assert.ok(all.logs.some(line => line.includes('health 1.050')));
});
