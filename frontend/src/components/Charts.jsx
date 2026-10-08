import React from 'react';
import { Flame, HeartPulse, Car, ShieldAlert, PackageOpen, AlertOctagon, HelpCircle } from 'lucide-react';

export function IncidentsByCategoryChart({ data = [] }) {
  const getIcon = (cat) => {
    switch (cat) {
      case 'Fire': return <Flame className="w-3.5 h-3.5 text-orange-500" />;
      case 'Medical': return <HeartPulse className="w-3.5 h-3.5 text-red-500" />;
      case 'Accident': return <Car className="w-3.5 h-3.5 text-amber-500" />;
      case 'Harassment': return <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />;
      case 'Theft': return <PackageOpen className="w-3.5 h-3.5 text-blue-500" />;
      case 'Unsafe Area': return <AlertOctagon className="w-3.5 h-3.5 text-yellow-500" />;
      default: return <HelpCircle className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getBarColor = (cat) => {
    switch (cat) {
      case 'Fire': return 'bg-orange-500';
      case 'Medical': return 'bg-red-500';
      case 'Accident': return 'bg-amber-500';
      case 'Harassment': return 'bg-purple-500';
      case 'Theft': return 'bg-blue-500';
      case 'Unsafe Area': return 'bg-yellow-500';
      default: return 'bg-slate-500';
    }
  };

  const maxVal = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="space-y-3.5">
      {data.map((item) => {
        const percent = Math.round((item.count / maxVal) * 100);
        return (
          <div key={item.category} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                {getIcon(item.category)}
                {item.category}
              </span>
              <span className="font-mono text-slate-500">
                {item.count} incident{item.count > 1 ? 's' : ''} ({item.percentage}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${getBarColor(item.category)} rounded-full transition-all duration-700`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function IncidentsByStatusChart({ data = [] }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Reported': return { bg: 'bg-slate-400', text: 'text-slate-700' };
      case 'Assigned': return { bg: 'bg-blue-500', text: 'text-blue-700' };
      case 'Responding': return { bg: 'bg-purple-600', text: 'text-purple-700' };
      case 'Resolved': return { bg: 'bg-emerald-500', text: 'text-emerald-700' };
      default: return { bg: 'bg-slate-300', text: 'text-slate-600' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Segmented Progress Bar */}
      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
        {data.map((item) => {
          const style = getStatusColor(item.status);
          return (
            <div
              key={item.status}
              className={`${style.bg} transition-all duration-500 relative group`}
              style={{ width: `${item.percentage}%` }}
              title={`${item.status}: ${item.count} (${item.percentage}%)`}
            />
          );
        })}
      </div>

      {/* Legend & Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {data.map((item) => {
          const style = getStatusColor(item.status);
          return (
            <div key={item.status} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${style.bg}`} />
                <span className="text-xs font-bold text-slate-700">{item.status}</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 font-mono">
                {item.count}
              </div>
              <div className="text-[10px] text-slate-400">
                {item.percentage}% of total
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function IncidentsOverTimeChart({ data = [] }) {
  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="h-40 flex items-end justify-between gap-2 pt-6 px-2">
      {data.map((item, idx) => {
        const heightPct = Math.max((item.count / max) * 100, 10);
        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="opacity-0 group-hover:opacity-100 transition text-[10px] font-mono font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded shadow">
              {item.count}
            </div>
            <div className="w-full bg-slate-100 h-28 rounded-t-lg relative flex items-end overflow-hidden">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg transition-all duration-700 group-hover:from-blue-500 group-hover:to-indigo-400"
                style={{ height: `${heightPct}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-500 font-medium">
              {item.time}
            </span>
          </div>
        );
      })}
    </div>
  );
}
