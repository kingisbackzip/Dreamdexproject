import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire, stripTypeScriptTypes} from 'node:module';
import {pathToFileURL} from 'node:url';
import vm from 'node:vm';
const require=createRequire(process.env.SDK_PACKAGE_JSON || import.meta.url);
const dist=new URL('./',pathToFileURL(require.resolve('@somnia-chain/markets-sdk')));
assert.equal(JSON.parse(readFileSync(new URL('../package.json',dist))).version,'0.32.1');
for (const [path,hash] of Object.entries(JSON.parse(readFileSync(new URL('../evidence/round2/sdk-sha256.json',import.meta.url))))) {
 assert.equal(createHash('sha256').update(readFileSync(new URL(path,dist))).digest('hex'),hash,path);
}
const sdk=async p=>import(new URL(p,dist));
const src=p=>readFileSync(new URL(p,dist),'utf8');
const snapshot=p=>readFileSync(new URL('../evidence/round2/'+p,import.meta.url),'utf8');
const {estimateMarketOrder,fillsWithinSlippage}=await sdk('unified/quotes.js');
const units=await sdk('units.js');
const funding=await sdk('funding.js');
const derived=await sdk('derivedReads.js');
const typescript=s=>stripTypeScriptTypes(s,{mode:'strip'});
const metricsCode=typescript(snapshot('metrics.ts')).replaceAll('export ','');
const computeMetrics=vm.runInNewContext(metricsCode+';computeMetrics');
const ledger={fills:[],realizedPnl:0,feesPaid:0,base:0,quote:0};
test('R2-03: candle fold excludes partial first hour',()=>{
 const now=90000+1800;const c=t=>({bucketStart:String(t),high:'100',low:'90',openPrice:'95',closePrice:'96',quoteVolume:'10',baseVolume:'1',tradeCount:1});
 const result=derived.marketStats24hFromCandles([c(3600),c(7200)],now);
 assert.equal(result.trades24h,1);assert.equal(derived.marketStats24hFromCandles([c(3600),c(7200)],90000).trades24h,2);
 assert.match(src('createClient.js'),/getCandlesInWindow\(pool, 3600/);
});
test('R2-04: exact shipped time-in-force branch selects LIMIT for lowercase ioc',()=>{
 const s=src('unified/exchange.js');const block=s.slice(s.indexOf('let orderType = Trade.ORDER_TYPE.LIMIT;'),s.indexOf('// Collateral must sit',s.indexOf('let orderType = Trade.ORDER_TYPE.LIMIT;')));
 const run=tif=>vm.runInNewContext(block+';orderType',{type:'limit',params:{timeInForce:tif},Trade:{ORDER_TYPE:{LIMIT:0,MARKET:2,POST_ONLY:3,FILL_OR_KILL:1}}});
 assert.equal(run('IOC'),2);assert.equal(run('ioc'),0);assert.equal(run('FOK'),1);assert.equal(run('fok'),0);
});
test('R2-05: invalid rounding direction falls down',()=>{
 assert.equal(units.snapRawToGrid(25n,10n,'up'),30n);assert.equal(units.snapRawToGrid(25n,10n,'UP'),20n);assert.equal(units.roundPriceToTick(25n,10n,'UP'),20n);
});
test('R2-06: NaN slippage passes deep-book guard',()=>{
 const b={bids:[[99,1]],asks:[[101,1],[150,1],[200,1]]};
 assert.equal(fillsWithinSlippage(b,'buy',3,0.01),false);assert.equal(fillsWithinSlippage(b,'buy',3,NaN),true);assert.equal(fillsWithinSlippage(b,'buy',3,undefined),true);
});
test('R2-07: positive subsecond funding window reaches division by zero',()=>{
 assert.throws(()=>funding.fundingRate8h(10n**14n,0.5),/Division by zero/);assert.equal(funding.fundingRate8h(10n**14n,28800),10n**14n);
 assert.throws(()=>funding.isFundingStale(100n,3601,160n,1.5),/integer/);
});
test('R2-08: max percentage drawdown overwritten by larger absolute loss',()=>{
 const m=computeMetrics({initialEquity:100,finalEquity:900,ledger,equityCurve:[100,50,100,1000,900].map((equity,t)=>({t,equity})),lastMid:1});
 assert.equal(m.maxDrawdownPct,0.1);assert.equal(m.maxDrawdown,100);
});
test('R2-09: actual CLI parser silently ignores misspelled fee flag',()=>{
 let s=typescript(snapshot('backtest.ts'));s=s.slice(s.indexOf('export const BOT_IDS'),s.indexOf('async function main()')).replaceAll('export ','');
 const parse=vm.runInNewContext(s+';parseArgs',{console,process:{exit(){throw Error('exit')}}});
 assert.equal(parse(['run','momentum','--taker-fee-bp','30']).takerFeeBps,0);assert.equal(parse(['run','momentum','--taker-fee-bps','30']).takerFeeBps,30);
});
test('R2-11: fee-losing round trip counted as win',()=>{
 const l={...ledger,fills:[{isBid:true,price:100,qty:1,fee:0.3},{isBid:false,price:100.01,qty:1,fee:0.3}],feesPaid:0.6};
 assert.equal(computeMetrics({initialEquity:100,finalEquity:99.41,ledger:l,equityCurve:[],lastMid:1}).winRate,1);
});
test('R2-17: invalid buy-side string walks bids',()=>{
 const b={bids:[[99,10]],asks:[[101,0.1],[120,10]]};assert.equal(estimateMarketOrder(b,'buy',1).averagePrice,118.1);assert.equal(estimateMarketOrder(b,'BUY',1).averagePrice,99);
 assert.equal(fillsWithinSlippage(b,'buy',1,0.05),false);assert.equal(fillsWithinSlippage(b,'BUY',1,0.05),true);
});
test('R2-18: unsigned plain-order builder accepts fee without address, stop builder rejects',async()=>{
 const {buildPlacePerpOrder}=await sdk('orders.js');const {buildPlacePerpStopOrder}=await sdk('perp/stops.js');const abi=await sdk('tradeAbi.js');const {decodeFunctionData}=require('viem');
 const w={chain:{id:50383},fromAddress:'0x1111111111111111111111111111111111111111',defaultGas:10000000n};
 const p={pool:'0x4181dd08e73bbcdd1ba3e615a18f6abd941b94c0',isBid:true,price:90000n*10n**18n,quantity:100000n,builderFeeBpsTimes1k:5000n};
 const result=await buildPlacePerpOrder(w,p);const decoded=decodeFunctionData({abi:abi.perpPoolWriteAbi,data:result.order.data});assert.equal(decoded.args[7],'0x0000000000000000000000000000000000000000');assert.equal(decoded.args[8],5000n);
 await assert.rejects(()=>buildPlacePerpStopOrder(w,{...p,registry:'0x52e2ccebaec9332672c247e9a90aa3d61fb615ef',triggerPrice:p.price,triggerOperator:1,stopOrderType:1,somiPayment:1n,skipOperatorApproval:true}),/needs a builder/);
});
test('R2-19: real doctor main resolves successfully when every market read fails',async()=>{
 let s=typescript(snapshot('perp-doctor.ts')).replace(/^import[\s\S]*?from ["'][^"']+["'];\s*/gm,'');s=s.slice(0,s.indexOf('main().then('));
 const logs=[];const ctx={console:{log:(x)=>logs.push(x)},formatUnits:()=>'',parseAbi:()=>[],loadConfig:()=>({network:'hideki',chainId:50383}),createExchange:()=>({exchange:{}}),perpMarkets:async()=>[{display:'BTC',info:{quoteToken:'synthetic',quoteDecimals:18}}],liveMark:async()=>{throw Error('simulated RPC failure')},shutdown:async()=>{}};
 const main=vm.runInNewContext(s+';main',ctx);await main();assert.ok(logs.some(x=>x?.includes('ERROR: simulated RPC failure')));assert.match(snapshot('perp-doctor.ts'),/\(\) => process.exit\(0\)/);
});
