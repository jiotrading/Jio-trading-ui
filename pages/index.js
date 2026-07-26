import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [signals, setSignals] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('SOL-USD');

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

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
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
          <iframe
            src={https://s.tradingview.com/widgetembed/?frameElementId=tradingview_1&symbol=${selectedSymbol.replace('-USD', 'USDT')}&interval=5&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&timezone=Etc%2FUTC}
            style={{ width: '100%', height: '500px', border: 'none', borderRadius: '8px' }}
          ></iframe>
        </section>

        <section style={{ backgroundColor: '#1e293b', borderRadius: '10px', padding: '15px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#cbd5e1' }}>
            🤖 AI SIGNAL ANALYTICS
          </h2>

          {signals.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>Loading live signals...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
              {signals.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedSymbol(item.symbol)}
                  style={{
                    backgroundColor: selectedSymbol === item.symbol ? '#334155' : '#0f172a',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: '1px solid #334155',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#f8fafc' }}>{item.symbol}</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                      Price: ${item.price} | RSI: {item.rsi}
                    </p>
                  </div>
                  <div>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: item.signal === 'BUY' ? '#166534' : item.signal === 'SELL' ? '#991b1b' : '#334155',
                        color: item.signal === 'BUY' ? '#4ade80' : item.signal === 'SELL' ? '#f87171' : '#94a3b8'
                      }}
                    >
                      {item.signal}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
