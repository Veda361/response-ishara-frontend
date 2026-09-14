import React from 'react';
import type { ISurveyResponse } from '../../types/survey';
import { formatEnum, formatDate } from '../../utils/formatters';
import { SectionLabel } from '../common/SectionLabel';
import { CTAButton } from '../common/CTAButton';
import { X, Building2, Calendar, User, Phone, Clock } from 'lucide-react';

interface SurveyDetailModalProps {
  survey: ISurveyResponse | null;
  onClose: () => void;
}

export const SurveyDetailModal: React.FC<SurveyDetailModalProps> = ({ survey, onClose }) => {
  if (!survey) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 md:p-6 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl border border-neutral-300 bg-white p-6 sm:p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-200 pb-5 mb-8">
          <div>
            <SectionLabel number="REC" label="INDIVIDUAL TELEMETRY LOG" className="mb-2" />
            <h2 className="text-xl font-normal text-neutral-950 font-sans">
              Respondent Profile &amp; Answers
            </h2>
            <p className="font-mono text-[11px] text-neutral-500 mt-1 flex items-center gap-2 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>LOGGED ON {formatDate(survey.createdAt)}</span>
              <span>•</span>
              <span className="text-neutral-400">ID: {survey._id}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 border border-neutral-300 hover:border-neutral-900 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Student Profile Card */}
        <div className="border border-neutral-300 bg-[#fcfcfc] p-5 mb-8 space-y-4">
          <SectionLabel number="ID" label="STUDENT IDENTIFICATION" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-neutral-400 shrink-0" />
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">COLLEGE / CAMPUS</span>
                <span className="font-semibold text-neutral-900 uppercase">
                  {survey.student?.college || '—'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-neutral-400 shrink-0" />
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">STUDENT NAME</span>
                <span className="font-semibold text-neutral-900 uppercase">
                  {survey.student?.name || 'ANONYMOUS'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">YEAR OF STUDY</span>
                <span className="font-semibold text-neutral-900 uppercase">
                  {survey.student?.yearOfStudy || '—'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">CONTACT INFORMATION</span>
                <span className="font-semibold text-neutral-900">
                  {survey.student?.contact || 'Not provided'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between font-mono text-xs">
            <span className="text-neutral-500 uppercase tracking-wider">PILOT RECRUITMENT STATUS:</span>
            <span
              className={`font-semibold px-2.5 py-0.5 border text-[10px] uppercase tracking-wider ${
                survey.student?.interestedInPilot
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-300 text-neutral-500 bg-neutral-100'
              }`}
            >
              {survey.student?.interestedInPilot ? 'OPTED IN' : 'DECLINED'}
            </span>
          </div>
        </div>

        {/* 12 Survey Answers Grid */}
        <div className="space-y-4">
          <SectionLabel number="ANS" label="12 QUESTION TELEMETRY BREAKDOWN" className="mb-2" />

          <div className="border border-neutral-200 p-3.5 bg-white space-y-1 font-mono text-xs">
            <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">
              Q01. USUAL TRAVEL MODE
            </span>
            <span className="font-semibold text-neutral-900 uppercase">
              {formatEnum(survey.travel?.usualTravelMode)}
            </span>
          </div>

          <div className="border border-neutral-200 p-3.5 bg-white space-y-1 font-mono text-xs">
            <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">
              Q02. DIFFICULTY FINDING RIDE
            </span>
            <span className="font-semibold text-neutral-900 uppercase">
              {formatEnum(survey.travel?.difficultyFindingRide)}
            </span>
          </div>

          <div className="border border-neutral-200 p-3.5 bg-white space-y-1 font-mono text-xs">
            <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">
              Q03. PROBLEMS FACED
            </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {(survey.travel?.problemsFaced || []).map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 border border-neutral-300 bg-neutral-50 text-neutral-800 text-[10px] uppercase tracking-wider"
                >
                  {formatEnum(p)}
                </span>
              ))}
            </div>
          </div>

          <div className="border border-neutral-200 p-3.5 bg-white space-y-1 font-mono text-xs">
            <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">
              Q04. LONGEST WAIT TIME
            </span>
            <span className="font-semibold text-neutral-900 uppercase">
              {formatEnum(survey.travel?.longestWait)}
            </span>
          </div>

          <div className="border border-neutral-200 p-3.5 bg-white space-y-1 font-mono text-xs">
            <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">
              Q05. NEEDED URGENT TRANSPORT
            </span>
            <span className="font-semibold text-neutral-900 uppercase">
              {formatEnum(survey.neededUrgentTransport)}
            </span>
          </div>

          <div className="border border-neutral-200 p-3.5 bg-white space-y-1 font-mono text-xs">
            <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">
              Q06. SEEN VEHICLE GOING TOWARDS CORRIDOR
            </span>
            <span className="font-semibold text-neutral-900 uppercase">
              {formatEnum(survey.seenVehicleGoingMyWay)}
            </span>
          </div>

          <div className="border border-neutral-200 p-3.5 bg-white space-y-1 font-mono text-xs">
            <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">
              Q07. NEARBY VERIFIED VEHICLE UTILITY
            </span>
            <span className="font-semibold text-neutral-900 uppercase">
              {formatEnum(survey.nearbyVerifiedVehicleUseful)}
            </span>
          </div>

          <div className="border border-neutral-200 p-3.5 bg-white space-y-1 font-mono text-xs">
            <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">
              Q08. TRUST FACTORS REQUIRED
            </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {(survey.trustFactors || []).map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 border border-neutral-300 bg-neutral-50 text-neutral-800 text-[10px] uppercase tracking-wider"
                >
                  {formatEnum(t)}
                </span>
              ))}
            </div>
          </div>

          <div className="border border-neutral-200 p-3.5 bg-white space-y-1 font-mono text-xs">
            <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">
              Q09. WOULD USE RIDE SIGNAL
            </span>
            <span className="font-semibold text-neutral-900 uppercase">
              {formatEnum(survey.wouldUseRideSignal)}
            </span>
          </div>

          <div className="border border-neutral-200 p-3.5 bg-white space-y-1 font-mono text-xs">
            <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">
              Q10. BIGGEST BOTTLENECK
            </span>
            <span className="px-2 py-0.5 border border-neutral-300 bg-neutral-50 text-neutral-900 font-semibold uppercase tracking-wider inline-block">
              {formatEnum(survey.biggestProblem)}
            </span>
          </div>

          <div className="border border-neutral-200 p-3.5 bg-white space-y-1 font-mono text-xs">
            <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">
              Q11. ISHARA ADOPTION WILLINGNESS
            </span>
            <span className="px-2 py-0.5 border border-neutral-900 bg-neutral-900 text-white font-semibold uppercase tracking-wider inline-block">
              {formatEnum(survey.wouldTryIsahara)}
            </span>
          </div>

          {survey.improvementSuggestion && (
            <div className="border border-neutral-200 p-3.5 bg-white space-y-1.5 font-mono text-xs">
              <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">
                Q12. DIRECT FEEDBACK / SUGGESTION
              </span>
              <p className="text-neutral-800 bg-neutral-50 p-3 border border-neutral-300 text-xs leading-relaxed">
                &ldquo;{survey.improvementSuggestion}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-neutral-200 pt-5 flex justify-end">
          <CTAButton
            type="button"
            onClick={onClose}
            variant="outline"
            size="sm"
          >
            DISMISS
          </CTAButton>
        </div>
      </div>
    </div>
  );
};
