import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Send,
  Upload,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  ArrowRight,
  Clock,
  Flame,
  Radio,
} from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';
import { useAuth } from '../context/AuthContext';
import { classifyEmergencyText } from '../services/aiClassifier';
import AIClassificationBadge from '../components/AIClassificationBadge';
import {
  INCIDENT_TYPES,
  SEVERITY_LEVELS,
  CAMPUS_LOCATIONS,
} from '../utils/constants';

export default function ReportIncidentPage() {
  const { user } = useAuth();
  const { createIncident } = useIncidents();
  const navigate = useNavigate();

  // Form State
  const [type, setType] = useState('Fire');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [severity, setSeverity] = useState('Critical');
  const [priority, setPriority] = useState('Immediate');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [imagePreview, setImagePreview] = useState(null);

  // Live AI state
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAiApplied, setIsAiApplied] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdIncident, setCreatedIncident] = useState(null);
  const [formError, setFormError] = useState('');

  // Live AI analysis debounced when description changes
  useEffect(() => {
    if (!description.trim()) {
      setAiAnalysis(null);
      setIsAiApplied(false);
      return;
    }

    const timer = setTimeout(() => {
      const result = classifyEmergencyText(description);
      if (result) {
        setAiAnalysis(result);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [description]);

  // Handler to accept AI suggestion
  const handleApplyAISuggestion = (suggestion) => {
    if (!suggestion) return;
    setType(suggestion.category);
    setSeverity(suggestion.severity);
    setPriority(suggestion.priority);
    setIsAiApplied(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick prompt autofill for demo presentations
  const handleDemoPreset = (text, defaultLoc) => {
    setDescription(text);
    if (!title) setTitle(text.slice(0, 45) + '...');
    if (defaultLoc) setLocation(defaultLoc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const finalLocation = customLocation.trim() || location;

    if (!description.trim()) {
      setFormError('Please provide an incident description.');
      return;
    }

    if (!finalLocation) {
      setFormError('Please select or specify the incident location.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        type,
        title: title.trim() || `${type} Emergency at ${finalLocation}`,
        description,
        location: finalLocation,
        severity,
        priority,
        contactPhone,
        image: imagePreview,
        aiAnalysis,
        isSOS: false,
      };

      const result = await createIncident(payload);
      setCreatedIncident(result);
      setSubmitSuccess(true);
    } catch (err) {
      setFormError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* SUCCESS MODAL / SCREEN */}
      {submitSuccess && createdIncident ? (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Emergency Report Submitted Successfully
            </h2>
            <p className="text-sm text-slate-600">
              Campus Security Dispatch and designated response units have received this incident.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left max-w-lg mx-auto space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Incident ID:</span>
              <span className="font-mono font-black text-blue-600 text-sm">
                {createdIncident.incidentId}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Status:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                {createdIncident.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Category:</span>
              <span className="font-bold text-slate-800">
                {createdIncident.type}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Severity:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold">
                {createdIncident.severity}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Location:</span>
              <span className="font-semibold text-slate-800 text-right">
                {createdIncident.location}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Submission Time:</span>
              <span className="font-medium text-slate-600">
                {new Date(createdIncident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => navigate(`/incidents/${createdIncident.incidentId}`)}
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              Track Incident
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/student/dashboard')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* REPORT FORM */
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
              Emergency Triage Submission
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Report Campus Incident
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Provide incident details. Our real-time AI engine will automatically analyze keywords, categorize the hazard, and assign dispatch priority.
            </p>
          </div>

          {/* Quick Demo Pre-fills */}
          <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              💡 Hackathon Demo Pre-fills (Click to test AI engine):
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleDemoPreset('I can see smoke coming from the electronics laboratory.', 'Science & Tech Complex - Lab B-204')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-xs text-slate-700 font-medium transition"
              >
                🔥 Smoke in Electronics Lab
              </button>
              <button
                type="button"
                onClick={() => handleDemoPreset('A student collapsed and is unconscious with breathing difficulty near cafeteria.', 'North Dining Hall & Cafeteria')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 text-xs text-slate-700 font-medium transition"
              >
                🩺 Unconscious Student
              </button>
              <button
                type="button"
                onClick={() => handleDemoPreset('Suspicious trespasser in dark area behind dormitory parking lot.', 'Parking Lot 4 - Behind Residence Hall C')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-xs text-slate-700 font-medium transition"
              >
                ⚠️ Dark Corridors & Prowler
              </button>
            </div>
          </div>

          {formError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            {/* Description (Primary trigger for AI) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Incident Description *
                </label>
                <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Live AI Analysis Active
                </span>
              </div>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you observed (e.g., 'I can see smoke coming from the electronics laboratory...')"
                className="w-full p-4 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>

            {/* AI CLASSIFICATION BOX (LIVE AS USER TYPES) */}
            {aiAnalysis && (
              <AIClassificationBadge
                analysis={aiAnalysis}
                onApply={handleApplyAISuggestion}
                isApplied={isAiApplied}
              />
            )}

            {/* Type & Severity Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Emergency Category *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-medium"
                >
                  {INCIDENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Severity Level *
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-medium"
                >
                  {SEVERITY_LEVELS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Incident Title (Optional Summary)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Smoke hazard in Tech Complex"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Campus Location *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setCustomLocation('');
                  }}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="Or enter custom room/hall..."
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Contact Phone & Image Attachment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Reporter Contact Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Optional Photo Attachment
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 transition">
                    <Upload className="w-4 h-4 text-slate-500" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <span className="text-xs text-emerald-600 font-bold">
                      ✓ Image attached
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-blue-500/25 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Emergency Report...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Dispatch Emergency Report Now
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
