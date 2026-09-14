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
import { SectionLabel } from '../common/SectionLabel';

interface AnalyticsChartsProps {
  data: AnalyticsOverview;
}

const MONO_SHADES = [
  '#111111',
  '#262626',
  '#404040',
  '#525252',
  '#737373',
  '#a3a3a3',
  '#d4d4d4',
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="border border-neutral-900 bg-neutral-900 text-white px-3 py-2 text-xs font-mono">
        <p className="uppercase tracking-wider">{label}</p>
        <p className="font-semibold text-neutral-300 mt-0.5">COUNT: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Chart 1: Travel Modes */}
      <div className="border border-neutral-300 bg-white p-6 sm:p-8">
        <SectionLabel number="01" label="TRANSIT MODES" className="mb-2" />
        <h3 className="text-base font-medium text-neutral-950">Usual Travel Modes</h3>
        <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-6">
          Primary student commute vehicles
        </p>
        <div className="h-64 w-full">
          {travelModeData.length === 0 ? (
            <div className="h-full flex items-center justify-center font-mono text-xs text-neutral-400">
              [ NO TELEMETRY RECORDED ]
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={travelModeData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e5e5e5" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#737373', fontFamily: 'JetBrains Mono' }}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#737373', fontFamily: 'JetBrains Mono' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#111111">
                  {travelModeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={MONO_SHADES[index % MONO_SHADES.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 2: Typical Waiting Times */}
      <div className="border border-neutral-300 bg-white p-6 sm:p-8">
        <SectionLabel number="02" label="DELAY TELEMETRY" className="mb-2" />
        <h3 className="text-base font-medium text-neutral-950">Typical Waiting Bottlenecks</h3>
        <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-6">
          Longest wait intervals reported
        </p>
        <div className="h-64 w-full">
          {waitingTimeData.length === 0 ? (
            <div className="h-full flex items-center justify-center font-mono text-xs text-neutral-400">
              [ NO TELEMETRY RECORDED ]
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waitingTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e5e5e5" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#737373', fontFamily: 'JetBrains Mono' }}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#737373', fontFamily: 'JetBrains Mono' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#1a1a1a" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 3: Common Bottlenecks */}
      <div className="border border-neutral-300 bg-white p-6 sm:p-8">
        <SectionLabel number="03" label="FRICTION LOG" className="mb-2" />
        <h3 className="text-base font-medium text-neutral-950">Common Commute Frictions</h3>
        <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-6">
          Systemic barriers preventing fast rides
        </p>
        <div className="h-64 w-full">
          {problemsData.length === 0 ? (
            <div className="h-full flex items-center justify-center font-mono text-xs text-neutral-400">
              [ NO TELEMETRY RECORDED ]
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={problemsData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#e5e5e5" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: '#737373', fontFamily: 'JetBrains Mono' }}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 9, fill: '#171717', fontFamily: 'JetBrains Mono' }}
                  width={130}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#262626" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 4: Trust Factors */}
      <div className="border border-neutral-300 bg-white p-6 sm:p-8">
        <SectionLabel number="04" label="VERIFICATION" className="mb-2" />
        <h3 className="text-base font-medium text-neutral-950">Trust Requirements</h3>
        <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-6">
          Pre-requisites for student vehicle boarding
        </p>
        <div className="h-64 w-full">
          {trustData.length === 0 ? (
            <div className="h-full flex items-center justify-center font-mono text-xs text-neutral-400">
              [ NO TELEMETRY RECORDED ]
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trustData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#e5e5e5" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: '#737373', fontFamily: 'JetBrains Mono' }}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 9, fill: '#171717', fontFamily: 'JetBrains Mono' }}
                  width={130}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#404040" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 5: Adoption Intent */}
      <div className="border border-neutral-300 bg-white p-6 sm:p-8 lg:col-span-2">
        <SectionLabel number="05" label="ADOPTION" className="mb-2" />
        <h3 className="text-base font-medium text-neutral-950">Ishara Platform Willingness</h3>
        <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-6">
          Likelihood to adopt real-time ride-signal network
        </p>
        <div className="h-60 w-full">
          {adoptionData.length === 0 ? (
            <div className="h-full flex items-center justify-center font-mono text-xs text-neutral-400">
              [ NO TELEMETRY RECORDED ]
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adoptionData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e5e5e5" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#737373', fontFamily: 'JetBrains Mono' }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#737373', fontFamily: 'JetBrains Mono' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#111111">
                  {adoptionData.map((_, index) => (
                    <Cell key={`cell-adoption-${index}`} fill={MONO_SHADES[index % MONO_SHADES.length]} />
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
