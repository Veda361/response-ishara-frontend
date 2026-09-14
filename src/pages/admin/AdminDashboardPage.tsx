import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../api/admin.api';
import type { AnalyticsOverview, AnalyticsFilterQuery } from '../../types/analytics';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { KpiCard } from '../../components/admin/KpiCard';
import { AnalyticsCharts } from '../../components/admin/AnalyticsCharts';
import { formatEnum } from '../../utils/formatters';
import {
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  Filter,
  RefreshCw,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [collegeFilter, setCollegeFilter] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<string>('');

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: AnalyticsFilterQuery = {};
      if (collegeFilter.trim()) filters.college = collegeFilter.trim();
      if (yearFilter.trim()) filters.yearOfStudy = yearFilter.trim();

      const response = await adminApi.getAnalyticsOverview(filters);
      setData(response.data || null);
    } catch (err: unknown) {
      console.error('Failed to load analytics:', err);
      const msg = err instanceof Error ? err.message : 'Failed to fetch analytics from backend';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [collegeFilter, yearFilter]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Derived KPI metrics
  const total = data?.totalResponses || 0;
  const pilotOptIns = Number(data?.pilotInterest?.['true'] || 0);
  const pilotRate = total > 0 ? `${Math.round((pilotOptIns / total) * 100)}%` : '0%';

  // Top travel mode
  const travelEntries = Object.entries(data?.transportModes || {}) as [string, number][];
  const topTravelModeEntry = travelEntries.sort((a, b) => b[1] - a[1])[0];
  const topTravelMode = topTravelModeEntry ? formatEnum(topTravelModeEntry[0]) : '—';

  // Top bottleneck
  const problemEntries = Object.entries(data?.biggestProblem || {}) as [string, number][];
  const topProblemEntry = problemEntries.sort((a, b) => b[1] - a[1])[0];
  const topProblem = topProblemEntry ? formatEnum(topProblemEntry[0]) : '—';

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <AdminNavbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Executive Analytics Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live data aggregation computed directly via MongoDB pipelines on Render
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAnalytics}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Filter By:</span>
          </div>

          <div className="flex flex-1 w-full sm:w-auto gap-3">
            <input
              type="text"
              placeholder="College name (regex search)..."
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
            />

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 bg-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="">All Years of Study</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>

          {(collegeFilter || yearFilter) && (
            <button
              type="button"
              onClick={() => {
                setCollegeFilter('');
                setYearFilter('');
              }}
              className="text-xs text-rose-600 hover:underline shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-white border border-slate-200 p-5 animate-pulse" />
              ))}
            </div>
            <div className="h-96 rounded-2xl bg-white border border-slate-200 p-8 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-800 my-8">
            <AlertCircle className="mx-auto w-8 h-8 text-rose-600 mb-2" />
            <h3 className="font-bold text-base mb-1">Failed to Load Backend Analytics</h3>
            <p className="text-xs text-rose-700 mb-4">{error}</p>
            <button
              type="button"
              onClick={fetchAnalytics}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>
          </div>
        )}

        {/* Real Data Render */}
        {!loading && !error && data && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <KpiCard
                title="Total Responses"
                value={total}
                subtitle="Students surveyed"
                icon={<Users className="w-4 h-4 text-emerald-600" />}
              />

              <KpiCard
                title="Pilot Opt-in Rate"
                value={pilotRate}
                subtitle={`${pilotOptIns} students joined pilot`}
                icon={<CheckCircle className="w-4 h-4 text-indigo-600" />}
              />

              <KpiCard
                title="Primary Commute Mode"
                value={topTravelMode}
                subtitle="Most frequent mode"
                icon={<Clock className="w-4 h-4 text-amber-600" />}
              />

              <KpiCard
                title="Top Bottleneck"
                value={topProblem}
                subtitle="Biggest student problem"
                icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
              />
            </div>

            {/* Empty State */}
            {total === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center my-8">
                <span className="text-4xl">📊</span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">No Survey Responses Recorded Yet</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  Take the survey from the public landing page or share the link with college students to see live analytics populated here.
                </p>
              </div>
            ) : (
              <AnalyticsCharts data={data} />
            )}
          </>
        )}
      </div>
    </div>
  );
};
