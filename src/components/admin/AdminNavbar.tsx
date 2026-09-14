import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { adminApi } from '../../api/admin.api';
import { CTAButton } from '../common/CTAButton';
import { Download, LogOut, ArrowLeft, BarChart2, Table } from 'lucide-react';

export const AdminNavbar: React.FC = () => {
  const location = useLocation();
  const { adminKey, logout } = useAuth();
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const isActive = (path: string) => location.pathname === path;

  const handleExportCsv = async () => {
    if (!adminKey) return;
    setIsExporting(true);
    try {
      const blob = await adminApi.downloadCsvExport(adminKey);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `isahara_telemetry_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('CSV Export failed:', err);
      alert('Failed to download CSV export. Please check server connectivity.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="border-b border-neutral-300 bg-[#fcfcfc]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12 py-4">
        {/* Left Side: Brand and Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 transition-colors select-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>PUBLIC SURVEY</span>
          </Link>

          <div className="h-4 w-px bg-neutral-300 hidden sm:block" />

          <nav className="flex items-center gap-2">
            <Link
              to="/admin/dashboard"
              className={`inline-flex items-center gap-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-all ${
                isActive('/admin') || isActive('/admin/dashboard')
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>OVERVIEW</span>
            </Link>

            <Link
              to="/admin/surveys"
              className={`inline-flex items-center gap-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-all ${
                isActive('/admin/surveys')
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>RESPONSES</span>
            </Link>
          </nav>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          <CTAButton
            type="button"
            onClick={handleExportCsv}
            disabled={isExporting}
            loading={isExporting}
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            iconPosition="left"
          >
            EXPORT CSV
          </CTAButton>

          <button
            type="button"
            onClick={logout}
            aria-label="Logout and lock session"
            className="inline-flex items-center gap-1.5 border border-neutral-300 bg-white px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-colors select-none cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LOCK</span>
          </button>
        </div>
      </div>
    </div>
  );
};
