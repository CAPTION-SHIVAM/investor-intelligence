'use client';

import { useState } from 'react';
import { FileText, Download, Search, CheckCircle2, Bot, Sparkles, FileCode } from 'lucide-react';
import { AppShell } from '../components/app-shell';

const DRHP_DOCUMENTS = [
  {
    name: 'Skyline-Cloud-Draft-Red-Herring-Prospectus-SEBI.pdf',
    company: 'Skyline Cloud Technologies',
    pages: 412,
    size: '14.2 MB',
    status: 'AI Indexed & Verified',
    filingDate: 'August 2026',
    highlights: 'Section 4 Financials parsed · 18 Risk factors indexed',
  },
  {
    name: 'GreenVolt-Clean-Energy-DRHP-Final.pdf',
    company: 'GreenVolt Clean Energy',
    pages: 384,
    size: '11.8 MB',
    status: 'AI Indexed & Verified',
    filingDate: 'August 2026',
    highlights: 'PPA agreements verified · Debt schedule extracted',
  },
  {
    name: 'Nova-Microfinance-Bharat-Prospectus.pdf',
    company: 'Nova Microfinance Bharat',
    pages: 320,
    size: '9.4 MB',
    status: 'AI Indexed & Verified',
    filingDate: 'July 2026',
    highlights: 'Asset quality cluster data & state NPA breakdown',
  },
  {
    name: 'FintechX-Peer-Payments-DRHP-SEBI.pdf',
    company: 'FintechX Peer Payments',
    pages: 456,
    size: '16.5 MB',
    status: 'High OFS Detected',
    filingDate: 'August 2026',
    highlights: 'Promoter and investor exit schedules flagged',
  },
];

export default function DocumentsPage() {
  const [search, setSearch] = useState('');

  const filtered = DRHP_DOCUMENTS.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell title="DRHP Filings & Document Corpus">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Prospectus Library</p>
              <h2 className="mt-1 font-heading text-2xl font-bold text-white">Audited DRHP & Annual Reports</h2>
              <p className="text-xs text-slate-400 mt-1">Direct official SEBI filings pre-indexed for rapid AI question answering and red flag extraction.</p>
            </div>
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search filings..."
                className="w-full md:w-64 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
              <Search size={14} className="absolute right-3 top-2.5 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((doc) => (
            <article
              key={doc.name}
              className="rounded-3xl border border-slate-800 bg-[#070d19] p-5 shadow-sm transition hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-base font-bold text-white">{doc.company}</h3>
                    <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/20">
                      {doc.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400 font-mono-code truncate max-w-xl">{doc.name}</p>
                  <p className="mt-1 text-xs text-slate-300">{doc.highlights}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right text-xs text-slate-400">
                  <p>{doc.pages} Pages</p>
                  <p>{doc.size}</p>
                </div>
                <button className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-cyan-500 hover:text-slate-950 transition">
                  <Download size={14} /> PDF
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
