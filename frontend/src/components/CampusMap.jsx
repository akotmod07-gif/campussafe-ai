import React, { useState } from 'react';
import {
  MapPin,
  AlertTriangle,
  Flame,
  HeartPulse,
  Car,
  ShieldAlert,
  CheckCircle2,
  X,
  ExternalLink,
  Layers,
  Compass,
  Radio,
  Eye,
  Clock,
  UserCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';
import { formatDate } from '../utils/formatters';

// Fixed coordinates mapping for standard campus zones in the simulated map
const ZONE_COORDINATES = {
  'Science & Tech Complex - Lab B-204': { x: 28, y: 32, zone: 'North-West Tech Wing' },
  'Science Complex': { x: 28, y: 32, zone: 'North-West Tech Wing' },
  'North Dining Hall & Cafeteria': { x: 62, y: 25, zone: 'North Quad Dining' },
  'North Cafeteria': { x: 62, y: 25, zone: 'North Quad Dining' },
  'Main University Gate & East Ave': { x: 82, y: 72, zone: 'East Perimeter Gate' },
  'Main Gate': { x: 82, y: 72, zone: 'East Perimeter Gate' },
  'Parking Lot 4 - Behind Residence Hall C': { x: 18, y: 75, zone: 'South-West Dormitory Lot' },
  'Parking Area': { x: 18, y: 75, zone: 'South-West Dormitory Lot' },
  'Engineering Block East Entrance': { x: 45, y: 55, zone: 'Central Engineering Hall' },
  'Engineering Block': { x: 45, y: 55, zone: 'Central Engineering Hall' },
  'Central Library - 3rd Floor': { x: 50, y: 40, zone: 'Academic Library Commons' },
  'Central Library': { x: 50, y: 40, zone: 'Academic Library Commons' },
  'Sports Arena & Gymnasium': { x: 78, y: 38, zone: 'Athletics & Recreation' },
  'Student Center & Auditorium': { x: 38, y: 48, zone: 'Student Union Plaza' },
  'Hostel Block A - Courtyard': { x: 22, y: 60, zone: 'Residential Complex A' },
};

export default function CampusMap() {
  const { incidents } = useIncidents();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('All'); // 'All', 'Critical', 'High', 'Medium', 'Resolved'

  // Map coordinates helper
  const getCoordinates = (incident, index) => {
    for (const [key, coords] of Object.entries(ZONE_COORDINATES)) {
      if (incident.location?.toLowerCase().includes(key.toLowerCase())) {
        return coords;
      }
    }
    // Fallback spread across campus
    const fallbacks = [
      { x: 35, y: 28, zone: 'North Academic Wing' },
      { x: 55, y: 65, zone: 'South Arts Pavilion' },
      { x: 70, y: 50, zone: 'Research Annex' },
      { x: 25, y: 45, zone: 'Bio-Tech Lab' },
    ];
    return fallbacks[index % fallbacks.length];
  };

  // Color mapping based on user requirements:
  // Red = Critical, Orange = High, Yellow = Medium, Green = Resolved
  const getMarkerColor = (incident) => {
    if (incident.status === 'Resolved') {
      return {
        badge: 'bg-emerald-500 text-white',
        ring: 'border-emerald-400 ring-emerald-500/30',
        dot: 'bg-emerald-500',
        label: 'Resolved',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
      };
    }
    switch (incident.severity) {
      case 'Critical':
        return {
          badge: 'bg-red-600 text-white animate-pulse',
          ring: 'border-red-500 ring-red-500/40 animate-ping',
          dot: 'bg-red-600',
          label: 'Critical',
          text: 'text-red-700',
          bg: 'bg-red-50',
        };
      case 'High':
        return {
          badge: 'bg-orange-500 text-white',
          ring: 'border-orange-400 ring-orange-500/30',
          dot: 'bg-orange-500',
          label: 'High',
          text: 'text-orange-700',
          bg: 'bg-orange-50',
        };
      case 'Medium':
      default:
        return {
          badge: 'bg-amber-500 text-white',
          ring: 'border-amber-400 ring-amber-500/30',
          dot: 'bg-amber-500',
          label: 'Medium',
          text: 'text-amber-700',
          bg: 'bg-amber-50',
        };
    }
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (filterSeverity === 'All') return true;
    if (filterSeverity === 'Resolved') return inc.status === 'Resolved';
    return inc.severity === filterSeverity && inc.status !== 'Resolved';
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/20">
            <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>Interactive Campus Telemetry & Spatial Grid</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Live Campus Incident Map
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Simulated campus radar with real-time geolocation markers. Click any incident node to inspect live responder dispatch telemetry.
          </p>
        </div>

        {/* Severity Legend & Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 text-xs">
          <button
            type="button"
            onClick={() => setFilterSeverity('All')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filterSeverity === 'All' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({incidents.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity('Critical')}
            className={`px-2.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              filterSeverity === 'Critical' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-red-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Critical
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity('High')}
            className={`px-2.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              filterSeverity === 'High' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-orange-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            High
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity('Medium')}
            className={`px-2.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              filterSeverity === 'Medium' ? 'bg-amber-500 text-white shadow' : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Medium
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity('Resolved')}
            className={`px-2.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              filterSeverity === 'Resolved' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Resolved
          </button>
        </div>
      </div>

      {/* SIMULATED MAP CANVAS */}
      <div className="relative w-full h-[460px] sm:h-[500px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner select-none">
        {/* Architectural Campus Grid Pattern (SVG) */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>

        {/* Simulated Campus Layout: Pathways, Greens, and Buildings */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {/* Main Diagonal Walkway */}
          <div className="absolute top-0 left-1/4 w-1.5 h-full bg-slate-700/60 rotate-45 transform origin-top-left" />
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-700/50" />
          <div className="absolute top-0 left-1/2 w-1 h-full bg-slate-700/50" />

          {/* Campus Quad Lawn */}
          <div className="absolute top-[35%] left-[42%] w-36 h-28 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-center">
            <span className="text-[10px] font-mono text-emerald-400/80 font-bold tracking-wider uppercase">Central Quad</span>
          </div>

          {/* Building Outlines */}
          <div className="absolute top-[18%] left-[16%] w-44 h-24 rounded-xl border border-blue-500/40 bg-blue-950/30 p-2">
            <span className="text-[10px] font-mono text-blue-300 font-bold block">Science & Tech Complex</span>
            <span className="text-[9px] text-slate-500 font-mono">Bldg 4 • 4 Floors</span>
          </div>

          <div className="absolute top-[14%] right-[14%] w-40 h-22 rounded-xl border border-indigo-500/40 bg-indigo-950/30 p-2">
            <span className="text-[10px] font-mono text-indigo-300 font-bold block">North Dining Hall</span>
            <span className="text-[9px] text-slate-500 font-mono">Cafeteria Hub</span>
          </div>

          <div className="absolute bottom-[16%] left-[12%] w-40 h-24 rounded-xl border border-slate-700/80 bg-slate-900/60 p-2">
            <span className="text-[10px] font-mono text-slate-300 font-bold block">Residence Halls & P4</span>
            <span className="text-[9px] text-slate-500 font-mono">Dorm Block C</span>
          </div>

          <div className="absolute bottom-[18%] right-[12%] w-44 h-22 rounded-xl border border-amber-500/30 bg-amber-950/20 p-2">
            <span className="text-[10px] font-mono text-amber-300 font-bold block">East Gate Entrance</span>
            <span className="text-[9px] text-slate-500 font-mono">Transit Access</span>
          </div>

          <div className="absolute top-[45%] right-[22%] w-32 h-20 rounded-xl border border-purple-500/30 bg-purple-950/20 p-2">
            <span className="text-[10px] font-mono text-purple-300 font-bold block">Sports Arena</span>
            <span className="text-[9px] text-slate-500 font-mono">Gymnasium</span>
          </div>
        </div>

        {/* Compass Rose */}
        <div className="absolute top-4 right-4 p-2 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
          <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '20s' }} />
          <span>CAMPUS NORTH • GEO-37.77</span>
        </div>

        {/* Geofence boundary badge */}
        <div className="absolute bottom-4 left-4 p-2 bg-slate-900/90 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400">
          <span className="text-emerald-400 font-bold">● ACTIVE GEO-FENCE</span> • Radius 1.8km²
        </div>

        {/* INCIDENT MARKER PINS */}
        {filteredIncidents.map((incident, idx) => {
          const coords = getCoordinates(incident, idx);
          const color = getMarkerColor(incident);
          const isSelected = selectedIncident?.incidentId === incident.incidentId;

          return (
            <div
              key={incident.incidentId || incident.id}
              style={{ top: `${coords.y}%`, left: `${coords.x}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
              onClick={() => setSelectedIncident(incident)}
            >
              {/* Outer pulsing ring for critical/high */}
              {incident.status !== 'Resolved' && incident.severity === 'Critical' && (
                <div className="absolute -inset-3 rounded-full bg-red-500/30 animate-ping pointer-events-none" />
              )}

              {/* Marker pin */}
              <div
                className={`relative px-2 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 shadow-xl transition-all duration-300 transform group-hover:scale-125 border-2 ${
                  isSelected ? 'scale-125 ring-4 ring-white' : ''
                } ${color.badge}`}
              >
                <span className={`w-2 h-2 rounded-full bg-white flex-shrink-0`} />
                <span className="font-mono">{incident.type}</span>
              </div>

              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-xl bg-slate-900 text-white text-[10px] pointer-events-none shadow-2xl border border-slate-700 z-30">
                <p className="font-bold truncate text-slate-100">{incident.title}</p>
                <p className="text-slate-400 truncate">{incident.location}</p>
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800">
                  <span className={color.text}>{incident.severity}</span>
                  <span className="text-blue-400">{incident.status}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* INTERACTIVE INCIDENT INSPECTION POPUP / DRAWER */}
        {selectedIncident && (
          <div className="absolute bottom-4 right-4 max-w-sm w-full bg-slate-900/95 backdrop-blur-xl border border-blue-500/40 rounded-2xl p-4 shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  {selectedIncident.incidentId}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getMarkerColor(selectedIncident).badge}`}>
                  {selectedIncident.severity}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIncident(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">
              {selectedIncident.title}
            </h4>

            <p className="text-[11px] text-slate-300 line-clamp-2 mb-3 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              "{selectedIncident.description}"
            </p>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 mb-3">
              <div>
                <span className="block text-slate-500">Location:</span>
                <strong className="text-slate-200 truncate block">📍 {selectedIncident.location}</strong>
              </div>
              <div>
                <span className="block text-slate-500">Status:</span>
                <strong className="text-blue-300 truncate block">● {selectedIncident.status}</strong>
              </div>
              <div>
                <span className="block text-slate-500">Assigned Unit:</span>
                <strong className="text-slate-200 truncate block">{selectedIncident.assignedResponder || 'Unassigned'}</strong>
              </div>
              <div>
                <span className="block text-slate-500">Reported:</span>
                <strong className="text-slate-200 block">{formatDate(selectedIncident.createdAt)}</strong>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2">
              <Link
                to={`/incidents/${selectedIncident.incidentId}`}
                className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-center text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                Inspect Dossier
              </Link>
              <Link
                to={`/track/${selectedIncident.incidentId}`}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-center text-xs font-bold transition"
              >
                Live Stepper
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer Meta */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 border-t border-slate-800 pt-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <strong className="text-slate-300">Red:</strong> Critical
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <strong className="text-slate-300">Orange:</strong> High
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <strong className="text-slate-300">Yellow:</strong> Medium
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <strong className="text-slate-300">Green:</strong> Resolved
          </span>
        </div>
        <div>
          <span>Click any pin to inspect real-time responder assignment</span>
        </div>
      </div>
    </div>
  );
}
