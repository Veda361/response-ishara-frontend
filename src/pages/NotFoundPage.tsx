import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SectionLabel } from '../components/common/SectionLabel';
import { CTAButton } from '../components/common/CTAButton';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20">
      <SectionLabel number="404" label="CORRIDOR UNRESOLVED" className="mb-4" />
      <h1 className="text-4xl md:text-5xl font-normal text-neutral-950 tracking-tight font-sans mb-3">
        Page Not Located
      </h1>
      <p className="font-mono text-xs text-neutral-500 max-w-sm uppercase tracking-wider mb-8">
        The requested telemetry route does not exist or has been relocated.
      </p>
      <Link to="/">
        <CTAButton
          type="button"
          variant="primary"
          size="md"
          icon={<ArrowLeft className="w-3.5 h-3.5" />}
          iconPosition="left"
        >
          RETURN TO SURVEY
        </CTAButton>
      </Link>
    </div>
  );
};
