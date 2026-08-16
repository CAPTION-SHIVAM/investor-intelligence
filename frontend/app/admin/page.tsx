'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  PlusCircle,
  Edit,
  Trash2,
  Save,
  X,
  TrendingUp,
  Award,
  AlertTriangle,
  Eye,
  Gift,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Database,
  CreditCard,
  QrCode,
  Building,
  Copy,
  Users,
  UserCheck,
  Zap,
  Crown,
  Search,
  UserX,
  ArrowUpRight,
  TrendingDown,
  Clock,
} from 'lucide-react';
import { AppShell } from '../components/app-shell';
import { fetchJson, postJson, putJson, deleteJson } from '../../lib/api';
import {
  getStoredUser,
  saveUserProfile,
  getRegisteredUsers,
  adminUpdateUserPlan,
  adminDeleteUser,
  getSubscriptionInfo,
  type InvestorUser,
  type UserPlan,
} from '../../lib/user-profile';
import { isMasterAdmin, MASTER_ADMIN } from '../../lib/admin-auth';
import { getPaymentConfig, savePaymentConfig, type PaymentConfigType, PAYMENT_CONFIG } from '../../lib/payment-config';

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
  verdict_badge: string;
  summary: string;
  gift_point?: {
    verdict_action: string;
    decisive_reason: string;
    target_investor: string;
  };
  main_features?: string[];
  disadvantages?: string[];
  what_retail_misses?: string[];
};

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<InvestorUser | null>(null);
  const [ipos, setIpos] = useState<IpoItem[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<InvestorUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab State: IPOS, USERS, PAYMENT
  const [adminTab, setAdminTab] = useState<'IPOS' | 'USERS' | 'PAYMENT'>('USERS');

  // User Filter State
  const [userFilter, setUserFilter] = useState<'ALL' | 'PAID' | 'FREE'>('ALL');
  const [userSearch, setUserSearch] = useState('');

  // Admin Auth State
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [authError, setAuthError] = useState('');

  // Payment Config State
  const [paymentConfig, setPaymentConfigState] = useState<PaymentConfigType>(getPaymentConfig());
  const [paymentSaveMsg, setPaymentSaveMsg] = useState(false);

  // Modal / Editor State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIpo, setEditingIpo] = useState<IpoItem | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Form Fields
  const [formSymbol, setFormSymbol] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formType, setFormType] = useState('Mainboard');
  const [formStatus, setFormStatus] = useState('OPEN');
  const [formPriceBand, setFormPriceBand] = useState('₹450 - ₹480');
  const [formIssueSize, setFormIssueSize] = useState('₹2,500 Cr');
  const [formLotSize, setFormLotSize] = useState(30);
  const [formOpenDate, setFormOpenDate] = useState('2026-08-20');
  const [formCloseDate, setFormCloseDate] = useState('2026-08-24');
  const [formListingDate, setFormListingDate] = useState('2026-08-30');
  const [formGmp, setFormGmp] = useState('₹45 (+10.0%)');
  const [formGmpPct, setFormGmpPct] = useState(10.0);
  const [formSubTimes, setFormSubTimes] = useState('3.5x');
  const [formQibSub, setFormQibSub] = useState('5.2x');
  const [formNiiSub, setFormNiiSub] = useState('2.1x');
  const [formRetailSub, setFormRetailSub] = useState('1.8x');
  const [formScore, setFormScore] = useState(82);
  const [formVerdict, setFormVerdict] = useState('APPLY (Growth)');
  const [formBadge, setFormBadge] = useState('Apply · High Quality Market Leader');
  const [formSummary, setFormSummary] = useState('');

  // 4-Pillar Detailed Fields
  const [formGiftAction, setFormGiftAction] = useState('APPLY FOR LONG TERM');
  const [formGiftReason, setFormGiftReason] = useState('High ROCE business with dominant market share in primary sector.');
  const [formGiftTarget, setFormGiftTarget] = useState('Growth & Compounder Investors');
  const [formFeature1, setFormFeature1] = useState('Market leadership with strong brand equity');
  const [formFeature2, setFormFeature2] = useState('High EBITDA margins and operating cash flow');
  const [formFeature3, setFormFeature3] = useState('Expanding customer base and order book');
  const [formDisadv1, setFormDisadv1] = useState('Competitive pricing pressure from established peers');
  const [formDisadv2, setFormDisadv2] = useState('Offer for sale (OFS) secondary dilution');
  const [formMissed1, setFormMissed1] = useState('Unit economics break-even curve accelerating in key metros');
  const [formMissed2, setFormMissed2] = useState('Anchor lock-in expiry scheduled for 30 days post-listing');

  useEffect(() => {
    const current = getStoredUser();
    setUser(current);
    setPaymentConfigState(getPaymentConfig());
    loadIpos();
    loadUsers();
  }, []);

  const loadIpos = async () => {
    setLoading(true);
    try {
      const res = await fetchJson<{ success: boolean; data: IpoItem[] }>('/ipos');
      if (res.data) {
        setIpos(res.data);
      }
    } catch (err) {
      console.error('Failed to load IPOs in admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = () => {
    setRegisteredUsers(getRegisteredUsers());
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (isMasterAdmin(adminUser, adminPass)) {
      const adminProfile = saveUserProfile({
        firstName: 'Master',
        lastName: 'Admin',
        email: 'admin@investorintelligence.com',
        displayName: 'Master Admin',
        role: 'ADMIN',
        plan: 'PRO',
      });
      setUser(adminProfile);
      loadIpos();
      loadUsers();
    } else {
      setAuthError('Invalid Master Admin credentials. Username: admin, Password: admin123 or admin@123');
    }
  };

  const handlePaymentConfigSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = savePaymentConfig(paymentConfig);
    setPaymentConfigState(updated);
    setPaymentSaveMsg(true);
    setTimeout(() => setPaymentSaveMsg(false), 3500);
  };

  // User Actions
  const handleUpdateUserPlan = (email: string, newPlan: UserPlan) => {
    const ok = adminUpdateUserPlan(email, newPlan);
    if (ok) {
      loadUsers();
      setSaveSuccess(`Updated user (${email}) plan to ${newPlan}.`);
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  const handleDeleteUser = (email: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user account "${name}" (${email})?`)) return;
    const ok = adminDeleteUser(email);
    if (ok) {
      loadUsers();
      setSaveSuccess(`Deleted user account (${email}).`);
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  const handleOpenAddModal = () => {
    setEditingIpo(null);
    setFormSymbol('');
    setFormCompany('');
    setFormType('Mainboard');
    setFormStatus('OPEN');
    setFormPriceBand('₹450 - ₹480');
    setFormIssueSize('₹2,500 Cr');
    setFormLotSize(30);
    setFormOpenDate('2026-08-20');
    setFormCloseDate('2026-08-24');
    setFormListingDate('2026-08-30');
    setFormGmp('₹45 (+10.0%)');
    setFormGmpPct(10.0);
    setFormSubTimes('3.5x');
    setFormQibSub('5.2x');
    setFormNiiSub('2.1x');
    setFormRetailSub('1.8x');
    setFormScore(82);
    setFormVerdict('APPLY (Growth)');
    setFormBadge('Apply · High Quality Market Leader');
    setFormSummary('');
    setFormGiftAction('APPLY FOR LONG TERM');
    setFormGiftReason('High ROCE business with dominant market share in primary sector.');
    setFormGiftTarget('Growth & Compounder Investors');
    setFormFeature1('Market leadership with strong brand equity');
    setFormFeature2('High EBITDA margins and operating cash flow');
    setFormFeature3('Expanding customer base and order book');
    setFormDisadv1('Competitive pricing pressure from established peers');
    setFormDisadv2('Offer for sale (OFS) secondary dilution');
    setFormMissed1('Unit economics break-even curve accelerating in key metros');
    setFormMissed2('Anchor lock-in expiry scheduled for 30 days post-listing');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ipo: IpoItem) => {
    setEditingIpo(ipo);
    setFormSymbol(ipo.symbol);
    setFormCompany(ipo.company);
    setFormType(ipo.type);
    setFormStatus(ipo.status);
    setFormPriceBand(ipo.price_band);
    setFormIssueSize(ipo.issue_size);
    setFormLotSize(ipo.lot_size);
    setFormOpenDate(ipo.open_date);
    setFormCloseDate(ipo.close_date);
    setFormListingDate(ipo.listing_date);
    setFormGmp(ipo.gmp);
    setFormGmpPct(ipo.gmp_pct);
    setFormSubTimes(ipo.subscription_times);
    setFormQibSub(ipo.qib_sub);
    setFormNiiSub(ipo.nii_sub);
    setFormRetailSub(ipo.retail_sub);
    setFormScore(ipo.reality_score);
    setFormVerdict(ipo.verdict);
    setFormBadge(ipo.verdict_badge);
    setFormSummary(ipo.summary);

    if (ipo.gift_point) {
      setFormGiftAction(ipo.gift_point.verdict_action);
      setFormGiftReason(ipo.gift_point.decisive_reason);
      setFormGiftTarget(ipo.gift_point.target_investor);
    }
    if (ipo.main_features) {
      setFormFeature1(ipo.main_features[0] || '');
      setFormFeature2(ipo.main_features[1] || '');
      setFormFeature3(ipo.main_features[2] || '');
    }
    if (ipo.disadvantages) {
      setFormDisadv1(ipo.disadvantages[0] || '');
      setFormDisadv2(ipo.disadvantages[1] || '');
    }
    if (ipo.what_retail_misses) {
      setFormMissed1(ipo.what_retail_misses[0] || '');
      setFormMissed2(ipo.what_retail_misses[1] || '');
    }
    setIsModalOpen(true);
  };

  const handleSaveIpo = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      symbol: formSymbol.toUpperCase(),
      company: formCompany,
      type: formType,
      status: formStatus,
      price_band: formPriceBand,
      issue_size: formIssueSize,
      lot_size: Number(formLotSize),
      open_date: formOpenDate,
      close_date: formCloseDate,
      listing_date: formListingDate,
      gmp: formGmp,
      gmp_pct: Number(formGmpPct),
      subscription_times: formSubTimes,
      qib_sub: formQibSub,
      nii_sub: formNiiSub,
      retail_sub: formRetailSub,
      reality_score: Number(formScore),
      verdict: formVerdict,
      verdict_badge: formBadge,
      summary: formSummary,
      gift_point: {
        verdict_action: formGiftAction,
        decisive_reason: formGiftReason,
        target_investor: formGiftTarget,
      },
      main_features: [formFeature1, formFeature2, formFeature3].filter(Boolean),
      disadvantages: [formDisadv1, formDisadv2].filter(Boolean),
      what_retail_misses: [formMissed1, formMissed2].filter(Boolean),
    };

    try {
      if (editingIpo) {
        await putJson(`/ipos/${editingIpo.id}`, payload);
        setSaveSuccess(`IPO ${payload.symbol} updated successfully!`);
      } else {
        await postJson('/ipos', payload);
        setSaveSuccess(`New IPO ${payload.symbol} created and published live!`);
      }
      setIsModalOpen(false);
      loadIpos();
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to save IPO:', err);
      alert('Failed to save IPO record. Please check backend status.');
    }
  };

  const handleDeleteIpo = async (id: string, symbol: string) => {
    if (!confirm(`Are you sure you want to delete ${symbol} from the active database?`)) return;

    try {
      await deleteJson(`/ipos/${id}`);
      setSaveSuccess(`IPO ${symbol} removed from database.`);
      loadIpos();
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to delete IPO:', err);
      alert('Failed to delete IPO.');
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  // Analytics Computation for Users & Subscriptions
  const totalUsersCount = registeredUsers.length;
  const paidProCount = registeredUsers.filter((u) => u.plan === 'PRO').length;
  const paidInstCount = registeredUsers.filter((u) => u.plan === 'INSTITUTIONAL').length;
  const totalPaidCount = paidProCount + paidInstCount;
  const freeUsersCount = registeredUsers.filter((u) => u.plan === 'FREE').length;
  const conversionRate = totalUsersCount > 0 ? Math.round((totalPaidCount / totalUsersCount) * 100) : 0;
  const estMrr = (paidProCount * paymentConfig.monthlyPrice) + (paidInstCount * 799);

  // Filtered Users List
  const filteredUsers = registeredUsers.filter((u) => {
    const matchesFilter =
      userFilter === 'ALL'
        ? true
        : userFilter === 'PAID'
        ? u.plan === 'PRO' || u.plan === 'INSTITUTIONAL'
        : u.plan === 'FREE';

    const matchesSearch =
      !userSearch.trim() ||
      u.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.utrRef && u.utrRef.toLowerCase().includes(userSearch.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <AppShell title="Master Admin Database & Gateway Management">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Admin Header */}
        <div className="rounded-3xl border border-purple-500/40 bg-gradient-to-r from-slate-950 via-purple-950/20 to-slate-950 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Database size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-xl font-black text-white">Master Administration Portal</h2>
                <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-black text-purple-300 border border-purple-500/30">
                  ROOT ACCESS
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-400">
                Manage live IPO database records, users &amp; free/paid subscriptions, and UPI payment acceptance gateway.
              </p>
            </div>
          </div>

          {isAdmin && (
            <div className="flex flex-wrap items-center gap-2.5">
              {/* 3 Tabs Switcher */}
              <div className="inline-flex rounded-2xl border border-slate-800 bg-slate-900 p-1">
                <button
                  onClick={() => setAdminTab('USERS')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    adminTab === 'USERS' ? 'bg-cyan-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users size={13} />
                  <span>Users &amp; Subscriptions ({registeredUsers.length})</span>
                </button>
                <button
                  onClick={() => setAdminTab('IPOS')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    adminTab === 'IPOS' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Database size={13} />
                  <span>IPO Database ({ipos.length})</span>
                </button>
                <button
                  onClick={() => setAdminTab('PAYMENT')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    adminTab === 'PAYMENT' ? 'bg-emerald-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode size={13} />
                  <span>UPI &amp; Bank Settings</span>
                </button>
              </div>

              {adminTab === 'IPOS' && (
                <button
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-3.5 py-1.5 text-xs font-extrabold text-slate-950 shadow-md transition hover:scale-105"
                >
                  <PlusCircle size={14} />
                  <span>Add IPO</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs font-bold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Master Admin Login Gate if not authenticated */}
        {!isAdmin ? (
          <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 mb-4">
              <Lock size={24} />
            </div>
            <h3 className="font-heading text-xl font-bold text-white">Master Admin Authentication</h3>
            <p className="mt-1 text-xs text-slate-400">
              Enter master credentials (user: <strong className="text-white">admin</strong> / pass: <strong className="text-white">admin123</strong>) to access database controls.
            </p>

            <form onSubmit={handleAdminLogin} className="mt-6 space-y-4 text-left">
              {authError && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-300">
                  {authError}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Username</label>
                <input
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  placeholder="admin"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Master Password</label>
                <input
                  type="password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="admin123"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-2.5 text-xs font-black text-slate-950 shadow-md transition hover:scale-105"
              >
                Sign In as Master Admin
              </button>
            </form>
          </div>
        ) : adminTab === 'USERS' ? (
          /* ========================================================================= */
          /* TAB 1: USERS & SUBSCRIPTION MANAGEMENT SECTION (FREE VS PAID BREAKDOWN) */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* KPI Analytics Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1: Total Users */}
              <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Total Registered Users</span>
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                    <Users size={18} />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-black text-white">{totalUsersCount}</span>
                  <span className="text-xs font-bold text-slate-400">Accounts</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Active accounts in database</p>
              </div>

              {/* Card 2: Free Starter Plan */}
              <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Free Starter Users</span>
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
                    <Zap size={18} />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-black text-slate-200">{freeUsersCount}</span>
                  <span className="text-xs font-bold text-slate-400">Free Logins</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Viewing basic calendar &amp; bands</p>
              </div>

              {/* Card 3: Paid Pro Subscribers */}
              <div className="rounded-3xl border border-cyan-500/30 bg-[#070d19] p-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-300">Paid Subscribers</span>
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    <Crown size={18} />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-black text-cyan-400">{totalPaidCount}</span>
                  <span className="text-xs font-bold text-cyan-300">Paid Plans</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  {paidProCount} Pro (₹{paymentConfig.monthlyPrice}/mo) · {paidInstCount} VIP
                </p>
              </div>

              {/* Card 4: Est. MRR & Conversion */}
              <div className="rounded-3xl border border-emerald-500/30 bg-[#070d19] p-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-300">Est. Monthly Revenue</span>
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CreditCard size={18} />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-black text-emerald-400">₹{estMrr.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] font-black bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded">
                    {conversionRate}% CONV
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Direct to your UPI / HDFC A/C</p>
              </div>
            </div>

            {/* Users Table Card */}
            <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                    <Users size={20} className="text-cyan-400" />
                    <span>Registered User Accounts &amp; Subscription Details</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live breakdown of Free vs Paid accounts, verified UPI UTR references, and plan overrides.
                  </p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900 p-1">
                    <button
                      onClick={() => setUserFilter('ALL')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                        userFilter === 'ALL' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All ({totalUsersCount})
                    </button>
                    <button
                      onClick={() => setUserFilter('PAID')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                        userFilter === 'PAID' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Paid Only ({totalPaidCount})
                    </button>
                    <button
                      onClick={() => setUserFilter('FREE')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                        userFilter === 'FREE' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Free Only ({freeUsersCount})
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search user or UTR..."
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
                      <th className="px-4 py-3">User &amp; Email</th>
                      <th className="px-3 py-3">Subscription Plan</th>
                      <th className="px-3 py-3">1-Month Validity &amp; Expiry</th>
                      <th className="px-3 py-3">Payment Reference (UTR)</th>
                      <th className="px-3 py-3">Joined Date</th>
                      <th className="px-3 py-3">Last Active</th>
                      <th className="px-4 py-3 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.map((u) => {
                      const isPaid = u.plan === 'PRO' || u.plan === 'INSTITUTIONAL';
                      const sub = getSubscriptionInfo(u);

                      return (
                        <tr key={u.email} className="hover:bg-slate-900/60 transition">
                          {/* User Name & Email */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                                  isPaid
                                    ? 'bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 shadow-sm'
                                    : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {u.initials || 'U'}
                              </div>
                              <div>
                                <span className="font-bold text-white block">{u.displayName}</span>
                                <span className="text-[11px] text-slate-400">{u.email}</span>
                              </div>
                            </div>
                          </td>

                          {/* Plan Status Badge */}
                          <td className="px-3 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                                u.plan === 'PRO'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                  : u.plan === 'INSTITUTIONAL'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {u.plan === 'PRO' ? (
                                <Crown size={11} className="text-cyan-400" />
                              ) : u.plan === 'INSTITUTIONAL' ? (
                                <Sparkles size={11} className="text-purple-400" />
                              ) : (
                                <Zap size={11} className="text-slate-400" />
                              )}
                              <span>{u.plan}</span>
                            </span>
                          </td>

                          {/* 1-Month Validity & Expiry */}
                          <td className="px-3 py-3.5">
                            {u.role === 'ADMIN' ? (
                              <span className="text-purple-400 font-bold text-[11px]">Lifetime Root Access</span>
                            ) : isPaid ? (
                              <div>
                                <span className="font-bold text-emerald-400 flex items-center gap-1">
                                  <Clock size={11} /> {sub.daysLeft}d left
                                </span>
                                <span className="text-[10px] text-slate-400 block font-mono-code">
                                  Expires {sub.formattedExpiryDate}
                                </span>
                              </div>
                            ) : u.isExpired ? (
                              <div>
                                <span className="rounded bg-rose-950/60 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 text-[10px] font-black uppercase">
                                  EXPIRED (Free Reverted)
                                </span>
                                <span className="text-[10px] text-slate-500 block mt-0.5">
                                  Ended {sub.formattedExpiryDate}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-[11px]">Free Account (No Expiry)</span>
                            )}
                          </td>

                          {/* Payment Reference / UTR */}
                          <td className="px-3 py-3.5">
                            {u.utrRef ? (
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono-code font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                                  {u.utrRef}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-[11px]">Free Account (No Payment)</span>
                            )}
                          </td>

                          {/* Joined Date */}
                          <td className="px-3 py-3.5 text-slate-300 font-mono-code">{u.joinedDate || '2026-08-16'}</td>

                          {/* Last Active */}
                          <td className="px-3 py-3.5 text-slate-400">{u.lastLogin || 'Today'}</td>

                          {/* Admin Action Buttons */}
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {u.plan === 'FREE' ? (
                                <button
                                  onClick={() => handleUpdateUserPlan(u.email, 'PRO')}
                                  className="rounded-lg bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-1 text-[11px] font-bold text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition"
                                  title="Grant 1-Month PRO Access"
                                >
                                  + Grant PRO
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateUserPlan(u.email, 'FREE')}
                                  className="rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:bg-rose-500/20 hover:text-rose-300 transition"
                                  title="Downgrade to Free"
                                >
                                  Set Free
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteUser(u.email, u.displayName)}
                                className="rounded-lg bg-slate-800 p-1.5 text-rose-400 hover:bg-rose-500 hover:text-white transition"
                                title="Delete Account"
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
          </div>
        ) : adminTab === 'PAYMENT' ? (
          /* ========================================================================= */
          /* TAB 3: UPI PAYMENT, BANK ACCOUNT & QR CODE SETTINGS PANEL */
          /* ========================================================================= */
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Form Inputs (7 Cols) */}
            <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-[#070d19] p-6 md:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                    <QrCode size={20} className="text-cyan-400" />
                    <span>UPI &amp; Bank Account Settings</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure your UPI ID, Merchant Name, and Bank Details to receive payments.
                  </p>
                </div>
              </div>

              {paymentSaveMsg && (
                <div className="mb-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-3.5 text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Payment Gateway &amp; UPI QR details saved live across the entire website!</span>
                </div>
              )}

              <form onSubmit={handlePaymentConfigSave} className="space-y-4 text-xs">
                {/* 1. UPI ID */}
                <div>
                  <label className="block font-bold text-cyan-300 mb-1">
                    Your UPI ID / VPA (GPay / PhonePe / Paytm / BHIM)
                  </label>
                  <input
                    required
                    value={paymentConfig.upiId}
                    onChange={(e) => setPaymentConfigState({ ...paymentConfig, upiId: e.target.value.trim() })}
                    placeholder="e.g. investor.shivam5049@ybl"
                    className="w-full rounded-xl border border-cyan-500/40 bg-slate-950 px-3.5 py-2.5 text-white font-mono-code font-bold text-sm focus:border-cyan-400 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Payments from users scanning the QR will go directly to this UPI ID.</p>
                </div>

                {/* 2. Merchant Name */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Business / Account Holder Name (Payee Name)
                  </label>
                  <input
                    required
                    value={paymentConfig.merchantName}
                    onChange={(e) => setPaymentConfigState({ ...paymentConfig, merchantName: e.target.value })}
                    placeholder="e.g. Investor Intelligence Research Inc"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* 3. Bank Account Details */}
                <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Bank Name</label>
                    <input
                      value={paymentConfig.bankName}
                      onChange={(e) => setPaymentConfigState({ ...paymentConfig, bankName: e.target.value })}
                      placeholder="e.g. HDFC Bank"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Account Number</label>
                    <input
                      value={paymentConfig.accountNumber}
                      onChange={(e) => setPaymentConfigState({ ...paymentConfig, accountNumber: e.target.value })}
                      placeholder="e.g. 50100419751029"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-cyan-400 focus:outline-none font-mono-code"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">IFSC Code</label>
                    <input
                      value={paymentConfig.ifscCode}
                      onChange={(e) => setPaymentConfigState({ ...paymentConfig, ifscCode: e.target.value.toUpperCase() })}
                      placeholder="e.g. HDFC0001882"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-cyan-400 focus:outline-none font-mono-code uppercase"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Support Billing Email</label>
                    <input
                      value={paymentConfig.supportEmail}
                      onChange={(e) => setPaymentConfigState({ ...paymentConfig, supportEmail: e.target.value })}
                      placeholder="billing@investorintelligence.in"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 4. Pricing Controls */}
                <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Monthly Pro Price (₹)</label>
                    <input
                      type="number"
                      value={paymentConfig.monthlyPrice}
                      onChange={(e) => setPaymentConfigState({ ...paymentConfig, monthlyPrice: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-cyan-400 focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Annual Pro Price (₹)</label>
                    <input
                      type="number"
                      value={paymentConfig.annualPrice}
                      onChange={(e) => setPaymentConfigState({ ...paymentConfig, annualPrice: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-cyan-400 focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 font-extrabold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:scale-105"
                  >
                    <Save size={16} />
                    <span>Save Payment Gateway Configuration</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Live QR Code & Checkout Preview (5 Cols) */}
            <div className="lg:col-span-5 rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 via-[#070d19] to-slate-950 p-6 md:p-8 shadow-xl flex flex-col justify-between">
              <div>
                <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                  Live QR Code Preview
                </span>
                <h4 className="font-heading text-lg font-bold text-white mt-2">What Users See on Checkout</h4>
                <p className="text-xs text-slate-400 mt-1">
                  This dynamic QR code updates in real-time with your configured UPI ID.
                </p>

                {/* Real Dynamic QR Code */}
                <div className="my-6 mx-auto h-48 w-48 rounded-3xl bg-white p-3 shadow-2xl flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                      `upi://pay?pa=${paymentConfig.upiId}&pn=${encodeURIComponent(paymentConfig.merchantName)}&am=${paymentConfig.monthlyPrice}&cu=INR&tn=Pro%20Subscription`
                    )}&margin=10`}
                    alt="Live UPI QR Code Preview"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target UPI ID:</span>
                    <span className="font-mono-code font-bold text-cyan-400">{paymentConfig.upiId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Merchant Name:</span>
                    <span className="font-bold text-white">{paymentConfig.merchantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pro Price:</span>
                    <span className="font-bold text-emerald-400">₹{paymentConfig.monthlyPrice}/mo · ₹{paymentConfig.annualPrice}/yr</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <span>NPCI UPI Intent 2.0 &amp; Static/Dynamic VPA compliant.</span>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* TAB 2: IPO MANAGEMENT TABLE */
          /* ========================================================================= */
          <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-white">Active IPO Database Records</h3>
                <p className="text-xs text-slate-400">Total Live Records: {ipos.length}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Symbol &amp; Company</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Price Band</th>
                    <th className="px-3 py-3">GMP</th>
                    <th className="px-3 py-3">Subscription</th>
                    <th className="px-3 py-3 text-center">Score</th>
                    <th className="px-3 py-3 text-center">Verdict</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {ipos.map((ipo) => (
                    <tr key={ipo.id} className="hover:bg-slate-900/60 transition">
                      <td className="px-4 py-3">
                        <span className="font-bold text-white">{ipo.symbol}</span>
                        <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{ipo.company}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            ipo.status === 'OPEN'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : ipo.status === 'UPCOMING'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {ipo.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-200">{ipo.price_band}</td>
                      <td className="px-3 py-3 font-bold text-emerald-400">{ipo.gmp}</td>
                      <td className="px-3 py-3 text-slate-300">{ipo.subscription_times}</td>
                      <td className="px-3 py-3 text-center">
                        <span className="font-extrabold text-cyan-400">{ipo.reality_score}/100</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                          {ipo.verdict}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(ipo)}
                            className="rounded-lg bg-slate-800 p-1.5 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition"
                            title="Edit IPO"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteIpo(ipo.id, ipo.symbol)}
                            className="rounded-lg bg-slate-800 p-1.5 text-rose-400 hover:bg-rose-500 hover:text-white transition"
                            title="Delete IPO"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Full Add / Edit IPO Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-3xl rounded-3xl border border-slate-700 bg-[#080e1c] p-6 md:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase mb-1">
                <Database size={15} />
                <span>{editingIpo ? `Editing ${editingIpo.symbol}` : 'Add New IPO Record'}</span>
              </div>
              <h3 className="font-heading text-xl font-black text-white">
                {editingIpo ? `Update ${editingIpo.company}` : 'Publish New Mainboard/SME IPO'}
              </h3>

              <form onSubmit={handleSaveIpo} className="mt-6 space-y-4 text-xs">
                {/* 1. Basic Metadata */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Symbol (e.g. SWIGGY)</label>
                    <input
                      required
                      value={formSymbol}
                      onChange={(e) => setFormSymbol(e.target.value.toUpperCase())}
                      placeholder="SWIGGY"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-300 mb-1">Company Full Name</label>
                    <input
                      required
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      placeholder="Swiggy Limited"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Issue Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    >
                      <option>Mainboard</option>
                      <option>SME</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="UPCOMING">UPCOMING</option>
                      <option value="LISTED">LISTED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Price Band</label>
                    <input
                      value={formPriceBand}
                      onChange={(e) => setFormPriceBand(e.target.value)}
                      placeholder="₹371 - ₹390"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Lot Size</label>
                    <input
                      type="number"
                      value={formLotSize}
                      onChange={(e) => setFormLotSize(Number(e.target.value))}
                      placeholder="38"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    />
                  </div>
                </div>

                {/* 2. GMP & Score */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Live GMP Text</label>
                    <input
                      value={formGmp}
                      onChange={(e) => setFormGmp(e.target.value)}
                      placeholder="+₹28 (+7.2%)"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-bold text-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">GMP Percentage (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formGmpPct}
                      onChange={(e) => setFormGmpPct(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Reality Score ({formScore}/100)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formScore}
                      onChange={(e) => setFormScore(Number(e.target.value))}
                      className="w-full accent-cyan-400 mt-2"
                    />
                  </div>
                </div>

                {/* 3. The Gift Point Verdict */}
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-3">
                  <p className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Gift size={14} /> The Gift Point Configuration
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Verdict Action</label>
                      <input
                        value={formGiftAction}
                        onChange={(e) => setFormGiftAction(e.target.value)}
                        placeholder="APPLY FOR LISTING GAINS / AVOID"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Target Investor Category</label>
                      <input
                        value={formGiftTarget}
                        onChange={(e) => setFormGiftTarget(e.target.value)}
                        placeholder="Growth & High Risk Compounders"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">The Decisive Reason (The Gift Point)</label>
                    <textarea
                      rows={2}
                      value={formGiftReason}
                      onChange={(e) => setFormGiftReason(e.target.value)}
                      placeholder="Duopoly with 90% market share and dark stores breaking even in 10 months."
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    />
                  </div>
                </div>

                {/* 4. Features & Red Flags */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-semibold text-emerald-300 mb-1">Main Feature / Moat 1</label>
                    <input
                      value={formFeature1}
                      onChange={(e) => setFormFeature1(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-rose-300 mb-1">Key Disadvantage / Risk 1</label>
                    <input
                      value={formDisadv1}
                      onChange={(e) => setFormDisadv1(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-purple-300 mb-1">What Retail Missed (DRHP Detail)</label>
                  <input
                    value={formMissed1}
                    onChange={(e) => setFormMissed1(e.target.value)}
                    placeholder="Dark store contribution margin turns positive past 1,100 daily orders."
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
                    {editingIpo ? 'Save IPO Updates' : 'Publish Live IPO'}
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
