'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ShieldCheck, ArrowRight, CheckCircle2, Crown, Zap, AlertCircle, Search } from 'lucide-react';
import { registerUserAsync, type UserPlan } from '../../lib/user-profile';
import { BrandLogo } from '../components/brand-logo';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUpgradeRedirect = searchParams.get('redirect') === 'upgrade';
  const isSearchRedirect = searchParams.get('redirect') === 'search';
  const searchQuery = searchParams.get('q') || '';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<UserPlan>(isUpgradeRedirect ? 'PRO' : 'FREE');
  const [investorType, setInvestorType] = useState('Growth & IPO Investor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim()) {
      setError('Please enter your first name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await registerUserAsync({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password.trim(),
        plan: selectedPlan,
      });

      if (!res.success) {
        setError(res.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      if (isSearchRedirect && searchQuery) {
        router.push(`/ipos?q=${encodeURIComponent(searchQuery)}`);
      } else if (isSearchRedirect) {
        router.push('/ipos');
      } else if (isUpgradeRedirect) {
        router.push('/dashboard?upgrade=true');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Connection issue. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg rounded-3xl border border-slate-800/90 bg-[#080e1c]/90 p-8 shadow-2xl backdrop-blur-2xl relative z-10">
      <div className="mb-6 flex flex-col items-center text-center">
        <BrandLogo size="lg" showSubtitle={false} href="/" />
        <h1 className="mt-4 font-heading text-2xl font-black text-white">Create Your Account</h1>
        <p className="mt-1.5 text-xs text-slate-400">Join thousands of investors using 6-Pillar IPO research</p>
      </div>

      {/* Upgrade Notice when redirected */}
      {isUpgradeRedirect && (
        <div className="mb-5 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-3.5 flex items-start gap-2.5">
          <Crown size={18} className="text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-cyan-300">Create Account to Upgrade Pro</p>
            <p className="text-slate-300 mt-0.5">Your account will be created and payment checkout will open immediately.</p>
          </div>
        </div>
      )}

      {/* Search Notice when redirected from homepage search */}
      {isSearchRedirect && (
        <div className="mb-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 flex items-start gap-2.5">
          <Search size={18} className="text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-emerald-300">Create Account to Analyze &quot;{searchQuery || 'IPO/Stock'}&quot;</p>
            <p className="text-slate-300 mt-0.5">Sign up free to access full 6-pillar reality scores and the Gift Point verdict.</p>
          </div>
        </div>
      )}

      {/* Plan Selection Toggle */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setSelectedPlan('FREE')}
          className={`rounded-2xl p-3 text-left border transition ${
            selectedPlan === 'FREE'
              ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-md shadow-emerald-500/20'
              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs flex items-center gap-1 text-emerald-300">
              <Zap size={14} /> Free Starter
            </span>
            <span className="text-[10px] font-extrabold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Free</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Basic IPO dates, bands, &amp; market status</p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedPlan('PRO')}
          className={`rounded-2xl p-3 text-left border transition ${
            selectedPlan === 'PRO'
              ? 'border-cyan-500 bg-cyan-500/15 text-white shadow-md shadow-cyan-500/20'
              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs flex items-center gap-1 text-cyan-300">
              <Crown size={14} /> Pro Investor
            </span>
            <span className="text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">Pro</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1">Full 6-pillar score, DRHP red flags &amp; GMP</p>
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs font-semibold text-rose-300 flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300">First Name</label>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Rohan"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300">Last Name</label>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Sharma"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="rohan.sharma@example.com"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">Primary Investment Style</label>
          <select
            value={investorType}
            onChange={(e) => setInvestorType(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
          >
            <option>Growth &amp; IPO Investor</option>
            <option>Long Term Compounder</option>
            <option>SME &amp; Value Investor</option>
            <option>Wealth Manager / Family Office</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">Set Account Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-3 font-extrabold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              <span>Creating your account...</span>
            </span>
          ) : (
            <>
              <span>
                {isSearchRedirect
                  ? 'Create Account & View Analysis'
                  : isUpgradeRedirect
                  ? 'Create Account & Continue to Payment'
                  : `Create ${selectedPlan === 'PRO' ? 'Pro' : 'Free'} Workspace`}
              </span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link
          href={
            isSearchRedirect
              ? `/login?redirect=search&q=${encodeURIComponent(searchQuery)}`
              : isUpgradeRedirect
              ? '/login?redirect=upgrade'
              : '/login'
          }
          className="font-bold text-cyan-400 hover:underline"
        >
          Sign In
        </Link>
      </div>

      <div className="mt-6 border-t border-slate-800/80 pt-4 flex flex-col items-center gap-1 text-[11px] text-slate-400 text-center">
        <p className="text-[10px] text-slate-500">
          Securities market research tool. <Link href="/disclaimer" className="text-cyan-400 hover:underline">SEBI Disclaimers &amp; Risk Warning</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#030712] p-4 text-slate-100 selection:bg-cyan-500/30 selection:text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,_rgba(16,185,129,0.12),_transparent_70%)] pointer-events-none" />

      <Suspense fallback={<div className="text-white text-sm">Loading...</div>}>
        <RegisterContent />
      </Suspense>
    </main>
  );
}
