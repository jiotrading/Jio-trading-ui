import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [signals, setSignals] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('SOL-USD');

  const fetchSignals = async () => {
    try {
      const res = await fetch('https://yogiaitrading-web.onrender.com/api/signals');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setSignals(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 15000);
    return () => clearInterval(interval);
  }, []);

  const activeAsset = signals.find(s => s.symbol === selectedSymbol) || signals[0];

  const getTvSymbol = (sym) => {
    if (!sym) return 'BINANCE:SOLUSDT';
    if (sym === '^NSEI') return 'NSE:NIFTY';
    if (sym === '^NSEBANK') return 'NSE:BANKNIFTY';
    return 'BINANCE:' + sym.replace('-USD', 'USDT');
  };

  return (
    <div style={{ backgroundColor: '#030712', color: '#f9fafb', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Head>
        <title>Jio AI Trading | Institutional Smart Money Suite</title>
      </Head>

      <header style={{ borderBottom: '1px solid #1f2937', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0b0f19' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#38bdf8' }}>
            ⚡ JIO AI-TRADING <span style={{ color: '#fff', fontSize: '14px', border: '1px solid #38bdf8', padding: '2px 8px', borderRadius: '12px' }}>INSTITUTIONAL V2</span>
          </h1>
        </div>
        <div style={{ fontSize: '14px', color: '#9ca3af' }}>
          <span>🟢 Scanner: Active 24/7 | </span>
          <span style={{ color: '#bae6fd', fontWeight: 'bold' }}>Dev: Yogendra Kumar</span>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '12px', padding: '12px 32px', overflowX: 'auto', background: '#111827', borderBottom: '1px solid #1f2937' }}>
        {signals.map((item) => (
          <button
            key={item.symbol}
            onClick={() => setSelectedSymbol(item.symbol)}
            style={{
              background: selectedSymbol === item.symbol ? '#1e293b' : '#0f172a',
              border: selectedSymbol === item.symbol ? '1px solid #38bdf8' : '1px solid #1f2937',
              borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', textAlign: 'left', minWidth: '150px'
            }}
          >
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>{item.asset}</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>${item.price}</div>
            <div style={{ fontSize: '11px', color: item.signal === 1 ? '#22c55e' : item.signal === -1 ? '#ef4444' : '#eab308' }}>
              {item.signal === 1 ? '🟢 BUY SIGNAL' : item.signal === -1 ? '🔴 SELL SIGNAL' : '⚖️ SCANNING'}
            </div>
          </button>
        ))}
      </div>

      <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ background: '#0b0f19', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px', minHeight: '550px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#38bdf8' }}>📊 Real-Time Technical Chart: {activeAsset ? activeAsset.asset : 'Loading...'}</h2>
          <iframe
            src={'https://s.tradingview.com/widgetembed/?frameElementId=tradingview_1&symbol=' + getTvSymbol(selectedSymbol) + '&interval=5&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC'}
            style={{ width: '100%', height: '500px', border: 'none', borderRadius: '8px' }}
          ></iframe>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#0b0f19', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#9ca3af' }}>🤖 AI SIGNAL ANALYTICS</h3>
            {activeAsset ? (
              <div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>${activeAsset.price}</div>
                <div style={{ padding: '12px', borderRadius: '8px', background: activeAsset.signal === 1 ? 'rgba(34,197,94,0.1)' : activeAsset.signal === -1 ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)', border: '1px solid #334155', marginBottom: '16px' }}>
                  <div style={{ fontWeight: 'bold', color: activeAsset.signal === 1 ? '#22c55e' : activeAsset.signal === -1 ? '#ef4444' : '#eab308' }}>
                    {activeAsset.reason}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ background: '#111827', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>StopLoss (SL)</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ef4444' }}>{activeAsset.sl}</div>
                  </div>
                  <div style={{ background: '#111827', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>Target (TP)</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#22c55e' }}>{activeAsset.tp}</div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', background: '#111827', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>RSI (14) Momentum: {activeAsset.rsi}</div>
                  <div style={{ width: '100%', height: '8px', background: '#374151', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: activeAsset.rsi + '%', height: '100%', background: activeAsset.rsi > 68 ? '#ef4444' : activeAsset.rsi < 32 ? '#22c55e' : '#38bdf8' }}></div>
                  </div>
                </div>
              </div>
            ) : <p>Loading live signals...</p>}
          </div>

          <div style={{ background: '#0b0f19', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#bae6fd' }}>⚡ 24/7 Telegram Automation</h4>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
              The background radar engine continuously scans all 7 assets and broadcasts high-precision Siren Alerts directly to your Telegram channel!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
