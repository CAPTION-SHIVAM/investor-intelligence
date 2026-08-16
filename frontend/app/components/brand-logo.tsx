'use client';

import Link from 'next/link';

export function BrandLogo({
  size = 'md',
  showSubtitle = true,
  href = '/',
}: {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  href?: string;
}) {
  const iconSizes = {
    sm: 'h-7 w-7 sm:h-8 sm:w-8 text-xs',
    md: 'h-8 w-8 sm:h-10 sm:w-10 text-sm',
    lg: 'h-10 w-10 sm:h-12 sm:w-12 text-base',
  };

  const titleSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-sm sm:text-lg',
    lg: 'text-lg sm:text-2xl',
  };

  return (
    <Link href={href} className="group flex items-center gap-2 sm:gap-3 transition shrink-0">
      {/* Glowing Diamond Crest Icon */}
      <div className="relative shrink-0">
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 opacity-40 blur-sm transition group-hover:opacity-75" />
        <div
          className={`relative flex ${iconSizes[size]} items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-900 via-[#071124] to-slate-950 border border-cyan-500/40 p-1 shadow-xl shadow-cyan-500/15`}
        >
          {/* Custom Geometric Monogram SVG */}
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* Background hexagonal shield */}
            <path
              d="M24 4L40 13V35L24 44L8 35V13L24 4Z"
              fill="url(#logoGrad)"
              fillOpacity="0.12"
              stroke="url(#logoGrad)"
              strokeWidth="2"
            />

            {/* Ascending Trendline Chart Bars */}
            <rect x="14" y="24" width="4" height="12" rx="1.5" fill="#06b6d4" />
            <rect x="22" y="17" width="4" height="19" rx="1.5" fill="#10b981" />
            <rect x="30" y="11" width="4" height="25" rx="1.5" fill="#38bdf8" />

            {/* Golden Star / Diamond Apex */}
            <circle cx="32" cy="8" r="2.5" fill="url(#goldGrad)" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className={`font-heading ${titleSizes[size]} font-black tracking-tight text-white`}>
            Investor<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Intelligence</span>
          </span>
          <span className="rounded bg-cyan-500/15 px-1 py-0.2 text-[8px] sm:text-[9px] font-black tracking-wider text-cyan-300 border border-cyan-500/30 uppercase">
            PRO
          </span>
        </div>
        {showSubtitle && (
          <p className="hidden sm:block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            6-Pillar IPO Reality &amp; Stock Screener
          </p>
        )}
      </div>
    </Link>
  );
}
