'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Sparkles, ShieldCheck, ArrowRight, Lock, Mail, CheckCircle2, Crown, Zap, UserCheck, AlertCircle, Info, Search } from 'lucide-react';
import { getStoredUser, authenticateUserAsync, type InvestorUser } from '../../lib/user-profile';
import { BrandLogo } from '../components/brand-logo';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUpgradeRedirect = searchParams.get('redirect') === 'upgrade';
  const isSearchRedirect = searchParams.get('redirect') === 'search';
  const searchQuery = searchParams.get('q') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [detectedUser, setDetectedUser] = useState<InvestorUser | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (user?.email) {
      setDetectedUser(user);
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authenticateUserAsync(email, password);
      if (!res.success) {
        setError(res.error || 'Invalid credentials. Please verify your email and password.');
        setLoading(false);
        return;
      }

      if (res.user?.role === 'ADMIN') {
        router.push('/admin');
      } else if (isSearchRedirect && searchQuery) {
        router.push(`/ipos?q=${encodeURIComponent(searchQuery)}`);
      } else if (isSearchRedirect) {
        router.push('/ipos');
      } else if (isUpgradeRedirect) {
        router.push('/dashboard?upgrade=true');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Connection issue. Please check your network and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-800/90 bg-[#080e1c]/95 p-8 shadow-2xl backdrop-blur-2xl relative z-10">
      {/* Brand Header with Enhanced Logo */}
      <div className="mb-6 flex flex-col items-center text-center">
        <BrandLogo size="lg" showSubtitle={false} href="/" />
        <h1 className="mt-4 font-heading text-2xl font-black text-white">Investor Portal Login</h1>
        <p className="mt-1 text-xs text-slate-400">Sign in to access your IPO research workspace</p>
      </div>

      {/* Upgrade Notice when redirected */}
      {isUpgradeRedirect && (
        <div className="mb-5 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-3.5 flex items-start gap-2.5">
          <Crown size={18} className="text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-cyan-300">Sign In to Complete Upgrade</p>
            <p className="text-slate-300 mt-0.5">Please sign in to link your Pro subscription. Payment checkout will open automatically.</p>
          </div>
        </div>
      )}

      {/* Search Notice when redirected from homepage Analyze button */}
      {isSearchRedirect && (
        <div className="mb-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 flex items-start gap-2.5">
          <Search size={18} className="text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-emerald-300">Sign In to Analyze &quot;{searchQuery || 'IPO/Stock'}&quot;</p>
            <p className="text-slate-300 mt-0.5">Sign in to unlock full 6-pillar reality scores, DRHP forensics, and the Gift Point verdict.</p>
          </div>
        </div>
      )}

      {/* Automatic Active User Detection Banner */}
      {detectedUser && !isUpgradeRedirect && !isSearchRedirect && (
        <div className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <UserCheck size={16} />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{detectedUser.displayName}</p>
              <p className="text-[10px] text-emerald-400 font-bold uppercase">
                {detectedUser.role === 'ADMIN' ? 'Master Admin' : `${detectedUser.plan} Plan`} Active
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push(detectedUser.role === 'ADMIN' ? '/admin' : '/dashboard')}
            className="rounded-xl bg-emerald-400 px-3 py-1.5 text-xs font-black text-slate-950 hover:bg-emerald-300 transition shadow-sm"
          >
            Continue →
          </button>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleLoginSubmit}>
        {error && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs font-semibold text-rose-300 flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">Email or Username</label>
          <div className="relative">
            <input
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email or username"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            <Mail className="absolute right-3 top-3 h-4 w-4 text-slate-500" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-slate-300">Password</label>
            <span className="text-[11px] text-cyan-400 hover:underline cursor-pointer">Forgot?</span>
          </div>
          <div className="relative">
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            <Lock className="absolute right-3 top-3 h-4 w-4 text-slate-500" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-3 font-extrabold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              <span>Verifying credentials...</span>
            </span>
          ) : (
            <>
              <span>
                {isSearchRedirect
                  ? 'Sign In & View Analysis'
                  : isUpgradeRedirect
                  ? 'Sign In & Continue to Payment'
                  : 'Sign In'}
              </span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-400">
        New to Investor Intelligence?{' '}
        <Link
          href={
            isSearchRedirect
              ? `/register?redirect=search&q=${encodeURIComponent(searchQuery)}`
              : isUpgradeRedirect
              ? '/register?redirect=upgrade'
              : '/register'
          }
          className="font-bold text-cyan-400 hover:underline"
        >
          Create an account
        </Link>
      </div>

      <div className="mt-6 border-t border-slate-800/80 pt-4 flex flex-col items-center gap-1.5 text-[11px] text-slate-400 text-center">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>256-Bit Encrypted Financial Research Gateway</span>
        </div>
        <p className="text-[10px] text-slate-500">
          Securities market research tool. <Link href="/disclaimer" className="text-cyan-400 hover:underline">SEBI Disclaimers &amp; Risk Warning</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#030712] p-4 text-slate-100 selection:bg-cyan-500/30 selection:text-white relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(6,182,212,0.18),_transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(16,185,129,0.12),_transparent_70%)] pointer-events-none" />

      <Suspense fallback={<div className="text-white text-sm">Loading...</div>}>
        <LoginContent />
      </Suspense>
    </main>
  );
}
