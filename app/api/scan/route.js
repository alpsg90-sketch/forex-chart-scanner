import { NextResponse } from "next/server";
import { makeSampleCandles, scanCandles } from "../../../lib/scanner";
import { getCandles } from "../../../lib/market-data";

const pairs = [
  ["EUR/USD", "15M", "EUR/USD", 1.08],
  ["GBP/USD", "1H", "GBP/USD", 1.27],
  ["USD/JPY", "15M", "USD/JPY", 145],
  ["XAU/USD", "15M", "XAU/USD", 2650]
];

export async function GET() {
  const liveConfigured = Boolean(process.env.MARKET_DATA_BASE_URL && process.env.MARKET_DATA_API_KEY);

  const results = await Promise.all(pairs.map(async ([pair, tf, symbol, seed]) => {
    let candles = null;
    let source = "sample";
    if (liveConfigured) {
      try {
        candles = await getCandles({ symbol, interval: tf === "1H" ? "1h" : "15min" });
        if (candles?.length >= 55) source = "live";
      } catch {}
    }
    candles = candles?.length >= 55 ? candles : makeSampleCandles(seed);
    return { pair, tf, source, ...scanCandles(candles) };
  }));

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    live: results.some(r => r.source === "live"),
    results
  });
}