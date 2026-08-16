'use client';

import { useEffect, useRef, useState, memo } from 'react';
import { BarChart3, Maximize2 } from 'lucide-react';

const POPULAR_SYMBOLS = [
  { label: 'NIFTY 50', symbol: 'NSE:NIFTY' },
  { label: 'SENSEX', symbol: 'BSE:SENSEX' },
  { label: 'BANK NIFTY', symbol: 'NSE:BANKNIFTY' },
  { label: 'Reliance', symbol: 'NSE:RELIANCE' },
  { label: 'TCS', symbol: 'NSE:TCS' },
  { label: 'HDFC Bank', symbol: 'NSE:HDFCBANK' },
  { label: 'Tata Motors', symbol: 'NSE:TATAMOTORS' },
  { label: 'Zomato', symbol: 'NSE:ZOMATO' },
  { label: 'Bajaj Housing', symbol: 'NSE:BAJAJHFL' },
];

export const TradingViewChart = memo(function TradingViewChart({
  defaultSymbol = 'NSE:NIFTY',
  height = 480,
}: {
  defaultSymbol?: string;
  height?: number;
}) {
  const [symbol, setSymbol] = useState(defaultSymbol);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: 'D',
      timezone: 'Asia/Kolkata',
      theme: 'dark',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      backgroundColor: 'rgba(7, 13, 25, 1)',
      gridColor: 'rgba(255, 255, 255, 0.05)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: 'https://www.tradingview.com',
    });

    const widgetWrapper = document.createElement('div');
    widgetWrapper.className = 'tradingview-widget-container__widget';
    widgetWrapper.style.height = `${height}px`;
    widgetWrapper.style.width = '100%';

    containerRef.current.appendChild(widgetWrapper);
    containerRef.current.appendChild(script);
  }, [symbol, height]);

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-5 shadow-xl">
      {/* Symbol Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BarChart3 size={16} />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
              <span>Live TradingView Chart</span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-black text-emerald-300">
                REALTIME
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Institutional Candlestick & Technical Analysis</p>
          </div>
        </div>

        {/* Quick Symbol Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {POPULAR_SYMBOLS.map((item) => (
            <button
              key={item.symbol}
              onClick={() => setSymbol(item.symbol)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                symbol === item.symbol
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div ref={containerRef} className="tradingview-widget-container overflow-hidden rounded-2xl" style={{ height: `${height}px` }} />
    </div>
  );
});
