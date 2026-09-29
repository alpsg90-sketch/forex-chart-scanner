import { scanCandles } from "./scanner";

export function backtest(candles, horizon = 5) {
  const trades = [];
  for (let i = 55; i < candles.length - horizon; i++) {
    const setup = scanCandles(candles.slice(0, i + 1));
    if (setup.signal === "NEUTRAL") continue;

    const entry = candles[i].close;
    const exit = candles[i + horizon].close;
    const direction = setup.signal === "BUY" ? 1 : -1;
    const returnPct = ((exit - entry) / entry) * direction * 100;

    trades.push({
      index: i,
      signal: setup.signal,
      score: setup.score,
      returnPct: Number(returnPct.toFixed(3))
    });
  }

  const wins = trades.filter(t => t.returnPct > 0).length;
  const totalReturn = trades.reduce((sum, t) => sum + t.returnPct, 0);

  return {
    trades,
    tradeCount: trades.length,
    wins,
    losses: trades.length - wins,
    winRate: trades.length ? Number((wins / trades.length * 100).toFixed(1)) : 0,
    totalReturn: Number(totalReturn.toFixed(2))
  };
}
