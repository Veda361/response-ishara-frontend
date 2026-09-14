import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../api/admin.api';
import type { ISurveyResponse, SurveyListQuery } from '../../types/survey';
import type { PaginationMeta } from '../../types/api';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { SurveyDetailModal } from '../../components/admin/SurveyDetailModal';
import { formatEnum, formatDate } from '../../utils/formatters';
import {
  Search,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
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
  const [college, setCollege] = useState<string>('');
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
      if (college.trim()) query.college = college.trim();
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
  }, [page, college, wouldTryIsahara, interestedInPilot, search]);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this survey response?')) {
      return;
    }

    setDeletingId(id);
    try {
      await adminApi.deleteSurvey(id);
      // Remove locally or refresh
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
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <AdminNavbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Survey Responses
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browsing {pagination.total} individual student submissions
            </p>
          </div>

          <button
            type="button"
            onClick={fetchSurveys}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, college, year..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Adoption Filter */}
          <select
            value={wouldTryIsahara}
            onChange={(e) => {
              setWouldTryIsahara(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-auto rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 bg-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All Adoption Intent</option>
            <option value="definitely">Definitely</option>
            <option value="probably">Probably</option>
            <option value="maybe">Maybe</option>
            <option value="probably_not">Probably not</option>
            <option value="definitely_not">Definitely not</option>
          </select>

          {/* Pilot Opt-in Filter */}
          <select
            value={interestedInPilot}
            onChange={(e) => {
              setInterestedInPilot(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-auto rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 bg-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All Pilot Status</option>
            <option value="true">Opted into Pilot</option>
            <option value="false">Did Not Opt In</option>
          </select>

          {(search || college || wouldTryIsahara || interestedInPilot) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCollege('');
                setWouldTryIsahara('');
                setInterestedInPilot('');
                setPage(1);
              }}
              className="text-xs text-rose-600 hover:underline shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-800 my-6">
            <AlertCircle className="mx-auto w-6 h-6 text-rose-600 mb-2" />
            <h3 className="font-bold text-sm">Error Loading Survey Records</h3>
            <p className="text-xs text-rose-700 mt-1">{error}</p>
          </div>
        )}

        {/* Responses Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Student & College</th>
                  <th className="py-3 px-4">Commute Mode</th>
                  <th className="py-3 px-4">Wait Time</th>
                  <th className="py-3 px-4">Biggest Bottleneck</th>
                  <th className="py-3 px-4">Adoption Intent</th>
                  <th className="py-3 px-4">Pilot Opt-in</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Loader2 className="mx-auto w-6 h-6 animate-spin text-emerald-600 mb-2" />
                      <span>Fetching survey responses from backend...</span>
                    </td>
                  </tr>
                )}

                {!loading && surveys.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <div className="text-2xl mb-1">📋</div>
                      <p className="font-bold text-sm text-slate-700">No responses match the current query</p>
                      <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search or filters.</p>
                    </td>
                  </tr>
                )}

                {!loading &&
                  surveys.map((survey: ISurveyResponse) => (
                    <tr key={survey._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Student & College */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">
                          {survey.student?.name || 'Anonymous'}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[150px]">{survey.student?.college}</span>
                        </div>
                      </td>

                      {/* Commute Mode */}
                      <td className="py-3 px-4 text-slate-700">
                        {formatEnum(survey.travel?.usualTravelMode)}
                      </td>

                      {/* Wait Time */}
                      <td className="py-3 px-4 text-slate-700">
                        {formatEnum(survey.travel?.longestWait)}
                      </td>

                      {/* Biggest Bottleneck */}
                      <td className="py-3 px-4 text-slate-700">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-medium inline-block">
                          {formatEnum(survey.biggestProblem)}
                        </span>
                      </td>

                      {/* Adoption Intent */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            survey.wouldTryIsahara === 'definitely'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : survey.wouldTryIsahara === 'probably'
                              ? 'bg-teal-50 text-teal-700 border-teal-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {formatEnum(survey.wouldTryIsahara)}
                        </span>
                      </td>

                      {/* Pilot Opt-in */}
                      <td className="py-3 px-4">
                        {survey.student?.interestedInPilot ? (
                          <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                            <span>✓</span> Opted In
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">No</span>
                        )}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {formatDate(survey.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => setSelectedSurvey(survey)}
                          className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="View all 12 answers"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(survey._id)}
                          disabled={deletingId === survey._id}
                          className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                          title="Delete response"
                        >
                          {deletingId === survey._id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Toolbar */}
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 bg-white text-xs text-slate-500">
            <div>
              Showing page <span className="font-bold text-slate-900">{pagination.page}</span> of{' '}
              <span className="font-bold text-slate-900">{pagination.totalPages}</span> ({pagination.total} total)
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                disabled={pagination.page <= 1 || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <button
                type="button"
                onClick={() => setPage((p: number) => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page >= pagination.totalPages || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Survey Detail Inspection Modal */}
      <SurveyDetailModal
        survey={selectedSurvey}
        onClose={() => setSelectedSurvey(null)}
      />
    </div>
  );
};
