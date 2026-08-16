'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, AlertTriangle, X, Scale, AlertCircle } from 'lucide-react';

export function DisclaimerBanner() {
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <aside aria-label="SEBI Statutory Disclaimers" className="border-t border-slate-800 bg-[#040814] px-4 py-2 text-[11px] text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale size={14} className="text-amber-400 shrink-0" />
          <span>
            <strong className="text-amber-300">NOT SEBI REGISTERED:</strong> Educational research tooling only. Take your own decisions or consult your certified advisor before investing.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/disclaimer" className="text-cyan-400 font-bold hover:underline">
            Read Full Disclaimers →
          </Link>
          <button
            onClick={() => setIsMinimized(false)}
            className="text-slate-400 hover:text-white text-[10px] uppercase font-bold"
          >
            Expand
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside aria-label="SEBI Statutory Disclaimers" className="border-t-2 border-amber-500/40 bg-[#070d1a] px-4 py-3.5 text-xs text-slate-300 shadow-xl">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0 mt-0.5">
            <AlertTriangle size={18} />
          </div>
          <div className="text-[11px] leading-relaxed text-slate-300">
            <p className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
              <span>⚠️ IMPORTANT STATUTORY NOTICE: NOT A SEBI REGISTERED ADVISOR</span>
            </p>
            <p className="text-slate-200 mt-1">
              <strong>I am NOT a SEBI Registered Investment Advisor (RIA) or Research Analyst (RA).</strong> All reality scores, Gift Point verdicts, ratios, and DRHP analysis provided on this website are <strong>strictly for educational, informational, and personal analytical research purposes only</strong>.
            </p>
            <p className="text-slate-400 mt-1">
              Securities market &amp; IPO investments are subject to market risks. <strong>Before investing, please take decisions from your own end (DYOR)</strong> or consult your SEBI certified financial advisor. We do not provide buy/sell calls or assured returns.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <Link
            href="/disclaimer"
            className="rounded-xl bg-amber-400 px-3.5 py-1.5 text-[11px] font-black text-slate-950 hover:bg-amber-300 transition shadow-sm"
          >
            Full Legal Disclaimers
          </Link>
          <button
            onClick={() => setIsMinimized(true)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            title="Minimize Disclaimer"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
