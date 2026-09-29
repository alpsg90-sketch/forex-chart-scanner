const baseUrl = process.env.MARKET_DATA_BASE_URL || "https://api.twelvedata.com/time_series";
const apiKey = process.env.MARKET_DATA_API_KEY;

export async function getCandles({ symbol, interval = "15min", outputsize = 120 }) {
  if (!apiKey) return null;

  const url = new URL(baseUrl);
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("interval", interval);
  url.searchParams.set("outputsize", String(outputsize));
  url.searchParams.set("include_ohlc", "true");
  url.searchParams.set("timezone", "UTC");
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Market-data request failed: ${response.status}`);

  const data = await response.json();
  if (!Array.isArray(data.values)) throw new Error(data.message || "No candle data returned");

  return data.values
    .map(c => ({
      open: Number(c.open),
      high: Number(c.high),
      low: Number(c.low),
      close: Number(c.close),
      time: c.datetime
    }))
    .filter(c => [c.open,c.high,c.low,c.close].every(Number.isFinite))
    .reverse();
}
