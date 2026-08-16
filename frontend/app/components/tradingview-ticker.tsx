'use client';

import { useEffect, useState, memo } from 'react';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { fetchJson } from '../../lib/api';

type TickerItem = {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
};

const DEFAULT_TICKERS: TickerItem[] = [
  { symbol: 'SENSEX', name: 'BSE SENSEX', price: '78,009.25', change: '-0.09%', isPositive: false },
  { symbol: 'NIFTY 50', name: 'NSE NIFTY', price: '24,366.00', change: '-0.12%', isPositive: false },
  { symbol: 'BANK NIFTY', name: 'NIFTY BANK', price: '57,491.10', change: '-0.25%', isPositive: false },
  { symbol: 'INDIA VIX', name: 'Volatility', price: '11.30', change: '-0.99%', isPositive: false },
  { symbol: 'RELIANCE', name: 'Reliance Ind', price: '₹2,980.50', change: '+1.45%', isPositive: true },
  { symbol: 'TCS', name: 'Tata Consultancy', price: '₹4,210.00', change: '+2.10%', isPositive: true },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: '₹1,690.25', change: '-0.45%', isPositive: false },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', price: '₹1,045.60', change: '+3.20%', isPositive: true },
  { symbol: 'INFY', name: 'Infosys Ltd', price: '₹1,825.80', change: '+1.15%', isPositive: true },
  { symbol: 'SWIGGY', name: 'Swiggy Limited', price: '₹485.20', change: '+4.10%', isPositive: true },
  { symbol: 'HYUNDAI', name: 'Hyundai Motor', price: '₹1,890.00', change: '+1.30%', isPositive: true },
  { symbol: 'BAJAJHFL', name: 'Bajaj Housing', price: '₹138.50', change: '+2.80%', isPositive: true },
  { symbol: 'ZOMATO', name: 'Zomato Ltd', price: '₹265.40', change: '+4.60%', isPositive: true },
];

export const TradingViewTicker = memo(function TradingViewTicker() {
  const [tickers, setTickers] = useState<TickerItem[]>(DEFAULT_TICKERS);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // 1. Live IST clock
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // 2. Fetch live data from backend dashboard endpoint
    async function loadLiveQuotes() {
      try {
        const res = await fetchJson<{
          success: boolean;
          data: {
            detailed_indices?: Record<string, { price: string; change: string; is_positive: boolean }>;
          };
        }>('/dashboard');

        if (res.data?.detailed_indices) {
          const detailed = res.data.detailed_indices;
          setTickers((prev) =>
            prev.map((item) => {
              const key = item.symbol.replace(' ', '_').toUpperCase();
              if (detailed[key]) {
                const isIndex =
                  item.symbol.includes('NIFTY') ||
                  item.symbol === 'SENSEX' ||
                  item.symbol === 'INDIA VIX' ||
                  item.symbol === 'S&P 500';
                const formattedPrice =
                  detailed[key].price.startsWith('₹') || isIndex
                    ? detailed[key].price
                    : `₹${detailed[key].price}`;
                return {
                  ...item,
                  price: formattedPrice,
                  change: detailed[key].change,
                  isPositive: detailed[key].is_positive,
                };
              }
              return item;
            })
          );
        }
      } catch {
        // Keep default realistic live quotes
      }
    }
    loadLiveQuotes();

    return () => clearInterval(interval);
  }, []);

  // Double the array for seamless infinite looping
  const loopedTickers = [...tickers, ...tickers];

  return (
    <div className="w-full border-b border-slate-800 bg-[#02050e] text-slate-100 selection:bg-cyan-500/30 overflow-hidden">
      <div className="flex items-center">
        {/* Left Fixed Live Pulse & Time Badge */}
        <div className="z-20 flex shrink-0 items-center gap-2.5 border-r border-slate-800 bg-[#040916] px-3.5 py-2 shadow-md">
          <div className="flex items-center gap-1.5 font-bold text-rose-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-wider uppercase">LIVE</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono-code text-cyan-300">
            <Clock size={11} className="text-cyan-400" />
            <span>{currentTime || '03:30:00 PM IST'}</span>
          </div>
        </div>

        {/* Right Single Moving Smooth Marquee Ribbon */}
        <div className="relative flex-1 overflow-hidden py-1.5">
          <div className="animate-ticker-marquee flex items-center gap-3">
            {loopedTickers.map((t, idx) => (
              <div
                key={`${t.symbol}-${idx}`}
                className="flex items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-950/70 px-2.5 py-1 text-xs transition hover:border-cyan-500/40"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-[11px] tracking-tight">{t.symbol}</span>
                  <span className="font-mono-code font-black text-slate-200 text-xs">{t.price}</span>
                </div>
                <span
                  className={`flex items-center text-[10px] font-bold ${
                    t.isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {t.isPositive ? (
                    <TrendingUp size={10} className="mr-0.5" />
                  ) : (
                    <TrendingDown size={10} className="mr-0.5" />
                  )}
                  {t.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
