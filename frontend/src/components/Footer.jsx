import React from 'react';
import { ShieldAlert, Heart, Phone, Mail, MapPin, ExternalLink, Activity, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-lg text-white tracking-tight">
                CampusSafe <span className="text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Autonomous campus emergency response & triage intelligence platform.
              Empowering students with 1-click SOS, real-time AI classification, and seamless dispatch tracking.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-[11px] text-blue-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Collegiate Safety Platform • Active 24/7
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition">Home Overview</Link>
              </li>
              <li>
                <a href="/#features" className="hover:text-white transition">Platform Features</a>
              </li>
              <li>
                <a href="/#live-incidents" className="hover:text-white transition">Live Incidents Map</a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-white transition">How It Works</a>
              </li>
              <li>
                <Link to="/report" className="hover:text-blue-400 transition text-blue-400 font-semibold">Report an Emergency</Link>
              </li>
              <li>
                <Link to="/sos" className="hover:text-red-400 transition text-red-400 font-semibold">Immediate SOS Alert</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Emergency Dispatch Numbers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Emergency Hotlines
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>Dispatch: <strong>+1 (555) 019-SAFE</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span>Ambulance: <strong>+1 (555) 019-HELP</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Fire Response: <strong>+1 (555) 019-FIRE</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>Security HQ: Quad East, Gate 1</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Security & Portal Login */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Security Access
            </h4>
            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>Authorized Portals</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Students and security personnel can authenticate into dedicated management dashboards.
              </p>
              <Link
                to="/login"
                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center block transition shadow-md"
              >
                Sign In to Portal →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} CampusSafe AI. Smart Campus Emergency Management Platform.
          </p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for collegiate welfare & rapid crisis containment.
          </p>
        </div>
      </div>
    </footer>
  );
}
