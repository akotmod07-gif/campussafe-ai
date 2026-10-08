import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Radio,
  Sparkles,
  Clock,
  CheckCircle2,
  Users,
  Flame,
  Activity,
  ArrowRight,
  ShieldCheck,
  Send,
  Cpu,
  BellRing,
  UserCheck,
  Compass,
  FileCheck2,
  PhoneCall,
  AlertTriangle,
  Zap,
  MapPin,
  Lock,
  ChevronRight,
  HelpCircle,
  Siren,
} from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';
import { useAuth } from '../context/AuthContext';
import { EMERGENCY_CONTACTS, CAMPUS_LOCATIONS } from '../utils/constants';
import CampusMap from '../components/CampusMap';
import InteractiveAITriageDemo from '../components/InteractiveAITriageDemo';
import SOSCountdownModal from '../components/SOSCountdownModal';

export default function LandingPage() {
  const { stats, createIncident } = useIncidents();
  const { user, isAuthenticated, isAdmin } = useAuth();

  // In-page SOS Modal trigger state
  const [sosModalOpen, setSosModalOpen] = useState(false);

  const handleConfirmSOS = async () => {
    const payload = {
      type: 'Medical',
      title: `SOS DISTRESS: Immediate Medical/Hazard Call at ${CAMPUS_LOCATIONS[0]}`,
      description: `URGENT SOS ACTIVATION from Landing Page portal by ${user?.name || 'Campus Student'}. Immediate dispatch requested.`,
      location: CAMPUS_LOCATIONS[0],
      severity: 'Critical',
      priority: 'Immediate',
      isSOS: true,
      contactPhone: user?.phone || '+1 (555) 234-5678',
    };
    return await createIncident(payload);
  };

  const workflowSteps = [
    {
      num: '01',
      title: 'Student Report',
      subtitle: 'Mobile / SOS Button',
      icon: Send,
      color: 'bg-blue-600 text-white',
      border: 'border-blue-500/40',
    },
    {
      num: '02',
      title: 'AI Triage',
      subtitle: 'NLP Hazard Scoring',
      icon: Cpu,
      color: 'bg-indigo-600 text-white',
      border: 'border-indigo-500/40',
    },
    {
      num: '03',
      title: 'Security Alert',
      subtitle: 'Auto Command Dispatch',
      icon: BellRing,
      color: 'bg-purple-600 text-white',
      border: 'border-purple-500/40',
    },
    {
      num: '04',
      title: 'Responder',
      subtitle: 'Field Unit En Route',
      icon: UserCheck,
      color: 'bg-amber-600 text-white',
      border: 'border-amber-500/40',
    },
    {
      num: '05',
      title: 'Resolved',
      subtitle: 'Verified Safe & Logged',
      icon: CheckCircle2,
      color: 'bg-emerald-600 text-white',
      border: 'border-emerald-500/40',
    },
  ];

  const features = [
    {
      icon: Radio,
      title: '1-Click SOS Protocol',
      desc: 'Rapid 5-second cancelable distress trigger with automated campus geofencing and instant security siren broadcast.',
      color: 'bg-red-50 text-red-600 border-red-200',
    },
    {
      icon: Cpu,
      title: 'AI Incident Classification',
      desc: 'Real-time NLP engine categorizes hazards (Fire, Medical, Assault, Accidents), evaluates severity, and sets priority in under 20ms.',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      icon: Activity,
      title: 'Real-Time Incident Tracking',
      desc: 'Live 4-phase progress pipeline keeps students, dispatchers, and first responders synchronized from report to site resolution.',
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    {
      icon: Sparkles,
      title: 'Smart Prioritization',
      desc: 'Automated triage tags life safety hazards with Immediate priority and routes them straight to specialized emergency units.',
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      icon: ShieldCheck,
      title: 'Admin Command Console',
      desc: 'Complete incident management console for campus security teams to assign units, update live statuses, and maintain audit logs.',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      icon: Users,
      title: 'Campus-Wide Safety Grid',
      desc: 'Comprehensive multi-building spatial telemetry to visualize incident density, identify dark corridors, and optimize patrol routes.',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
  ];

  const howItWorksSteps = [
    {
      step: 'Step 1',
      title: 'Report',
      desc: 'Student submits a detailed report or hits the 1-click SOS distress trigger with geolocation.',
      icon: Send,
    },
    {
      step: 'Step 2',
      title: 'AI Triage',
      desc: 'NLP engine analyzes text keywords in milliseconds, assigning hazard category, severity, and urgency priority.',
      icon: Cpu,
    },
    {
      step: 'Step 3',
      title: 'Alert Security',
      desc: 'Central security command center receives instant notification with location coordinates and risk telemetry.',
      icon: BellRing,
    },
    {
      step: 'Step 4',
      title: 'Assign Responder',
      desc: 'Appropriate specialized unit (Security Unit A/B, Medical Team, Fire Marshals) is officially assigned.',
      icon: UserCheck,
    },
    {
      step: 'Step 5',
      title: 'Track Incident',
      desc: 'Interactive 4-phase live stepper keeps student and dispatcher updated with real-time field status.',
      icon: Compass,
    },
    {
      step: 'Step 6',
      title: 'Resolve',
      desc: 'Responders secure the scene, log field notes, and officially verify the incident as safely resolved.',
      icon: FileCheck2,
    },
  ];

  return (
    <div className="space-y-28 pb-20 overflow-x-hidden">
      {/* =========================================================================
          1. HERO SECTION WITH PROFESSIONAL VISUAL WORKFLOW
          ========================================================================= */}
      <section id="hero" className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 overflow-hidden">
        {/* Glow backdrop decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-blue-400/15 via-indigo-400/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Hero Content Center */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200/80 text-blue-900 text-xs font-black tracking-wide shadow-sm hover:bg-blue-200/70 transition">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>COLLEGIATE SAFETY & RAPID EMERGENCY DISPATCH</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Safer Campus.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600">
                Faster Response.
              </span>{' '}
              Smarter Emergency Management.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              CampusSafe AI connects distressed students directly with campus security, police, and medical teams.
              Featuring 1-click SOS triggers, real-time AI triage classification, and continuous dispatch tracking.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/report"
                className="px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Report Emergency
              </Link>

              <button
                type="button"
                onClick={() => setSosModalOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-xl shadow-red-500/30 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 animate-pulse"
              >
                <Radio className="w-4 h-4" />
                Activate SOS
              </button>

              <Link
                to={isAuthenticated ? (isAdmin ? '/admin/dashboard' : '/student/dashboard') : '/login'}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
              >
                View Dashboard
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Trust Telemetry Highlights */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <strong>&lt; 3.8 min</strong> Avg. Response
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <strong>Zero-Delay</strong> AI Triage
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <strong>JWT & End-to-End</strong> Encrypted
              </span>
            </div>
          </div>

          {/* PROFESSIONAL VISUAL WORKFLOW: Student Report → AI Triage → Security Alert → Responder → Resolved */}
          <div className="max-w-5xl mx-auto pt-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 block">
                    End-to-End Dispatch Lifecycle
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    How an Incident Moves in Real-Time
                  </h3>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-bold">
                  Autonomous Protocol
                </span>
              </div>

              {/* Connected 5-Step Pipeline */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
                {workflowSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isLast = idx === workflowSteps.length - 1;

                  return (
                    <div
                      key={idx}
                      className="group relative bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-4 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Top Step Pill & Icon */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-extrabold text-slate-400 group-hover:text-blue-600 transition">
                          {step.num}
                        </span>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${step.color} shadow-md group-hover:scale-110 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Labels */}
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition tracking-tight">
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {step.subtitle}
                      </p>

                      {/* Connective arrow indicator on desktop */}
                      {!isLast && (
                        <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. IMPROVED STATISTICS SECTION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
                Verified Campus Impact
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
                Proven Safety Metrics & Fleet Reliability
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              * Simulated campus prototype metrics
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Metric 1 */}
            <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/80 hover:border-blue-500 transition-all duration-300">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Students Protected</span>
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                4.8K+
              </div>
              <div className="text-xs text-blue-300 font-semibold mt-1">
                Active campus population
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/80 hover:border-blue-500 transition-all duration-300">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg. Response Time</span>
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                3.8 min
              </div>
              <div className="text-xs text-emerald-400 font-semibold mt-1">
                ↓ 45% faster with AI triage
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/80 hover:border-blue-500 transition-all duration-300">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Incidents Resolved</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                98%
              </div>
              <div className="text-xs text-emerald-300 font-semibold mt-1">
                Verified incident closure
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/80 hover:border-blue-500 transition-all duration-300">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Safety Monitoring</span>
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                24/7
              </div>
              <div className="text-xs text-indigo-300 font-semibold mt-1">
                Continuous geofence uptime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. HIGHLY VISIBLE "AI-POWERED EMERGENCY TRIAGE" SECTION
          ========================================================================= */}
      <section id="ai-triage" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InteractiveAITriageDemo />
      </section>

      {/* =========================================================================
          4. "LIVE CAMPUS INCIDENTS" SECTION (SIMULATED MAP)
          ========================================================================= */}
      <section id="live-incidents" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CampusMap />
      </section>

      {/* =========================================================================
          5. STRONG "HOW CAMPUSSAFE AI WORKS" 6-STEP SECTION
          ========================================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Automated Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How CampusSafe AI Works
          </h2>
          <p className="text-sm text-slate-600">
            A cohesive 6-phase response loop engineered to shave minutes off emergency handling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {howItWorksSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100">
                    {step.step}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-blue-600 transition">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          6. PLATFORM FEATURES GRID
          ========================================================================= */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Enterprise Grade Protection
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Features Built for College Safety Teams
          </h2>
          <p className="text-sm text-slate-600">
            Engineered for high reliability, zero configuration, and rapid student communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-5 ${feat.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          7. PROMINENT "NEED HELP?" EMERGENCY CARD WITH ACTIVATE SOS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          {/* Pulsing visual radar in background */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white/10 animate-ping-slow pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="space-y-3 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider border border-white/30">
                <Siren className="w-3.5 h-3.5 animate-bounce" />
                Immediate Crisis Intervention
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Need Help?
              </h2>
              <p className="text-base sm:text-lg text-red-100 font-semibold">
                Report an emergency in seconds.
              </p>
              <p className="text-xs text-red-200 leading-relaxed">
                Whether you observe a fire hazard, medical crisis, vehicle collision, or suspicious behavior, our campus emergency units are on standby 24/7.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
              <Link
                to="/report"
                className="py-4 px-6 rounded-2xl bg-white hover:bg-slate-100 text-red-700 font-black text-xs uppercase tracking-wider text-center transition shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Report Emergency
              </Link>
              <button
                type="button"
                onClick={() => setSosModalOpen(true)}
                className="py-4 px-6 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider text-center transition shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-red-400/40 animate-pulse"
              >
                <Radio className="w-4 h-4 text-red-400" />
                Activate SOS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. EMERGENCY DIRECT HOTLINES DIRECTORY
          ========================================================================= */}
      <section id="contacts" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            Voice Dispatch
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Campus Emergency Voice Hotlines
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMERGENCY_CONTACTS.map((contact, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-4 sm:p-5 border bg-white shadow-sm hover:shadow-md transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-slate-900">
                  {contact.title}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${contact.color}`}>
                  {contact.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {contact.desc}
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-black font-mono text-slate-900">
                  {contact.number}
                </span>
                <a
                  href={`tel:${contact.number}`}
                  className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SOS COUNTDOWN MODAL TRIGGERED FROM HERO / EMERGENCY CARD */}
      <SOSCountdownModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        onConfirm={handleConfirmSOS}
        location={CAMPUS_LOCATIONS[0]}
        emergencyType="Medical Emergency"
      />
    </div>
  );
}
