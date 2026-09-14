import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../api/admin.api';
import type { AnalyticsOverview, AnalyticsFilterQuery } from '../../types/analytics';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { KpiCard } from '../../components/admin/KpiCard';
import { AnalyticsCharts } from '../../components/admin/AnalyticsCharts';
import { SectionLabel } from '../../components/common/SectionLabel';
import { PillButton } from '../../components/common/PillButton';
import { formatEnum } from '../../utils/formatters';
import {
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
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
    <div className="min-h-screen bg-[#fcfcfc] pb-20">
      <AdminNavbar />

      {/* Section 3B: Dark Section Header Band */}
      <section className="bg-[#0a0a0a] text-white border-b border-neutral-800 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <SectionLabel number="01" label="EXECUTIVE RESEARCH HUB" theme="dark" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white font-sans">
                Curated Transit Telemetry &amp; Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-mono max-w-2xl">
                Aggregated commute bottlenecks, wait times, and verification demand processed live from verified student responses.
              </p>
            </div>

            {/* Real Data Status Pill Row (Section 3B) */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border border-neutral-700 bg-neutral-900 text-neutral-300">
                TOTAL LOGS: {total}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border border-neutral-700 bg-neutral-900 text-neutral-300">
                PILOT INTEREST: {pilotRate}
              </span>
              <button
                type="button"
                onClick={fetchAnalytics}
                disabled={loading}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border border-white bg-white text-black hover:bg-neutral-200 transition-colors disabled:opacity-50 select-none cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>SYNC</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="mx-auto max-w-7xl px-6 md:px-12 pt-10">
        {/* Filter Controls Bar */}
        <div className="border border-neutral-300 bg-white p-4 sm:p-5 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SectionLabel number="FLT" label="TELEMETRY FILTERS" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search college corridor..."
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="border border-neutral-300 bg-[#fcfcfc] px-3.5 py-1.5 font-mono text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none w-full sm:w-64"
            />

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="border border-neutral-300 bg-[#fcfcfc] px-3 py-1.5 font-mono text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none"
            >
              <option value="">ALL STUDY YEARS</option>
              <option value="1st Year">1ST YEAR</option>
              <option value="2nd Year">2ND YEAR</option>
              <option value="3rd Year">3RD YEAR</option>
              <option value="4th Year">4TH YEAR</option>
              <option value="Postgraduate">POSTGRADUATE</option>
            </select>

            {(collegeFilter || yearFilter) && (
              <PillButton
                onClick={() => {
                  setCollegeFilter('');
                  setYearFilter('');
                }}
                size="sm"
              >
                RESET
              </PillButton>
            )}
          </div>
        </div>

        {/* Loading State: Thin skeleton bars + [ LOADING ] */}
        {loading && (
          <div className="space-y-6">
            <div className="flex items-center justify-center py-4">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 animate-pulse">
                [ LOADING AGGREGATED TELEMETRY ]
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 border border-neutral-200 bg-neutral-100 animate-pulse" />
              ))}
            </div>
            <div className="h-80 border border-neutral-200 bg-neutral-100 animate-pulse" />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="border border-neutral-900 bg-neutral-900 text-white p-8 text-center my-8">
            <AlertCircle className="mx-auto w-8 h-8 text-neutral-300 mb-3" />
            <h3 className="font-mono text-sm uppercase tracking-[0.2em] mb-1">
              [ TELEMETRY PIPELINE ERROR ]
            </h3>
            <p className="text-xs font-mono text-neutral-400 mb-4">{error}</p>
            <button
              type="button"
              onClick={fetchAnalytics}
              className="inline-flex items-center gap-2 border border-white bg-white text-black px-4 py-2 font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RETRY TRANSMISSION</span>
            </button>
          </div>
        )}

        {/* Real Data Render */}
        {!loading && !error && data && (
          <>
            {/* KPI Tiles (Right-Sidebar Stat Format) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <KpiCard
                index="01"
                title="Total Telemetry Logs"
                value={total}
                subtitle="Individual student responses"
                icon={<Users className="w-4 h-4" />}
              />

              <KpiCard
                index="02"
                title="Pilot Enrollment"
                value={pilotRate}
                subtitle={`${pilotOptIns} respondents opted in`}
                icon={<CheckCircle className="w-4 h-4" />}
              />

              <KpiCard
                index="03"
                title="Primary Mode"
                value={topTravelMode}
                subtitle="Most frequent commute mode"
                icon={<Clock className="w-4 h-4" />}
              />

              <KpiCard
                index="04"
                title="Top Friction Point"
                value={topProblem}
                subtitle="Dominant student complaint"
                icon={<AlertTriangle className="w-4 h-4" />}
              />
            </div>

            {/* Empty State */}
            {total === 0 ? (
              <div className="border border-dashed border-neutral-400 bg-white p-16 text-center my-8">
                <SectionLabel number="EMP" label="DATASET EMPTY" className="mb-3" />
                <h3 className="text-lg font-normal text-neutral-900 font-sans">
                  No Telemetry Records Found
                </h3>
                <p className="font-mono text-xs text-neutral-500 max-w-md mx-auto mt-2">
                  Submit responses via the public survey portal to populate this live executive research matrix.
                </p>
              </div>
            ) : (
              <AnalyticsCharts data={data} />
            )}
          </>
        )}
      </main>
    </div>
  );
};
