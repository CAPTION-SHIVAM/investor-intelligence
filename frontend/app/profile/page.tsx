'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  ShieldCheck,
  Crown,
  Zap,
  Mail,
  Lock,
  Save,
  CheckCircle2,
  LogOut,
  Calendar,
  CreditCard,
  Briefcase,
  Layers,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Clock,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { AppShell } from '../components/app-shell';
import {
  getStoredUser,
  saveUserProfile,
  clearUserProfile,
  getSubscriptionInfo,
  type InvestorUser,
  type UserPlan,
} from '../../lib/user-profile';
import { PaymentModal } from '../components/payment-modal';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<InvestorUser | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [investmentStyle, setInvestmentStyle] = useState('Growth & IPO Investor');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [city, setCity] = useState('Mumbai, India');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Security password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    const current = getStoredUser();
    if (current) {
      setUser(current);
      setFirstName(current.firstName || '');
      setLastName(current.lastName || '');
      setEmail(current.email || '');
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updated = saveUserProfile({
      ...user,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      displayName: `${firstName.trim()} ${lastName.trim()}`.trim(),
    });

    if (updated) {
      setUser(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) return;

    if (user) {
      saveUserProfile({
        ...user,
        password: newPassword,
      });
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPasswordSuccess(false), 3500);
    }
  };

  const handleLogout = () => {
    clearUserProfile();
    setUser(null);
    router.push('/'); // Redirects directly to the homepage
  };

  const isPro = user?.plan === 'PRO' || user?.plan === 'INSTITUTIONAL' || user?.role === 'ADMIN';
  const subInfo = getSubscriptionInfo(user);

  return (
    <AppShell title="Investor Profile & Workspace Settings">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Top Profile Banner */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-[#071124] to-slate-950 p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-cyan-400 via-teal-400 to-emerald-400 text-2xl font-black text-slate-950 shadow-xl shadow-cyan-500/25">
                {user?.initials || 'II'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-2xl font-black text-white">{user?.displayName || 'Investor Member'}</h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-black uppercase tracking-wider ${
                      user?.role === 'ADMIN'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : isPro
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {user?.role === 'ADMIN' ? 'Master Admin' : `${user?.plan} Plan`}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400 flex items-center gap-2">
                  <span>{user?.email}</span>
                  <span>•</span>
                  <span>{city}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {!isPro ? (
                <button
                  onClick={() => setIsPaymentOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:scale-105"
                >
                  <Crown size={15} /> Upgrade to Pro
                </button>
              ) : (
                <span className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck size={15} /> Pro Plan Active
                </span>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
              >
                <LogOut size={15} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pending Payment Verification Banner */}
        {user?.paymentStatus === 'PENDING' && (
          <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-slate-950 to-amber-500/5 p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 animate-pulse">
                  <Clock size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading text-base font-black text-white">
                      UPI Payment Verification in Progress
                    </h4>
                    <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                      Under Review
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Your 12-digit transaction reference for the <strong className="text-cyan-400">{user.pendingPlan || 'PRO'} Membership</strong> has been submitted. Our team is verifying this with bank statements.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPaymentOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition shrink-0"
              >
                <span>Update UTR / Slip</span>
              </button>
            </div>

            {/* Verification Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-amber-500/20 text-xs">
              <div className="rounded-xl bg-slate-950/80 p-2.5 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Submitted UTR:</span>
                <span className="font-mono-code font-bold text-amber-300">{user.utrRef || 'N/A'}</span>
              </div>
              <div className="rounded-xl bg-slate-950/80 p-2.5 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Requested Plan:</span>
                <span className="font-bold text-white uppercase">{user.pendingPlan || 'PRO'}</span>
              </div>
              <div className="rounded-xl bg-slate-950/80 p-2.5 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Amount:</span>
                <span className="font-bold text-emerald-400">₹{user.pendingAmount || 299}</span>
              </div>
              <div className="rounded-xl bg-slate-950/80 p-2.5 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Estimated Time:</span>
                <span className="font-bold text-cyan-300">5 – 15 Mins</span>
              </div>
            </div>
          </div>
        )}

        {/* Rejected Payment Banner if UTR was invalid or unpaid */}
        {user?.paymentStatus === 'REJECTED' && (
          <div className="rounded-3xl border border-rose-500/40 bg-rose-950/30 p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-rose-300">
                  Payment Verification Unsuccessful
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  The submitted reference (<strong className="font-mono-code text-rose-200">{user.utrRef}</strong>) could not be verified in the bank statement: {user.rejectionReason || 'Invalid UTR / Payment not received'}. Please re-submit your valid 12-digit UPI UTR.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-md transition hover:scale-105 shrink-0"
            >
              <RotateCcw size={14} />
              <span>Re-submit Correct UTR</span>
            </button>
          </div>
        )}

        {/* Expired Subscription Banner if 1 month has passed and reverted to Free */}
        {user?.isExpired && (
          <div className="rounded-3xl border border-amber-500/40 bg-amber-950/30 p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-amber-300">
                  Your 1-Month Pro Subscription Has Expired
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Your 30-day validity ended and your account was automatically reverted to the <strong>FREE Starter Plan</strong>. Renew your subscription below to restore all 6-pillar reality scores &amp; DRHP forensics.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-md transition hover:scale-105 shrink-0"
            >
              <RotateCcw size={14} />
              <span>Renew Pro (₹299/mo)</span>
            </button>
          </div>
        )}

        {/* 2-Column Grid: Plan Details & Profile Form */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Subscription & Plan Tier */}
          <div className="space-y-6">
            {/* Subscription Card with 30-Day Validity & Expiry Countdown */}
            <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-lg">
              <h3 className="font-heading text-base font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-cyan-400" />
                <span>Membership &amp; Validity</span>
              </h3>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-950 p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-400 font-semibold">Current Plan</span>
                  <span className="font-bold text-xs text-white uppercase">{user?.plan} Membership</span>
                </div>
                <p className="font-heading text-2xl font-black text-white mt-2">
                  {user?.plan === 'PRO' ? '₹299 / month' : user?.plan === 'INSTITUTIONAL' ? '₹799 / month' : '₹0 / Free Starter'}
                </p>

                {/* Expiry / Days Remaining */}
                <div className="mt-3 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-cyan-400" /> Validity:
                    </span>
                    <strong className={subInfo.isActivePro ? 'text-emerald-400' : 'text-slate-400'}>
                      {subInfo.statusText}
                    </strong>
                  </div>

                  {subInfo.isActivePro && user?.role !== 'ADMIN' && (
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>30-Day Month Cycle</span>
                        <span>{subInfo.daysLeft} days left</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                          style={{ width: `${Math.min(100, Math.round((subInfo.daysLeft / 30) * 100))}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span>Real SEBI DRHP Market Intelligence</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span>Institutional Trading Journal (`/journal`)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span>The Gift Point Verdict Summaries</span>
                </div>
                {isPro && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>6-Pillar IPO Reality Score Breakdown</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Hidden DRHP Forensic Red Flag Radar</span>
                    </div>
                  </>
                )}
              </div>

              {!isPro ? (
                <button
                  onClick={() => setIsPaymentOpen(true)}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-2.5 text-xs font-black text-slate-950 shadow-md transition hover:scale-105"
                >
                  {user?.isExpired ? 'Renew 1-Month Pro (₹299)' : 'Upgrade to Pro (Instant UPI)'}
                </button>
              ) : (
                <button
                  onClick={() => setIsPaymentOpen(true)}
                  className="mt-6 w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
                >
                  Extend Subscription / Invoices
                </button>
              )}
            </div>

            {/* Quick Links Card */}
            <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-lg">
              <h3 className="font-heading text-base font-bold text-white mb-3 flex items-center gap-2">
                <Layers size={18} className="text-emerald-400" />
                <span>Quick Access</span>
              </h3>
              <div className="space-y-2 text-xs">
                <Link
                  href="/journal"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-300 hover:border-cyan-500/40 hover:text-white transition"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <Sparkles size={14} className="text-cyan-400" /> Trading Journal (NEW)
                  </span>
                  <ArrowUpRight size={14} className="text-slate-500" />
                </Link>
                <Link
                  href="/ipos"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-300 hover:border-cyan-500/40 hover:text-white transition"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <TrendingUp size={14} className="text-cyan-400" /> IPO Radar &amp; Verdicts
                  </span>
                  <ArrowUpRight size={14} className="text-slate-500" />
                </Link>
                <Link
                  href="/screener"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-300 hover:border-cyan-500/40 hover:text-white transition"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <Briefcase size={14} className="text-emerald-400" /> Fundamental Screener
                  </span>
                  <ArrowUpRight size={14} className="text-slate-500" />
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="flex items-center justify-between rounded-xl border border-purple-500/30 bg-purple-950/20 p-3 text-purple-300 hover:border-purple-500 hover:text-white transition"
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      <Sparkles size={14} className="text-purple-400" /> Master Admin Console
                    </span>
                    <ArrowUpRight size={14} className="text-purple-400" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Edit Profile & Password Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Edit Profile Details */}
            <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 md:p-8 shadow-lg">
              <h3 className="font-heading text-lg font-bold text-white mb-1 flex items-center gap-2">
                <User size={18} className="text-cyan-400" />
                <span>Personal Account Information</span>
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Update your name, contact email, and workspace preferences.
              </p>

              {saveSuccess && (
                <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Profile details updated and saved successfully!</span>
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Primary Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 pl-10 text-white focus:border-cyan-400 focus:outline-none"
                    />
                    <Mail size={16} className="absolute left-3.5 top-3 text-slate-500" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">Investment Style</label>
                    <select
                      value={investmentStyle}
                      onChange={(e) => setInvestmentStyle(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option>Growth &amp; IPO Compounder</option>
                      <option>Listing Gains Specialist</option>
                      <option>Value &amp; High ROCE Investor</option>
                      <option>F&amp;O Momentum Trader</option>
                      <option>Long Term Family Office</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">Location / City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:bg-cyan-400"
                  >
                    <Save size={14} />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Security & Password Settings */}
            <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 md:p-8 shadow-lg">
              <h3 className="font-heading text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Lock size={18} className="text-emerald-400" />
                <span>Security &amp; Password</span>
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Change your account password to protect your investment research and custom thesis notes.
              </p>

              {passwordSuccess && (
                <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Password updated successfully!</span>
                </div>
              )}

              <form onSubmit={handlePasswordUpdate} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs font-bold text-slate-200 shadow-md transition hover:bg-slate-800 hover:text-white"
                  >
                    <Lock size={14} />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Global Payment / Upgrade Modal */}
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          initialPlan={user?.plan === 'FREE' ? 'PRO' : user?.plan}
          onSuccess={() => {
            const fresh = getStoredUser();
            setUser(fresh);
          }}
        />
      </div>
    </AppShell>
  );
}
