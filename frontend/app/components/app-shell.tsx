'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  BriefcaseBusiness,
  Building2,
  SlidersHorizontal,
  FileText,
  LayoutDashboard,
  LogOut,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Menu,
  X,
  Zap,
  Crown,
  UserCheck,
  Database,
  User,
  BookOpen,
} from 'lucide-react';
import { clearUserProfile, getStoredUser, saveUserProfile, type InvestorUser } from '../../lib/user-profile';
import { AiChatModal } from './ai-chat-modal';
import { TradingViewTicker } from './tradingview-ticker';
import { PaymentModal } from './payment-modal';
import { BrandLogo } from './brand-logo';
import { DisclaimerBanner } from './disclaimer-banner';

const baseNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'IPO Radar & Verdicts', href: '/ipos', icon: TrendingUp, badge: 'HOT' },
  { name: 'Trading Journal', href: '/journal', icon: BookOpen, badge: 'NEW' },
  { name: 'Stock Screener', href: '/screener', icon: SlidersHorizontal },
  { name: 'User Profile & Plan', href: '/profile', icon: User },
  { name: 'Portfolio Tracker', href: '/portfolio', icon: BriefcaseBusiness },
  { name: 'Thesis Tracker', href: '/thesis', icon: Sparkles },
  { name: 'Companies Hub', href: '/companies', icon: Building2 },
  { name: 'Research Workspace', href: '/research', icon: Search },
  { name: 'Market Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'Documents (DRHP)', href: '/documents', icon: FileText },
];

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<InvestorUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleLogout = () => {
    clearUserProfile();
    setUser(null);
    router.push('/'); // Directly redirects to the Homepage on logout
  };

  const profileName = user?.displayName || 'Investor Member';
  const profileInitials = user?.initials || 'IM';
  const profileRole = user?.role === 'ADMIN' ? 'Master Admin' : 'Investor';
  const profilePlan = user?.plan || 'FREE';

  const navItems = user?.role === 'ADMIN'
    ? [...baseNavItems, { name: 'Master Admin Portal', href: '/admin', icon: Database, badge: 'ADMIN' }]
    : baseNavItems;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-white">
      {/* Live Single Moving Top Ticker Tape Bar */}
      <TradingViewTicker />

      <div className="flex min-h-[calc(100vh-42px)]">
        {/* Desktop Sidebar */}
        <aside className="hidden w-72 flex-col border-r border-slate-800/80 bg-[#070d19]/90 p-5 backdrop-blur-xl lg:flex">
          {/* Enhanced Brand Logo */}
          <div className="px-1 py-1">
            <BrandLogo size="md" href="/dashboard" />
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-1.5 flex-1">
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Navigation</p>
            {navItems.map(({ name, href, icon: Icon, badge }) => {
              const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

              return (
                <Link
                  key={name}
                  href={href}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'border border-cyan-500/30 bg-gradient-to-r from-cyan-500/15 to-transparent text-white shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />
                    <span>{name}</span>
                  </div>
                  {badge && (
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-black border ${
                        badge === 'ADMIN'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Master Admin / Pro Upgrade / Active Badge */}
          {user?.role === 'ADMIN' ? (
            <div className="mt-auto rounded-2xl border border-purple-500/40 bg-gradient-to-b from-purple-500/15 to-cyan-500/5 p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                  <Database size={16} /> Master Database Admin
                </div>
                <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300">ADMIN</span>
              </div>
              <p className="mt-2 text-xs text-slate-300">
                You have full access to add, edit, and delete IPO records in real-time.
              </p>
              <Link
                href="/admin"
                className="mt-3 block w-full rounded-xl bg-purple-500/30 border border-purple-500/50 py-2 text-center text-xs font-black text-white hover:bg-purple-500 transition"
              >
                Open Admin Portal →
              </Link>
            </div>
          ) : profilePlan !== 'PRO' ? (
            <div className="mt-auto rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 to-emerald-500/5 p-4 shadow-lg">
              <div className="flex items-center gap-2 text-cyan-300">
                <Crown size={18} />
                <span className="text-sm font-bold">Upgrade to Pro</span>
              </div>
              <p className="mt-2 text-xs text-slate-300">
                Unlock 6-pillar score breakdowns, real GMP alerts, &amp; unlimited AI copilot.
              </p>
              <button
                onClick={() => setIsPaymentOpen(true)}
                className="mt-3.5 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-3 py-2 text-xs font-black text-slate-950 shadow-md shadow-cyan-500/25 transition hover:scale-[1.02]"
              >
                Upgrade to Pro (₹299/mo)
              </button>
            </div>
          ) : (
            <div className="mt-auto rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-cyan-500/5 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                  <ShieldCheck size={16} /> Pro Intelligence Active
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">LIVE</span>
              </div>
              <p className="mt-2 text-xs text-slate-300">
                Full 6-pillar reality scores, DRHP Red Flag radar, &amp; fast screener active.
              </p>
            </div>
          )}

          {/* User Profile Card (Clickable to /profile) */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/80 p-3 transition hover:border-slate-700">
            <Link href="/profile" className="flex items-center gap-3 overflow-hidden flex-1 mr-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 text-xs font-black text-slate-950 shrink-0 group-hover:scale-105 transition">
                {profileInitials}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-xs font-bold text-white group-hover:text-cyan-300 transition">{profileName}</p>
                <div className="flex items-center gap-1 text-[11px] text-cyan-400">
                  <span>{profileRole}</span>
                  <span>·</span>
                  <span className="font-bold text-emerald-400">{profilePlan}</span>
                </div>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition"
              title="Logout (Go to Homepage)"
            >
              <LogOut size={16} />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#030712]/90 px-5 py-4 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              {/* Mobile menu toggle & page title */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 lg:hidden"
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
                      INVESTOR INTELLIGENCE PLATFORM
                    </p>
                  </div>
                  <h1 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-white">{title}</h1>
                </div>
              </div>

              {/* Search and Action Bar */}
              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 md:flex">
                  <Search size={15} className="text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search stocks, IPOs, DRHP..."
                    className="w-56 lg:w-72 border-0 bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
                  />
                </div>

                <Link
                  href="/ipos"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition hover:scale-105"
                >
                  <TrendingUp size={14} />
                  <span>IPO Radar</span>
                </Link>

                <Link
                  href="/profile"
                  className="hidden md:flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition"
                >
                  <User size={14} className="text-cyan-400" />
                  <span>Profile</span>
                </Link>

                {user?.role === 'ADMIN' ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-500/20 px-3 py-2 text-xs font-bold text-purple-300 hover:bg-purple-500 hover:text-white transition"
                  >
                    <Database size={13} />
                    <span>Admin Panel</span>
                  </Link>
                ) : profilePlan !== 'PRO' ? (
                  <button
                    onClick={() => setIsPaymentOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition"
                  >
                    <Crown size={13} />
                    <span>Get Pro</span>
                  </button>
                ) : null}

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-medium text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
                    title="Logout to Home Page"
                  >
                    <LogOut size={14} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 lg:hidden">
                <nav className="space-y-1">
                  {navItems.map(({ name, href, icon: Icon }) => (
                    <Link
                      key={name}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                        pathname === href ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon size={16} />
                      {name}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </nav>
              </div>
            )}
          </header>

          {/* Page Content */}
          <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</div>

          {/* Statutory SEBI Disclaimers Footer */}
          <DisclaimerBanner />
        </main>
      </div>

      {/* Embedded Global AI Copilot & Payment Modal */}
      <AiChatModal />
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        initialPlan="PRO"
        onSuccess={() => setUser(getStoredUser())}
      />
    </div>
  );
}
