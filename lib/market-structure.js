export function detectStructure(candles, lookback = 5) {
  if (candles.length < lookback * 2 + 2) return { bias: "Neutral", support: null, resistance: null };

  const highs = [], lows = [];
  for (let i = lookback; i < candles.length - lookback; i++) {
    const window = candles.slice(i - lookback, i + lookback + 1);
    const h = candles[i].high, l = candles[i].low;
    if (h === Math.max(...window.map(c => c.high))) highs.push(h);
    if (l === Math.min(...window.map(c => c.low))) lows.push(l);
  }

  const last = candles[candles.length - 1].close;
  const resistance = highs.length ? Math.max(...highs.slice(-3)) : null;
  const support = lows.length ? Math.min(...lows.slice(-3)) : null;
  const bias = resistance && last > resistance ? "Bullish breakout" : support && last < support ? "Bearish breakdown" : "Range / developing";

  return { bias, support, resistance };
}
