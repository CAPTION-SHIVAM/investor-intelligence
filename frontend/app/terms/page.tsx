'use client';

import Link from 'next/link';
import { FileText, ArrowLeft, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from '../components/brand-logo';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-white pb-20">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#030712]/90 backdrop-blur-xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <BrandLogo size="sm" href="/" />
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold text-cyan-300">
            <FileText size={14} />
            <span>User Agreement &amp; Platform Terms</span>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-black text-white sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Governing the use of Investor Intelligence analytical software and subscription services.
          </p>
        </div>

        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-6">
            <h3 className="font-heading text-base font-bold text-white mb-2">1. Nature of the Service</h3>
            <p>
              Investor Intelligence provides quantitative IPO reality scoring, fundamental data screening, prospectus forensics, and financial tool calculators for educational and personal research purposes. By accessing or registering an account, you acknowledge that our software does not constitute portfolio management, investment advice, or brokerage services.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-6">
            <h3 className="font-heading text-base font-bold text-white mb-2">2. Subscriptions &amp; Payments</h3>
            <p>
              Pro Investor and Institutional tier subscriptions are processed via authorized Indian payment gateways (UPI, Cards, NetBanking). Subscriptions grant access to enhanced data tools and real-time alerts. Upgrades are activated immediately upon payment receipt.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-6">
            <h3 className="font-heading text-base font-bold text-white mb-2">3. User Responsibility</h3>
            <p>
              You agree not to reverse engineer, scrape at abusive volume, or redistribute proprietary scoring models without express commercial authorization. All investment bids and portfolio actions remain your sole responsibility.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-6">
            <h3 className="font-heading text-base font-bold text-white mb-2">4. Dispute Resolution &amp; Governing Law</h3>
            <p>
              These Terms shall be governed by the substantive laws of India. Any legal dispute or proceeding relating to the platform shall be subject to the exclusive jurisdiction of the courts located in India.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:scale-105 transition"
          >
            <ArrowLeft size={14} /> Return to Platform
          </Link>
        </div>
      </div>
    </main>
  );
}
