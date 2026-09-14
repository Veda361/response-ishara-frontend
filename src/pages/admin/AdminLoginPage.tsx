import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { SectionLabel } from '../../components/common/SectionLabel';
import { CTAButton } from '../../components/common/CTAButton';
import { KeyRound, AlertCircle, ArrowLeft, Lock } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [keyInput, setKeyInput] = useState<string>('');
  const { login, isVerifying, authError } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;

    const success = await login(keyInput.trim());
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO PUBLIC RESEARCH</span>
        </Link>

        <div className="border border-neutral-300 bg-white p-8 sm:p-10 shadow-sm">
          <SectionLabel number="AUTH" label="AUTHENTICATION GATEWAY" className="mb-4" />

          <div className="flex items-center gap-3 mb-3">
            <Lock className="w-5 h-5 text-neutral-900" />
            <h1 className="text-2xl font-normal text-neutral-950 tracking-tight font-sans">
              Founder &amp; Admin Portal
            </h1>
          </div>

          <p className="text-xs text-neutral-500 leading-relaxed mb-6 font-mono">
            Enter the admin secret passkey configured on the backend to inspect real-time corridor telemetry and student survey archives.
          </p>

          {authError && (
            <div className="mb-6 border border-neutral-900 bg-neutral-900 text-white p-3.5 font-mono text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-700 mb-2 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-neutral-400" />
                <span>Passkey Key</span>
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter ADMIN_SECRET_KEY..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full border border-neutral-300 bg-[#fcfcfc] px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono transition-colors"
              />
            </div>

            <CTAButton
              type="submit"
              disabled={isVerifying || !keyInput.trim()}
              loading={isVerifying}
              variant="primary"
              size="md"
              className="w-full"
            >
              AUTHENTICATE &amp; ENTER
            </CTAButton>
          </form>

          <div className="mt-8 border-t border-neutral-200 pt-4 text-center">
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-neutral-400">
              PROTECTED ENDPOINT: <code className="text-neutral-600 font-mono">/api/v1/admin/*</code>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
