'use client';

import { useState } from 'react';
import { AlertTriangle, Bell, CheckCircle2, ShieldAlert, Zap, TrendingUp, Info } from 'lucide-react';
import { AppShell } from '../components/app-shell';

const ALERTS_DATA = [
  {
    id: '1',
    title: 'Skyline Cloud Technologies (IPO) GMP Surge to +33%',
    detail: 'Grey market bids jumped from ₹120 to ₹165 following 28.4x QIB institutional oversubscription.',
    severity: 'High Momentum',
    time: '2 hours ago',
    type: 'ipo',
  },
  {
    id: '2',
    title: 'GreenVolt Clean Energy (IPO) Closes in 24 Hours',
    detail: 'Issue subscription crosses 22.5x with strong demand across retail and NII tranches.',
    severity: 'Action Required',
    time: '5 hours ago',
    type: 'deadline',
  },
  {
    id: '3',
    title: 'FintechX DRHP Red Flag: 80% Issue is Secondary OFS',
    detail: 'Early PE venture funds offloading substantial stakes while net operating losses continue.',
    severity: 'Risk Alert',
    time: '1 day ago',
    type: 'risk',
  },
  {
    id: '4',
    title: 'Portfolio Rebalancing Suggestion',
    detail: 'Tech & Cloud allocation reached 28.5%. Consider reallocating partial gains to defence/energy.',
    severity: 'Optimization',
    time: '2 days ago',
    type: 'portfolio',
  },
];

export default function AlertsPage() {
  const [alerts] = useState(ALERTS_DATA);

  return (
    <AppShell title="Market Risk & IPO Signals">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 shadow-lg">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Bell size={16} /> Real-Time Signal Stream
          </div>
          <h2 className="font-heading text-2xl font-bold text-white">Live IPO & Portfolio Alerts</h2>
          <p className="text-xs text-slate-400 mt-1">Automatic triggers for GMP fluctuations, DRHP red flags, subscription surges, and thesis drift.</p>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <article
              key={alert.id}
              className="rounded-3xl border border-slate-800 bg-[#070d19] p-5 shadow-sm transition hover:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      alert.type === 'risk'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : alert.type === 'ipo'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {alert.type === 'risk' ? <ShieldAlert size={20} /> : <TrendingUp size={20} />}
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-white">{alert.title}</h3>
                    <p className="mt-1 text-xs text-slate-300">{alert.detail}</p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                      alert.severity === 'Risk Alert'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : alert.severity === 'Action Required'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-[11px] text-slate-500">{alert.time}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
