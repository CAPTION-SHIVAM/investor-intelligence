'use client';

import { useState } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { AppShell } from '../components/app-shell';

type Thesis = {
  id: string;
  company: string;
  symbol: string;
  score: number;
  status: 'Bullish Conviction' | 'Monitoring Quarter' | 'Risk Alert';
  targetPrice: string;
  currentPrice: string;
  catalysts: string[];
  risks: string[];
};

const INITIAL_THESES: Thesis[] = [
  {
    id: '1',
    company: 'Skyline Cloud Technologies',
    symbol: 'SKYLINE',
    score: 88,
    status: 'Bullish Conviction',
    targetPrice: '₹850 (3 Yrs)',
    currentPrice: '₹665',
    catalysts: [
      'Enterprise ARR accelerating to 48% YoY',
      'Operating margin expansion from 16% to 24%',
      'Sovereign AI cloud contracts in BFSI sector',
    ],
    risks: ['Customer concentration in top 5 enterprise accounts'],
  },
  {
    id: '2',
    company: 'GreenVolt Clean Energy',
    symbol: 'GREENVOLT',
    score: 85,
    status: 'Bullish Conviction',
    targetPrice: '₹480 (2 Yrs)',
    currentPrice: '₹326',
    catalysts: [
      '4.2 GW contracted pipeline with 25-yr PPAs',
      'Lower borrowing cost via Green Bonds',
    ],
    risks: ['Capex execution delays or transmission grid curtailment'],
  },
  {
    id: '3',
    company: 'Tata Motors Ltd',
    symbol: 'TATAMOTORS',
    score: 86,
    status: 'Bullish Conviction',
    targetPrice: '₹1,350',
    currentPrice: '₹1,045',
    catalysts: [
      'JLR net debt zero transition complete',
      'EV market leadership with 70%+ domestic share',
    ],
    risks: ['European luxury auto demand slowdown'],
  },
  {
    id: '4',
    company: 'FintechX Peer Payments',
    symbol: 'FINTECHX',
    score: 49,
    status: 'Risk Alert',
    targetPrice: 'Under Review',
    currentPrice: '₹790',
    catalysts: ['Large 35M monthly consumer user base'],
    risks: [
      'Operating loss of -₹320 Cr in FY25',
      '80% OFS selling by early investors',
      'Regulatory interchange fee cap',
    ],
  },
];

export default function ThesisPage() {
  const [theses] = useState<Thesis[]>(INITIAL_THESES);

  return (
    <AppShell title="Investment Thesis & Conviction Tracker">
      <div className="space-y-6">
        {/* KPI Row */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Theses Tracked</p>
            <p className="mt-2 font-heading text-3xl font-black text-white">{theses.length} Companies</p>
            <p className="mt-1 text-xs text-cyan-400">3 Bullish · 1 Risk Alert</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Conviction Health</p>
            <p className="mt-2 font-heading text-3xl font-black text-emerald-400">82.5/100</p>
            <p className="mt-1 text-xs text-slate-300">High Quality Fundamentals</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thesis Drift Alerts</p>
            <p className="mt-2 font-heading text-3xl font-black text-rose-400">1 Review</p>
            <p className="mt-1 text-xs text-slate-400">FintechX Cash Burn Watch</p>
          </div>
        </div>

        {/* Theses Cards */}
        <div className="space-y-4">
          {theses.map((thesis) => (
            <article
              key={thesis.id}
              className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-extrabold text-cyan-300">
                      {thesis.symbol}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-black uppercase tracking-wider ${
                        thesis.status === 'Bullish Conviction'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {thesis.status}
                    </span>
                  </div>
                  <h3 className="mt-2 font-heading text-xl font-bold text-white">{thesis.company}</h3>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-xs text-slate-400">Current: {thesis.currentPrice} → Target: <span className="font-bold text-white">{thesis.targetPrice}</span></p>
                  <p className="text-sm font-black text-cyan-400 mt-1">Reality Score: {thesis.score}/100</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 pt-4 border-t border-slate-800/80 text-xs">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-3.5">
                  <p className="font-bold text-emerald-300 mb-1.5 flex items-center gap-1">
                    <CheckCircle2 size={13} /> Growth Catalysts
                  </p>
                  <ul className="space-y-1 text-slate-300">
                    {thesis.catalysts.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-emerald-400">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-3.5">
                  <p className="font-bold text-rose-300 mb-1.5 flex items-center gap-1">
                    <AlertTriangle size={13} /> Invalidation Risks
                  </p>
                  <ul className="space-y-1 text-slate-300">
                    {thesis.risks.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-rose-400">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
