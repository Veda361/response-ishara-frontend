import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { surveyApi } from '../../api/survey.api';

export const Navbar: React.FC = () => {
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    surveyApi
      .checkHealth()
      .then((res) => {
        if (mounted) setIsBackendHealthy(res.data?.status === 'healthy');
      })
      .catch(() => {
        if (mounted) setIsBackendHealthy(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-[#fcfcfc]/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group select-none">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase">
                INITIATIVE
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
            </div>
            <span className="text-xl md:text-2xl font-normal tracking-tight text-neutral-950 font-sans">
              ISHARA
            </span>
          </div>
        </Link>

        {/* Right Nav: Survey & Minimalist Live Status Pill */}
        <div className="flex items-center gap-6 sm:gap-8">
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:outline-none ${
                location.pathname === '/' || location.pathname === '/survey'
                  ? 'text-neutral-950 font-medium'
                  : 'text-neutral-500 hover:text-neutral-950'
              }`}
            >
              SURVEY
            </Link>
          </nav>

          {/* Minimalist Live Status Pill */}
          <div
            className="flex items-center gap-2 border border-neutral-300 rounded-full px-3 py-1 bg-white select-none"
            title={
              isBackendHealthy === null
                ? 'Pinging backend health...'
                : isBackendHealthy
                ? 'Connected to backend service'
                : 'Server offline'
            }
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isBackendHealthy === null
                  ? 'bg-amber-400 animate-pulse'
                  : isBackendHealthy
                  ? 'bg-neutral-900'
                  : 'bg-rose-500'
              }`}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">
              {isBackendHealthy === null
                ? 'CONNECTING'
                : isBackendHealthy
                ? 'SYSTEM LIVE'
                : 'OFFLINE'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
