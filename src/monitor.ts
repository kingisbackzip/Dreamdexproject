import "dotenv/config";

import {
  SOMNIA_TESTNET_ADDRESSES,
  SomniaMarkets,
  isPerpMarket,
  type PerpMarket,
} from "@somnia-chain/markets-sdk";
import { defineChain, formatUnits, getAddress, isAddress } from "viem";

import {
  annualizedFundingPercent,
  basisPointSpread,
  classifyHealth,
  maintenanceHealthRatio,
} from "./analytics.js";

const INDEXER_URL = process.env.INDEXER_URL ?? "https://hideki-dev.smk.somnia.host/v1/graphql";
const WS_RPC_URL = process.env.WS_RPC_URL ?? "wss://api.hideki2.infra.testnet.somnia.network/ws";
const RPC_URL = process.env.RPC_URL ?? "https://api.hideki2.infra.testnet.somnia.network";
const SYMBOL_FILTER = process.env.PERP_SYMBOL?.trim();
const OWNER_RAW = process.env.OWNER_ADDRESS?.trim();
const JSON_OUTPUT = process.argv.includes("--json");

const hideki = defineChain({
  id: 50_383,
  name: "Somnia Hideki Testnet",
  nativeCurrency: { name: "Somnia Test Token", symbol: "STT", decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL], webSocket: [WS_RPC_URL] } },
});

type MarketReport = {
  symbol: string;
  active: boolean;
  indexed: boolean;
  markPrice: string | null;
  indexPrice: string;
  markPriceFresh: boolean;
  openInterest: string;
  fundingRatePerWindowPercent: number;
  fundingWindowSeconds: number;
  annualizedFundingPercent: number;
  bestBid: number | null;
  bestAsk: number | null;
  spreadBps: number | null;
  nextFundingAt: string;
};

function ownerAddress(): `0x${string}` | undefined {
  if (!OWNER_RAW) return undefined;
  if (!isAddress(OWNER_RAW)) {
    throw new Error("OWNER_ADDRESS must be a public 0x address. Never provide a private key.");
  }
  return getAddress(OWNER_RAW);
}

function asPerpMarket(market: { info: unknown }): PerpMarket {
  const info = market.info;
  if (!isPerpMarket(info as PerpMarket)) throw new Error("SDK returned a non-perp market in the perp set.");
  return info as PerpMarket;
}

async function inspectMarket(exchange: SomniaMarkets, symbol: string): Promise<MarketReport> {
  const market = exchange.markets[symbol];
  if (!market || market.type !== "swap") throw new Error(`Unknown perp symbol: ${symbol}`);

  const info = asPerpMarket(market);
  const [state, book] = await Promise.all([
    exchange.client.getPerpState(info.poolAddress),
    exchange.fetchOrderBook(symbol, 1),
  ]);
  const bid = book.bids[0]?.[0];
  const ask = book.asks[0]?.[0];
  const rate = Number(formatUnits(state.fundingRate, 18));

  return {
    symbol,
    active: market.active,
    indexed: market.indexed,
    markPrice: state.markPriceOk ? formatUnits(state.markPrice, info.quoteDecimals) : null,
    indexPrice: formatUnits(state.indexPrice, info.quoteDecimals),
    markPriceFresh: state.markPriceOk,
    openInterest: formatUnits(state.openInterest, info.baseDecimals),
    fundingRatePerWindowPercent: rate * 100,
    fundingWindowSeconds: state.fundingWindowSec,
    annualizedFundingPercent: annualizedFundingPercent(rate, state.fundingWindowSec),
    bestBid: bid ?? null,
    bestAsk: ask ?? null,
    spreadBps: basisPointSpread(bid, ask) ?? null,
    nextFundingAt: new Date(Number(state.nextFundingAt) * 1000).toISOString(),
  };
}

async function main(): Promise<void> {
  const owner = ownerAddress();
  const exchange = new SomniaMarkets({
    indexerUrl: INDEXER_URL,
    chain: hideki,
    wsRpcUrl: WS_RPC_URL,
    addresses: SOMNIA_TESTNET_ADDRESSES,
    ...(owner ? { account: owner } : {}),
  });

  try {
  await exchange.loadMarkets(true);
  const symbols = Object.values(exchange.markets)
    .filter((market) => market.type === "swap")
    .map((market) => market.symbol)
    .filter((symbol) => !SYMBOL_FILTER || symbol.toLowerCase() === SYMBOL_FILTER.toLowerCase())
    .sort();

  if (symbols.length === 0) {
    throw new Error(SYMBOL_FILTER ? `No perp matched PERP_SYMBOL=${SYMBOL_FILTER}` : "No DreamDEX perp markets found.");
  }

  const markets = await Promise.all(symbols.map((symbol) => inspectMarket(exchange, symbol)));
  let margin: Record<string, unknown> | undefined;

  if (owner) {
    const first = exchange.markets[symbols[0]!];
    if (!first) throw new Error("Market registry changed while reading.");
    const info = asPerpMarket(first);
    const account = await exchange.client.getMarginAccount(info.marginBank, owner);
    const ratio = maintenanceHealthRatio(account.equity, account.mmReq);
    margin = {
      owner,
      collateralDecimals: info.quoteDecimals,
      unlockedCollateral: formatUnits(account.unlockedCollateralBalance, info.quoteDecimals),
      lockedCollateral: formatUnits(account.lockedCollateral, info.quoteDecimals),
      equity: formatUnits(account.equity, info.quoteDecimals),
      initialMarginRequirement: formatUnits(account.imReq, info.quoteDecimals),
      maintenanceMarginRequirement: formatUnits(account.mmReq, info.quoteDecimals),
      contractStatus: account.marginStatus,
      maintenanceHealthRatio: Number.isFinite(ratio) ? ratio : null,
      displayHealthLevel: classifyHealth(ratio),
      activePerpPools: account.activePerpPools.length,
    };
  }

  const report = {
    generatedAt: new Date().toISOString(),
    network: { name: hideki.name, chainId: hideki.id },
    readOnly: true,
    markets,
    ...(margin ? { margin } : {}),
  };

  if (JSON_OUTPUT) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log(`DreamDEX Perps Market Monitor · ${report.network.name} (${report.network.chainId})`);
  console.log(`Mode: READ ONLY · ${report.markets.length} market(s) · ${report.generatedAt}\n`);
  for (const market of report.markets) {
    const mark = market.markPrice ?? `STALE (index ${market.indexPrice})`;
    const book = market.bestBid === null || market.bestAsk === null
      ? "incomplete book"
      : `${market.bestBid} / ${market.bestAsk} · ${market.spreadBps?.toFixed(2) ?? "?"} bps`;
    console.log(
      `${market.symbol}\n` +
        `  active=${market.active} indexed=${market.indexed} mark=${mark} OI=${market.openInterest}\n` +
        `  funding=${market.fundingRatePerWindowPercent.toFixed(6)}%/${market.fundingWindowSeconds}s ` +
        `(${market.annualizedFundingPercent.toFixed(2)}% simple APR)\n` +
        `  bid/ask=${book} nextFunding=${market.nextFundingAt}`,
    );
  }
  if (margin) console.log(`\nMargin\n${JSON.stringify(margin, null, 2)}`);
  } finally {
    await exchange.close();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`monitor failed: ${message}`);
  process.exitCode = 1;
});
