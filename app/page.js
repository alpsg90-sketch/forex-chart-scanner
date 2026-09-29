"use client";
import {useEffect,useMemo,useState} from "react";

export default function Home(){
  const[tf,setTf]=useState("All"),[q,setQ]=useState(""),[rows,setRows]=useState([]),[loading,setLoading]=useState(true),[backtest,setBacktest]=useState(null);

  async function load(){
    setLoading(true);
    try{const d=await (await fetch("/api/scan",{cache:"no-store"})).json();setRows(d.results||[])}finally{setLoading(false)}
  }
  async function loadBacktest(){setBacktest(await (await fetch("/api/backtest",{cache:"no-store"})).json())}
  useEffect(()=>{load();loadBacktest()},[]);
  const filtered=useMemo(()=>rows.filter(r=>(tf==="All"||r.tf===tf)&&r.pair.toLowerCase().includes(q.toLowerCase())),[rows,tf,q]);

  return <main className="shell">
    <header><div className="eyebrow">MARKET INTELLIGENCE</div><h1>Forex Chart Scanner</h1><p>Rule-based analysis for forex and gold markets.</p></header>
    <section className="hero"><div><div className="eyebrow">V3 SCANNER ENGINE</div><h2>Trend + momentum + volatility + structure.</h2><p>EMA 20/50, RSI 14, ATR 14, breakout structure and a transparent setup score.</p></div><button onClick={load}>Refresh scan</button></section>
    <section className="controls"><input placeholder="Search pair..." value={q} onChange={e=>setQ(e.target.value)}/><div className="tabs">{["All","5M","15M","1H","4H","1D"].map(x=><button className={tf===x?"active":""} key={x} onClick={()=>setTf(x)}>{x}</button>)}</div></section>
    <section className="stats"><div><span>Pairs scanned</span><strong>{filtered.length}</strong></div><div><span>Buy setups</span><strong>{filtered.filter(x=>x.signal==="BUY").length}</strong></div><div><span>Sell setups</span><strong>{filtered.filter(x=>x.signal==="SELL").length}</strong></div><div><span>Neutral</span><strong>{filtered.filter(x=>x.signal==="NEUTRAL").length}</strong></div></section>
    <section className="panel"><div className="panelhead"><h3>Scanner results</h3><p>{loading?"Calculating...":"Live adapter ready; sample data is used until provider credentials are configured."}</p></div><div className="table"><div className="tr th"><span>Pair</span><span>TF</span><span>Trend</span><span>RSI</span><span>Setup</span><span>Signal</span><span>Score</span></div>{filtered.map(r=><div className="tr" key={r.pair+r.tf}><span className="pair">{r.pair}</span><span>{r.tf}</span><span>{r.trend}</span><span>{r.rsi}</span><span>{r.setup}</span><span className={"signal "+r.signal.toLowerCase()}>{r.signal}</span><span>{r.score}/100</span></div>)}</div></section>
    <section className="panel backtest"><div className="panelhead"><h3>Strategy backtest</h3><p>Illustrative sample-candle test only. It is not evidence of future performance.</p></div>{backtest&&<div className="backgrid">{backtest.results.map(r=><div className="bt" key={r.pair}><strong>{r.pair}</strong><span>Trades: {r.tradeCount}</span><span>Win rate: {r.winRate}%</span><span>Sample return: {r.totalReturn}%</span></div>)}</div>}</section>
    <footer>Scores and backtests are analytical tools, not guarantees. Use historical/paper testing before considering real-money trading.</footer>
  </main>
}