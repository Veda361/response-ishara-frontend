import React from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface SurveySuccessProps {
  onReset: () => void;
  collegeName?: string;
  interestedInPilot?: boolean;
}

export const SurveySuccess: React.FC<SurveySuccessProps> = ({
  onReset,
  collegeName,
  interestedInPilot,
}) => {
  return (
    <div className="mx-auto max-w-xl text-center py-12 px-4 sm:px-6">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 mb-6 shadow-md shadow-emerald-500/10">
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </div>

      <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-3">
        Submission Confirmed
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
        Thank you for speaking up! 🎉
      </h1>

      <p className="text-base text-slate-600 leading-relaxed mb-8">
        Your response has been securely saved to the Isahara research platform.
        {collegeName ? ` Insights from students at ${collegeName} ` : ' Your feedback '}
        will help us design reliable, student-first mobility solutions that eliminate long waits after class.
      </p>

      {interestedInPilot && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 mb-8 text-left flex items-start gap-3">
          <div className="text-xl">🚀</div>
          <div>
            <h2 className="text-sm font-bold text-emerald-900 mb-0.5">Pilot Program Opt-in Saved</h2>
            <p className="text-xs text-emerald-800 leading-relaxed">
              We noted your interest in testing early ride signals! When our prototype launches for your route, we will reach out with early access.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Submit Another Response</span>
        </button>
      </div>
    </div>
  );
};
