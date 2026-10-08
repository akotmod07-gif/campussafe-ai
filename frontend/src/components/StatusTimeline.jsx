import React from 'react';
import { FileText, UserCheck, Radio, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const STEPS = [
  { key: 'Reported', label: 'Reported', icon: FileText, desc: 'Incident logged & dispatched' },
  { key: 'Assigned', label: 'Assigned', icon: UserCheck, desc: 'Safety team assigned' },
  { key: 'Responding', label: 'Responding', icon: Radio, desc: 'Responders en route' },
  { key: 'Resolved', label: 'Resolved', icon: CheckCircle2, desc: 'Incident closed & verified' },
];

export default function StatusTimeline({ currentStatus, incident }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStatus);
  const activeStep = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full py-4">
      {/* Desktop / Tablet Stepper */}
      <div className="relative">
        {/* Background track line */}
        <div className="absolute top-5 left-6 right-6 h-1 bg-slate-200 -z-0" />

        {/* Active progress track */}
        <div
          className="absolute top-5 left-6 h-1 bg-blue-600 transition-all duration-500 -z-0"
          style={{ width: `${(activeStep / (STEPS.length - 1)) * 90}%` }}
        />

        {/* Steps */}
        <div className="flex items-start justify-between relative z-10">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < activeStep;
            const isCurrent = idx === activeStep;

            return (
              <div key={step.key} className="flex flex-col items-center text-center max-w-[120px]">
                {/* Circle Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-sm ${
                    isCompleted
                      ? 'bg-blue-600 text-white shadow-blue-500/20'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 ring-offset-2 animate-pulse'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Label */}
                <div className="mt-2.5">
                  <span
                    className={`block text-xs font-bold ${
                      isCurrent
                        ? 'text-blue-600 font-extrabold'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[11px] text-slate-500 hidden sm:block mt-0.5 leading-tight">
                    {step.desc}
                  </span>
                </div>

                {/* Status-specific contextual info */}
                {isCurrent && (
                  <span className="mt-1.5 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full border border-blue-200">
                    Current
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Responder & Timestamp meta strip */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          <span className="font-semibold text-slate-700">Assigned Unit:</span>{' '}
          <span className="font-mono text-blue-600 font-bold">
            {incident?.assignedResponder || 'Pending Assignment'}
          </span>
        </div>
        <div>
          <span className="font-semibold text-slate-700">Last Status Update:</span>{' '}
          <span>{formatDate(incident?.updatedAt || incident?.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
