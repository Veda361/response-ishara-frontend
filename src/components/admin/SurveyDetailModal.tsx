import React from 'react';
import type { ISurveyResponse } from '../../types/survey';
import { formatEnum, formatDate } from '../../utils/formatters';
import { X, Building2, Calendar, User, Phone, Clock } from 'lucide-react';

interface SurveyDetailModalProps {
  survey: ISurveyResponse | null;
  onClose: () => void;
}

export const SurveyDetailModal: React.FC<SurveyDetailModalProps> = ({ survey, onClose }) => {
  if (!survey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚗</span>
              <h2 className="text-lg font-bold text-slate-900">Survey Response Details</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Submitted on {formatDate(survey.createdAt)}</span>
              <span>•</span>
              <span className="font-mono text-[10px] text-slate-400">ID: {survey._id}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Profile */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 mb-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Student Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-slate-500 block">College</span>
                <span className="font-bold text-slate-900">{survey.student?.college || '—'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-slate-500 block">Student Name</span>
                <span className="font-medium text-slate-800">{survey.student?.name || 'Anonymous'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-slate-500 block">Year of Study</span>
                <span className="font-medium text-slate-800">{survey.student?.yearOfStudy || '—'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-slate-500 block">Contact Info</span>
                <span className="font-medium text-slate-800">{survey.student?.contact || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600">Interested in Pilot Program:</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-full ${
                survey.student?.interestedInPilot
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {survey.student?.interestedInPilot ? 'Yes, Opted In' : 'No'}
            </span>
          </div>
        </div>

        {/* 12 Survey Answers */}
        <div className="space-y-4 text-xs sm:text-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Survey Question Answers
          </h3>

          <div className="border border-slate-100 rounded-xl p-3 bg-white space-y-1">
            <span className="text-slate-500 block text-xs">Q1. Usual Travel Mode</span>
            <span className="font-semibold text-slate-900">{formatEnum(survey.travel?.usualTravelMode)}</span>
          </div>

          <div className="border border-slate-100 rounded-xl p-3 bg-white space-y-1">
            <span className="text-slate-500 block text-xs">Q2. Difficulty Finding Ride</span>
            <span className="font-semibold text-slate-900">{formatEnum(survey.travel?.difficultyFindingRide)}</span>
          </div>

          <div className="border border-slate-100 rounded-xl p-3 bg-white space-y-1">
            <span className="text-slate-500 block text-xs">Q3. Problems Faced</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {(survey.travel?.problemsFaced || []).map((p) => (
                <span key={p} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium">
                  {formatEnum(p)}
                </span>
              ))}
            </div>
          </div>

          <div className="border border-slate-100 rounded-xl p-3 bg-white space-y-1">
            <span className="text-slate-500 block text-xs">Q4. Longest Wait Time</span>
            <span className="font-semibold text-slate-900">{formatEnum(survey.travel?.longestWait)}</span>
          </div>

          <div className="border border-slate-100 rounded-xl p-3 bg-white space-y-1">
            <span className="text-slate-500 block text-xs">Q5. Needed Urgent Transport</span>
            <span className="font-semibold text-slate-900">{formatEnum(survey.neededUrgentTransport)}</span>
          </div>

          <div className="border border-slate-100 rounded-xl p-3 bg-white space-y-1">
            <span className="text-slate-500 block text-xs">Q6. Seen Vehicle Going Same Direction</span>
            <span className="font-semibold text-slate-900">{formatEnum(survey.seenVehicleGoingMyWay)}</span>
          </div>

          <div className="border border-slate-100 rounded-xl p-3 bg-white space-y-1">
            <span className="text-slate-500 block text-xs">Q7. Nearby Verified Vehicle Usefulness</span>
            <span className="font-semibold text-slate-900">{formatEnum(survey.nearbyVerifiedVehicleUseful)}</span>
          </div>

          <div className="border border-slate-100 rounded-xl p-3 bg-white space-y-1">
            <span className="text-slate-500 block text-xs">Q8. Trust Factors</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {(survey.trustFactors || []).map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-medium">
                  {formatEnum(t)}
                </span>
              ))}
            </div>
          </div>

          <div className="border border-slate-100 rounded-xl p-3 bg-white space-y-1">
            <span className="text-slate-500 block text-xs">Q9. Would Use Ride Signal</span>
            <span className="font-semibold text-slate-900">{formatEnum(survey.wouldUseRideSignal)}</span>
          </div>

          <div className="border border-slate-100 rounded-xl p-3 bg-white space-y-1">
            <span className="text-slate-500 block text-xs">Q10. Biggest Bottleneck</span>
            <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 inline-block">
              {formatEnum(survey.biggestProblem)}
            </span>
          </div>

          <div className="border border-slate-100 rounded-xl p-3 bg-white space-y-1">
            <span className="text-slate-500 block text-xs">Q11. Isahara Adoption Intent</span>
            <span className="font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block">
              {formatEnum(survey.wouldTryIsahara)}
            </span>
          </div>

          {survey.improvementSuggestion && (
            <div className="border border-slate-100 rounded-xl p-3 bg-white space-y-1">
              <span className="text-slate-500 block text-xs">Q12. What student would change</span>
              <p className="text-slate-800 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs leading-relaxed">
                "{survey.improvementSuggestion}"
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-slate-100 pt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
