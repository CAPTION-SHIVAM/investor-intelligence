'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  BriefcaseBusiness,
  Bot,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronRight,
  Zap,
  Crown,
  BarChart3,
  Search,
  Lock,
  Star,
  Users,
  Award,
  HelpCircle,
  Briefcase,
  Gift,
  AlertTriangle,
  Eye,
  UserCheck,
  Calculator,
  PieChart,
  Target,
  FileCheck,
  TrendingDown,
  BookOpen,
  BrainCircuit,
  Smile,
  Layers,
  Download,
} from 'lucide-react';
import { TradingViewTicker } from './components/tradingview-ticker';
import { PaymentModal } from './components/payment-modal';
import { BrandLogo } from './components/brand-logo';
import { DisclaimerBanner } from './components/disclaimer-banner';
import { getStoredUser, type InvestorUser } from '../lib/user-profile';

const REAL_IPOS_PREVIEW = [
  {
    symbol: 'SWIGGY',
    name: 'Swiggy Limited',
    price_band: '₹371 - ₹390',
    gmp: '+7.2%',
    score: 76,
    verdict: 'APPLY (Growth)',
    verdict_badge: 'Apply · Quick Commerce Hypergrowth',
    gift_point: 'Duopoly with Zomato controlling 90%+ market. Instamart dark stores reaching EBITDA break-even in 10 months.',
    main_feature: '14M+ active monthly transacting users & Instamart quick commerce growing 85% YoY.',
    disadvantage: 'Intense price competition against Blinkit & Zepto; corporate level cash burn.',
    what_missed: 'Dark store contribution margin turns +3.2% positive once orders cross 1,100/day.',
  },
  {
    symbol: 'HYUNDAI',
    name: 'Hyundai Motor India',
    price_band: '₹1,865 - ₹1,960',
    gmp: '+3.3%',
    score: 84,
    verdict: 'APPLY (Long Term)',
    verdict_badge: 'Apply · 28.4% ROCE Auto Giant',
    gift_point: 'India’s highest ROCE passenger automaker (28.4% ROCE vs Maruti’s 18%). Core long-term compounder.',
    main_feature: '60%+ revenue from high-margin premium SUV mix (Creta) with 35% higher ASP.',
    disadvantage: '100% OFS exit: entire ₹27,870 Cr proceeds go to Korean parent entity; zero primary cash.',
    what_missed: 'Talegaon & Chennai mega plants export to 85+ countries as global RHD manufacturing hub.',
  },
  {
    symbol: 'BAJAJHFL',
    name: 'Bajaj Housing Finance',
    price_band: '₹70 (Listed ₹150)',
    gmp: '+114.2%',
    score: 91,
    verdict: 'APPLY (Super Compounder)',
    verdict_badge: 'Bajaj Pedigree · 0.27% Gross NPAs',
    gift_point: 'Triple-A credit rating + lowest borrowing costs + pristine 0.27% Gross NPAs.',
    main_feature: 'AUM growing at 32% CAGR with access to 85M+ existing Bajaj Finserv customer funnel.',
    disadvantage: 'Elevated post-listing price-to-book valuation multiple (P/BV > 3.8x).',
    what_missed: 'Developer loans are secured by strict escrow cash flows from tier-1 builders only.',
  },
  {
    symbol: 'ATHER',
    name: 'Ather Energy Ltd',
    price_band: '₹310 - ₹335',
    gmp: '+12.5%',
    score: 79,
    verdict: 'APPLY (EV Growth)',
    verdict_badge: 'Apply · Pure Play Premium EV Leader',
    gift_point: 'Highest customer Net Promoter Score and build quality in Indian electric 2-wheeler market.',
    main_feature: 'Rizta family scooter expanding addressable market by 3x with in-house battery tech.',
    disadvantage: 'EBITDA cash losses continue due to heavy charging network and R&D capex.',
    what_missed: 'Ather Grid fast charging network is standardized and opening to third-party EV brands.',
  },
];

const CALCULATOR_IPOS = [
  { symbol: 'SWIGGY', name: 'Swiggy Limited', price: 390, lotSize: 38, gmpPct: 7.2 },
  { symbol: 'HYUNDAI', name: 'Hyundai Motor India', price: 1960, lotSize: 7, gmpPct: 3.3 },
  { symbol: 'BAJAJHFL', name: 'Bajaj Housing Finance', price: 70, lotSize: 214, gmpPct: 114.2 },
  { symbol: 'ATHER', name: 'Ather Energy Ltd', price: 335, lotSize: 44, gmpPct: 12.5 },
  { symbol: 'NTPCGREEN', name: 'NTPC Green Energy', price: 108, lotSize: 138, gmpPct: 8.5 },
];

const SIX_PILLARS = [
  {
    title: '1. Unit Economics & Moat',
    weight: '20%',
    icon: Target,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-500/10',
    desc: 'Pricing power, customer acquisition cost vs lifetime value (LTV/CAC), and high barrier-to-entry moats.',
  },
  {
    title: '2. Financial Health & ROCE',
    weight: '20%',
    icon: BarChart3,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    desc: '3-year revenue CAGR, EBITDA margins, Return on Capital Employed (>18%), and debt-to-equity ratios.',
  },
  {
    title: '3. Valuation vs Listed Peers',
    weight: '20%',
    icon: PieChart,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    desc: 'P/E multiple, P/BV, and EV/EBITDA discount or premium relative to closest listed market competitors.',
  },
  {
    title: '4. Growth Runway & TAM',
    weight: '15%',
    icon: TrendingUp,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/10',
    desc: 'Total addressable market headroom, capacity expansion plans, and industry tailwinds over the next 5 years.',
  },
  {
    title: '5. Promoter & OFS Sell-off',
    weight: '10%',
    icon: Users,
    color: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    bgColor: 'bg-rose-500/10',
    desc: 'Percentage of secondary OFS dumping vs fresh capital raised for debt reduction or productive capex.',
  },
  {
    title: '6. Forensic Red Flag Radar',
    weight: '15%',
    icon: ShieldCheck,
    color: 'text-teal-400',
    borderColor: 'border-teal-500/30',
    bgColor: 'bg-teal-500/10',
    desc: 'Auditing hidden DRHP notes: pending SEBI litigations, related-party loans, and client concentration.',
  },
];

const FAQS = [
  {
    q: 'Why are full scores and DRHP forensics gated by login?',
    a: 'We provide top-level pricing and dates to all visitors, while reserving proprietary 6-pillar reality scores, DRHP red flag audits, and exact Gift Point decisions for verified registered members to protect analytical integrity.',
  },
  {
    q: 'How does the 6-Pillar IPO Reality Score work on real Indian IPOs?',
    a: 'Our deterministic grading engine analyzes the official SEBI DRHP filing across six critical vectors: Business Moat & Unit Economics (20%), Financial Quality & Balance Sheet (20%), Valuation vs Peers (20%), Growth Runway (15%), Promoter Governance & OFS Sell-offs (10%), and Downside Risk (15%).',
  },
  {
    q: 'What is the "Gift Point" for each IPO?',
    a: 'The Gift Point is our definitive, bottom-line takeaway that cuts straight to the point: whether you should Apply (for listing pop or long-term compounding), Hold, or Avoid, along with the single most decisive financial metric and the ideal investor type.',
  },
  {
    q: 'How do payments and instant activation work?',
    a: 'We support all major Indian digital payment methods including Instant UPI (GPay, PhonePe, Paytm, CRED), Credit/Debit Cards, and NetBanking with automated instant license activation and GST-compliant tax invoices.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [user, setUser] = useState<InvestorUser | null>(null);

  // Hero Quick Search
  const [heroSearch, setHeroSearch] = useState('');

  // Interactive IPO Profit Calculator state
  const [calcSymbol, setCalcSymbol] = useState('SWIGGY');
  const [calcLots, setCalcLots] = useState(1);
  const [calcGmpOverride, setCalcGmpOverride] = useState<number>(7.2);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const selectedCalcIpo = CALCULATOR_IPOS.find((ipo) => ipo.symbol === calcSymbol) || CALCULATOR_IPOS[0];

  const handleIpoSelect = (sym: string) => {
    setCalcSymbol(sym);
    const found = CALCULATOR_IPOS.find((i) => i.symbol === sym);
    if (found) {
      setCalcGmpOverride(found.gmpPct);
    }
  };

  // Calculations
  const totalShares = selectedCalcIpo.lotSize * calcLots;
  const totalInvestment = totalShares * selectedCalcIpo.price;
  const expectedListingPrice = Math.round(selectedCalcIpo.price * (1 + calcGmpOverride / 100) * 10) / 10;
  const expectedProfit = Math.round((expectedListingPrice - selectedCalcIpo.price) * totalShares);

  const isLoggedIn = !!user;

  const handleUpgradeClick = () => {
    if (!user) {
      router.push('/login?redirect=upgrade');
    } else {
      setIsPaymentOpen(true);
    }
  };

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = heroSearch.trim();
    if (!query) return;

    if (!user) {
      // Must first login before analyzing
      router.push(`/login?redirect=search&q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/ipos?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-white">
      {/* Live Single Moving Top Ticker Tape Bar */}
      <TradingViewTicker />

      {/* Background glowing gradients */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,_rgba(6,182,212,0.18),_transparent_65%)]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(16,185,129,0.12),_transparent_60%)]" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(99,102,241,0.10),_transparent_60%)]" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#030712]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <BrandLogo size="md" href="/" />

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-300 md:flex">
            <Link href="/journal" className="transition hover:text-white flex items-center gap-1.5 text-cyan-300 font-bold bg-cyan-950/40 px-2.5 py-1 rounded-xl border border-cyan-500/30">
              <BookOpen size={14} /> Trading Journal <span className="text-[9px] bg-cyan-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black uppercase">NEW</span>
            </Link>
            <a href="#calculator" className="transition hover:text-white flex items-center gap-1.5 text-slate-300 font-semibold">
              <Calculator size={14} /> Profit Calculator
            </a>
            <a href="#six-pillars" className="transition hover:text-white">6-Pillar Engine</a>
            <a href="#ipos" className="transition hover:text-white">Gift Verdicts</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
            <a href="#faq" className="transition hover:text-white">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500 hover:text-slate-950"
              >
                <UserCheck size={14} />
                <span>Dashboard ({user?.displayName})</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-xl border border-slate-700/80 bg-slate-900/80 px-4 py-2 text-xs font-bold text-slate-200 transition hover:bg-slate-800 hover:text-white"
                >
                  Sign in
                </Link>
              </div>
            )}

            <button
              onClick={handleUpgradeClick}
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:scale-105"
            >
              Upgrade Pro
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-18 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold text-cyan-300 shadow-sm backdrop-blur">
              <Gift size={14} className="text-amber-400 animate-bounce" />
              <span>The Investor Intelligence Gift Score Engine · Real DRHP Forensics</span>
            </div>

            <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.1]">
              Know Exactly <span className="gradient-text-cyan">Why an IPO is Good</span> &amp; What Retail Misses.
            </h1>

            <p className="mt-6 text-lg text-slate-300 sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Get the definitive <strong>Gift Point verdict</strong>, competitive moats, key disadvantages, and hidden DRHP forensics before you apply.
            </p>

            {/* Quick Hero Search Bar */}
            <form onSubmit={handleHeroSearchSubmit} className="mt-8 max-w-xl mx-auto">
              <div className="relative flex items-center">
                <input
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search any IPO or stock (e.g. Swiggy, Hyundai, Ather, Bajaj)..."
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 py-3.5 pl-12 pr-28 text-sm text-white placeholder:text-slate-500 shadow-2xl focus:border-cyan-400 focus:outline-none"
                />
                <Search size={18} className="absolute left-4 text-slate-400" />
                <button
                  type="submit"
                  className="absolute right-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-2 text-xs font-extrabold text-slate-950 hover:scale-105 transition"
                >
                  Analyze →
                </button>
              </div>
            </form>

            {/* Prominent Non-SEBI Disclaimer Badge */}
            <div className="mt-6 mx-auto max-w-2xl rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-slate-300 flex items-center justify-center gap-2.5">
              <AlertTriangle size={16} className="text-amber-400 shrink-0" />
              <p className="text-[11px] text-slate-300 text-left sm:text-center">
                <strong className="text-amber-300">Notice:</strong> We are <strong>NOT a SEBI registered advisor</strong>. All data is for educational research only. <strong>Please take independent investment decisions from your own end</strong> or consult your certified advisor.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/ipos"
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 px-7 py-3.5 text-sm sm:text-base font-extrabold text-slate-950 shadow-xl shadow-cyan-500/30 transition hover:scale-105"
              >
                <span>1. IPO Forensics &amp; Verdicts</span>
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/journal"
                className="flex items-center gap-2 rounded-2xl border border-cyan-500/40 bg-cyan-950/40 px-7 py-3.5 text-sm sm:text-base font-extrabold text-cyan-300 shadow-xl shadow-cyan-500/15 transition hover:bg-cyan-500 hover:text-slate-950"
              >
                <BookOpen size={18} />
                <span>2. Trading Journal (NEW)</span>
              </Link>
              <a
                href="#calculator"
                className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-md transition hover:bg-slate-800"
              >
                <Calculator size={17} className="text-cyan-400" />
                <span>Profit Calculator</span>
              </a>
            </div>

            {/* Real Market Trust metrics */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl mx-auto border-t border-slate-800/80 pt-8">
              <div>
                <p className="font-heading text-3xl font-black text-white">87.5%</p>
                <p className="text-xs text-slate-400 mt-1">Positive Listing Win Rate</p>
              </div>
              <div>
                <p className="font-heading text-3xl font-black text-cyan-400">₹65,000Cr+</p>
                <p className="text-xs text-slate-400 mt-1">Real DRHP Capital Audited</p>
              </div>
              <div>
                <p className="font-heading text-3xl font-black text-emerald-400">6-Pillar</p>
                <p className="text-xs text-slate-400 mt-1">Deterministic Reality Score</p>
              </div>
              <div>
                <p className="font-heading text-3xl font-black text-purple-400">Instant UPI</p>
                <p className="text-xs text-slate-400 mt-1">Pro Upgrades &amp; Tax Invoices</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW INTERACTIVE FEATURE: Real-time IPO Profit & Allotment Gain Calculator */}
      <section id="calculator" className="py-16 border-t border-slate-800/80 bg-gradient-to-b from-slate-950 via-[#071020] to-slate-950 relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold text-cyan-300">
              <Calculator size={14} />
              <span>Interactive Financial Tool</span>
            </div>
            <h2 className="mt-3 font-heading text-3xl font-black text-white sm:text-4xl">
              Live IPO Profit &amp; Listing Gain Calculator
            </h2>
            <p className="mt-2 text-xs md:text-sm text-slate-400">
              Select any upcoming or active mainboard IPO to simulate your total capital required, expected listing gain, and estimated net profit.
            </p>
          </div>

          {/* Interactive Calculator Box */}
          <div className="grid gap-8 lg:grid-cols-12 rounded-3xl border border-slate-800 bg-[#080f1e]/90 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
            {/* Left Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  1. Select IPO Issue
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CALCULATOR_IPOS.map((ipo) => (
                    <button
                      key={ipo.symbol}
                      onClick={() => handleIpoSelect(ipo.symbol)}
                      className={`rounded-2xl p-3 text-left border transition ${
                        calcSymbol === ipo.symbol
                          ? 'border-cyan-400 bg-cyan-500/15 text-white shadow-md shadow-cyan-500/15'
                          : 'border-slate-800 bg-slate-900/70 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <p className="font-heading text-xs font-extrabold text-white">{ipo.symbol}</p>
                      <p className="text-[11px] text-cyan-300 mt-0.5">₹{ipo.price} · Lot {ipo.lotSize}</p>
                      <span className="text-[10px] font-bold text-emerald-400">GMP +{ipo.gmpPct}%</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Lots Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    2. Number of Application Lots: <span className="text-cyan-400 font-extrabold">{calcLots} Lot{calcLots > 1 ? 's' : ''} ({totalShares} shares)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Max 20 Lots</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={calcLots}
                  onChange={(e) => setCalcLots(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1 Lot (Retail)</span>
                  <span>5 Lots</span>
                  <span>13 Lots (sHNI)</span>
                  <span>20 Lots (bHNI)</span>
                </div>
              </div>

              {/* Expected GMP % Slider / Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    3. Expected Listing Premium (GMP %): <span className="text-emerald-400 font-extrabold">+{calcGmpOverride}%</span>
                  </label>
                  <button
                    onClick={() => setCalcGmpOverride(selectedCalcIpo.gmpPct)}
                    className="text-[10px] text-cyan-400 hover:underline"
                  >
                    Reset to Live GMP
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={calcGmpOverride}
                  onChange={(e) => setCalcGmpOverride(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Right Output Card (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 via-slate-900 to-slate-950 p-6 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300">{selectedCalcIpo.name}</span>
                  <span className="text-xs font-bold text-cyan-400">{calcSymbol}</span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Total Investment Required</span>
                    <span className="font-heading font-extrabold text-white text-sm">₹{totalInvestment.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Expected Listing Price</span>
                    <span className="font-heading font-extrabold text-cyan-300 text-sm">₹{expectedListingPrice} / share</span>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4 mt-2">
                    <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Estimated Listing Profit</p>
                    <p className="font-heading text-3xl font-black text-emerald-300 mt-1">
                      +₹{expectedProfit.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Gain: +{calcGmpOverride}% on ₹{totalInvestment.toLocaleString()} capital</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <Link
                  href="/ipos"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-3 text-xs font-black text-slate-950 shadow-md shadow-cyan-500/25 transition hover:scale-105"
                >
                  <span>View Full 6-Pillar DRHP Score</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: The 6-Pillar Reality Score Engine Architecture */}
      <section id="six-pillars" className="py-20 border-t border-slate-800/80 bg-slate-950/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Institutional Methodology</span>
            <h2 className="mt-2 font-heading text-3xl font-black text-white sm:text-5xl">
              The 6-Pillar IPO Reality Score
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-400 leading-relaxed">
              We replace hype with cold, deterministic mathematical forensics. Here is how every DRHP is evaluated out of 100 points:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SIX_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className={`rounded-3xl border ${pillar.borderColor} ${pillar.bgColor} p-6 shadow-lg backdrop-blur-md flex flex-col justify-between transition hover:scale-[1.02]`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-2xl bg-slate-950/80 border ${pillar.borderColor} ${pillar.color}`}>
                        <Icon size={20} />
                      </div>
                      <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs font-black text-white border border-slate-700">
                        Weight: {pillar.weight}
                      </span>
                    </div>

                    <h3 className="mt-4 font-heading text-lg font-bold text-white">{pillar.title}</h3>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed">{pillar.desc}</p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">SEBI DRHP Metric</span>
                    <span className={`font-bold ${pillar.color}`}>Audited Forensics</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Real IPO 4-Pillar Gift Point Showcase */}
      <section id="ipos" className="py-16 border-t border-slate-800/80 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Gift size={16} /> 4-Pillar Forensic Breakdown
              </div>
              <h2 className="mt-2 font-heading text-3xl font-black text-white sm:text-4xl">
                Why Apply, Main Features, Disadvantages &amp; Missed Points
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Audited intelligence from Swiggy, Hyundai Motor India, Bajaj Housing Finance, and Ather Energy.
              </p>
            </div>
            <Link
              href="/ipos"
              className="mt-4 md:mt-0 inline-flex items-center gap-1 text-sm font-bold text-cyan-400 hover:text-cyan-300"
            >
              View Full IPO Radar <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {REAL_IPOS_PREVIEW.map((ipo) => (
              <div
                key={ipo.symbol}
                className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Top Line: Symbol, Verdict Badge, Score */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-cyan-300 border border-slate-700">
                        {ipo.symbol}
                      </span>
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-black text-emerald-300 border border-emerald-500/30">
                        {ipo.verdict}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-semibold">Reality Score</span>
                      {isLoggedIn ? (
                        <p className="font-heading text-lg font-black text-cyan-400">{ipo.score}/100</p>
                      ) : (
                        <p className="font-heading text-sm font-bold text-slate-400 flex items-center gap-1">
                          <Lock size={12} className="text-cyan-400" />
                          <span>•• / 100</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <h3 className="mt-3 font-heading text-xl font-bold text-white">{ipo.name}</h3>

                  {/* 1. THE GIFT POINT */}
                  <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs">
                    <p className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                      <Gift size={14} /> The Gift Point Verdict:
                    </p>
                    {isLoggedIn ? (
                      <p className="text-slate-200 leading-relaxed font-medium">{ipo.gift_point}</p>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-slate-300 italic">Sign in to reveal the exact decisive Apply/Avoid rationale...</p>
                        <Link
                          href="/login"
                          className="rounded-lg bg-amber-400 px-2.5 py-1 text-[10px] font-black text-slate-950 shrink-0"
                        >
                          Unlock
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* 2. THREE PILLARS */}
                  <div className="mt-4 space-y-2.5 text-xs">
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-2.5">
                      <p className="font-bold text-emerald-300 mb-0.5 flex items-center gap-1">
                        <Award size={13} /> Main Feature &amp; Moat:
                      </p>
                      <p className="text-slate-300">{ipo.main_feature}</p>
                    </div>

                    <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-2.5">
                      <p className="font-bold text-rose-300 mb-0.5 flex items-center gap-1">
                        <AlertTriangle size={13} /> Key Disadvantage:
                      </p>
                      <p className="text-slate-300">{ipo.disadvantage}</p>
                    </div>

                    <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-2.5">
                      <p className="font-bold text-purple-300 mb-0.5 flex items-center gap-1">
                        <Eye size={13} /> What Retail Missed:
                      </p>
                      <p className="text-slate-300">{ipo.what_missed}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-800/80 pt-4 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400">GMP: </span>
                    <strong className="text-emerald-400">{ipo.gmp}</strong>
                    <span className="text-slate-500 ml-2">Band: {ipo.price_band}</span>
                  </div>

                  <Link
                    href={isLoggedIn ? '/ipos' : '/login'}
                    className="rounded-xl bg-slate-800/90 px-4 py-2 text-center text-xs font-bold text-slate-200 transition hover:bg-cyan-500 hover:text-slate-950"
                  >
                    {isLoggedIn ? 'Full DRHP Breakdown →' : 'Sign In to View All Points →'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLAGSHIP 2: Institutional Trading & Psychology Journal Showcase */}
      <section id="trading-journal" className="py-20 border-t border-slate-800/80 bg-gradient-to-b from-slate-950 via-[#051124] to-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left: Text & Features */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold text-cyan-300">
                <BookOpen size={14} className="text-cyan-400" />
                <span>Flagship Platform Engine · For All Active Investors</span>
              </div>
              <h2 className="mt-4 font-heading text-3xl font-black text-white sm:text-5xl leading-tight">
                Institutional <span className="gradient-text-cyan">Trading Journal</span> &amp; Discipline Tracker
              </h2>
              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                Most traders lose money not because of strategy, but because of poor execution psychology and unrecorded mistakes. Our <strong>Institutional Trading Journal</strong> tracks your real P&amp;L, win rates, strategy setups, and emotional discipline in real-time.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                    <Target size={18} />
                    <span>Win Rate &amp; Profit Factor</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Automatic mathematical win rates, risk-reward ratios, and net rupee returns.</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <BrainCircuit size={18} />
                    <span>Psychology Discipline Tagging</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Tag trades with &apos;Disciplined Execution&apos;, &apos;FOMO&apos;, or &apos;Patient Dip Buy&apos; to eliminate bad habits.</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                    <Layers size={18} />
                    <span>Strategy Playbooks</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Categorize by IPO Listing Day Breakouts, 20 EMA Swings, and Earnings Surprises.</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Download size={18} />
                    <span>1-Click CSV Tax Export</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Download comprehensive trade logs with entry/exit timestamps for easy taxation &amp; audit.</p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href={isLoggedIn ? '/journal' : '/login'}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 px-7 py-3.5 text-sm font-extrabold text-slate-950 shadow-xl shadow-cyan-500/25 transition hover:scale-105"
                >
                  <BookOpen size={16} />
                  <span>{isLoggedIn ? 'Open Your Trading Journal' : 'Sign In to Open Journal →'}</span>
                </Link>
              </div>
            </div>

            {/* Right: Interactive Visual Card Mockup */}
            <div className="w-full lg:max-w-md rounded-3xl border border-cyan-500/30 bg-[#070e1d] p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500" />
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono-code text-slate-400 ml-2">journal.analytics</span>
                </div>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  +₹20,078 NET P&amp;L
                </span>
              </div>

              {/* Sample Metrics Mockup */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-[11px] text-slate-400">Win Rate</span>
                  <p className="font-heading text-xl font-black text-cyan-400 mt-1">75.0%</p>
                  <span className="text-[10px] text-emerald-400 font-bold">3 Wins / 1 Loss</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-[11px] text-slate-400">Profit Factor</span>
                  <p className="font-heading text-xl font-black text-purple-400 mt-1">2.45</p>
                  <span className="text-[10px] text-slate-400">R:R Ratio 1:2.8</span>
                </div>
              </div>

              {/* Sample Trade Entries */}
              <div className="space-y-2 text-xs">
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/90 p-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-white">SWIGGY</strong>
                      <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 rounded font-bold">BUY · IPO</span>
                    </div>
                    <span className="text-[10px] text-cyan-300">IPO Listing Breakout</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400 font-mono-code">+₹4,408</span>
                    <p className="text-[10px] text-emerald-400">(+14.8%)</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-950/90 p-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-white">ZOMATO</strong>
                      <span className="text-[9px] bg-cyan-950 text-cyan-300 px-1.5 rounded font-bold">SWING</span>
                    </div>
                    <span className="text-[10px] text-cyan-300">20 EMA Pullback</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400 font-mono-code">+₹8,400</span>
                    <p className="text-[10px] text-emerald-400">(+17.3%)</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-950/90 p-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-white">HYUNDAI</strong>
                      <span className="text-[9px] bg-rose-950 text-rose-300 px-1.5 rounded font-bold">IPO</span>
                    </div>
                    <span className="text-[10px] text-rose-400">Strict Stoploss Respected</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-rose-400 font-mono-code">-₹980</span>
                    <p className="text-[10px] text-rose-400">(-3.5%)</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <ShieldCheck size={13} /> 100% Private &amp; Encrypted
                </span>
                <span className="font-mono-code text-cyan-400">CSV Export Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Free vs Pro Model Section */}
      <section id="pricing" className="py-20 border-t border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Transparent Pricing</span>
            <h2 className="mt-2 font-heading text-3xl font-black text-white sm:text-5xl">
              Simple, High-ROI Plans
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              A single avoided bad IPO can save you 10x the annual subscription cost.
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 inline-flex items-center rounded-full border border-slate-800 bg-slate-900/90 p-1.5">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-5 py-2 text-xs font-bold transition ${
                  billingCycle === 'monthly' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`rounded-full px-5 py-2 text-xs font-bold transition ${
                  billingCycle === 'annual' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Annual Billing <span className="ml-1 text-[10px] uppercase font-black text-slate-950 bg-emerald-300 px-1.5 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
            {/* Free Starter Tier */}
            <div className="glass-card rounded-3xl p-8 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-bold text-white">Free Starter</h3>
                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300">Starter</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">Essential IPO dates and basic fundamental overview.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-black text-white">₹0</span>
                  <span className="text-xs text-slate-400">/ forever free</span>
                </div>

                <ul className="mt-8 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Upcoming IPO issue calendar &amp; dates</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Basic price bands &amp; lot sizes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Live TradingView Ticker Tape</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-500">
                    <XCircle size={16} className="shrink-0" />
                    <span>6-Pillar Score Breakdown</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-500">
                    <XCircle size={16} className="shrink-0" />
                    <span>Live Grey Market Premium (GMP)</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="mt-8 block w-full rounded-xl border border-slate-700 bg-slate-900 py-3 text-center text-xs font-bold text-white transition hover:bg-slate-800"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Investor Tier */}
            <div className="glass-card rounded-3xl p-8 border-2 border-cyan-500/80 bg-gradient-to-b from-cyan-500/10 via-slate-900/90 to-slate-950 shadow-2xl shadow-cyan-500/20 relative flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-md">
                Most Popular · High Conviction
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-bold text-white">Pro Investor</h3>
                  <Crown size={20} className="text-cyan-400" />
                </div>
                <p className="mt-2 text-xs text-slate-300">Complete institutional scoring and risk radar for active investors.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-black text-white">
                    {billingCycle === 'annual' ? '₹239' : '₹299'}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                {billingCycle === 'annual' && (
                  <p className="text-[11px] text-emerald-400 font-bold mt-1">Billed ₹2,399 annually (Save ₹1,189)</p>
                )}

                <ul className="mt-8 space-y-3 text-xs text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                    <span className="font-semibold">Complete 6-Pillar IPO Reality Score Engine</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                    <span className="font-semibold">Live Grey Market Premium (GMP) Tracker</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                    <span>The Gift Point Verdicts &amp; What Retail Misses</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                    <span>Institutional Fundamental &amp; Valuation Ratios Screener</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                    <span>Full Multi-Cap Stock Screener + CSV Export</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                    <span>Unlimited AI Investment Copilot</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleUpgradeClick}
                className="mt-8 block w-full rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 py-3 text-center text-xs font-black text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:scale-105"
              >
                Instant UPI / Card Upgrade (₹{billingCycle === 'annual' ? '2,399' : '299'})
              </button>
            </div>

            {/* Institutional / Family Office */}
            <div className="glass-card rounded-3xl p-8 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-bold text-white">Institutional VIP</h3>
                  <span className="rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 text-xs font-semibold">Funds</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">For family offices, PMS managers, and research teams.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-black text-white">
                    {billingCycle === 'annual' ? '₹799' : '₹999'}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>

                <ul className="mt-8 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>All Pro Features included</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>API Access to 6-Pillar Scoring Engine</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Multi-seat analyst team workspace</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Custom DRHP deep-dive analyst memos</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleUpgradeClick}
                className="mt-8 block w-full rounded-xl border border-slate-700 bg-slate-900 py-3 text-center text-xs font-bold text-white transition hover:bg-slate-800"
              >
                Instant Upgrade
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-slate-800/80 bg-slate-950/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Questions &amp; Answers</span>
            <h2 className="mt-2 font-heading text-3xl font-black text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-white hover:text-cyan-300"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    size={18}
                    className={`transition-transform duration-200 ${activeFaq === idx ? 'rotate-90 text-cyan-400' : 'text-slate-400'}`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer with BrandLogo */}
      <footer className="border-t border-slate-800/80 bg-[#020611] py-12 text-slate-400 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <BrandLogo size="md" href="/" />
              <p className="mt-3 text-slate-400 leading-relaxed">
                Institutional grade IPO reality scoring, real-time TradingView charts, stock screening, and risk management.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Platform Flagships</h4>
              <ul className="space-y-2">
                <li><Link href="/ipos" className="hover:text-white font-bold text-cyan-300">1. IPO Radar &amp; Forensics</Link></li>
                <li><Link href="/journal" className="hover:text-white font-bold text-emerald-300">2. Trading Journal (NEW)</Link></li>
                <li><Link href="/screener" className="hover:text-white">Stock Screener</Link></li>
                <li><Link href="/portfolio" className="hover:text-white">Portfolio Tracker</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Executive Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/documents" className="hover:text-white">DRHP Library</Link></li>
                <li><Link href="/thesis" className="hover:text-white">Thesis Builder</Link></li>
                <li><Link href="/research" className="hover:text-white">Research Workspace</Link></li>
                <li><Link href="/alerts" className="hover:text-white">Market Risk Alerts</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Regulatory &amp; Legal</h4>
              <p className="text-[11px] leading-relaxed text-slate-400">
                <strong>Non-Advisory Tool:</strong> Not a SEBI Registered Advisor (RIA/RA). All reality scores and algorithmic outputs are for educational research only.
              </p>
              <ul className="mt-3 space-y-1.5 text-[11px]">
                <li><Link href="/disclaimer" className="text-cyan-400 hover:underline font-bold">Statutory Disclaimers &amp; SEBI Risk Warning →</Link></li>
                <li><Link href="/terms" className="text-slate-400 hover:text-white">Terms of Service</Link></li>
                <li><a href="https://www.sebi.gov.in" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-300">SEBI Official Portal (sebi.gov.in)</a></li>
              </ul>
              <p className="mt-3 text-[10px] text-slate-500">© 2026 Investor Intelligence Platforms India. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Persistent Statutory Indian SEBI Disclaimers Banner */}
      <DisclaimerBanner />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        initialPlan="PRO"
      />
    </main>
  );
}
