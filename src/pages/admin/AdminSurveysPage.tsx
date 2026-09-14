import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../api/admin.api';
import type { ISurveyResponse, SurveyListQuery } from '../../types/survey';
import type { PaginationMeta } from '../../types/api';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { SurveyDetailModal } from '../../components/admin/SurveyDetailModal';
import { SectionLabel } from '../../components/common/SectionLabel';
import { PillButton } from '../../components/common/PillButton';
import { formatEnum, formatDate } from '../../utils/formatters';
import {
  Search,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Building2,
} from 'lucide-react';

export const AdminSurveysPage: React.FC = () => {
  const [surveys, setSurveys] = useState<ISurveyResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [wouldTryIsahara, setWouldTryIsahara] = useState<string>('');
  const [interestedInPilot, setInterestedInPilot] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  // Modals & Actions
  const [selectedSurvey, setSelectedSurvey] = useState<ISurveyResponse | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSurveys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query: SurveyListQuery = {
        page,
        limit: 10,
      };
      if (search.trim()) query.search = search.trim();
      if (wouldTryIsahara) query.wouldTryIsahara = wouldTryIsahara;
      if (interestedInPilot !== '') query.interestedInPilot = interestedInPilot === 'true';

      const response = await adminApi.getSurveys(query);
      setSurveys(response.data?.responses || []);
      if (response.data?.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (err: unknown) {
      console.error('Failed to load surveys:', err);
      const msg = err instanceof Error ? err.message : 'Failed to fetch surveys';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, wouldTryIsahara, interestedInPilot, search]);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this telemetry record?')) {
      return;
    }

    setDeletingId(id);
    try {
      await adminApi.deleteSurvey(id);
      setSurveys((prev: ISurveyResponse[]) => prev.filter((s) => s._id !== id));
      setPagination((prev: PaginationMeta) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete response. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-6 md:px-12 pt-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <SectionLabel number="02" label="SURVEY RESPONSE ARCHIVE" className="mb-2" />
            <h1 className="text-2xl sm:text-3xl font-normal text-neutral-950 tracking-tight font-sans">
              Respondent Telemetry Dataset
            </h1>
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mt-1">
              Browsing {pagination.total} individual student submissions
            </p>
          </div>

          <button
            type="button"
            onClick={fetchSurveys}
            disabled={loading}
            className="inline-flex items-center gap-2 border border-neutral-300 bg-white px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-neutral-700 hover:border-neutral-900 transition-colors disabled:opacity-50 select-none cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-neutral-500 ${loading ? 'animate-spin' : ''}`} />
            <span>SYNC DATASET</span>
          </button>
        </div>

        {/* Section 2C Action Pills & Filter Row */}
        <div className="border border-neutral-300 bg-white p-5 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="SEARCH NAME, CORRIDOR, YEAR..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-neutral-300 bg-[#fcfcfc] pl-10 pr-3.5 py-2 font-mono text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            {/* Action Pills: Adoption Intent (Section 2C) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 mr-1">
                ADOPTION:
              </span>
              <PillButton
                size="sm"
                active={wouldTryIsahara === ''}
                onClick={() => {
                  setWouldTryIsahara('');
                  setPage(1);
                }}
              >
                ALL
              </PillButton>
              <PillButton
                size="sm"
                active={wouldTryIsahara === 'definitely'}
                onClick={() => {
                  setWouldTryIsahara('definitely');
                  setPage(1);
                }}
              >
                DEFINITELY
              </PillButton>
              <PillButton
                size="sm"
                active={wouldTryIsahara === 'probably'}
                onClick={() => {
                  setWouldTryIsahara('probably');
                  setPage(1);
                }}
              >
                PROBABLY
              </PillButton>
              <PillButton
                size="sm"
                active={wouldTryIsahara === 'maybe'}
                onClick={() => {
                  setWouldTryIsahara('maybe');
                  setPage(1);
                }}
              >
                MAYBE
              </PillButton>
            </div>

            {/* Action Pills: Pilot Status */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 mr-1">
                PILOT:
              </span>
              <PillButton
                size="sm"
                active={interestedInPilot === ''}
                onClick={() => {
                  setInterestedInPilot('');
                  setPage(1);
                }}
              >
                ALL
              </PillButton>
              <PillButton
                size="sm"
                active={interestedInPilot === 'true'}
                onClick={() => {
                  setInterestedInPilot('true');
                  setPage(1);
                }}
              >
                OPTED IN
              </PillButton>
              <PillButton
                size="sm"
                active={interestedInPilot === 'false'}
                onClick={() => {
                  setInterestedInPilot('false');
                  setPage(1);
                }}
              >
                OPTED OUT
              </PillButton>
            </div>

            {(search || wouldTryIsahara || interestedInPilot) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setWouldTryIsahara('');
                  setInterestedInPilot('');
                  setPage(1);
                }}
                className="font-mono text-xs uppercase tracking-wider text-neutral-500 hover:text-neutral-900 underline ml-auto"
              >
                RESET
              </button>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="border border-neutral-900 bg-neutral-900 text-white p-6 my-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-neutral-300" />
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider">Failed to Load Records</h3>
                <p className="font-mono text-xs text-neutral-400 mt-0.5">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Responses Table */}
        <div className="border border-neutral-300 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-300 bg-neutral-100 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                  <th className="py-3.5 px-4">STUDENT &amp; CORRIDOR</th>
                  <th className="py-3.5 px-4">COMMUTE MODE</th>
                  <th className="py-3.5 px-4">WAIT TIME</th>
                  <th className="py-3.5 px-4">BOTTLENECK</th>
                  <th className="py-3.5 px-4">ADOPTION</th>
                  <th className="py-3.5 px-4">PILOT</th>
                  <th className="py-3.5 px-4">SUBMITTED</th>
                  <th className="py-3.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {loading && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 animate-pulse">
                        [ FETCHING RECORDS FROM MONGODB ]
                      </span>
                    </td>
                  </tr>
                )}

                {!loading && surveys.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <SectionLabel number="00" label="NO MATCHING RESPONSES" className="mb-2" />
                      <p className="font-mono text-xs text-neutral-500 uppercase tracking-wider">
                        Adjust filter parameters or query string
                      </p>
                    </td>
                  </tr>
                )}

                {!loading &&
                  surveys.map((survey: ISurveyResponse) => (
                    <tr key={survey._id} className="hover:bg-neutral-50 transition-colors">
                      {/* Student & College */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-neutral-950 font-mono text-xs">
                          {survey.student?.name || 'ANONYMOUS'}
                        </div>
                        <div className="text-[11px] text-neutral-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span className="truncate max-w-[170px] uppercase">{survey.student?.college}</span>
                        </div>
                      </td>

                      {/* Commute Mode */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-700 uppercase">
                        {formatEnum(survey.travel?.usualTravelMode)}
                      </td>

                      {/* Wait Time */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-700 uppercase">
                        {formatEnum(survey.travel?.longestWait)}
                      </td>

                      {/* Biggest Bottleneck */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 border border-neutral-300 bg-neutral-50 font-mono text-[10px] uppercase tracking-wider text-neutral-800 inline-block">
                          {formatEnum(survey.biggestProblem)}
                        </span>
                      </td>

                      {/* Adoption Intent */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider border ${
                            survey.wouldTryIsahara === 'definitely'
                              ? 'border-neutral-900 bg-neutral-900 text-white'
                              : 'border-neutral-300 text-neutral-700 bg-neutral-50'
                          }`}
                        >
                          {formatEnum(survey.wouldTryIsahara)}
                        </span>
                      </td>

                      {/* Pilot Opt-in */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {survey.student?.interestedInPilot ? (
                          <span className="text-neutral-900 font-semibold uppercase">
                            [ OPT-IN ]
                          </span>
                        ) : (
                          <span className="text-neutral-400 uppercase">[ NO ]</span>
                        )}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 font-mono text-[10px] text-neutral-400 uppercase">
                        {formatDate(survey.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => setSelectedSurvey(survey)}
                          className="inline-flex items-center justify-center p-1.5 border border-neutral-300 hover:border-neutral-900 text-neutral-700 hover:text-neutral-950 transition-colors"
                          title="Inspect all 12 telemetry responses"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(survey._id)}
                          disabled={deletingId === survey._id}
                          className="inline-flex items-center justify-center p-1.5 border border-neutral-300 hover:border-rose-600 text-neutral-400 hover:text-rose-600 transition-colors disabled:opacity-50"
                          title="Delete response"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Toolbar */}
          <div className="flex items-center justify-between border-t border-neutral-300 px-4 py-3 bg-[#fcfcfc] font-mono text-[11px] text-neutral-500 uppercase tracking-wider">
            <div>
              [ PAGE <span className="font-semibold text-neutral-900">{pagination.page}</span> OF{' '}
              <span className="font-semibold text-neutral-900">{pagination.totalPages}</span> ] — {pagination.total} TOTAL RECORDS
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                disabled={pagination.page <= 1 || loading}
                className="inline-flex items-center gap-1 border border-neutral-300 px-3 py-1 text-neutral-800 hover:border-neutral-900 disabled:opacity-40 disabled:hover:border-neutral-300 transition-colors"
              >
                <ChevronLeft className="w-3 h-3" />
                <span>PREV</span>
              </button>

              <button
                type="button"
                onClick={() => setPage((p: number) => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page >= pagination.totalPages || loading}
                className="inline-flex items-center gap-1 border border-neutral-300 px-3 py-1 text-neutral-800 hover:border-neutral-900 disabled:opacity-40 disabled:hover:border-neutral-300 transition-colors"
              >
                <span>NEXT</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      <SurveyDetailModal
        survey={selectedSurvey}
        onClose={() => setSelectedSurvey(null)}
      />
    </div>
  );
};
