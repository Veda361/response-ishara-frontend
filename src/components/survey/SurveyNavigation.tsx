import React from 'react';
import { ArrowLeft, ArrowRight, Loader2, Send } from 'lucide-react';

interface SurveyNavigationProps {
  canGoBack: boolean;
  onBack: () => void;
  onNext: () => void;
  isLastStep: boolean;
  isSubmitting?: boolean;
  canProceed?: boolean;
  nextButtonText?: string;
}

export const SurveyNavigation: React.FC<SurveyNavigationProps> = ({
  canGoBack,
  onBack,
  onNext,
  isLastStep,
  isSubmitting = false,
  canProceed = true,
  nextButtonText,
}) => {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-slate-200/80 mt-8 gap-4">
      {canGoBack ? (
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      ) : (
        <div />
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={!canProceed || isSubmitting}
        className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-[0.98] ${
          !canProceed || isSubmitting
            ? 'bg-slate-300 cursor-not-allowed opacity-70'
            : isLastStep
            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
            : 'bg-slate-900 hover:bg-slate-800'
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting Response...
          </>
        ) : isLastStep ? (
          <>
            <span>Submit Survey</span>
            <Send className="w-4 h-4" />
          </>
        ) : (
          <>
            <span>{nextButtonText || 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};
