import React, { useState } from 'react';
import {
  Radio,
  MapPin,
  Flame,
  HeartPulse,
  ShieldAlert,
  Car,
  AlertTriangle,
  PhoneCall,
  Clock,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';
import { useAuth } from '../context/AuthContext';
import SOSCountdownModal from '../components/SOSCountdownModal';
import { EMERGENCY_CONTACTS, CAMPUS_LOCATIONS } from '../utils/constants';

export default function SOSPage() {
  const { user } = useAuth();
  const { createIncident } = useIncidents();

  const [emergencyType, setEmergencyType] = useState('Medical Emergency');
  const [currentLocation, setCurrentLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const emergencyOptions = [
    { label: 'Medical Emergency', icon: HeartPulse, color: 'text-red-500 border-red-200 bg-red-50' },
    { label: 'Fire & Hazmat', icon: Flame, color: 'text-orange-500 border-orange-200 bg-orange-50' },
    { label: 'Personal Safety & Escort', icon: ShieldAlert, color: 'text-purple-500 border-purple-200 bg-purple-50' },
    { label: 'Vehicle Crash / Accident', icon: Car, color: 'text-amber-500 border-amber-200 bg-amber-50' },
  ];

  const handleTriggerSOS = () => {
    setIsModalOpen(true);
  };

  const handleConfirmSOS = async () => {
    const payload = {
      type: emergencyType.includes('Medical')
        ? 'Medical'
        : emergencyType.includes('Fire')
        ? 'Fire'
        : emergencyType.includes('Crash')
        ? 'Accident'
        : 'Harassment',
      title: `SOS DISTRESS: ${emergencyType} at ${currentLocation}`,
      description: `URGENT SOS BUTTON ACTIVATED by ${user?.name || 'Student'}. Immediate response required at ${currentLocation}. Type: ${emergencyType}.`,
      location: currentLocation,
      severity: 'Critical',
      priority: 'Immediate',
      isSOS: true,
      contactPhone: user?.phone || '+1 (555) 234-5678',
    };

    return await createIncident(payload);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hackathon Prototype Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>
            <strong>Hackathon Simulation Prototype:</strong> This interface simulates university emergency dispatch and does not make live 911 calls.
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase bg-amber-200/80 px-2 py-0.5 rounded font-mono">
          Safe Test Mode
        </span>
      </div>

      {/* Hero & SOS Trigger Button */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-8 relative overflow-hidden">
        <div className="max-w-md mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            Rapid Dispatch Protocol
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Campus Emergency SOS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Press the SOS button below to trigger an immediate Critical response from Campus Police and Emergency Responders.
          </p>
        </div>

        {/* THE GIANT SOS BUTTON */}
        <div className="relative py-4 flex items-center justify-center">
          {/* Pulsing rings */}
          <div className="absolute w-64 h-64 rounded-full bg-red-500/10 animate-ping-slow pointer-events-none" />
          <div className="absolute w-52 h-52 rounded-full bg-red-500/20 animate-pulse pointer-events-none" />

          <button
            type="button"
            onClick={handleTriggerSOS}
            className="relative w-44 h-44 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 hover:from-red-800 hover:to-rose-600 active:scale-95 text-white font-black text-3xl tracking-widest shadow-2xl shadow-red-500/50 flex flex-col items-center justify-center border-4 border-white transition-all duration-200 group"
          >
            <Radio className="w-9 h-9 mb-1 text-white animate-pulse" />
            <span>SOS</span>
            <span className="text-[10px] tracking-normal font-sans font-bold uppercase text-red-100">
              Hold or Tap
            </span>
          </button>
        </div>

        {/* Emergency Type Selector */}
        <div className="space-y-3 text-left max-w-xl mx-auto">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Select Distress Type:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {emergencyOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = emergencyType === opt.label;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setEmergencyType(opt.label)}
                  className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition flex items-center gap-3 ${
                    isSelected
                      ? 'border-red-500 bg-red-50/70 text-red-900 shadow-sm ring-2 ring-red-400/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl border ${opt.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Location Placeholder / Selector */}
        <div className="max-w-xl mx-auto text-left space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Verified Campus GPS Location:
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
              <MapPin className="w-4 h-4" />
            </div>
            <select
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white font-semibold text-slate-800"
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc} (Coordinates: 37.7749° N, 122.4194° W)
                </option>
              ))}
            </select>
          </div>
          <span className="text-[11px] text-slate-400 block">
            📍 Simulated automated indoor Wi-Fi positioning & campus geofence.
          </span>
        </div>
      </div>

      {/* Emergency Hotlines Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Direct Campus Dispatch Contacts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EMERGENCY_CONTACTS.slice(0, 3).map((c, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">{c.title}</p>
                <p className="text-xs font-mono font-black text-blue-600">{c.number}</p>
              </div>
              <a
                href={`tel:${c.number}`}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* SOS COUNTDOWN MODAL */}
      <SOSCountdownModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSOS}
        location={currentLocation}
        emergencyType={emergencyType}
      />
    </div>
  );
}
