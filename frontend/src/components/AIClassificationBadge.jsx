import React from 'react';
import { Sparkles, Check, Flame, HeartPulse, Car, ShieldAlert, PackageOpen, AlertOctagon, HelpCircle } from 'lucide-react';
import { getSeverityBadge, getPriorityBadge } from '../utils/formatters';

export default function AIClassificationBadge({ analysis, onApply, isApplied }) {
  if (!analysis) return null;

  const { category, severity, priority, confidence, matchedKeywords, explanation } = analysis;

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Fire':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'Medical':
        return <HeartPulse className="w-4 h-4 text-red-500" />;
      case 'Accident':
        return <Car className="w-4 h-4 text-amber-500" />;
      case 'Harassment':
        return <ShieldAlert className="w-4 h-4 text-purple-500" />;
      case 'Theft':
        return <PackageOpen className="w-4 h-4 text-blue-500" />;
      case 'Unsafe Area':
        return <AlertOctagon className="w-4 h-4 text-yellow-500" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  const sevBadge = getSeverityBadge(severity);

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-xl border border-blue-500/30 relative overflow-hidden transition-all duration-300">
      {/* Background glow decoration */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30 text-blue-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-wide flex items-center gap-2">
              AI Emergency Classification
              <span className="text-[10px] bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full font-mono uppercase">
                Active NLP Engine
              </span>
            </h4>
            <p className="text-xs text-slate-300">
              Automated real-time safety triage analysis
            </p>
          </div>
        </div>

        {/* Confidence pill */}
        <div className="text-right">
          <div className="text-xs text-blue-300 font-medium">Confidence</div>
          <div className="text-lg font-extrabold text-blue-400 font-mono">
            {confidence}%
          </div>
        </div>
      </div>

      {/* Classification Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        {/* Category */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
          <span className="text-[11px] text-slate-300 font-medium block mb-1">
            Suggested Category
          </span>
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            {getCategoryIcon(category)}
            <span>{category}</span>
          </div>
        </div>

        {/* Severity */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
          <span className="text-[11px] text-slate-300 font-medium block mb-1">
            Suggested Severity
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${sevBadge.dot}`} />
            <span className="font-bold text-white text-sm">{severity}</span>
          </div>
        </div>

        {/* Priority */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
          <span className="text-[11px] text-slate-300 font-medium block mb-1">
            Suggested Priority
          </span>
          <span className={`inline-block px-2.5 py-0.5 rounded text-xs ${getPriorityBadge(priority)}`}>
            {priority}
          </span>
        </div>
      </div>

      {/* Keywords detected */}
      {matchedKeywords && matchedKeywords.length > 0 && (
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-400">Trigger Keywords:</span>
          {matchedKeywords.map((kw, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-blue-500/20 text-blue-200 border border-blue-400/20 rounded text-[11px] font-mono"
            >
              #{kw}
            </span>
          ))}
        </div>
      )}

      {/* Explanation text */}
      {explanation && (
        <p className="text-xs text-slate-300 italic mb-4 border-l-2 border-blue-400 pl-2.5">
          "{explanation}"
        </p>
      )}

      {/* Action button */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <span className="text-xs text-slate-400">
          Accepting applies these parameters to the submission form.
        </span>
        <button
          type="button"
          onClick={() => onApply(analysis)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md ${
            isApplied
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 cursor-default'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30'
          }`}
        >
          {isApplied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Applied to Form
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Apply AI Suggestion
            </>
          )}
        </button>
      </div>
    </div>
  );
}
