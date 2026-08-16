'use client';

import { useState } from 'react';
import { Search, FileText, Bot, Sparkles, BookOpen, Clock, Tag } from 'lucide-react';
import { AppShell } from '../components/app-shell';

const RESEARCH_NOTES = [
  {
    id: '1',
    title: 'Skyline Cloud: Enterprise SaaS Margins & AI TAM Dissection',
    category: 'IPO Deep Dive',
    date: 'August 15, 2026',
    author: 'Senior Tech Analyst',
    tags: ['Cloud', 'AI Infrastructure', 'SaaS ARR'],
    summary: 'Evaluating Skyline’s gross margins (72%) vs global peers (Snowflake, Datadog) and customer net expansion rate of 114%.',
  },
  {
    id: '2',
    title: 'GreenVolt Clean Energy: 25-Year PPA Bankability & Tariff Risks',
    category: 'Renewables & Infrastructure',
    date: 'August 14, 2026',
    author: 'Infrastructure Lead',
    tags: ['Solar', 'Green Hydrogen', 'PPA Analysis'],
    summary: 'Detailed cash flow modeling of 4.2 GW grid contracts and interest rate sensitivity on future solar park debt.',
  },
  {
    id: '3',
    title: 'SME IPO Surge: Avoiding Retail Pump-and-Dump Traps',
    category: 'Market Strategy & Red Flags',
    date: 'August 12, 2026',
    author: 'Forensic Research Desk',
    tags: ['SME Board', 'Forensic Accounting', 'Red Flags'],
    summary: 'Framework to detect circular trading, related party transactions, and sudden revenue spikes prior to DRHP filing.',
  },
  {
    id: '4',
    title: 'Defence Electronics: Indigenous Manufacturing Moat in EMS',
    category: 'Sector Thematic',
    date: 'August 10, 2026',
    author: 'Capital Goods Analyst',
    tags: ['EMS', 'Defence', 'Solar Industries', 'Kaynes'],
    summary: 'Why electronics manufacturing services (EMS) order books are compounding at 35%+ CAGR with export upside.',
  },
];

export default function ResearchPage() {
  const [search, setSearch] = useState('');

  const filtered = RESEARCH_NOTES.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AppShell title="Research Workspace & Analyst Notes">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Institutional Insights</p>
              <h2 className="mt-1 font-heading text-2xl font-bold text-white">Analyst Notes & Sector Deep Dives</h2>
              <p className="text-xs text-slate-400 mt-1">In-depth valuation models, management interview notes, and forensic accounting screens.</p>
            </div>
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes, sectors, tags..."
                className="w-full md:w-64 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
              <Search size={14} className="absolute right-3 top-2.5 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((note) => (
            <article
              key={note.id}
              className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-md transition hover:border-slate-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-cyan-300 font-semibold border border-cyan-500/20">
                    {note.category}
                  </span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {note.date}</span>
                </div>

                <h3 className="mt-3 font-heading text-lg font-bold text-white leading-snug">{note.title}</h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">{note.summary}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {note.tags.map((t) => (
                    <span key={t} className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400 border border-slate-800">
                      #{t}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer">Read Memo →</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
