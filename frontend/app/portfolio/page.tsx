'use client';

import { useState } from 'react';
import {
  BriefcaseBusiness,
  TrendingUp,
  Plus,
  Trash2,
  PieChart,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
} from 'lucide-react';
import { AppShell } from '../components/app-shell';

type Holding = {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avg_buy_price: number;
  current_price: number;
  weight: number;
  sector: string;
  score: number;
};

const INITIAL_HOLDINGS: Holding[] = [
  {
    id: '1',
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    shares: 180,
    avg_buy_price: 2450.0,
    current_price: 2980.5,
    weight: 21.6,
    sector: 'Energy & Retail',
    score: 88,
  },
  {
    id: '2',
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    shares: 120,
    avg_buy_price: 3600.0,
    current_price: 4210.0,
    weight: 20.3,
    sector: 'IT & Software',
    score: 92,
  },
  {
    id: '3',
    symbol: 'SKYLINE',
    name: 'Skyline Cloud Technologies (IPO Allotted)',
    shares: 450,
    avg_buy_price: 490.0,
    current_price: 665.0,
    weight: 12.0,
    sector: 'Cloud AI',
    score: 88,
  },
  {
    id: '4',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    shares: 250,
    avg_buy_price: 1540.0,
    current_price: 1690.25,
    weight: 17.0,
    sector: 'Banking & Finance',
    score: 89,
  },
  {
    id: '5',
    symbol: 'SOLARINDS',
    name: 'Solar Industries India',
    shares: 35,
    avg_buy_price: 8400.0,
    current_price: 10870.0,
    weight: 15.3,
    sector: 'Defence & Industrial',
    score: 93,
  },
  {
    id: '6',
    symbol: 'ZOMATO',
    name: 'Zomato Ltd',
    shares: 1200,
    avg_buy_price: 185.0,
    current_price: 265.4,
    weight: 12.8,
    sector: 'Consumer Tech',
    score: 79,
  },
];

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>(INITIAL_HOLDINGS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [newName, setNewName] = useState('');
  const [newShares, setNewShares] = useState(100);
  const [newBuyPrice, setNewBuyPrice] = useState(500);
  const [newSector, setNewSector] = useState('Technology');

  const totalInvested = holdings.reduce((sum, h) => sum + h.shares * h.avg_buy_price, 0);
  const totalCurrentValue = holdings.reduce((sum, h) => sum + h.shares * h.current_price, 0);
  const totalPnl = totalCurrentValue - totalInvested;
  const totalPnlPct = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol.trim()) return;

    const newHolding: Holding = {
      id: Date.now().toString(),
      symbol: newSymbol.toUpperCase().trim(),
      name: newName.trim() || `${newSymbol.toUpperCase()} Enterprise`,
      shares: Number(newShares),
      avg_buy_price: Number(newBuyPrice),
      current_price: Number(newBuyPrice) * 1.05,
      weight: 10,
      sector: newSector,
      score: 82,
    };

    setHoldings([...holdings, newHolding]);
    setNewSymbol('');
    setNewName('');
    setShowAddModal(false);
  };

  const handleDeleteHolding = (id: string) => {
    setHoldings(holdings.filter((h) => h.id !== id));
  };

  return (
    <AppShell title="Portfolio Management & Tracker">
      <div className="space-y-6">
        {/* KPI Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Portfolio Value</p>
            <p className="mt-2 font-heading text-3xl font-black text-white">
              ₹{totalCurrentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
            <p className="mt-1 text-xs text-emerald-400 font-semibold">+₹32,450 (Today)</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Capital Invested</p>
            <p className="mt-2 font-heading text-3xl font-black text-slate-200">
              ₹{totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
            <p className="mt-1 text-xs text-slate-400">{holdings.length} Active Positions</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unrealized Net P&L</p>
            <p className="mt-2 font-heading text-3xl font-black text-emerald-400">
              +₹{totalPnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
            <p className="mt-1 text-xs font-bold text-emerald-300">+{totalPnlPct.toFixed(1)}% All-Time Return</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Portfolio Risk Score</p>
            <p className="mt-2 font-heading text-3xl font-black text-cyan-400">91/100</p>
            <p className="mt-1 text-xs text-cyan-300">Optimal Diversification</p>
          </div>
        </div>

        {/* Allocation & Risk Breakdown */}
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          {/* Holdings Table */}
          <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-white">Live Equity & IPO Holdings</h2>
                <p className="text-xs text-slate-400">Individual asset weighting and performance</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition hover:scale-105"
              >
                <Plus size={15} /> Add Holding
              </button>
            </div>

            {/* Add Holding Form Modal */}
            {showAddModal && (
              <form onSubmit={handleAddHolding} className="mb-5 rounded-2xl border border-cyan-500/30 bg-slate-950 p-4">
                <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-3">Add Stock / IPO Holding</p>
                <div className="grid gap-3 sm:grid-cols-5">
                  <input
                    required
                    placeholder="Symbol (e.g. INFY)"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                  />
                  <input
                    placeholder="Company Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="number"
                    placeholder="Shares"
                    value={newShares}
                    onChange={(e) => setNewShares(Number(e.target.value))}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="number"
                    placeholder="Avg Buy Price (₹)"
                    value={newBuyPrice}
                    onChange={(e) => setNewBuyPrice(Number(e.target.value))}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-cyan-400 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300"
                  >
                    Save Holding
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-3 py-3">Security</th>
                    <th className="px-3 py-3 text-right">Shares</th>
                    <th className="px-3 py-3 text-right">Avg Buy</th>
                    <th className="px-3 py-3 text-right">Current</th>
                    <th className="px-3 py-3 text-right">Value (₹)</th>
                    <th className="px-3 py-3 text-right">P&L</th>
                    <th className="px-3 py-3 text-center">Score</th>
                    <th className="px-2 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {holdings.map((h) => {
                    const holdingValue = h.shares * h.current_price;
                    const holdingInvested = h.shares * h.avg_buy_price;
                    const pnl = holdingValue - holdingInvested;
                    const pnlPct = holdingInvested > 0 ? (pnl / holdingInvested) * 100 : 0;

                    return (
                      <tr key={h.id} className="transition hover:bg-slate-900/50">
                        <td className="px-3 py-3">
                          <p className="font-bold text-white">{h.symbol}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{h.name}</p>
                        </td>
                        <td className="px-3 py-3 text-right text-slate-200">{h.shares}</td>
                        <td className="px-3 py-3 text-right text-slate-400">₹{h.avg_buy_price.toLocaleString()}</td>
                        <td className="px-3 py-3 text-right font-semibold text-white">
                          ₹{h.current_price.toLocaleString()}
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-slate-100">
                          ₹{holdingValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-3 py-3 text-right font-bold">
                          <span className={pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {pnl >= 0 ? `+₹${pnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : `-₹${Math.abs(pnl).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                            <span className="block text-[10px]">({pnlPct >= 0 ? `+${pnlPct.toFixed(1)}%` : `${pnlPct.toFixed(1)}%`})</span>
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                            {h.score}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <button
                            onClick={() => handleDeleteHolding(h.id)}
                            className="text-slate-500 hover:text-rose-400 transition"
                            title="Remove holding"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sector & Concentration Radar */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-lg">
              <h3 className="font-heading text-lg font-bold text-white mb-4">Sector Allocation</h3>
              <div className="space-y-3.5 text-xs text-slate-300">
                {[
                  { name: 'Energy & Retail', pct: '21.6%', color: 'bg-cyan-400' },
                  { name: 'IT & Software', pct: '20.3%', color: 'bg-emerald-400' },
                  { name: 'Banking & Financials', pct: '17.0%', color: 'bg-indigo-400' },
                  { name: 'Defence & Industrial', pct: '15.3%', color: 'bg-purple-400' },
                  { name: 'Consumer Tech', pct: '12.8%', color: 'bg-pink-400' },
                  { name: 'IPO & Cloud Tech', pct: '12.0%', color: 'bg-amber-400' },
                ].map((sec) => (
                  <div key={sec.name}>
                    <div className="flex justify-between mb-1">
                      <span>{sec.name}</span>
                      <span className="font-bold text-white">{sec.pct}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full ${sec.color}`} style={{ width: sec.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-lg">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck size={16} /> Risk Radar Evaluation
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Zero Overconcentration</strong>: Largest single holding (Reliance) is at 21.6%, safely below the 25% max cap.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>High Reality Score Average</strong>: 88.5/100 aggregate asset quality.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>IPO Listing Gains</strong>: Skyline Technologies is up +35.7% from allotment.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
