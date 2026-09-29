import { NextResponse } from "next/server";
import { makeSampleCandles, scanCandles } from "../../../lib/scanner";

const pairs = [
  ["EUR/USD", "15M", 1.08],
  ["GBP/USD", "1H", 1.27],
  ["USD/JPY", "15M", 145],
  ["XAU/USD", "15M", 2650]
];

export async function GET() {
  const results = pairs.map(([pair, tf, seed]) => ({
    pair,
    tf,
    ...scanCandles(makeSampleCandles(seed))
  }));
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    live: false,
    results
  });
}
