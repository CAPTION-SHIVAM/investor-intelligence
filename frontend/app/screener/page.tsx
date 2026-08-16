'use client';

import { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  Search,
  Download,
  RotateCcw,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Crown,
  CheckCircle2,
  Lock,
  ArrowUpDown,
  BarChart2,
  X,
} from 'lucide-react';
import { AppShell } from '../components/app-shell';
import { fetchJson } from '../../lib/api';
import { getStoredUser, type InvestorUser } from '../../lib/user-profile';
import { PaymentModal } from '../components/payment-modal';

type StockItem = {
  symbol: string;
  company: string;
  sector: string;
  market_cap_category: string;
  market_cap_cr: number;
  price: number;
  change_pct: number;
  pe: number;
  pb: number;
  roe: number;
  roce: number;
  debt_equity: number;
  dividend_yield: number;
  score: number;
  is_pro: boolean;
};

export default function ScreenerPage() {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [sectors, setSectors] = useState<string[]>(['All Sectors']);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<InvestorUser | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Filters
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [selectedCap, setSelectedCap] = useState('All Market Caps');
  const [maxPe, setMaxPe] = useState<number>(100);
  const [minRoe, setMinRoe] = useState<number>(10);
  const [maxDebt, setMaxDebt] = useState<number>(2.0);
  const [minScore, setMinScore] = useState<number>(75);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'market_cap_cr' | 'roe' | 'pe' | 'change_pct'>('score');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    setUser(getStoredUser());

    async function loadScreener() {
      try {
        const queryParams = new URLSearchParams({
          sector: selectedSector,
          cap_category: selectedCap,
          max_pe: maxPe.toString(),
          min_roe: minRoe.toString(),
          max_debt_equity: maxDebt.toString(),
          min_score: minScore.toString(),
          search: searchQuery,
          sort_by: sortBy,
          order: sortOrder,
        });

        const res = await fetchJson<{
          success: boolean;
          total: number;
          sectors: string[];
          data: StockItem[];
        }>(`/screener?${queryParams.toString()}`);

        if (res.data) {
          setStocks(res.data);
          if (res.sectors) setSectors(res.sectors);
        }
      } catch (err) {
        console.error('Screener fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadScreener();
  }, [selectedSector, selectedCap, maxPe, minRoe, maxDebt, minScore, searchQuery, sortBy, sortOrder]);

  const handleResetFilters = () => {
    setSelectedSector('All Sectors');
    setSelectedCap('All Market Caps');
    setMaxPe(100);
    setMinRoe(10);
    setMaxDebt(2.0);
    setMinScore(75);
    setSearchQuery('');
  };

  const handleExportCSV = () => {
    const headers = ['Symbol,Company,Sector,MarketCap(Cr),Price,Change%,P/E,ROE%,ROCE%,Debt/Equity,Score'];
    const rows = stocks.map((s) =>
      `"${s.symbol}","${s.company}","${s.sector}",${s.market_cap_cr},${s.price},${s.change_pct},${s.pe},${s.roe},${s.roce},${s.debt_equity},${s.score}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `investor_intelligence_screener_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isUserPro = user?.plan === 'PRO' || user?.role === 'ADMIN';

  return (
    <AppShell title="Stock Screener & Fundamental Filter">
      <div className="space-y-6">
        {/* Top Summary Banner */}
        <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <SlidersHorizontal size={16} /> Fundamental Screening Engine
              </div>
              <h2 className="mt-1 font-heading text-2xl font-bold text-white">
                Screen High ROE & Low Debt Compounders
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Filter across 500+ securities using 6-pillar fundamental health, valuation multiples, and capital efficiency.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition hover:scale-105"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Grid */}
        <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Filter Parameters
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Sector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Sector</label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* Market Cap Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Market Cap</label>
              <select
                value={selectedCap}
                onChange={(e) => setSelectedCap(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="All Market Caps">All Market Caps</option>
                <option value="Large Cap">Large Cap (&gt;₹50,000 Cr)</option>
                <option value="Mid Cap">Mid Cap (₹15k-₹50k Cr)</option>
                <option value="Small Cap">Small Cap (&lt;₹15,000 Cr)</option>
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Search Symbol or Name</label>
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. TCS, Reliance, Solar..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
                <Search size={14} className="absolute right-3 top-2.5 text-slate-500" />
              </div>
            </div>

            {/* Min Score Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Min Reality Score</span>
                <span className="text-cyan-400 font-bold">{minScore}/100</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          {/* Additional Sliders */}
          <div className="mt-5 grid gap-5 sm:grid-cols-3 border-t border-slate-800/80 pt-5">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Max P/E Multiple</span>
                <span className="text-cyan-400 font-bold">{maxPe}x</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                value={maxPe}
                onChange={(e) => setMaxPe(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Min Return on Equity (ROE)</span>
                <span className="text-emerald-400 font-bold">{minRoe}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="45"
                value={minRoe}
                onChange={(e) => setMinRoe(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Max Debt-to-Equity</span>
                <span className="text-purple-400 font-bold">{maxDebt}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={maxDebt}
                onChange={(e) => setMaxDebt(Number(e.target.value))}
                className="w-full accent-purple-400 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-5 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold text-white">
                Filtered Results ({stocks.length} Companies)
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 focus:outline-none"
              >
                <option value="score">Reality Score</option>
                <option value="market_cap_cr">Market Cap</option>
                <option value="roe">ROE %</option>
                <option value="pe">P/E Multiple</option>
                <option value="change_pct">Day Change</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="rounded-lg border border-slate-700 bg-slate-900 p-1 text-slate-300 hover:text-white"
                title="Toggle sort order"
              >
                <ArrowUpDown size={14} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Company / Symbol</th>
                  <th className="px-3 py-3">Sector</th>
                  <th className="px-3 py-3 text-right">Price</th>
                  <th className="px-3 py-3 text-right">24h Change</th>
                  <th className="px-3 py-3 text-right">Market Cap</th>
                  <th className="px-3 py-3 text-right">P/E</th>
                  <th className="px-3 py-3 text-right">ROE %</th>
                  <th className="px-3 py-3 text-right">ROCE %</th>
                  <th className="px-3 py-3 text-right">Debt/Eq</th>
                  <th className="px-4 py-3 text-center">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stocks.map((stock) => (
                  <tr
                    key={stock.symbol}
                    className="transition hover:bg-slate-900/60"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white">{stock.symbol}</span>
                        {stock.is_pro && (
                          <span className="rounded bg-cyan-500/20 px-1 py-0.2 text-[9px] font-black text-cyan-300 border border-cyan-500/30">
                            PRO
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{stock.company}</p>
                    </td>

                    <td className="px-3 py-3">
                      <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300">
                        {stock.sector}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-right font-semibold text-white">
                      ₹{stock.price.toLocaleString()}
                    </td>

                    <td className="px-3 py-3 text-right font-bold">
                      <span
                        className={`inline-flex items-center gap-0.5 ${
                          stock.change_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {stock.change_pct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {stock.change_pct >= 0 ? `+${stock.change_pct}%` : `${stock.change_pct}%`}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-right text-slate-300">
                      ₹{stock.market_cap_cr.toLocaleString()} Cr
                    </td>

                    <td className="px-3 py-3 text-right font-medium text-slate-300">
                      {stock.pe}x
                    </td>

                    <td className="px-3 py-3 text-right font-bold text-emerald-400">
                      {stock.roe}%
                    </td>

                    <td className="px-3 py-3 text-right font-semibold text-cyan-300">
                      {stock.roce}%
                    </td>

                    <td className="px-3 py-3 text-right text-slate-300">
                      {stock.debt_equity}x
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-black ${
                          stock.score >= 88
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : stock.score >= 80
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {stock.score}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        initialPlan="PRO"
      />
    </AppShell>
  );
}
