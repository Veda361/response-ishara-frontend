import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { AnalyticsOverview } from '../../types/analytics';
import { formatEnum } from '../../utils/formatters';

interface AnalyticsChartsProps {
  data: AnalyticsOverview;
}

const COLORS = ['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b'];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data }) => {
  // 1. Travel Modes
  const travelModeData = Object.entries(data.transportModes || {}).map(([key, count]) => ({
    name: formatEnum(key),
    count,
  }));

  // 2. Waiting Times
  const waitingTimeData = Object.entries(data.waitingTimes || {}).map(([key, count]) => ({
    name: formatEnum(key),
    count,
  }));

  // 3. Common Problems
  const problemsData = Object.entries(data.commonProblems || {})
    .map(([key, count]) => ({
      name: formatEnum(key),
      count,
    }))
    .sort((a, b) => b.count - a.count);

  // 4. Trust Factors
  const trustData = Object.entries(data.trustFactors || {})
    .map(([key, count]) => ({
      name: formatEnum(key),
      count,
    }))
    .sort((a, b) => b.count - a.count);

  // 5. Adoption Intent
  const adoptionData = Object.entries(data.isaharaAdoption || {}).map(([key, count]) => ({
    name: formatEnum(key),
    count,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Travel Modes */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Usual Travel Modes</h3>
        <p className="text-xs text-slate-500 mb-4">How students currently leave campus</p>
        <div className="h-64 w-full">
          {travelModeData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={travelModeData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {travelModeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 2: Typical Waiting Times */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Typical Waiting Times</h3>
        <p className="text-xs text-slate-500 mb-4">Longest typical delays faced by students</p>
        <div className="h-64 w-full">
          {waitingTimeData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waitingTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 3: Common Bottlenecks */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Common Commute Problems</h3>
        <p className="text-xs text-slate-500 mb-4">Ranked frequency of student pain points</p>
        <div className="h-64 w-full">
          {problemsData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={problemsData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#334155' }} width={120} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 4: Trust Factors */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Trust Verification Requirements</h3>
        <p className="text-xs text-slate-500 mb-4">What makes students trust an unknown vehicle</p>
        <div className="h-64 w-full">
          {trustData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trustData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#334155' }} width={120} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 5: Isahara Adoption Intent */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-2">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Isahara Platform Adoption Willingness</h3>
        <p className="text-xs text-slate-500 mb-4">Student likelihood to try the platform at their college</p>
        <div className="h-60 w-full">
          {adoptionData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adoptionData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#059669" radius={[6, 6, 0, 0]}>
                  {adoptionData.map((_, index) => (
                    <Cell key={`cell-adoption-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
