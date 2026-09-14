import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SectionLabel } from '../common/SectionLabel';

interface SurveyProgressProps {
  currentStep: number;
  totalSteps: number;
  categoryTitle?: string;
  stepsList?: string[];
  onSelectStep?: (stepIndex: number) => void;
  variant?: 'compact' | 'chapterList';
  theme?: 'light' | 'dark';
}

export const SurveyProgress: React.FC<SurveyProgressProps> = ({
  currentStep,
  totalSteps,
  categoryTitle,
  stepsList,
  onSelectStep,
  variant = 'compact',
  theme = 'light',
}) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  const formattedCurrent = String(Math.max(1, currentStep)).padStart(2, '0');
  const formattedTotal = String(totalSteps).padStart(2, '0');

  if (variant === 'chapterList' && stepsList && stepsList.length > 0) {
    return (
      <div className="flex flex-col h-full justify-between">
        <div className="space-y-1">
          <SectionLabel
            number={formattedCurrent}
            label="RESEARCH QUESTION MATRIX"
            theme={theme}
            className="mb-4"
          />

          <ul className="space-y-2.5" role="list">
            {stepsList.map((stepLabel, idx) => {
              const stepIndex = idx + 1;
              const isActive = currentStep === stepIndex;
              const isPast = currentStep > stepIndex;

              return (
                <li key={idx} aria-current={isActive ? 'step' : undefined}>
                  <button
                    type="button"
                    onClick={() => onSelectStep?.(stepIndex)}
                    disabled={!onSelectStep || stepIndex > currentStep + 1}
                    className={`group flex w-full items-center justify-between text-left transition-all py-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 ${
                      isActive
                        ? theme === 'dark'
                          ? 'text-white font-medium pl-2 border-l-2 border-white'
                          : 'text-neutral-950 font-medium pl-2 border-l-2 border-neutral-900'
                        : isPast
                        ? theme === 'dark'
                          ? 'text-neutral-400 hover:text-neutral-200'
                          : 'text-neutral-600 hover:text-neutral-900'
                        : theme === 'dark'
                        ? 'text-neutral-600'
                        : 'text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] tracking-wider uppercase">
                        {String(stepIndex).padStart(2, '0')}
                      </span>
                      <span className="text-xs tracking-tight line-clamp-1">
                        {stepLabel}
                      </span>
                    </div>

                    {isActive && (
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-90 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 mt-6 flex items-center justify-between font-mono text-[11px] tracking-[0.2em] uppercase">
          <span className="text-neutral-500">STAGE</span>
          <span className="font-semibold text-neutral-900 dark:text-white">
            {formattedCurrent} / {formattedTotal}
          </span>
        </div>
      </div>
    );
  }

  // Compact bar for header/top of survey cards
  return (
    <div className="w-full space-y-2.5 select-none">
      <div className="flex items-center justify-between font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase">
        <span className="text-neutral-500">
          {categoryTitle || `PHASE ${formattedCurrent} OF ${formattedTotal}`}
        </span>
        <span className="text-neutral-900 font-semibold">{percentage}% COMPLETED</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden bg-neutral-200/80">
        <div
          className="h-full bg-neutral-900 transition-all duration-500 ease-signature"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
