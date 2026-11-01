/** Actual SDK 0.32.1 pure functions/store + pinned bot text. No network/signing.
 * Tests assert observed defects or exclusion reasons, not upstream repairs.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createRequire, stripTypeScriptTypes} from 'node:module';
import {readFileSync, existsSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const require=createRequire(new URL('../review/package.json',import.meta.url));
const {formatUnits,decodeErrorResult,toFunctionSelector}=await import(pathToFileURL(require.resolve('viem')));
const {fromHuman,ceilRawAmount,floorRawBalance,snapRawToGrid}=await import(pathToFileURL(require.resolve('@somnia-chain/markets-sdk')));
const dist=new URL('./',pathToFileURL(require.resolve('@somnia-chain/markets-sdk')));
const sdk=JSON.parse(readFileSync(new URL('../package.json',dist),'utf8'));
assert.equal(sdk.version,'0.32.1');
const {MaterializerStore}=await import(new URL('store.js',dist));
const {perpOrderMarginQuote}=await import(new URL('perp/margin.js',dist));
const {contractErrorsAbi}=await import(new URL('contractErrorsAbi.js',dist));
const bot=p=>readFileSync(new URL('../evidence/upstream/4e758968/'+p,import.meta.url),'utf8');
const strip=s=>stripTypeScriptTypes(s,{mode:'strip'});
function fn(source,name){const m=source.match(new RegExp('(?:export )?(?:async )?function '+name+'\\b[\\s\\S]*?\\n}'));assert.ok(m);return strip(m[0].replace(/^export /,''));}

test('001 exclusion: missing claim selectors are already explicitly acknowledged in shipped JSDoc',()=>{
 const docs=readFileSync(new URL('trade.d.ts',dist),'utf8');
 assert.match(docs,/bundled error table does not name the last two yet/);
 for(const name of ['ClaimantNotFlat','ClaimantIsMainFunded']){
  assert.ok(!contractErrorsAbi.some(e=>e.name===name));
  assert.throws(()=>decodeErrorResult({abi:contractErrorsAbi,data:toFunctionSelector(name+'()')}));
 }
});

test('005 exclusion: explicit NETWORK=testnet is preserved; documented no-NETWORK case selects Hideki',()=>{
 const source=bot('scripts/railway-start.mjs').replace(/^import .*;$/m,'');
 for(const [input,expected] of [['testnet','testnet'],[undefined,'hideki']]){
  let childEnv;
  const env={STRATEGY:'perp-guard',PRIVATE_KEY:'0x'+'11'.repeat(32),DRY_RUN:'true'};
  if(input)env.NETWORK=input;
  vm.runInNewContext(source,{process:{env,on(){},exit(){throw Error('unexpected exit');}},console:{log(){},error(){}},spawn(_cmd,_args,options){childEnv=options.env;return {on(){}};}});
  assert.equal(childEnv.NETWORK,expected);
 }
});

test('008: real margin quote reports sufficient with a synthetic quantity above a separately supplied account cap',()=>{
 const one=10n**18n, syntheticCap=100n;
 const p={isBid:true,quantity:101n,positionSize:0n,effectiveReducingCapacity:0n,
  price:one,markPrice:one,oneBase:1n,effectiveImfBps:1000n,
  creditFloor:0n,voucherMarketAllowed:true,voucherLeverageCapX:0,
  accountMaxLeverageX:0,protocolMaxLeverageX:0,unlockedCollateral:1000000n*one,
  equity:1000000n*one,imRequirement:0n,restricted:false,isolationAllowsMarket:true};
 assert.ok(p.quantity>syntheticCap);
 assert.equal(perpOrderMarginQuote(p).sufficient,true);
 assert.match(readFileSync(new URL('somniaMarketsClient.d.ts',dist),'utf8'),/whether the pool will accept it/);
 // This establishes a quote/documentation boundary; the synthetic cap is not live state.
});

test('009 hold: shipped offset query uses updatedAt alone without a unique tie breaker',()=>{
 const s=readFileSync(new URL('perp/state.js',dist),'utf8');
 assert.match(s,/PerpPosition\(where: \$where, order_by: \{ updatedAt: desc \}, limit: \$limit, offset: \$offset\)/);
 // No indexer contact: intermittent duplicate/omission is not independently reproduced.
});

test('020 scope hold: documented analytics workspace is outside the root workspace patterns',()=>{
 const root=JSON.parse(bot('package.json'));
 assert.deepEqual(root.workspaces,['packages/*','strategies/*','advanced/*']);
 assert.match(bot('strategies/yield-optimizer/README.md'),/npm start -w dreamdex-edge-analytics/);
 assert.equal(JSON.parse(bot('tools/edge-analytics/package.json')).name,'dreamdex-edge-analytics');
});

test('021 scope hold: real starter registers SIGINT cleanup but no SIGTERM cleanup',async()=>{
 let source=bot('strategies/starter/src/index.ts').replace(/^import .*;$/gm,'');
 source=source.slice(0,source.lastIndexOf('main().catch('))+'globalThis.done=main();';
 const handlers=new Map(),cancelled=[];
 const pool={tick:1,lot:1,minQty:1,topOfBook:async()=>({bestBid:99,bestAsk:101,mid:100}),walletBase:async()=>0,place:async()=>({orderId:1n,txHash:'synthetic'}),cancel:async id=>cancelled.push(id)};
 const context=vm.createContext({createChainContext:()=>({net:{name:'synthetic'},account:{address:'synthetic'}}),Pool:{load:async()=>pool},ORDER_TYPE:{PostOnly:2,ImmediateOrCancel:1},config:{dryRun:false,symbol:'synthetic',tickMs:1,expireMs:1},decide:()=>[{side:'buy',size:1,price:99}],console:{log(){},error(){}},setInterval(){return 1;},clearInterval(){},process:{on:(s,f)=>handlers.set(s,f),exit(){}}});
 vm.runInContext(strip(source),context);await context.done;
 assert.ok(handlers.has('SIGINT'));assert.ok(!handlers.has('SIGTERM'));
 await handlers.get('SIGINT')();assert.deepEqual(cancelled,[1n]);
});

test('024: actual maker ask expression and dry-run placePerp floor a sell below the synthetic mark',async()=>{
 const maker=bot('strategies/perp-maker/src/index.ts');
 const decl=maker.match(/^    const askPx = .*;$/m)[0];
 const mark=0.16891;
 const price=vm.runInNewContext(decl+'\naskPx',{mark,half:15/10000,skew:10/10000});
 const logs=[];
 const context=vm.createContext({formatUnits,console:{log:s=>logs.push(s)},ORDER_TYPE:{LIMIT:0,MARKET:1,FILL_OR_KILL:3}});
 vm.runInContext(fn(bot('packages/perp-core/src/markets.ts'),'alignPrice')+'\n'+fn(bot('packages/perp-core/src/orders.ts'),'placePerp')+'\nglobalThis.place=placePerp;',context);
 const result=await context.place({ctx:{config:{dryRun:true}},market:{info:{tickSize:'100000000000000',baseDecimals:7,baseSymbol:'XLM'}},side:'short',quantity:10000000n,price,orderType:2});
 assert.equal(result.sent,false);
 assert.match(logs[0],/@ 0\.1689$/);
 assert.ok(Number(logs[0].split('@ ')[1])<mark);
 const tick=100000000000000n;
 const roundUp=((price+tick-1n)/tick)*tick;
 assert.ok(roundUp>=price); // reference directional-rounding control
});

test('026 exclusion: unknown backtest keys are explicitly allowed for forward compatibility',()=>{
 assert.match(bot('packages/backtest/src/config-overrides.ts'),/Allow unknown keys for forward-compat/);
});

test('031: actual MaterializerStore recentFills puts an older block first inside one timestamp',()=>{
 const pool='0x1111111111111111111111111111111111111111';
 function run(rows){const store=new MaterializerStore(50383);for(const r of rows)store.fills.set(r.id,{pool,price:'1',quantity:'1',makerOrder_id:'m',takerOrder_id:'t',...r});return store.recentFills(pool,10);}
 const old={id:'100_17',blockNumber:100,logIndex:17,timestamp:'1730000000'};
 const newer={id:'101_6',blockNumber:101,logIndex:6,timestamp:'1730000000'};
 assert.deepEqual(run([old,newer]).map(f=>f.id),['100_17','101_6']);
 assert.deepEqual(run([old,{...newer,timestamp:'1730000001'}]).map(f=>f.id),['101_6','100_17']);
});

test('036 low-value packaging note: MIGRATING links to an unshipped changelog',()=>{
 const text=readFileSync(new URL('../docs/MIGRATING.md',dist),'utf8');
 assert.match(text,/\.\.\/CHANGELOG\.md/);
 assert.equal(existsSync(new URL('../CHANGELOG.md',dist)),false);
});

test('037: actual fromHuman violates the stated decimal half-away rule for five number/string pairs',()=>{
 for(const [n,s,d,expected] of [[1.005,'1.005',2,101n],[2.675,'2.675',2,268n],[-1.005,'-1.005',2,-101n],[5e-7,'0.0000005',6,1n],[2.5e-7,'0.00000025',7,3n]]){
  assert.equal(fromHuman(s,d),expected);assert.notEqual(fromHuman(n,d),expected);
 }
 assert.equal(fromHuman(1.0000005,6),1000001n);
});

test('038: actual ceilRawAmount silently returns an off-grid value for unsupported or invalid quantum',()=>{
 const raw=3456789012345678n,step=100000000000n;
 assert.equal(ceilRawAmount(raw,18,'0.0000001')%step,0n);
 for(const q of ['1e-7','0','-0.0000001','abc']){
  assert.equal(ceilRawAmount(raw,18,q),raw);
  assert.notEqual(ceilRawAmount(raw,18,q)%step,0n);
  assert.equal(floorRawBalance(raw,18,q),Number(formatUnits(raw,18)));
 }
 assert.throws(()=>snapRawToGrid(raw,0n,'up'));
});
