import { NextResponse } from "next/server";
import { makeSampleCandles } from "../../../lib/scanner";
import { backtest } from "../../../lib/backtest";

export async function GET() {
  const results = [
    ["EUR/USD", 1.08],
    ["GBP/USD", 1.27],
    ["USD/JPY", 145],
    ["XAU/USD", 2650]
  ].map(([pair, seed]) => ({
    pair,
    ...backtest(makeSampleCandles(seed))
  }));

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    type: "illustrative-sample-backtest",
    results
  });
}
