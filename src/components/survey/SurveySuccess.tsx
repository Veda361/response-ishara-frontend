import React from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { SectionLabel } from '../common/SectionLabel';
import { CTAButton } from '../common/CTAButton';

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
    <div className="mx-auto max-w-2xl text-center py-16 px-6">
      {/* Confirmation Indicator */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 text-white mb-6">
        <Check className="w-8 h-8 stroke-[2.5]" />
      </div>

      <div className="flex justify-center mb-3">
        <SectionLabel number="REC" label="TRANSMISSION ARCHIVED" />
      </div>

      <h1 className="text-4xl md:text-5xl font-normal text-neutral-950 tracking-tight mb-6">
        Insight Logged.
      </h1>

      <p className="text-sm md:text-base text-neutral-600 leading-relaxed max-w-xl mx-auto mb-10">
        Your response has been secured to the Ishara transit research platform.
        {collegeName ? ` Data from students at ${collegeName} ` : ' Your commute telemetry '}
        directly validates wait times, bottlenecks, and the necessity of real-time student ride signals.
      </p>

      {interestedInPilot && (
        <div className="border border-neutral-300 bg-neutral-50 p-6 mb-10 text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 bg-neutral-900 rounded-full" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-neutral-900">
              PILOT PROGRAM ENROLLMENT ACTIVE
            </span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Your interest in testing early route signals has been recorded. When the Ishara prototype pilot expands to your campus corridor, you will be alerted for priority access.
          </p>
        </div>
      )}

      <div className="flex items-center justify-center">
        <CTAButton
          type="button"
          onClick={onReset}
          variant="primary"
          size="md"
          icon={<RotateCcw className="w-4 h-4" />}
          iconPosition="left"
        >
          SUBMIT ANOTHER RECORD
        </CTAButton>
      </div>
    </div>
  );
};
