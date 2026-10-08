import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  Clock,
  User,
  Radio,
  ChevronLeft,
  Share2,
  RefreshCw,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';
import StatusTimeline from '../components/StatusTimeline';
import { getSeverityBadge, getStatusBadge, getPriorityBadge, formatDate } from '../utils/formatters';

export default function IncidentTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getIncident } = useIncidents();

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getIncident(id);
        if (active) setIncident(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h3 className="font-bold text-slate-800">Incident Not Found</h3>
        <button
          onClick={() => navigate('/student/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const sev = getSeverityBadge(incident.severity);
  const st = getStatusBadge(incident.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 flex items-center gap-1.5 text-xs font-bold transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            {incident.incidentId}
          </span>
        </div>
      </div>

      {/* Main Tracking Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Live Field Dispatch Status
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {incident.title}
            </h1>
            <p className="text-xs text-slate-500">
              Reported by <strong className="text-slate-800">{incident.reporter?.name}</strong> • Category: <strong className="text-blue-600">{incident.type}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${sev.bg}`}>
              {incident.severity}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(incident.priority)}`}>
              {incident.priority}
            </span>
          </div>
        </div>

        {/* Status Stepper */}
        <StatusTimeline currentStatus={incident.status} incident={incident} />

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              Location
            </span>
            <p className="text-sm font-bold text-slate-800">{incident.location}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Reported Time
            </span>
            <p className="text-sm font-bold text-slate-800">
              {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <span className="text-[11px] text-slate-400">({formatDate(incident.createdAt)})</span>
          </div>
        </div>

        {/* Description box */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Incident Description
          </span>
          <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
            {incident.description}
          </p>
        </div>

        {/* Field Notes from Responders */}
        {incident.responseNotes && incident.responseNotes.length > 0 && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Field Updates from Responders
            </span>
            <div className="space-y-2">
              {incident.responseNotes.map((note, idx) => (
                <div key={idx} className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
                  <div className="flex items-center justify-between font-bold text-blue-900 mb-0.5">
                    <span>{note.author}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{formatDate(note.timestamp)}</span>
                  </div>
                  <p className="text-slate-700">{note.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/incidents/${incident.incidentId}`}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Open Full Command Dossier →
          </Link>

          <Link
            to="/student/dashboard"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
