'use client';

import { useState } from 'react';
import { Building2, TrendingUp, Search, Star, ArrowUpRight } from 'lucide-react';
import { AppShell } from '../components/app-shell';

const COMPANIES_DATABASE = [
  {
    name: 'Reliance Industries Ltd',
    symbol: 'RELIANCE',
    sector: 'Conglomerate & Energy',
    mcap: '₹20,15,400 Cr',
    pe: '27.4x',
    roe: '14.8%',
    score: 88,
    status: 'Market Leader',
  },
  {
    name: 'Tata Consultancy Services',
    symbol: 'TCS',
    sector: 'IT & Software',
    mcap: '₹15,24,000 Cr',
    pe: '31.2x',
    roe: '48.5%',
    score: 92,
    status: 'Core Compounder',
  },
  {
    name: 'HDFC Bank Ltd',
    symbol: 'HDFCBANK',
    sector: 'Banking & Financials',
    mcap: '₹12,85,600 Cr',
    pe: '19.5x',
    roe: '16.9%',
    score: 89,
    status: 'Banking Anchor',
  },
  {
    name: 'Skyline Cloud Technologies',
    symbol: 'SKYLINE',
    sector: 'Cloud & Sovereign AI',
    mcap: '₹18,500 Cr',
    pe: '38.0x',
    roe: '24.0%',
    score: 88,
    status: 'IPO Allotment',
  },
  {
    name: 'Solar Industries India',
    symbol: 'SOLARINDS',
    sector: 'Defence & Industrial',
    mcap: '₹98,400 Cr',
    pe: '72.0x',
    roe: '32.5%',
    score: 93,
    status: 'Defence Compounder',
  },
  {
    name: 'GreenVolt Clean Energy',
    symbol: 'GREENVOLT',
    sector: 'Renewables & Hydrogen',
    mcap: '₹14,200 Cr',
    pe: '22.5x',
    roe: '18.2%',
    score: 85,
    status: 'Active IPO',
  },
  {
    name: 'Kaynes Technology India',
    symbol: 'KAYNES',
    sector: 'Electronics & EMS',
    mcap: '₹36,500 Cr',
    pe: '84.0x',
    roe: '19.8%',
    score: 91,
    status: 'High Growth EMS',
  },
  {
    name: 'Tata Motors Ltd',
    symbol: 'TATAMOTORS',
    sector: 'Automotive & EV',
    mcap: '₹3,85,000 Cr',
    pe: '17.8x',
    roe: '34.5%',
    score: 86,
    status: 'EV Leader',
  },
];

export default function CompaniesPage() {
  const [search, setSearch] = useState('');

  const filtered = COMPANIES_DATABASE.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase()) ||
      c.sector.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell title="Tracked Companies Hub">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Universe Coverage</p>
              <h2 className="mt-1 font-heading text-2xl font-bold text-white">Tracked Equities & IPO Profiles</h2>
              <p className="text-xs text-slate-400 mt-1">Fundamental health metrics, reality scores, and capital allocation track records.</p>
            </div>
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search symbol, company, sector..."
                className="w-full md:w-64 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
              <Search size={14} className="absolute right-3 top-2.5 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filtered.map((company) => (
            <article
              key={company.symbol}
              className="glass-card glass-card-hover rounded-3xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-cyan-300 border border-slate-700">
                    <Building2 size={18} />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
                      company.score >= 90
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {company.score}/100
                  </span>
                </div>

                <h3 className="mt-4 font-heading text-base font-bold text-white leading-snug">{company.name}</h3>
                <p className="text-xs text-cyan-400 font-mono-code mt-0.5">{company.symbol}</p>

                <div className="mt-4 space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sector</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[130px]">{company.sector}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Market Cap</span>
                    <span className="font-semibold text-white">{company.mcap}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">P/E Multiple</span>
                    <span className="font-semibold text-cyan-300">{company.pe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Return on Equity</span>
                    <span className="font-bold text-emerald-400">{company.roe}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-400">
                  {company.status}
                </span>
                <span className="flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer">
                  Profile <ArrowUpRight size={13} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
