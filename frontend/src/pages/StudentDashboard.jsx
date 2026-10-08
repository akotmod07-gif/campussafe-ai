import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Radio,
  PlusCircle,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  Filter,
  Search,
  Bell,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIncidents } from '../context/IncidentContext';
import { useNotifications } from '../context/NotificationContext';
import { formatDate, getSeverityBadge, getStatusBadge } from '../utils/formatters';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { incidents, loading } = useIncidents();
  const { notifications } = useNotifications();
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'active', 'resolved'
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Filter incidents for this student or campus active
  const myIncidents = incidents.filter(
    (inc) => inc.reporter?.email?.toLowerCase() === user?.email?.toLowerCase()
  );

  // Statistics for student
  const totalReports = myIncidents.length;
  const activeReports = myIncidents.filter((i) => i.status !== 'Resolved').length;
  const resolvedReports = myIncidents.filter((i) => i.status === 'Resolved').length;
  const criticalReports = myIncidents.filter((i) => i.severity === 'Critical').length;

  // Filtered list
  const displayIncidents = (filterTab === 'all'
    ? myIncidents
    : filterTab === 'active'
    ? myIncidents.filter((i) => i.status !== 'Resolved')
    : myIncidents.filter((i) => i.status === 'Resolved')
  ).filter((inc) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      inc.incidentId.toLowerCase().includes(s) ||
      inc.title.toLowerCase().includes(s) ||
      inc.location.toLowerCase().includes(s) ||
      inc.type.toLowerCase().includes(s)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome & Fast Action Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/20">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Student Safety Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Monitor your active emergency dispatches, submit new campus safety reports, or activate 1-click SOS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/sos"
              className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-red-500/30 flex items-center gap-2 animate-pulse"
            >
              <Radio className="w-4 h-4" />
              Emergency SOS
            </Link>
            <Link
              to="/report"
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Report Incident
            </Link>
          </div>
        </div>
      </div>

      {/* STATISTIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total reports */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Reports</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {totalReports}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Submitted from your profile</div>
        </div>

        {/* Active reports */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Active Reports</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
            {activeReports}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">Under dispatch / response</div>
        </div>

        {/* Resolved reports */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
            {resolvedReports}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Successfully handled</div>
        </div>

        {/* Critical incidents */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Critical Calls</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-600 font-mono">
            {criticalReports}
          </div>
          <div className="text-[11px] text-red-700 font-medium mt-1">High priority incidents</div>
        </div>
      </div>

      {/* Main Grid: My Reports Table + Sidebar (Recent Activity & Notifications) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: My Reports */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            {/* Header + Tabs + Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  My Incident Reports
                </h3>
                <p className="text-xs text-slate-500">
                  Track the real-time response status of emergencies you reported
                </p>
              </div>

              {/* Tabs */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setFilterTab('all')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    filterTab === 'all'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({myIncidents.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('active')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    filterTab === 'active'
                      ? 'bg-white text-amber-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Active ({activeReports})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('resolved')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    filterTab === 'resolved'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Resolved ({resolvedReports})
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by incident ID, title, location, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* Incidents List */}
            {displayIncidents.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No reports found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  You haven't reported any incidents in this category yet.
                </p>
                <Link
                  to="/report"
                  className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  Report An Emergency
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {displayIncidents.map((inc) => {
                  const sev = getSeverityBadge(inc.severity);
                  const st = getStatusBadge(inc.status);

                  return (
                    <div
                      key={inc.id || inc.incidentId}
                      onClick={() => navigate(`/incidents/${inc.incidentId}`)}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition bg-white cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      {/* Left Info */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                            {inc.incidentId}
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            {inc.type}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sev.bg}`}>
                            {inc.severity}
                          </span>
                          {inc.isSOS && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                              SOS Alert
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                          {inc.title}
                        </h4>

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            {inc.location}
                          </span>
                          <span className="flex items-center gap-1 flex-shrink-0">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {formatDate(inc.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Right Status Badge & Action */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${st.bg}`}>
                          <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                          {inc.status}
                        </span>
                        <div className="p-1.5 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-500 transition">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Activity Feed & Notifications */}
        <div className="space-y-6">
          {/* Notifications Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                Recent Alerts
              </h3>
              <span className="text-xs text-slate-400">Live</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {notifications.slice(0, 4).map((notif) => (
                <div key={notif.id || notif._id} className="py-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{notif.title}</span>
                    <span className="text-[10px] text-slate-400">{formatDate(notif.createdAt)}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Campus Safety Tips Card */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 text-white space-y-4">
            <div className="flex items-center gap-2 text-blue-400">
              <ShieldAlert className="w-5 h-5" />
              <h4 className="font-bold text-sm text-white">Emergency Best Practices</h4>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>In fire incidents, avoid elevators and use external fire exit stairwells.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Stay on the line with security dispatch after pressing the SOS button if safe.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Share exact floor and classroom numbers in your description.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
