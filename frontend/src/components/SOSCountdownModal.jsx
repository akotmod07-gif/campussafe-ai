import React, { useState, useEffect } from 'react';
import { AlertOctagon, X, CheckCircle2, ShieldCheck, Siren, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SOSCountdownModal({ isOpen, onClose, onConfirm, location, emergencyType }) {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [isCompleted, setIsCompleted] = useState(false);
  const [createdIncident, setCreatedIncident] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isOpen && !isCompleted && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isOpen && !isCompleted && secondsLeft === 0) {
      handleTriggerDispatch();
    }
    return () => clearInterval(timer);
  }, [isOpen, secondsLeft, isCompleted]);

  const handleTriggerDispatch = async () => {
    try {
      const incident = await onConfirm();
      setCreatedIncident(incident);
      setIsCompleted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualSendNow = () => {
    setSecondsLeft(0);
    handleTriggerDispatch();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-red-200 relative overflow-hidden">
        {/* Hackathon Prototype Banner */}
        <div className="bg-amber-100 text-amber-900 text-[11px] font-bold py-1.5 px-3 rounded-full mb-4 inline-flex items-center gap-1.5 border border-amber-300">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
          HACKATHON SIMULATION MODE • NO ACTUAL SERVICES CONTACTED
        </div>

        {!isCompleted ? (
          <div>
            {/* Pulsing countdown circle */}
            <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping-slow" />
              <div className="absolute inset-2 rounded-full bg-red-500/30 animate-pulse" />
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white flex flex-col items-center justify-center shadow-xl border-4 border-white">
                <Siren className="w-7 h-7 text-white/90 animate-bounce mb-1" />
                <span className="text-3xl font-black font-mono leading-none">
                  {secondsLeft}s
                </span>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1">
              EMERGENCY SOS ACTIVATION
            </h3>
            <p className="text-sm font-semibold text-red-600 mb-2">
              Emergency alert will be sent in {secondsLeft} seconds.
            </p>
            <p className="text-xs text-slate-500 mb-6">
              Broadcasting critical alert for <strong className="text-slate-800">{emergencyType}</strong> at{' '}
              <strong className="text-slate-800">{location}</strong> to all campus emergency teams.
            </p>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition flex items-center justify-center gap-1.5 text-sm"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleManualSendNow}
                className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-lg shadow-red-500/30 flex items-center justify-center gap-1.5 text-sm"
              >
                <Siren className="w-4 h-4" />
                Send Now
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation State */
          <div className="animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-1">
              Emergency Alert Sent Successfully!
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Campus security dispatch and rapid medical units have been alerted.
            </p>

            {/* Incident Details Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Incident ID:</span>
                <span className="font-mono font-bold text-blue-600 text-sm">
                  {createdIncident?.incidentId}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Priority:</span>
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[11px]">
                  {createdIncident?.priority || 'Immediate'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[11px]">
                  {createdIncident?.status || 'Reported'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Location:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {createdIncident?.location || location}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(`/incidents/${createdIncident?.incidentId || ''}`);
                }}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                Track Incident Progress
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/student/dashboard');
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
