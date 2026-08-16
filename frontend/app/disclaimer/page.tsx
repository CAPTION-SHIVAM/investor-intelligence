'use client';

import Link from 'next/link';
import { ShieldAlert, AlertTriangle, Scale, FileText, CheckCircle2, ArrowLeft, Lock, Building, HelpCircle } from 'lucide-react';
import { BrandLogo } from '../components/brand-logo';

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-white pb-20">
      {/* Top Header */}
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
        {/* Title Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-300">
            <Scale size={14} />
            <span>Statutory Legal Disclosures &amp; Compliance Framework</span>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-black text-white sm:text-4xl">
            Regulatory Disclaimers &amp; Terms of Research
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-400">
            Last Updated: August 2026 · Compliant with Indian Securities and Financial Technology Regulations
          </p>
        </div>

        {/* Primary High-Risk SEBI Warning Box */}
        <div className="rounded-3xl border-2 border-rose-500/40 bg-rose-950/20 p-6 md:p-8 shadow-2xl mb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert size={26} />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-rose-300 uppercase tracking-wide">
                Mandatory Statutory Risk Warning
              </h2>
              <p className="mt-2 text-sm text-slate-200 font-semibold leading-relaxed">
                &ldquo;Investments in securities market are subject to market risks. Read all scheme and offer-related documents (DRHP / RHP) carefully before investing.&rdquo;
              </p>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Securities trading including Equities, Derivatives, and Mainboard/SME Initial Public Offerings (IPOs) involve substantial risk of financial loss. Past performance, algorithms, quantitative models, and reality scores are not indicative of future returns.
              </p>
            </div>
          </div>
        </div>

        {/* User Explicit Notice: Not a SEBI Registrant */}
        <div className="rounded-3xl border-2 border-amber-500/40 bg-amber-500/10 p-6 md:p-8 shadow-xl mb-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <AlertTriangle size={26} />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-amber-300 uppercase tracking-wide">
                Important Declaration: I Am NOT a SEBI Registrant
              </h2>
              <p className="mt-2 text-sm text-slate-100 font-bold leading-relaxed">
                I / The creators of this platform are NOT SEBI registered investment advisors, research analysts, or portfolio managers.
              </p>
              <p className="mt-2 text-xs text-slate-200 leading-relaxed">
                All information, 6-pillar reality scores, algorithmic summaries, and Gift Point verdicts provided on this website are strictly for personal study, educational awareness, and quantitative analytics. <strong>Before making any financial investment or applying for any IPO, you must take decisions from your own end (DYOR)</strong> or seek advice from a certified, SEBI-registered financial advisor. We do not provide buy, sell, or hold recommendations, nor do we promise guaranteed allotment or returns.
              </p>
            </div>
          </div>
        </div>

        {/* Structured Legal Clauses */}
        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Clause 1 */}
          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-6">
            <h3 className="font-heading text-base font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">1.</span> Non-SEBI Registered Advisory Disclosure
            </h3>
            <p>
              <strong>Investor Intelligence</strong> is purely a financial technology, quantitative data aggregation, and analytical research tool. Investor Intelligence is <strong>NOT a SEBI Registered Investment Adviser (RIA)</strong> under SEBI (Investment Advisers) Regulations, 2013, nor a <strong>Research Analyst (RA)</strong> under SEBI (Research Analysts) Regulations, 2014, nor a Portfolio Management Service (PMS) entity.
            </p>
            <p className="mt-2">
              The contents, metrics, &ldquo;Gift Point&rdquo; summaries, algorithmic 6-pillar reality scores, and automated prospectus red-flag highlights provided on this platform are generated for <strong>informational, educational, and analytical decision-support purposes only</strong>. Nothing contained herein constitutes personal financial advice, an offer to buy or sell securities, or a solicitous solicitation of public issue subscriptions.
            </p>
          </div>

          {/* Clause 2 */}
          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-6">
            <h3 className="font-heading text-base font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">2.</span> Grey Market Premium (GMP) Disclaimer
            </h3>
            <p>
              Grey Market Premium (GMP), Kostak rates, and Subject-to-Sauda figures displayed on this website represent unofficial, informal, and unregulated over-the-counter (OTC) market price indications gathered from market observers.
            </p>
            <p className="mt-2">
              GMP is highly volatile, purely speculative, and carries zero regulatory protection or guarantee from stock exchanges (BSE/NSE) or SEBI. Investor Intelligence does not endorse, facilitate, trade in, or guarantee unofficial grey market transactions. Users must never base capital allocation decisions solely on GMP indications.
            </p>
          </div>

          {/* Clause 3 */}
          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-6">
            <h3 className="font-heading text-base font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">3.</span> Sourcing of Public DRHP &amp; Exchange Data
            </h3>
            <p>
              All company fundamental data, balance sheet figures, financial ratios, promoter holdings, and issue terms are collected from publicly available Draft Red Herring Prospectuses (DRHP), Red Herring Prospectuses (RHP), exchange filings (BSE/NSE), and regulatory repositories.
            </p>
            <p className="mt-2">
              While we make utmost analytical efforts to ensure data integrity and real-time processing accuracy, Investor Intelligence does not warrant the absolute completeness, timeliness, or accuracy of third-party public disclosures. Users are strongly advised to cross-verify all statutory details on official exchange websites (<a href="https://www.bseindia.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">bseindia.com</a>, <a href="https://www.nseindia.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">nseindia.com</a>, and <a href="https://www.sebi.gov.in" target="_blank" rel="noreferrer" className="text-cyan-400 underline">sebi.gov.in</a>).
            </p>
          </div>

          {/* Clause 4 */}
          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-6">
            <h3 className="font-heading text-base font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">4.</span> No Assured Return &amp; Independent Due Diligence
            </h3>
            <p>
              Investor Intelligence explicitly disclaims any promise, assurance, or guarantee of positive listing day gains, share allotment, capital preservation, or annualized portfolio returns. All investment decisions are executed at the sole discretion, responsibility, and risk of the user.
            </p>
            <p className="mt-2">
              Users must independently assess their own risk appetite, financial situation, and tax implications, or seek guidance from a qualified, SEBI-certified Independent Financial Advisor before applying to any IPO or purchasing listed securities.
            </p>
          </div>

          {/* Clause 5 */}
          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-6">
            <h3 className="font-heading text-base font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">5.</span> Limitation of Liability &amp; Indemnity
            </h3>
            <p>
              In no event shall Investor Intelligence, its directors, developers, research contributors, or affiliate entities be liable for any direct, indirect, incidental, punitive, or consequential losses (including loss of capital or prospective profit) arising from the use of, or inability to use, the platform tools, calculators, scores, or AI models.
            </p>
          </div>

          {/* Clause 6 */}
          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-6">
            <h3 className="font-heading text-base font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">6.</span> Indian Jurisdiction &amp; Grievance Redressal
            </h3>
            <p>
              This platform operates in strict compliance with the laws of the Republic of India, including the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023. Any disputes arising out of the use of this website shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-400">
              <p><strong>Compliance &amp; Grievance Contact:</strong> compliance@investorintelligence.in</p>
              <p><strong>Registered Research Tooling Desk:</strong> Investor Intelligence Platforms India</p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:scale-105 transition"
          >
            <ArrowLeft size={14} /> I Understand &amp; Return to Platform
          </Link>
        </div>
      </div>
    </main>
  );
}
