'use client';

import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';
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
            <h3 className="font-heading text-base font-bold text-white mb-2">3. Non-SEBI Advisory Disclaimer</h3>
            <p>
              Investor Intelligence and its operators are not registered with the Securities and Exchange Board of India (SEBI) as Research Analysts or Investment Advisors. All data, scores, and indicators are generated programmatically and should never be construed as guaranteed returns or direct buy/sell recommendations.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-6">
            <h3 className="font-heading text-base font-bold text-white mb-2">4. User Responsibility &amp; Market Risks</h3>
            <p>
              Securities market investments, Initial Public Offerings, and equity trading carry inherent financial risks. Users are exclusively responsible for verifying all financial information and consulting certified financial advisors before executing capital market transactions.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-6">
            <h3 className="font-heading text-base font-bold text-white mb-2">5. Governing Law</h3>
            <p>
              These terms are governed in accordance with the laws of the Republic of India. Any disputes arising out of the platform shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
