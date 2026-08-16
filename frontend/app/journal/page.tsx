'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  Edit,
  Trash2,
  Download,
  Search,
  Filter,
  BrainCircuit,
  Target,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Smile,
  Frown,
  Zap,
} from 'lucide-react';
import { AppShell } from '../components/app-shell';
import { getStoredUser, type InvestorUser } from '../../lib/user-profile';
import {
  getJournalTrades,
  saveJournalTrade,
  deleteJournalTrade,
  calculateJournalMetrics,
  type JournalTrade,
  type TradeAssetType,
  type TradeDirection,
  type TradeStatus,
  type TradePsychology,
} from '../../lib/journal-storage';

export default function TradingJournalPage() {
  const router = useRouter();
  const [user, setUser] = useState<InvestorUser | null>(null);
  const [trades, setTrades] = useState<JournalTrade[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'WINS' | 'LOSSES' | 'OPEN'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<JournalTrade | null>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Form State
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [assetType, setAssetType] = useState<TradeAssetType>('IPO Allotment');
  const [direction, setDirection] = useState<TradeDirection>('BUY');
  const [entryPrice, setEntryPrice] = useState<number>(350);
  const [exitPrice, setExitPrice] = useState<number | undefined>(420);
  const [quantity, setQuantity] = useState<number>(50);
  const [entryDate, setEntryDate] = useState('2026-08-16');
  const [exitDate, setExitDate] = useState('2026-08-16');
  const [status, setStatus] = useState<TradeStatus>('CLOSED');
  const [setupStrategy, setSetupStrategy] = useState('IPO Listing Day Breakout');
  const [psychologyTag, setPsychologyTag] = useState<TradePsychology>('Disciplined Plan Execution');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const current = getStoredUser();
    if (!current) {
      router.push('/login');
      return;
    }
    setUser(current);
    loadTrades();
  }, [router]);

  const loadTrades = () => {
    setTrades(getJournalTrades());
  };

  const handleOpenAddModal = () => {
    setEditingTrade(null);
    setSymbol('');
    setName('');
    setAssetType('IPO Allotment');
    setDirection('BUY');
    setEntryPrice(390);
    setExitPrice(450);
    setQuantity(76);
    setEntryDate(new Date().toISOString().split('T')[0]);
    setExitDate(new Date().toISOString().split('T')[0]);
    setStatus('CLOSED');
    setSetupStrategy('IPO Listing Day Breakout');
    setPsychologyTag('Disciplined Plan Execution');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t: JournalTrade) => {
    setEditingTrade(t);
    setSymbol(t.symbol);
    setName(t.name);
    setAssetType(t.assetType);
    setDirection(t.direction);
    setEntryPrice(t.entryPrice);
    setExitPrice(t.exitPrice);
    setQuantity(t.quantity);
    setEntryDate(t.entryDate);
    setExitDate(t.exitDate || '');
    setStatus(t.status);
    setSetupStrategy(t.setupStrategy);
    setPsychologyTag(t.psychologyTag);
    setNotes(t.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;

    saveJournalTrade({
      id: editingTrade?.id,
      symbol: symbol.trim().toUpperCase(),
      name: name.trim() || `${symbol.trim().toUpperCase()} Stock`,
      assetType,
      direction,
      entryPrice: Number(entryPrice),
      exitPrice: status === 'CLOSED' ? Number(exitPrice) : undefined,
      quantity: Number(quantity),
      entryDate,
      exitDate: status === 'CLOSED' ? exitDate : undefined,
      status,
      setupStrategy,
      psychologyTag,
      notes: notes.trim(),
      tags: [assetType, setupStrategy.split(' ')[0]],
    });

    setIsModalOpen(false);
    loadTrades();
    setAlertMsg(editingTrade ? 'Trade updated successfully!' : 'New trade logged in your journal!');
    setTimeout(() => setAlertMsg(null), 3500);
  };

  const handleDeleteTrade = (id: string, sym: string) => {
    if (!confirm(`Delete journal entry for ${sym}?`)) return;
    deleteJournalTrade(id);
    loadTrades();
    setAlertMsg(`Trade for ${sym} removed from journal.`);
    setTimeout(() => setAlertMsg(null), 3000);
  };

  const handleExportCsv = () => {
    const headers = 'ID,Symbol,Name,Asset Type,Direction,Entry Price,Exit Price,Quantity,Entry Date,Exit Date,Status,Strategy,Psychology,P&L (INR),P&L (%)\n';
    const rows = trades
      .map(
        (t) =>
          `"${t.id}","${t.symbol}","${t.name}","${t.assetType}","${t.direction}",${t.entryPrice},${t.exitPrice || ''},${t.quantity},"${t.entryDate}","${t.exitDate || ''}","${t.status}","${t.setupStrategy}","${t.psychologyTag}",${t.pnl || 0},${t.pnlPct || 0}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Trading_Journal_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Metrics
  const metrics = calculateJournalMetrics(trades);

  // Filtered list
  const filteredTrades = trades.filter((t) => {
    const matchesFilter =
      activeFilter === 'ALL'
        ? true
        : activeFilter === 'WINS'
        ? t.status === 'CLOSED' && (t.pnl || 0) > 0
        : activeFilter === 'LOSSES'
        ? t.status === 'CLOSED' && (t.pnl || 0) < 0
        : t.status === 'OPEN';

    const matchesSearch =
      !searchQuery.trim() ||
      t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.setupStrategy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.psychologyTag.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <AppShell title="Trading Journal & Institutional Edge">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Header Banner */}
        <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-slate-950 via-[#06152b] to-slate-950 p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/25">
              <BookOpen size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-2xl font-black text-white">Institutional Trading Journal</h2>
                <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-black text-cyan-300 border border-cyan-500/30">
                  FLAGSHIP FEATURE
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-300 max-w-xl leading-relaxed">
                Log every IPO allotment, swing trade &amp; equity entry. Track your execution discipline, emotional psychology, and institutional edge.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:scale-105"
            >
              <PlusCircle size={16} />
              <span>+ Log New Trade</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {alertMsg && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs font-bold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{alertMsg}</span>
          </div>
        )}

        {/* Analytics KPI Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Net P&L */}
          <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Net Realized P&amp;L</span>
              <div
                className={`p-2 rounded-xl ${
                  metrics.netPnl >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {metrics.netPnl >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span
                className={`font-heading text-3xl font-black ${
                  metrics.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {metrics.netPnl >= 0 ? `+₹${metrics.netPnl.toLocaleString('en-IN')}` : `-₹${Math.abs(metrics.netPnl).toLocaleString('en-IN')}`}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Across {metrics.totalClosed} closed positions</p>
          </div>

          {/* Card 2: Win Rate */}
          <div className="rounded-3xl border border-cyan-500/30 bg-[#070d19] p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300">Journal Win Rate</span>
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <Target size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-heading text-3xl font-black text-cyan-400">{metrics.winRate}%</span>
              <span className="text-xs font-bold text-slate-400">
                ({metrics.winningCount}W / {metrics.losingCount}L)
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                style={{ width: `${metrics.winRate}%` }}
              />
            </div>
          </div>

          {/* Card 3: Profit Factor */}
          <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Profit Factor</span>
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <BarChart3 size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-heading text-3xl font-black text-white">{metrics.profitFactor}</span>
              <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                R:R {metrics.riskRewardRatio}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Avg Win: ₹{metrics.avgWin} · Avg Loss: ₹{metrics.avgLoss}</p>
          </div>

          {/* Card 4: Psychology Score */}
          <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Active / Open Trades</span>
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <BrainCircuit size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-heading text-3xl font-black text-amber-300">{metrics.openTradesCount}</span>
              <span className="text-xs font-bold text-slate-400">Positions</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Holding with predefined stoploss</p>
          </div>
        </div>

        {/* Main Trades Table Section */}
        <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Layers size={18} className="text-cyan-400" />
                <span>Trade Log &amp; Strategy Playbooks</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {filteredTrades.length} of {trades.length} logged entries
              </p>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900 p-1">
                <button
                  onClick={() => setActiveFilter('ALL')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    activeFilter === 'ALL' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({trades.length})
                </button>
                <button
                  onClick={() => setActiveFilter('WINS')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    activeFilter === 'WINS' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Wins ({metrics.winningCount})
                </button>
                <button
                  onClick={() => setActiveFilter('LOSSES')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    activeFilter === 'LOSSES' ? 'bg-rose-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Losses ({metrics.losingCount})
                </button>
                <button
                  onClick={() => setActiveFilter('OPEN')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    activeFilter === 'OPEN' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Open ({metrics.openTradesCount})
                </button>
              </div>

              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search symbol, setup..."
                  className="rounded-xl border border-slate-700 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                />
                <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Symbol &amp; Asset</th>
                  <th className="px-3 py-3">Direction &amp; Qty</th>
                  <th className="px-3 py-3">Entry &rarr; Exit</th>
                  <th className="px-3 py-3">Strategy Setup</th>
                  <th className="px-3 py-3">Psychology / Discipline</th>
                  <th className="px-3 py-3 text-right">Realized P&amp;L</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTrades.map((t) => {
                  const isProfit = (t.pnl || 0) > 0;
                  const isLoss = (t.pnl || 0) < 0;
                  const isOpen = t.status === 'OPEN';

                  return (
                    <tr key={t.id} className="hover:bg-slate-900/60 transition">
                      {/* Symbol & Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-white text-sm">{t.symbol}</span>
                          <span className="rounded bg-slate-800 text-slate-300 px-2 py-0.5 text-[10px] font-semibold">
                            {t.assetType}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-[170px] mt-0.5">{t.name}</p>
                      </td>

                      {/* Direction & Quantity */}
                      <td className="px-3 py-3.5">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-black uppercase ${
                            t.direction === 'BUY' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {t.direction}
                        </span>
                        <p className="text-[11px] text-slate-300 mt-1 font-mono-code">{t.quantity} Qty</p>
                      </td>

                      {/* Entry & Exit Prices */}
                      <td className="px-3 py-3.5 font-mono-code">
                        <div>
                          <span className="text-slate-400">Entry: </span>
                          <strong className="text-white">₹{t.entryPrice}</strong>
                        </div>
                        {t.exitPrice && (
                          <div className="mt-0.5">
                            <span className="text-slate-400">Exit: </span>
                            <strong className={isProfit ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-slate-200'}>
                              ₹{t.exitPrice}
                            </strong>
                          </div>
                        )}
                      </td>

                      {/* Strategy Setup */}
                      <td className="px-3 py-3.5">
                        <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-[11px] font-bold text-cyan-300 border border-cyan-500/20 inline-block">
                          {t.setupStrategy}
                        </span>
                        {t.notes && <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">&ldquo;{t.notes}&rdquo;</p>}
                      </td>

                      {/* Psychology Discipline Tag */}
                      <td className="px-3 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                            t.psychologyTag === 'Disciplined Plan Execution'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : t.psychologyTag === 'Patient Dip Buy'
                              ? 'bg-blue-950 text-blue-300 border border-blue-500/30'
                              : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {t.psychologyTag === 'Disciplined Plan Execution' ? (
                            <Smile size={11} />
                          ) : t.psychologyTag === 'FOMO Entry' ? (
                            <Frown size={11} />
                          ) : (
                            <BrainCircuit size={11} />
                          )}
                          <span>{t.psychologyTag}</span>
                        </span>
                      </td>

                      {/* P&L */}
                      <td className="px-3 py-3.5 text-right font-mono-code">
                        {isOpen ? (
                          <span className="rounded bg-amber-500/20 text-amber-300 px-2 py-0.5 text-[10px] font-bold">
                            HOLDING
                          </span>
                        ) : (
                          <div>
                            <span className={`font-black text-sm block ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {isProfit ? `+₹${t.pnl?.toLocaleString('en-IN')}` : `-₹${Math.abs(t.pnl || 0).toLocaleString('en-IN')}`}
                            </span>
                            <span className={`text-[11px] font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                              ({t.pnlPct && t.pnlPct > 0 ? `+${t.pnlPct}%` : `${t.pnlPct}%`})
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(t)}
                            className="rounded-lg bg-slate-800 p-1.5 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition"
                            title="Edit Trade"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteTrade(t.id, t.symbol)}
                            className="rounded-lg bg-slate-800 p-1.5 text-rose-400 hover:bg-rose-500 hover:text-white transition"
                            title="Delete Entry"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trade Logging / Editing Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-3xl border border-slate-700 bg-[#080e1c] p-6 md:p-8 shadow-2xl my-8 max-h-[92vh] overflow-y-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase mb-1">
                <BookOpen size={15} />
                <span>{editingTrade ? `Editing ${editingTrade.symbol}` : 'Log Trade in Journal'}</span>
              </div>
              <h3 className="font-heading text-xl font-black text-white">
                {editingTrade ? `Update ${editingTrade.symbol} Trade` : 'New Execution Entry'}
              </h3>

              <form onSubmit={handleSaveTrade} className="mt-6 space-y-4 text-xs">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Stock / IPO Symbol</label>
                    <input
                      required
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                      placeholder="e.g. SWIGGY, ZOMATO, TATASTEEL"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Company Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Swiggy Limited"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Asset Segment</label>
                    <select
                      value={assetType}
                      onChange={(e) => setAssetType(e.target.value as TradeAssetType)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    >
                      <option>IPO Allotment</option>
                      <option>Equity / Cash</option>
                      <option>F&amp;O Options</option>
                      <option>Swing Trade</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Direction</label>
                    <select
                      value={direction}
                      onChange={(e) => setDirection(e.target.value as TradeDirection)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    >
                      <option value="BUY">BUY / LONG</option>
                      <option value="SELL">SELL / SHORT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Position Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as TradeStatus)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    >
                      <option value="CLOSED">CLOSED (Realized P&amp;L)</option>
                      <option value="OPEN">OPEN (Currently Holding)</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Entry Price (₹)</label>
                    <input
                      type="number"
                      step="0.05"
                      required
                      value={entryPrice}
                      onChange={(e) => setEntryPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono-code font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {status === 'CLOSED' ? 'Exit Price (₹)' : 'Target / Stoploss (₹)'}
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      disabled={status === 'OPEN'}
                      value={exitPrice ?? ''}
                      onChange={(e) => setExitPrice(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder={status === 'OPEN' ? 'Holding Open' : 'e.g. 450'}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono-code font-bold disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Quantity (Shares/Lots)</label>
                    <input
                      type="number"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono-code font-bold"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Strategy Setup Playbook</label>
                    <select
                      value={setupStrategy}
                      onChange={(e) => setSetupStrategy(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    >
                      <option>IPO Listing Day Breakout</option>
                      <option>DRHP Forensic Moat Compounder</option>
                      <option>20 EMA Pullback Swing</option>
                      <option>Opening Range Breakout (ORB)</option>
                      <option>Quarterly Earnings Surprise</option>
                      <option>High ROCE Value Accumulation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Execution Psychology</label>
                    <select
                      value={psychologyTag}
                      onChange={(e) => setPsychologyTag(e.target.value as TradePsychology)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    >
                      <option>Disciplined Plan Execution</option>
                      <option>Patient Dip Buy</option>
                      <option>FOMO Entry</option>
                      <option>Panic Sell</option>
                      <option>Revenge Trade</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Trade Notes &amp; Lessons Learned</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Why did you take this trade? What did the DRHP or chart say? Did you respect your stoploss?"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2 font-black text-slate-950 shadow-md hover:scale-105 transition"
                  >
                    {editingTrade ? 'Update Journal Entry' : 'Save to Journal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
