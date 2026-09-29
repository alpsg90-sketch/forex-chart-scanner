import { ema, rsi, atr } from "./indicators";

export function scanCandles(candles) {
  if (!candles || candles.length < 55) {
    return { signal: "NEUTRAL", score: 50, trend: "Neutral", setup: "Insufficient data", rsi: 50, atr: 0 };
  }

  const closes = candles.map(c => c.close);
  const fast = ema(closes, 20);
  const slow = ema(closes, 50);
  const current = closes[closes.length - 1];
  const currentRsi = rsi(closes, 14);
  const currentAtr = atr(candles, 14);

  let score = 50;
  const bullish = fast > slow && current > fast;
  const bearish = fast < slow && current < fast;
  if (bullish) score += 20;
  if (bearish) score -= 20;

  if (currentRsi >= 52 && currentRsi <= 68) score += 12;
  if (currentRsi <= 48 && currentRsi >= 32) score -= 12;

  const recent = candles.slice(-6);
  const highs = recent.slice(0, -1).map(c => c.high);
  const lows = recent.slice(0, -1).map(c => c.low);
  const last = recent[recent.length - 1];
  if (last.close > Math.max(...highs)) score += 10;
  if (last.close < Math.min(...lows)) score -= 10;

  score = Math.max(0, Math.min(100, Math.round(score)));
  const signal = score >= 68 ? "BUY" : score <= 32 ? "SELL" : "NEUTRAL";
  const trend = bullish ? "Bullish" : bearish ? "Bearish" : "Neutral";
  const setup = signal === "BUY" ? "Momentum / breakout" : signal === "SELL" ? "Momentum / breakdown" : "No clear setup";

  return { signal, score, trend, setup, rsi: Math.round(currentRsi), atr: Number(currentAtr.toFixed(5)), ema20: Number(fast.toFixed(5)), ema50: Number(slow.toFixed(5)) };
}

export function makeSampleCandles(seed = 100) {
  const candles = [];
  let price = seed;
  for (let i = 0; i < 80; i++) {
    const drift = i < 40 ? 0.03 : 0.07;
    const wave = Math.sin(i / 3) * 0.05;
    const open = price;
    const close = price + drift + wave;
    const high = Math.max(open, close) + 0.08;
    const low = Math.min(open, close) - 0.08;
    candles.push({ open, high, low, close });
    price = close;
  }
  return candles;
}
