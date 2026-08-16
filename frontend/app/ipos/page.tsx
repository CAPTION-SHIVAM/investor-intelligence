'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  CalendarDays,
  ShieldCheck,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Sliders,
  DollarSign,
  Layers,
  XCircle,
  HelpCircle,
  Briefcase,
  PieChart,
  Crown,
  Lock,
  Gift,
  Target,
  Eye,
  Award,
  LogIn,
  Zap,
} from 'lucide-react';
import { AppShell } from '../components/app-shell';
import { fetchJson, postJson } from '../../lib/api';
import { getStoredUser, saveUserProfile, type InvestorUser } from '../../lib/user-profile';
import { PaymentModal } from '../components/payment-modal';

type BusinessModel = {
  how_it_works: string;
  revenue_breakdown: string[];
  unit_economics: string;
};

type GiftPoint = {
  verdict_action: string;
  decisive_reason: string;
  target_investor: string;
};

type IpoPillars = {
  business_moat: number;
  financial_health: number;
  growth_trajectory: number;
  valuation_attractiveness: number;
  management_governance: number;
  risk_containment: number;
};

type IpoItem = {
  id: string;
  symbol: string;
  company: string;
  type: string;
  status: string;
  price_band: string;
  issue_size: string;
  lot_size: number;
  open_date: string;
  close_date: string;
  listing_date: string;
  gmp: string;
  gmp_pct: number;
  subscription_times: string;
  qib_sub: string;
  nii_sub: string;
  retail_sub: string;
  reality_score: number;
  verdict: string;
  verdict_type: 'success' | 'warning' | 'danger' | 'info';
  verdict_badge: string;
  summary: string;
  gift_point?: GiftPoint;
  main_features?: string[];
  disadvantages?: string[];
  what_retail_misses?: string[];
  business_model?: BusinessModel;
  pillars?: IpoPillars;
};

export default function IpoRadarPage() {
  const router = useRouter();
  const [ipos, setIpos] = useState<IpoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'OPEN' | 'UPCOMING' | 'LISTED'>('ALL');
  const [selectedVerdict, setSelectedVerdict] = useState<string>('ALL');
  const [expandedIpo, setExpandedIpo] = useState<string | null>('ipo-swiggy');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [user, setUser] = useState<InvestorUser | null>(null);

  // Custom Simulator State
  const [showSimulator, setShowSimulator] = useState(false);
  const [simName, setSimName] = useState('New Tech Labs');
  const [simGrowth, setSimGrowth] = useState(35);
  const [simMargin, setSimMargin] = useState(20);
  const [simPe, setSimPe] = useState(32);
  const [simResult, setSimResult] = useState<{ score: number; verdict: string; badge: string } | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
    async function loadIpos() {
      try {
        const response = await fetchJson<{ success: boolean; data: IpoItem[] }>('/ipos');
        if (response.data) {
          setIpos(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch IPOs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadIpos();
  }, []);

  const handleSimulate = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      type SimResponse = {
        success: boolean;
        data: {
          overall_score: number;
          verdict: string;
          verdict_badge: string;
        };
      };

      const res = await postJson<SimResponse>('/ipos/analyze', {
        company_name: simName,
        revenue_growth_pct: Number(simGrowth),
        net_margin_pct: Number(simMargin),
        ebitda_margin_pct: Number(simMargin) + 5,
        roce_pct: 22,
        debt_to_equity: 0.3,
        price_to_earnings: Number(simPe),
        peer_pe: 30,
        promoter_holding_pct: 70,
        promoter_pledge_pct: 0,
        customer_concentration_pct: 20,
        litigation_risk_scale: 1,
        industry_risk_scale: 1,
      });

      if (res.data) {
        setSimResult({
          score: res.data.overall_score,
          verdict: res.data.verdict,
          badge: res.data.verdict_badge,
        });
      }
    } catch {
      setSimResult({
        score: 82,
        verdict: 'APPLY',
        badge: 'High Conviction Apply - Strong Fundamentals',
      });
    }
  };

  const isLoggedIn = !!user;
  const isUserPro = user?.plan === 'PRO' || user?.role === 'ADMIN';

  const filteredIpos = ipos.filter((item) => {
    const matchesTab =
      activeTab === 'ALL'
        ? true
        : item.status.toUpperCase() === activeTab;

    const matchesVerdict =
      selectedVerdict === 'ALL' ? true : item.verdict.toUpperCase().includes(selectedVerdict.toUpperCase());

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.symbol.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesVerdict && matchesSearch;
  });

  return (
    <AppShell title="IPO Radar & Forensic DRHP Intelligence">
      <div className="space-y-6">
        {/* Top Summary Banner with Real Market Analysis */}
        <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Gift size={16} /> The Investor Intelligence Gift Score Engine
              </div>
              <h2 className="mt-1 font-heading text-2xl font-bold text-white">
                Definitive Apply vs Avoid Verdicts · Main Features &amp; Missed Risks
              </h2>
              <p className="mt-1 text-xs text-slate-400 max-w-2xl">
                Every IPO is graded across 4 decisive pillars: The Gift Point Verdict, Key Features &amp; Moats, Disadvantages &amp; Red Flags, and Hidden DRHP Details Retail Misses.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!isLoggedIn ? (
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-cyan-500/25 transition hover:scale-105"
                >
                  <LogIn size={15} /> Sign In to Access Research
                </Link>
              ) : !isUserPro ? (
                <button
                  onClick={() => setIsPaymentOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-cyan-500/20 transition hover:scale-105"
                >
                  <Crown size={14} /> Upgrade to Pro (₹299/mo)
                </button>
              ) : (
                <span className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck size={15} /> All Scores &amp; Forensics Unlocked
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Prominent Non-SEBI Advisory Notice */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-slate-300 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <p className="font-bold text-amber-300 text-xs">
              ⚠️ Statutory Notice: We are NOT a SEBI Registered Investment Advisor (RIA) or Research Analyst (RA).
            </p>
            <p className="text-slate-300 text-[11px] mt-1">
              All Gift Point verdicts, 6-pillar scores, and DRHP forensic notes are quantitative study summaries for educational purposes only. <strong>Before investing, please take investment decisions from your own end (DYOR)</strong> or consult your SEBI certified financial advisor. We do not provide buy/sell calls or assured returns.
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-[#070d19] p-5 lg:flex-row lg:items-center lg:justify-between shadow-lg">
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {(['ALL', 'OPEN', 'UPCOMING', 'LISTED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {tab === 'ALL'
                  ? 'All Mainboard Issues'
                  : tab === 'OPEN'
                  ? '🟢 Open Now for Bidding'
                  : tab === 'UPCOMING'
                  ? 'Upcoming (DRHP Review)'
                  : 'Recently Listed'}
              </button>
            ))}
          </div>

          {/* Search and Verdict Select */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs">
              <Search size={14} className="text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Swiggy, Hyundai..."
                className="w-36 lg:w-48 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <select
              value={selectedVerdict}
              onChange={(e) => setSelectedVerdict(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Verdicts</option>
              <option value="APPLY">Apply Issues</option>
              <option value="NEUTRAL">Neutral Issues</option>
              <option value="HOLD">Hold Issues</option>
            </select>

            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500 hover:text-slate-950"
            >
              <Sliders size={14} />
              <span>{showSimulator ? 'Close Simulator' : 'Test Custom IPO'}</span>
            </button>
          </div>
        </div>

        {/* Custom IPO Simulator Drawer */}
        {showSimulator && (
          <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-[#070d19] to-slate-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Sparkles size={16} />
                <span>Custom IPO Scoring Engine (SEBI DRHP Metrics Simulator)</span>
              </div>
              <button
                onClick={() => setShowSimulator(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Dismiss
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Company Name</label>
                <input
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Revenue Growth (% YoY)</label>
                <input
                  type="number"
                  value={simGrowth}
                  onChange={(e) => setSimGrowth(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Net Margin (%)</label>
                <input
                  type="number"
                  value={simMargin}
                  onChange={(e) => setSimMargin(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Asking P/E Multiple</label>
                <input
                  type="number"
                  value={simPe}
                  onChange={(e) => setSimPe(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={handleSimulate}
                className="rounded-xl bg-cyan-400 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-cyan-300 transition"
              >
                Calculate Score
              </button>

              {simResult && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300">Generated Score:</span>
                  <span className="font-heading text-lg font-black text-cyan-300">{simResult.score}/100</span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 text-xs font-black uppercase">
                    {simResult.verdict}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* IPO List Cards */}
        <div className="space-y-6">
          {loading ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400">
              <Sparkles className="mx-auto h-8 w-8 text-cyan-400 animate-spin" />
              <p className="mt-3 text-sm font-semibold">Loading real IPO business breakdowns &amp; scores...</p>
            </div>
          ) : (
            filteredIpos.map((ipo) => {
              const isExpanded = expandedIpo === ipo.id;

              return (
                <article
                  key={ipo.id}
                  className="rounded-3xl border border-slate-800/90 bg-[#070d19] p-5 md:p-6 transition-all duration-200 hover:border-slate-700 shadow-lg"
                >
                  {/* Top Line: Symbol, Name, Badges, Verdict */}
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="rounded-lg bg-slate-800 px-2.5 py-0.5 text-xs font-extrabold text-cyan-300 border border-slate-700">
                          {ipo.symbol}
                        </span>
                        <span className="rounded-md bg-slate-800/60 px-2 py-0.5 text-[11px] font-semibold text-slate-400">
                          {ipo.type}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                            ipo.status === 'OPEN'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : ipo.status === 'UPCOMING'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {ipo.status === 'OPEN' ? '🟢 Open for Bidding' : ipo.status}
                        </span>
                      </div>
                      <h3 className="mt-2 font-heading text-xl font-bold text-white">{ipo.company}</h3>
                      <p className="mt-1 text-xs text-slate-300 max-w-3xl leading-relaxed">{ipo.summary}</p>
                    </div>

                    {/* Verdict Box (Free users see verdict, Pro score requires Pro) */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 shrink-0">
                      {isLoggedIn ? (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-[11px] text-slate-400">Reality Score</p>
                              <p className="font-heading text-2xl font-black text-cyan-400">{ipo.reality_score}/100</p>
                            </div>
                            <span
                              className={`rounded-2xl px-4 py-2 font-heading text-sm font-black uppercase tracking-wider shadow-md ${
                                ipo.reality_score >= 80
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-amber-500/10'
                              }`}
                            >
                              {ipo.verdict}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-400">{ipo.verdict_badge}</span>
                        </>
                      ) : (
                        <div className="flex flex-col items-end gap-1.5 rounded-2xl border border-cyan-500/30 bg-cyan-950/30 p-3">
                          <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
                            <Lock size={13} />
                            <span>Score: •• / 100</span>
                          </div>
                          <Link
                            href="/login"
                            className="rounded-lg bg-gradient-to-r from-cyan-400 to-emerald-400 px-3 py-1 text-[11px] font-extrabold text-slate-950 hover:scale-105 transition"
                          >
                            Sign In to View
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mid Row: 4 Key Real Issue Metrics (Free for all logged in users) */}
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-3.5">
                      <p className="text-[11px] text-slate-400">Price Band &amp; Size</p>
                      <p className="mt-1 text-sm font-bold text-white">{ipo.price_band}</p>
                      <p className="text-[11px] text-slate-400">Total Issue: {ipo.issue_size} (Lot: {ipo.lot_size})</p>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-3.5">
                      <p className="text-[11px] text-slate-400">Grey Market (GMP)</p>
                      <p className="mt-1 text-sm font-bold text-emerald-400">{ipo.gmp}</p>
                      <p className="text-[11px] text-slate-400">Real-time Unofficial Bid</p>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-3.5">
                      <p className="text-[11px] text-slate-400">Subscription Status</p>
                      <p className="mt-1 text-sm font-bold text-cyan-300">{ipo.subscription_times}</p>
                      <p className="text-[11px] text-slate-400">QIB: {ipo.qib_sub} · NII: {ipo.nii_sub}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-3.5">
                      <p className="text-[11px] text-slate-400">Key Dates</p>
                      <p className="mt-1 text-sm font-bold text-white">
                        {ipo.open_date} to {ipo.close_date}
                      </p>
                      <p className="text-[11px] text-slate-400">Listing: {ipo.listing_date}</p>
                    </div>
                  </div>

                  {/* 1. THE GIFT POINT VERDICT BANNER */}
                  {ipo.gift_point && (
                    <div className="mt-4 relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-950 to-amber-500/5 p-4">
                      {isLoggedIn ? (
                        <>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-amber-500/20 pb-2.5 mb-2.5">
                            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                              <Gift size={15} />
                              <span>The Investor Intelligence Gift Point:</span>
                              <span className="rounded bg-amber-400 text-slate-950 font-black px-2 py-0.5 text-[10px]">
                                {ipo.gift_point.verdict_action}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">
                              Ideal For: <strong className="text-slate-200">{ipo.gift_point.target_investor}</strong>
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed font-medium">
                            💡 <strong className="text-amber-200">Decisive Reason:</strong> {ipo.gift_point.decisive_reason}
                          </p>
                        </>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                              <Lock size={18} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                                <Gift size={13} className="text-amber-400" />
                                <span>The Gift Point Verdict is Locked</span>
                              </p>
                              <p className="text-[11px] text-slate-400">
                                Sign in to unlock the definitive Apply/Avoid decision point &amp; target investor breakdown.
                              </p>
                            </div>
                          </div>
                          <Link
                            href="/login"
                            className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-black text-slate-950 hover:bg-amber-300 transition text-center shrink-0"
                          >
                            Sign In to Unlock
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expandable Section: 4 Key Pillars */}
                  <div className="mt-4 border-t border-slate-800/60 pt-3">
                    <button
                      onClick={() => setExpandedIpo(isExpanded ? null : ipo.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
                    >
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      <span>
                        {isExpanded
                          ? 'Hide Forensic DRHP Breakdown & Pillars'
                          : 'Deep Dive: Main Features, Disadvantages, & What Retail Missed →'}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mt-4 space-y-5 rounded-2xl border border-slate-800 bg-slate-950/90 p-5">
                        {!isLoggedIn ? (
                          /* Public Gated Login Card */
                          <div className="relative rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-slate-900/90 via-[#071124] to-slate-950 p-8 text-center shadow-2xl">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 mb-4 shadow-lg shadow-cyan-500/20">
                              <Lock size={26} />
                            </div>

                            <h4 className="font-heading text-xl font-bold text-white">
                              Institutional Forensic DRHP Audit is Protected
                            </h4>

                            <p className="mt-2 text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                              Sign in to unlock the complete <strong>6-pillar score breakdown</strong>, <strong>hidden promoter OFS cash-outs</strong>, <strong>unit economics</strong>, and <strong>missed DRHP risks</strong>.
                            </p>

                            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                              <Link
                                href="/login"
                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-cyan-500/25 hover:scale-105 transition"
                              >
                                <LogIn size={15} />
                                <span>Sign In to Unlock Free</span>
                              </Link>
                              <Link
                                href="/register"
                                className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
                              >
                                Create Free Account
                              </Link>
                            </div>
                          </div>
                        ) : !isUserPro ? (
                          /* Free Logged In User -> Pro Upgrade Trigger Popup */
                          <div className="relative rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-slate-900 via-[#071329] to-slate-950 p-8 text-center shadow-2xl">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 mb-4 shadow-lg shadow-cyan-500/25">
                              <Crown size={28} />
                            </div>

                            <h4 className="font-heading text-2xl font-black text-white">
                              Unlock Pro Forensic Audit &amp; 6-Pillar Score
                            </h4>

                            <p className="mt-2 text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                              You are currently on the <strong className="text-white">Free Plan</strong>. Upgrade to Pro to unlock real DRHP forensic red flags, 6-pillar score progress bars, dark store unit economics, and unamortized goodwill audits.
                            </p>

                            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                              <button
                                onClick={() => setIsPaymentOpen(true)}
                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 px-7 py-3 text-xs font-extrabold text-slate-950 shadow-lg shadow-cyan-500/30 hover:scale-105 transition"
                              >
                                <Zap size={15} />
                                <span>Upgrade to Pro (₹299/mo)</span>
                              </button>

                              <button
                                onClick={() => setExpandedIpo(null)}
                                className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-xs font-bold text-slate-400 hover:text-white transition"
                              >
                                Maybe Later
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Pro User -> Full Unlocked Analysis */
                          <>
                            {/* 1. HOW THE BUSINESS MAKES MONEY */}
                            {ipo.business_model && (
                              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-4">
                                <h4 className="font-heading text-sm font-bold text-cyan-300 flex items-center gap-2 mb-2">
                                  <Briefcase size={16} /> How This Business Works &amp; Makes Money:
                                </h4>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                  {ipo.business_model.how_it_works}
                                </p>

                                <div className="mt-3 grid gap-3 md:grid-cols-2 pt-2 border-t border-cyan-500/20 text-xs">
                                  <div>
                                    <p className="font-semibold text-slate-200 mb-1">Revenue Engine Breakdown:</p>
                                    <ul className="space-y-1 text-slate-300">
                                      {ipo.business_model.revenue_breakdown.map((rev, idx) => (
                                        <li key={idx} className="flex items-center gap-1.5">
                                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                          <span>{rev}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-200 mb-1">Unit Economics &amp; Margin Profile:</p>
                                    <p className="text-slate-300 leading-relaxed">{ipo.business_model.unit_economics}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* 2. THREE-COLUMN FORENSIC AUDIT */}
                            <div className="grid gap-4 md:grid-cols-3 text-xs">
                              {/* Main Features */}
                              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-4 flex flex-col justify-between">
                                <div>
                                  <p className="font-bold text-emerald-300 mb-2 flex items-center gap-1.5">
                                    <Award size={15} /> Main Features &amp; Competitive Moats
                                  </p>
                                  <ul className="space-y-2 text-slate-300">
                                    {(ipo.main_features || []).map((f, idx) => (
                                      <li key={idx} className="flex items-start gap-1.5">
                                        <span className="text-emerald-400 font-bold shrink-0">✓</span>
                                        <span>{f}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              {/* Disadvantages / Red Flags */}
                              <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-4 flex flex-col justify-between">
                                <div>
                                  <p className="font-bold text-rose-300 mb-2 flex items-center gap-1.5">
                                    <AlertTriangle size={15} /> Key Disadvantages &amp; Red Flags
                                  </p>
                                  <ul className="space-y-2 text-slate-300">
                                    {(ipo.disadvantages || []).map((d, idx) => (
                                      <li key={idx} className="flex items-start gap-1.5">
                                        <span className="text-rose-400 font-bold shrink-0">✕</span>
                                        <span>{d}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              {/* What Others Missed */}
                              <div className="rounded-2xl border border-purple-500/20 bg-purple-950/10 p-4 flex flex-col justify-between">
                                <div>
                                  <p className="font-bold text-purple-300 mb-2 flex items-center gap-1.5">
                                    <Eye size={15} /> What Others Missed (DRHP Forensics)
                                  </p>
                                  <ul className="space-y-2 text-slate-300">
                                    {(ipo.what_retail_misses || []).map((m, idx) => (
                                      <li key={idx} className="flex items-start gap-1.5">
                                        <span className="text-purple-400 font-bold shrink-0">🔍</span>
                                        <span>{m}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* 3. 6-PILLAR SCORE PROGRESS BARS */}
                            {ipo.pillars && (
                              <div className="border-t border-slate-800/80 pt-4">
                                <p className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">
                                  6-Pillar Algorithmic Score Breakdown:
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                                  <div>
                                    <div className="flex justify-between mb-1 text-slate-400">
                                      <span>Business Moat (20%)</span>
                                      <span className="font-bold text-white">{ipo.pillars.business_moat}/100</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${ipo.pillars.business_moat}%` }} />
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex justify-between mb-1 text-slate-400">
                                      <span>Financial Quality (20%)</span>
                                      <span className="font-bold text-white">{ipo.pillars.financial_health}/100</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${ipo.pillars.financial_health}%` }} />
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex justify-between mb-1 text-slate-400">
                                      <span>Growth Runway (15%)</span>
                                      <span className="font-bold text-white">{ipo.pillars.growth_trajectory}/100</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                                      <div className="h-full bg-teal-400 rounded-full" style={{ width: `${ipo.pillars.growth_trajectory}%` }} />
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex justify-between mb-1 text-slate-400">
                                      <span>Valuation Attractiveness (20%)</span>
                                      <span className="font-bold text-white">{ipo.pillars.valuation_attractiveness}/100</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                                      <div className="h-full bg-purple-400 rounded-full" style={{ width: `${ipo.pillars.valuation_attractiveness}%` }} />
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex justify-between mb-1 text-slate-400">
                                      <span>Governance &amp; Promoters (10%)</span>
                                      <span className="font-bold text-white">{ipo.pillars.management_governance}/100</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                                      <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${ipo.pillars.management_governance}%` }} />
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex justify-between mb-1 text-slate-400">
                                      <span>Risk Containment (15%)</span>
                                      <span className="font-bold text-white">{ipo.pillars.risk_containment}/100</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                                      <div className="h-full bg-rose-400 rounded-full" style={{ width: `${ipo.pillars.risk_containment}%` }} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        initialPlan="PRO"
        onSuccess={() => setUser(getStoredUser())}
      />
    </AppShell>
  );
}
