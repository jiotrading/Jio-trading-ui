import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [signals, setSignals] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('SOL-USD');

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const res = await fetch('https://yogiaitrading-web.onrender.com/api/signals');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSignals(data);
        } else if (data && Array.isArray(data.signals)) {
          setSignals(data.signals);
        }
      } catch (err) {
        console.error("Error fetching signals:", err);
      }
    };

    fetchSignals();
    const interval = setInterval(fetchSignals, 15000);
    return () => clearInterval(interval);
  }, []);

  const chartSymbol = selectedSymbol ? selectedSymbol.replace('-USD', 'USDT').replace('^', '') : 'SOLUSDT';

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <Head>
        <title>JIO AI TRADING | INSTITUTIONAL V2</title>
      </Head>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '15px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#38bdf8', margin: 0 }}>
          ⚡ JIO AI-TRADING <span style={{ fontSize: '14px', color: '#94a3b8' }}>INSTITUTIONAL V2</span>
        </h1>
        <div style={{ fontSize: '14px', color: '#22c55e' }}>
          🟢 Scanner: Active 24/7 | Dev: Yogendra Kumar
        </div>
      </header>

      <main style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <section style={{ backgroundColor: '#1e293b', borderRadius: '10px', padding: '15px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#cbd5e1' }}>
            📊 Live Technical Chart ({selectedSymbol})
          </h2>
          <div>
            <iframe
              title="TradingView Chart"
              src={"https://s.tradingview.com/widgetembed/?frameElementId=tradingview_1&symbol=" + chartSymbol + "&interval=5&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&timezone=Etc%2FUTC"}
              width="100%"
              height="520"
              frameBorder="0"
            ></iframe>
          </div>
        </section>

        <section style={{ backgroundColor: '#1e293b', borderRadius: '10px', padding: '15px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#cbd5e1' }}>
            🤖 AI SIGNAL ANALYTICS
          </h2>

          {signals.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>Loading live signals...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '520px', overflowY: 'auto' }}>
              {signals.map((item, index) => {
                // If API doesn't send TP/SL yet, calculate auto estimates for display
                const entry = item.entry || item.price;
                const sl = item.sl || (item.signal === 'BUY' ? (entry * 0.985).toFixed(2) : item.signal === 'SELL' ? (entry * 1.015).toFixed(2) : '-');
                const tp = item.tp || (item.signal === 'BUY' ? (entry * 1.03).toFixed(2) : item.signal === 'SELL' ? (entry * 0.97).toFixed(2) : '-');

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedSymbol(item.symbol)}
                    style={{
                      backgroundColor: selectedSymbol === item.symbol ? '#334155' : '#0f172a',
                      padding: '12px 15px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: '1px solid #334155'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', color: '#f8fafc' }}>{item.symbol}</h3>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          backgroundColor: item.signal === 'BUY' ? '#166534' : item.signal === 'SELL' ? '#991b1b' : '#334155',
                          color: item.signal === 'BUY' ? '#4ade80' : item.signal === 'SELL' ? '#f87171' : '#94a3b8'
                        }}
                      >
                        {item.signal}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                      Live Price: <strong style={{ color: '#f1f5f9' }}>${item.price}</strong> | RSI: <strong>{item.rsi}</strong>
                    </div>

                    {/* Entry / Target / StopLoss Badges */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', fontSize: '11px', textAlign: 'center' }}>
                      <div style={{ backgroundColor: '#1e293b', padding: '4px', borderRadius: '4px', border: '1px solid #334155' }}>
                        <span style={{ color: '#94a3b8', display: 'block' }}>Entry</span>
                        <strong style={{ color: '#38bdf8' }}>${entry}</strong>
                      </div>
                      <div style={{ backgroundColor: '#1e293b', padding: '4px', borderRadius: '4px', border: '1px solid #334155' }}>
                        <span style={{ color: '#94a3b8', display: 'block' }}>Target (TP)</span>
                        <strong style={{ color: '#4ade80' }}>${tp}</strong>
                      </div>
                      <div style={{ backgroundColor: '#1e293b', padding: '4px', borderRadius: '4px', border: '1px solid #334155' }}>
                        <span style={{ color: '#94a3b8', display: 'block' }}>Stop Loss (SL)</span>
                        <strong style={{ color: '#f87171' }}>${sl}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
