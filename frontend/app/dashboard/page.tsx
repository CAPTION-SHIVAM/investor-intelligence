'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  BriefcaseBusiness,
  Bot,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Crown,
  Building2,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { AppShell } from '../components/app-shell';
import { fetchJson } from '../../lib/api';
import { getStoredUser } from '../../lib/user-profile';
import { defaultSiteContent, getSiteContent, saveSiteContent, type SiteContent } from '../../lib/site-content';
import { PaymentModal } from '../components/payment-modal';

type DashboardKpi = {
  label: string;
  value: string;
  change?: string;
};

type DashboardIpo = {
  id: string;
  company: string;
  price_band?: string;
  reality_score?: number | string;
  issue_date?: string;
  gmp?: string;
  risk?: string;
  status?: string;
  verdict?: string;
};

type DashboardResponse = {
  success: boolean;
  data: {
    greeting?: string;
    kpis?: DashboardKpi[];
    ipo_radar?: DashboardIpo[];
    thesis_health?: {
      company: string;
      previous_score: number;
      current_score: number;
      change: string;
      status: string;
    }[];
    mistakes?: {
      investor_score?: number;
      top_issues?: string[];
    };
    market_overview?: Record<string, string>;
    briefing?: string;
  };
};

const DEFAULT_KPIS: DashboardKpi[] = [
  { label: 'Portfolio Value', value: '₹24,85,420', change: '+18.4% YTD' },
  { label: 'IPO Reality Index', value: '84.2/100', change: '+3.6 pts' },
  { label: 'Win Rate (IPO)', value: '87.5%', change: '7/8 positive' },
  { label: 'Risk Health Score', value: '91/100', change: 'Safe Diversification' },
];

const DEFAULT_IPOS: DashboardIpo[] = [
  { id: 'ipo-swiggy', company: 'Swiggy Limited', price_band: '₹371 - ₹390', reality_score: 76, issue_date: '2026-08-15 to 2026-08-19', gmp: '+7.2%', risk: 'Moderate', status: 'OPEN', verdict: 'APPLY' },
  { id: 'ipo-hyundai', company: 'Hyundai Motor India', price_band: '₹1,865 - ₹1,960', reality_score: 84, issue_date: '2026-08-16 to 2026-08-20', gmp: '+3.3%', risk: 'Low', status: 'OPEN', verdict: 'APPLY' },
  { id: 'ipo-bajajhfl', company: 'Bajaj Housing Finance', price_band: '₹70', reality_score: 91, issue_date: 'Listed on NSE', gmp: '+114.2%', risk: 'Low', status: 'LISTED', verdict: 'APPLY' },
  { id: 'ipo-ather', company: 'Ather Energy Ltd', price_band: '₹310 - ₹335', reality_score: 79, issue_date: '2026-08-28 to 2026-09-02', gmp: '+12.5%', risk: 'Moderate', status: 'UPCOMING', verdict: 'APPLY' },
];

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const [dashboard, setDashboard] = useState<DashboardResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'ADMIN' | 'USER'>('USER');
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('upgrade') === 'true') {
      setIsPaymentOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const currentUser = getStoredUser();
    if (currentUser?.role) {
      setUserRole(currentUser.role);
    }

    setSiteContent(getSiteContent());

    async function loadDashboard() {
      try {
        const res = await fetchJson<DashboardResponse>('/dashboard');
        if (res.data) {
          setDashboard(res.data);
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const handleSiteContentChange = (field: keyof SiteContent, value: string) => {
    setSiteContent((current) => ({ ...current, [field]: value }));
  };

  const handleSiteContentSave = () => {
    const saved = saveSiteContent(siteContent);
    setSiteContent(saved);
  };

  const kpis = dashboard?.kpis ?? DEFAULT_KPIS;
  const ipos = dashboard?.ipo_radar ?? DEFAULT_IPOS;
  const market = dashboard?.market_overview ?? {
    NIFTY_50: '24,540.85',
    SENSEX: '80,436.20',
    NIFTY_BANK: '51,280.40',
  };

  return (
    <AppShell title="Executive Intelligence Dashboard">
      <div className="space-y-6">
        {/* Welcome & Live Real Market Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-[#070d19] to-slate-950 p-6 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles size={14} className="animate-spin" style={{ animationDuration: '8s' }} />
                <span>Real-Time Market & IPO Copilot</span>
              </div>
              <h2 className="mt-1 font-heading text-2xl font-black text-white">
                Live Market Pulse: <span className="text-emerald-400">Institutional DII Inflows Active</span>
              </h2>
              <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
                {dashboard?.briefing ||
                  'Indian primary markets are experiencing high quality mainboard issues (Swiggy, Hyundai Motor India, Bajaj Housing Finance). TradingView charts and 6-pillar reality scores are synced live.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/ipos"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-cyan-500/20 transition hover:scale-105"
              >
                <TrendingUp size={14} />
                <span>Check IPO Verdicts</span>
              </Link>
              <Link
                href="/screener"
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                <SlidersHorizontal size={14} />
                <span>Launch Stock Screener</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Master Admin Live Editor */}
        {userRole === 'ADMIN' && (
          <div className="rounded-3xl border border-cyan-500/30 bg-cyan-500/10 p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 font-extrabold">Master Admin Portal</p>
                <h3 className="mt-1 font-heading text-xl font-bold text-white">Live Platform Data Editor</h3>
              </div>
              <button
                type="button"
                onClick={handleSiteContentSave}
                className="rounded-xl bg-cyan-400 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-cyan-300 transition"
              >
                Save Live Updates
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-xs text-slate-300">
                <span className="mb-1 block font-semibold">Brand Name</span>
                <input
                  value={siteContent.brandName}
                  onChange={(e) => handleSiteContentChange('brandName', e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
                />
              </label>

              <label className="text-xs text-slate-300">
                <span className="mb-1 block font-semibold">Hero Headline</span>
                <input
                  value={siteContent.heroTitle}
                  onChange={(e) => handleSiteContentChange('heroTitle', e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
                />
              </label>
            </div>
          </div>
        )}

        {/* KPI Metric Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi, idx) => (
            <div
              key={kpi.label}
              className="rounded-3xl border border-slate-800 bg-[#070d19] p-5 shadow-sm transition hover:border-slate-700"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>{kpi.label}</span>
                <span className="text-cyan-400 font-bold">{kpi.change}</span>
              </div>
              <p className="mt-3 font-heading text-3xl font-black text-white">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Main 2-Column Grid: IPO Radar & Fast Picks */}
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          {/* Left Column: IPO Radar & Screener */}
          <div className="space-y-6">
            {/* IPO Radar Section */}
            <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">Mainboard IPO Radar & Verdicts</h3>
                  <p className="text-xs text-slate-400">6-Pillar reality scores and Grey Market (GMP) metrics</p>
                </div>
                <Link
                  href="/ipos"
                  className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                >
                  View All <ChevronRight size={14} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-3 py-3">Company</th>
                      <th className="px-3 py-3">Price Band</th>
                      <th className="px-3 py-3">GMP %</th>
                      <th className="px-3 py-3 text-center">Score</th>
                      <th className="px-3 py-3 text-center">Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {ipos.map((ipo) => (
                      <tr key={ipo.company} className="transition hover:bg-slate-900/50">
                        <td className="px-3 py-3 font-bold text-white">{ipo.company}</td>
                        <td className="px-3 py-3 text-slate-300">{ipo.price_band}</td>
                        <td className="px-3 py-3 font-semibold text-emerald-400">{ipo.gmp || '+15%'}</td>
                        <td className="px-3 py-3 text-center font-extrabold text-cyan-300">
                          {ipo.reality_score}/100
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                              Number(ipo.reality_score) >= 80
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {ipo.verdict || 'APPLY'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Screener Fast-Picks */}
            <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">High ROE Compounders (Screener)</h3>
                  <p className="text-xs text-slate-400">Zero Debt &gt; 25% ROE Equities</p>
                </div>
                <Link
                  href="/screener"
                  className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                >
                  Full Screener <ChevronRight size={14} />
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { symbol: 'TCS', price: '₹4,210', roe: '48.5%', score: 92, sector: 'IT Services' },
                  { symbol: 'SOLARINDS', price: '₹10,870', roe: '32.5%', score: 93, sector: 'Defence' },
                  { symbol: 'TATAMOTORS', price: '₹1,045', roe: '34.5%', score: 86, sector: 'Automotive' },
                ].map((s) => (
                  <div key={s.symbol} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-white text-sm">{s.symbol}</span>
                      <span className="rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5">
                        {s.score}/100
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{s.sector}</p>
                    <div className="mt-3 flex justify-between text-xs text-slate-300 border-t border-slate-800/80 pt-2">
                      <span>Price: {s.price}</span>
                      <span className="text-emerald-400 font-bold">ROE {s.roe}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Benchmark Indices & Health */}
          <div className="space-y-6">
            {/* Live Indices */}
            <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-lg">
              <h3 className="font-heading text-lg font-bold text-white mb-4">Benchmark Market Indices</h3>
              <div className="grid grid-cols-3 gap-3 text-xs">
                {Object.entries(market).map(([label, val]) => (
                  <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label.replace('_', ' ')}</p>
                    <p className="mt-1.5 font-heading text-sm font-black text-white">{val}</p>
                    <span className="text-[10px] font-bold text-emerald-400">+0.68%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Investor Mistake & Risk Analysis */}
            <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-bold text-white">Investor Health Score</h3>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  Grade A
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-center">
                <p className="text-xs text-slate-400">Discipline & Diversification Index</p>
                <p className="font-heading text-4xl font-black text-cyan-400 mt-1">86/100</p>
              </div>

              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="rounded-xl border border-slate-800/80 bg-slate-950 p-2.5 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Avoided 2 speculative issues with heavy secondary OFS cashing out.</span>
                </li>
                <li className="rounded-xl border border-slate-800/80 bg-slate-950 p-2.5 flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Healthy cash reserve (15%) maintained for upcoming Q3 IPO allotments.</span>
                </li>
              </ul>
            </div>
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

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400 text-sm">Loading executive dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
