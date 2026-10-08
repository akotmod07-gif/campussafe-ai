import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Radio,
  Search,
  Filter,
  UserCheck,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Layers,
  Sparkles,
  PhoneCall,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';
import { useAuth } from '../context/AuthContext';
import {
  IncidentsByCategoryChart,
  IncidentsByStatusChart,
  IncidentsOverTimeChart,
} from '../components/Charts';
import {
  getSeverityBadge,
  getStatusBadge,
  getPriorityBadge,
  formatDate,
} from '../utils/formatters';
import {
  INCIDENT_TYPES,
  SEVERITY_LEVELS,
  PRIORITY_LEVELS,
  INCIDENT_STATUSES,
} from '../utils/constants';

export default function AdminDashboard() {
  const { incidents, stats, loading } = useIncidents();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      if (selectedCategory !== 'All' && inc.type !== selectedCategory) return false;
      if (selectedSeverity !== 'All' && inc.severity !== selectedSeverity) return false;
      if (selectedPriority !== 'All' && inc.priority !== selectedPriority) return false;
      if (selectedStatus !== 'All' && inc.status !== selectedStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const idMatch = inc.incidentId?.toLowerCase().includes(q);
        const locMatch = inc.location?.toLowerCase().includes(q);
        const repMatch = inc.reporter?.name?.toLowerCase().includes(q);
        const titleMatch = inc.title?.toLowerCase().includes(q);
        if (!idMatch && !locMatch && !repMatch && !titleMatch) return false;
      }

      return true;
    });
  }, [incidents, selectedCategory, selectedSeverity, selectedPriority, selectedStatus, searchQuery]);

  // High priority / Critical alerts banner
  const criticalActiveAlerts = incidents.filter(
    (i) => (i.severity === 'Critical' || i.priority === 'Immediate') && i.status !== 'Resolved'
  );

  // Chart data calculations
  const categoryChartData = useMemo(() => {
    const counts = {};
    incidents.forEach((i) => {
      counts[i.type] = (counts[i.type] || 0) + 1;
    });
    return Object.keys(counts).map((cat) => ({
      category: cat,
      count: counts[cat],
      percentage: incidents.length ? Math.round((counts[cat] / incidents.length) * 100) : 0,
    }));
  }, [incidents]);

  const statusChartData = useMemo(() => {
    const counts = { Reported: 0, Assigned: 0, Responding: 0, Resolved: 0 };
    incidents.forEach((i) => {
      if (counts[i.status] !== undefined) counts[i.status] += 1;
    });
    return Object.keys(counts).map((st) => ({
      status: st,
      count: counts[st],
      percentage: incidents.length ? Math.round((counts[st] / incidents.length) * 100) : 0,
    }));
  }, [incidents]);

  const timelineChartData = [
    { time: '08:00', count: 1 },
    { time: '10:00', count: 3 },
    { time: '12:00', count: 6 },
    { time: '14:00', count: 4 },
    { time: '16:00', count: 8 },
    { time: '18:00', count: 5 },
    { time: '20:00', count: Math.max(2, incidents.length % 5) },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/20">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
            Security & Emergency Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Campus Operations Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Active commander: <strong className="text-white">{user?.name || 'Administrator'}</strong> • Real-time emergency triage and field responder dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            to="/sos"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-red-500/30 flex items-center gap-2 animate-pulse"
          >
            <Radio className="w-3.5 h-3.5" />
            Simulate SOS
          </Link>
          <Link
            to="/report"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow"
          >
            Create Incident
          </Link>
        </div>
      </div>

      {/* CRITICAL ALERTS BANNER IF ANY ACTIVE */}
      {criticalActiveAlerts.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-700 font-extrabold text-sm uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              Critical Emergencies Requiring Urgent Attention ({criticalActiveAlerts.length})
            </div>
            <span className="text-[11px] font-mono font-bold text-red-600">
              Immediate Priority
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {criticalActiveAlerts.map((crit) => (
              <div
                key={crit.incidentId || crit.id}
                onClick={() => navigate(`/incidents/${crit.incidentId}`)}
                className="bg-white p-3.5 rounded-2xl border border-red-200 hover:border-red-400 cursor-pointer transition flex items-center justify-between gap-3 group shadow-sm"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-red-600">
                      {crit.incidentId}
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {crit.type} - {crit.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    📍 {crit.location} • Responder: <strong className="text-blue-600">{crit.assignedResponder}</strong>
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-xs font-bold text-red-600 group-hover:underline flex items-center gap-1">
                    Manage →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5 STATISTICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Incidents</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {stats.total}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Logged in platform</div>
        </div>

        {/* Active */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Incidents</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">
            {stats.active}
          </div>
          <div className="text-[10px] text-amber-700 font-medium mt-1">In progress</div>
        </div>

        {/* Critical */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Critical Calls</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-red-600 font-mono">
            {stats.critical}
          </div>
          <div className="text-[10px] text-red-700 font-medium mt-1">Life safety risks</div>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            {stats.resolved}
          </div>
          <div className="text-[10px] text-emerald-700 font-medium mt-1">Closed successfully</div>
        </div>

        {/* Avg Response Time */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Avg Response</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 font-mono">
            {stats.avgResponseTime}
          </div>
          <div className="text-[10px] text-indigo-700 font-medium mt-1">Triage to dispatch</div>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Incidents by Category */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Incidents by Category
            </h3>
            <span className="text-[10px] text-slate-400 font-mono uppercase">Distribution</span>
          </div>
          <IncidentsByCategoryChart data={categoryChartData} />
        </div>

        {/* Chart 2: Incidents by Status */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              Status Pipeline Breakdown
            </h3>
            <span className="text-[10px] text-slate-400 font-mono uppercase">Flow</span>
          </div>
          <IncidentsByStatusChart data={statusChartData} />
        </div>

        {/* Chart 3: Incidents Over Time */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              24-Hour Dispatch Volume
            </h3>
            <span className="text-[10px] text-slate-400 font-mono uppercase">Hourly</span>
          </div>
          <IncidentsOverTimeChart data={timelineChartData} />
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Incident Management Console
            </h3>
            <p className="text-xs text-slate-500">
              Inspect, assign responders, update statuses, and log command field actions
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
            Showing {filteredIncidents.length} of {incidents.length} records
          </span>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Search */}
          <div className="relative lg:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ID, location, reporter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
            >
              <option value="All">All Categories</option>
              {INCIDENT_TYPES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
            >
              <option value="All">All Severities</option>
              {SEVERITY_LEVELS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
            >
              <option value="All">All Priorities</option>
              {PRIORITY_LEVELS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
            >
              <option value="All">All Statuses</option>
              {INCIDENT_STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        {/* INCIDENTS TABLE */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-y border-slate-200">
              <tr>
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Reporter</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Assigned Unit</th>
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No incidents matched your query.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => {
                  const sev = getSeverityBadge(inc.severity);
                  const st = getStatusBadge(inc.status);

                  return (
                    <tr
                      key={inc.incidentId || inc.id}
                      className="hover:bg-slate-50/80 transition group"
                    >
                      {/* ID */}
                      <td className="py-3 px-3 font-mono font-bold text-blue-600">
                        {inc.incidentId}
                      </td>

                      {/* Type */}
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {inc.type}
                      </td>

                      {/* Reporter */}
                      <td className="py-3 px-3 text-slate-600 truncate max-w-[120px]">
                        {inc.reporter?.name || 'Anonymous'}
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3 text-slate-600 truncate max-w-[150px]">
                        {inc.location}
                      </td>

                      {/* Severity */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${sev.bg}`}>
                          {inc.severity}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getPriorityBadge(inc.priority)}`}>
                          {inc.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 w-max ${st.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {inc.status}
                        </span>
                      </td>

                      {/* Assigned Unit */}
                      <td className="py-3 px-3 text-slate-600 font-mono text-[11px] truncate max-w-[130px]">
                        {inc.assignedResponder || 'Unassigned'}
                      </td>

                      {/* Time */}
                      <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                        {formatDate(inc.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/incidents/${inc.incidentId}`)}
                          className="px-3 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg text-xs font-bold transition inline-flex items-center gap-1"
                        >
                          Manage
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
