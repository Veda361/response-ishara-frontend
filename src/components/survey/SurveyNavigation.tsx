import React from 'react';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { CTAButton } from '../common/CTAButton';

interface SurveyNavigationProps {
  canGoBack: boolean;
  onBack: () => void;
  onNext: () => void;
  isLastStep: boolean;
  isSubmitting?: boolean;
  canProceed?: boolean;
  nextButtonText?: string;
  theme?: 'light' | 'dark';
}

export const SurveyNavigation: React.FC<SurveyNavigationProps> = ({
  canGoBack,
  onBack,
  onNext,
  isLastStep,
  isSubmitting = false,
  canProceed = true,
  nextButtonText,
  theme = 'light',
}) => {
  return (
    <div
      className={`flex items-center justify-between pt-8 border-t mt-10 gap-4 ${
        theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
      }`}
    >
      {canGoBack ? (
        <CTAButton
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          variant="secondary"
          size="sm"
          icon={<ArrowLeft className="w-3.5 h-3.5" />}
          iconPosition="left"
        >
          PREVIOUS
        </CTAButton>
      ) : (
        <div />
      )}

      <CTAButton
        type="button"
        onClick={onNext}
        disabled={!canProceed || isSubmitting}
        loading={isSubmitting}
        variant={theme === 'dark' ? 'dark' : 'primary'}
        size="md"
        icon={
          isLastStep ? (
            <Send className="w-3.5 h-3.5" />
          ) : (
            <ArrowRight className="w-3.5 h-3.5" />
          )
        }
        iconPosition="right"
      >
        {isSubmitting
          ? 'SAVING RESPONSE...'
          : isLastStep
          ? 'SUBMIT SURVEY'
          : nextButtonText
          ? nextButtonText.toUpperCase()
          : 'CONTINUE'}
      </CTAButton>
    </div>
  );
};
