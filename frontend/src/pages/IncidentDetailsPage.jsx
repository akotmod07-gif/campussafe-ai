import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Send,
  MessageSquare,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  RefreshCw,
  Flame,
  Radio,
} from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';
import { useAuth } from '../context/AuthContext';
import StatusTimeline from '../components/StatusTimeline';
import {
  getSeverityBadge,
  getStatusBadge,
  getPriorityBadge,
  formatDate,
} from '../utils/formatters';
import {
  RESPONDERS,
  INCIDENT_STATUSES,
  PRIORITY_LEVELS,
  SEVERITY_LEVELS,
} from '../utils/constants';

export default function IncidentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getIncident, updateIncident, resolveIncident, loading: listLoading } = useIncidents();
  const { user, isAdmin } = useAuth();

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Admin Management Form State
  const [selectedResponder, setSelectedResponder] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load incident details
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const data = await getIncident(id);
        if (isMounted) {
          setIncident(data);
          setSelectedResponder(data.assignedResponder || 'Unassigned');
          setSelectedStatus(data.status || 'Reported');
          setSelectedPriority(data.priority || 'Normal');
          setSelectedSeverity(data.severity || 'Medium');
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Incident not found');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [id, listLoading]);

  // Handle Admin Update
  const handleSaveAdminUpdates = async (e) => {
    if (e) e.preventDefault();
    setIsUpdating(true);
    setSuccessMessage('');
    try {
      const updated = await updateIncident(incident.incidentId || incident.id, {
        assignedResponder: selectedResponder,
        status: selectedStatus,
        priority: selectedPriority,
        severity: selectedSeverity,
        noteText: newNote.trim() ? newNote.trim() : undefined,
      });
      setIncident(updated);
      setNewNote('');
      setSuccessMessage('Incident details successfully updated!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update incident');
    } finally {
      setIsUpdating(false);
    }
  };

  // Quick Resolve Button
  const handleQuickResolve = async () => {
    setIsUpdating(true);
    try {
      const updated = await resolveIncident(
        incident.incidentId || incident.id,
        'Incident verified and officially resolved on site.'
      );
      setIncident(updated);
      setSelectedStatus('Resolved');
      setSuccessMessage('Incident has been officially marked as RESOLVED.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to resolve incident');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Loading Incident Dossier...
          </p>
        </div>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Incident Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested incident record (ID: {id}) could not be retrieved.
        </p>
        <Link
          to={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const sev = getSeverityBadge(incident.severity);
  const st = getStatusBadge(incident.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                {incident.incidentId}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${sev.bg}`}>
                {incident.severity}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getPriorityBadge(incident.priority)}`}>
                {incident.priority}
              </span>
              {incident.isSOS && (
                <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                  SOS Distress Call
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              {incident.title}
            </h1>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-2xl border font-bold text-xs flex items-center gap-2 ${st.bg}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${st.dot}`} />
            <span>Status: {incident.status}</span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* VISUAL 4-PHASE PROGRESS TIMELINE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Live Dispatch Progress Stepper
        </h3>
        <StatusTimeline currentStatus={incident.status} incident={incident} />
      </div>

      {/* MAIN TWO-COLUMN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Incident Details & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incident Overview Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-base font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3">
              Incident Overview
            </h3>

            {/* Description */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Description of Hazard
              </span>
              <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {incident.description}
              </p>
            </div>

            {/* AI Analysis Snapshot */}
            {incident.aiAnalysis && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-blue-300">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    AI Triage Engine Assessment
                  </span>
                  <span className="font-mono text-blue-300 font-bold">
                    Confidence: {incident.aiAnalysis.confidence * (incident.aiAnalysis.confidence <= 1 ? 100 : 1)}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Class:</span>
                    <strong className="text-white">{incident.aiAnalysis.suggestedCategory || incident.type}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Assigned Severity:</span>
                    <strong className="text-white">{incident.aiAnalysis.suggestedSeverity || incident.severity}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Dispatch Priority:</span>
                    <strong className="text-white">{incident.aiAnalysis.suggestedPriority || incident.priority}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Location & Timestamps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
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
                  Reported On
                </span>
                <p className="text-sm font-bold text-slate-800">
                  {new Date(incident.createdAt).toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-400">
                  ({formatDate(incident.createdAt)})
                </span>
              </div>
            </div>
          </div>

          {/* Response Activity Notes & Audit Log */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Responder Action Logs & Field Notes
            </h3>

            {(!incident.responseNotes || incident.responseNotes.length === 0) ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No responder logs recorded yet. Notes logged by security admins will appear here.
              </p>
            ) : (
              <div className="space-y-3">
                {incident.responseNotes.map((noteItem, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-700 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {noteItem.author}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {formatDate(noteItem.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {noteItem.note}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Reporter Card & Admin Management Console */}
        <div className="space-y-6">
          {/* Reporter Information Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Reporter Contact Dossier
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base">
                {incident.reporter?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {incident.reporter?.name || 'Anonymous Student'}
                </p>
                <span className="text-[11px] text-slate-400 font-mono">
                  ID: {incident.reporter?.studentId || 'STU-8821'}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{incident.reporter?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{incident.reporter?.phone || '+1 (555) 234-5678'}</span>
              </div>
            </div>
          </div>

          {/* ADMIN INCIDENT MANAGEMENT CONSOLE (For Admins & Demo Control) */}
          <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  Admin Command Console
                </h3>
              </div>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                {isAdmin ? 'Admin Active' : 'Demo Operator Mode'}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Assign response units, advance dispatch status, and log field updates. Changes synchronize instantly.
            </p>

            <form onSubmit={handleSaveAdminUpdates} className="space-y-4">
              {/* Assign Responder */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Assign Responder Team
                </label>
                <select
                  value={selectedResponder}
                  onChange={(e) => setSelectedResponder(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 font-medium"
                >
                  <option value="Unassigned">Unassigned</option>
                  {RESPONDERS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Advancement */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Update Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 font-medium"
                >
                  {INCIDENT_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority & Severity */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Priority
                  </label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {PRIORITY_LEVELS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Severity
                  </label>
                  <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {SEVERITY_LEVELS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Add Field Note */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Add Dispatch Field Note
                </label>
                <textarea
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="e.g. Unit A arrived at north gate. Situation assessed..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                >
                  {isUpdating ? 'Saving...' : 'Save Updates'}
                </button>

                {incident.status !== 'Resolved' && (
                  <button
                    type="button"
                    onClick={handleQuickResolve}
                    disabled={isUpdating}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Incident As Resolved
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
