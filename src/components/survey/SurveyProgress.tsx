import React from 'react';

interface SurveyProgressProps {
  currentStep: number;
  totalSteps: number;
  categoryTitle?: string;
}

export const SurveyProgress: React.FC<SurveyProgressProps> = ({
  currentStep,
  totalSteps,
  categoryTitle,
}) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <span>
          {categoryTitle || `Question ${currentStep} of ${totalSteps}`}
        </span>
        <span className="text-emerald-700 font-bold">{percentage}% completed</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200/80">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
