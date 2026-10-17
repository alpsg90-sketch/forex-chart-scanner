import { ema, rsi, atr } from "./indicators";
const roundPrice = value => Number(value.toFixed(value >= 100 ? 3 : value >= 10 ? 4 : 5));
export function scanCandles(candles, timeframe = "15M") {
  if (!candles || candles.length < 55) return { signal:"NEUTRAL",score:50,trend:"Neutral",setup:"Insufficient data",rsi:50,atr:0,currentPrice:null,tradePlan:null,holdEstimate:"No setup" };
  const closes=candles.map(c=>c.close), fast=ema(closes,20), slow=ema(closes,50), current=closes[closes.length-1], currentRsi=rsi(closes,14), currentAtr=atr(candles,14);
  let score=50; const bullish=fast>slow&&current>fast, bearish=fast<slow&&current<fast;
  if(bullish)score+=20; if(bearish)score-=20;
  if(currentRsi>=52&&currentRsi<=68)score+=12; if(currentRsi<=48&&currentRsi>=32)score-=12;
  const recent=candles.slice(-6), highs=recent.slice(0,-1).map(c=>c.high), lows=recent.slice(0,-1).map(c=>c.low), last=recent[recent.length-1];
  if(last.close>Math.max(...highs))score+=10; if(last.close<Math.min(...lows))score-=10;
  score=Math.max(0,Math.min(100,Math.round(score)));
  const signal=score>=68?"BUY":score<=32?"SELL":"NEUTRAL", trend=bullish?"Bullish":bearish?"Bearish":"Neutral";
  const setup=signal==="BUY"?"Momentum / breakout":signal==="SELL"?"Momentum / breakdown":"No clear setup";
  const risk=currentAtr*1.2, reward=currentAtr*1.8;
  const holdEstimate=signal==="NEUTRAL"?"Wait":(["5M","15M"].includes(timeframe)?"Approx. 15–90 min; reassess each candle":"Approx. 1–4 hours; reassess each candle");
  const tradePlan=signal==="BUY"?{entry:roundPrice(current),stopLoss:roundPrice(current-risk),takeProfit:roundPrice(current+reward),riskReward:"1:1.5"}:signal==="SELL"?{entry:roundPrice(current),stopLoss:roundPrice(current+risk),takeProfit:roundPrice(current-reward),riskReward:"1:1.5"}:null;
  return {signal,score,trend,setup,rsi:Math.round(currentRsi),atr:Number(currentAtr.toFixed(5)),ema20:roundPrice(fast),ema50:roundPrice(slow),currentPrice:roundPrice(current),tradePlan,holdEstimate};
}
export function makeSampleCandles(seed=100){const candles=[];let price=seed;for(let i=0;i<80;i++){const drift=i<40?0.03:0.07,wave=Math.sin(i/3)*0.05,open=price,close=price+drift+wave,high=Math.max(open,close)+0.08,low=Math.min(open,close)-0.08;candles.push({open,high,low,close});price=close;}return candles;}
