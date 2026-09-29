"use client";

import {useEffect,useMemo,useState} from "react";

export default function Home(){
  const [tf,setTf]=useState("All");
  const [q,setQ]=useState("");
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);

  async function load(){
    setLoading(true);
    try{
      const res=await fetch("/api/scan",{cache:"no-store"});
      const data=await res.json();
      setRows(data.results||[]);
    }finally{setLoading(false);}
  }

  useEffect(()=>{load()},[]);

  const filtered=useMemo(()=>rows.filter(r=>(tf==="All"||r.tf===tf)&&r.pair.toLowerCase().includes(q.toLowerCase())),[rows,tf,q]);

  return <main className="shell">
    <header><div className="eyebrow">MARKET INTELLIGENCE</div><h1>Forex Chart Scanner</h1><p>Transparent, rule-based market analysis.</p></header>
    <section className="hero"><div><div className="eyebrow">V2 SCANNER ENGINE</div><h2>See the rules behind every setup.</h2><p>EMA 20/50 trend, RSI 14 momentum, ATR volatility and recent price-break rules are combined into a transparent setup score.</p></div><button onClick={load}>Refresh scan</button></section>
    <section className="controls"><input placeholder="Search pair..." value={q} onChange={e=>setQ(e.target.value)}/><div className="tabs">{["All","5M","15M","1H","4H","1D"].map(x=><button className={tf===x?"active":""} key={x} onClick={()=>setTf(x)}>{x}</button>)}</div></section>
    <section className="stats"><div><span>Pairs scanned</span><strong>{filtered.length}</strong></div><div><span>Buy setups</span><strong>{filtered.filter(x=>x.signal==="BUY").length}</strong></div><div><span>Sell setups</span><strong>{filtered.filter(x=>x.signal==="SELL").length}</strong></div><div><span>Neutral</span><strong>{filtered.filter(x=>x.signal==="NEUTRAL").length}</strong></div></section>
    <section className="panel"><div className="panelhead"><h3>Scanner results</h3><p>{loading?"Calculating rules...":"Calculated from sample OHLC data — live market feed is the next integration."}</p></div>
      <div className="table"><div className="tr th"><span>Pair</span><span>TF</span><span>Trend</span><span>RSI</span><span>Setup</span><span>Signal</span><span>Score</span></div>
      {filtered.map(r=><div className="tr" key={r.pair+r.tf}><span className="pair">{r.pair}</span><span>{r.tf}</span><span>{r.trend}</span><span>{r.rsi}</span><span>{r.setup}</span><span className={"signal "+r.signal.toLowerCase()}>{r.signal}</span><span>{r.score}/100</span></div>)}
      </div>
    </section>
    <footer>Scores are rule-based analytical outputs, not probabilities or guarantees. Paper-test strategies before considering real-money use.</footer>
  </main>
}