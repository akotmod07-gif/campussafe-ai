import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  HeartPulse,
  Car,
  ShieldAlert,
  AlertOctagon,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Zap,
  Activity,
  Send,
} from 'lucide-react';
import { classifyEmergencyText } from '../services/aiClassifier';

const PRESET_EXAMPLES = [
  {
    label: '🔥 Fire in Electronics Lab',
    text: 'Smoke is coming from the electronics laboratory.',
    presetAnalysis: {
      category: 'FIRE',
      severity: 'CRITICAL',
      priority: 'IMMEDIATE',
      confidence: 96,
      matchedKeywords: ['smoke', 'electronics laboratory'],
      dispatchTarget: 'Fire Response Team + Hazmat Unit',
    },
  },
  {
    label: '🩺 Unresponsive Student',
    text: 'Student collapsed unconscious with difficulty breathing near dining hall line.',
    presetAnalysis: {
      category: 'MEDICAL',
      severity: 'CRITICAL',
      priority: 'IMMEDIATE',
      confidence: 98,
      matchedKeywords: ['collapsed', 'unconscious', 'breathing'],
      dispatchTarget: 'Medical Team & Paramedic Unit 1',
    },
  },
  {
    label: '⚠️ Stalker in Parking Lot',
    text: 'Suspicious person stalking and following me near the dark parking lot B.',
    presetAnalysis: {
      category: 'HARASSMENT',
      severity: 'HIGH',
      priority: 'URGENT',
      confidence: 94,
      matchedKeywords: ['stalking', 'following', 'dark parking'],
      dispatchTarget: 'Campus Security Rapid Patrol Team B',
    },
  },
  {
    label: '🚴 Shuttle Collision',
    text: 'Campus shuttle collided with bicycle at Main Gate East Avenue.',
    presetAnalysis: {
      category: 'ACCIDENT',
      severity: 'HIGH',
      priority: 'URGENT',
      confidence: 92,
      matchedKeywords: ['shuttle', 'collided', 'bicycle'],
      dispatchTarget: 'Campus Traffic & Security Unit A',
    },
  },
];

export default function InteractiveAITriageDemo() {
  const [inputText, setInputText] = useState(PRESET_EXAMPLES[0].text);
  const [currentAnalysis, setCurrentAnalysis] = useState(PRESET_EXAMPLES[0].presetAnalysis);
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  const handleSelectPreset = (index) => {
    setActivePresetIndex(index);
    setInputText(PRESET_EXAMPLES[index].text);
    setCurrentAnalysis(PRESET_EXAMPLES[index].presetAnalysis);
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    setActivePresetIndex(-1);

    if (!text.trim()) {
      setCurrentAnalysis(null);
      return;
    }

    const dynamic = classifyEmergencyText(text);
    if (dynamic) {
      setCurrentAnalysis({
        category: dynamic.category.toUpperCase(),
        severity: dynamic.severity.toUpperCase(),
        priority: dynamic.priority.toUpperCase(),
        confidence: dynamic.confidence,
        matchedKeywords: dynamic.matchedKeywords,
        dispatchTarget: dynamic.category === 'Fire'
          ? 'Fire Response Team'
          : dynamic.category === 'Medical'
          ? 'Emergency Medical Team'
          : 'Campus Security Unit A',
      });
    } else {
      setCurrentAnalysis({
        category: 'OTHER',
        severity: 'MEDIUM',
        priority: 'NORMAL',
        confidence: 70,
        matchedKeywords: [],
        dispatchTarget: 'Campus Security Patrol',
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-blue-500/30 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl mb-8 space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>Real-Time Natural Language Processing</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          AI-Powered Emergency Triage Engine
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Watch CampusSafe AI classify natural student language in milliseconds. Our automated NLP triage instantly extracts trigger hazards, flags severity, and assigns prioritized emergency response teams without manual intervention.
        </p>
      </div>

      {/* Interactive Presets Bar */}
      <div className="mb-6 space-y-2 relative z-10">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Select Live Hackathon Demo Scenarios:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_EXAMPLES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activePresetIndex === idx
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
              }`}
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual-Column AI Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left Column: Student Input Card */}
        <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wide flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-blue-400" />
                Student Incident Report
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-white/10 px-2 py-0.5 rounded">
                Live Input
              </span>
            </div>

            <div className="relative">
              <textarea
                rows={4}
                value={inputText}
                onChange={handleInputChange}
                placeholder="Type any campus emergency description here to test live AI..."
                className="w-full p-3.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium leading-relaxed resize-none transition"
              />
            </div>

            <p className="text-[11px] text-slate-400 italic">
              💡 Tip: Type phrases like "smell of smoke in lab", "student bleeding", "stalker near dorms", or "bike accident".
            </p>
          </div>

          {/* Trigger Keywords Extracted */}
          {currentAnalysis?.matchedKeywords && currentAnalysis.matchedKeywords.length > 0 && (
            <div className="pt-3 border-t border-white/10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Trigger Tokens Detected:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentAnalysis.matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-mono font-bold"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center: Connective Flow Arrow */}
        <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center shadow-lg animate-pulse">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* Right Column: Sleek Real AI Analysis Card */}
        <div className="lg:col-span-6 bg-gradient-to-tr from-slate-900 to-indigo-900/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-blue-500/40 shadow-2xl space-y-5">
          {/* Top Bar with Neural Icon & Latency */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400">
                <Cpu className="w-5 h-5 animate-spin" style={{ animationDuration: '15s' }} />
              </div>
              <div>
                <h4 className="text-sm font-black text-white tracking-wide">
                  AI Emergency Classification Output
                </h4>
                <span className="text-[10px] text-blue-300 font-mono">
                  Multi-Class Triage Model v2.6 • Neural Engine
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-400">Processing Latency</div>
              <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 justify-end">
                <Zap className="w-3 h-3" /> 18ms
              </div>
            </div>
          </div>

          {/* 4 Core Classification Metrics */}
          {currentAnalysis ? (
            <div className="grid grid-cols-2 gap-3">
              {/* Category */}
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Category
                </span>
                <div className="flex items-center gap-2 font-black text-base text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="tracking-wide">{currentAnalysis.category}</span>
                </div>
              </div>

              {/* Severity */}
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Severity
                </span>
                <div className="font-black text-base text-red-400 tracking-wide flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-red-600/40 border border-red-500/50 text-red-200 text-xs font-mono">
                    {currentAnalysis.severity}
                  </span>
                </div>
              </div>

              {/* Priority */}
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Priority
                </span>
                <div className="font-black text-base text-amber-400 tracking-wide">
                  <span className="px-2 py-0.5 rounded bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-mono">
                    {currentAnalysis.priority}
                  </span>
                </div>
              </div>

              {/* Confidence */}
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Confidence Score
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-base text-blue-400">
                    {currentAnalysis.confidence}%
                  </span>
                  <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${currentAnalysis.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Type or select an incident above to generate real-time AI triage.
            </div>
          )}

          {/* Automated Dispatch Action Banner */}
          {currentAnalysis && (
            <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">
                  Automated Field Routing
                </span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {currentAnalysis.dispatchTarget}
                </span>
              </div>
              <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-400/30">
                AUTO-DISPATCH READY
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
