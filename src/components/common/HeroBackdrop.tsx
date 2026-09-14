import React, { useRef, useEffect } from 'react';

interface HeroBackdropProps {
  videoSrc?: string;
  posterSrc?: string;
  overlayOpacity?: number;
  className?: string;
  theme?: 'dark' | 'light';
}

export const HeroBackdrop: React.FC<HeroBackdropProps> = ({
  videoSrc = '/assets/neo-museum/hero-bg.mp4',
  posterSrc = '/assets/neo-museum/01.png',
  overlayOpacity = 0.6,
  className = '',
  theme = 'light',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Respect reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster={posterSrc}
        className="h-full w-full object-cover object-center opacity-45 filter contrast-105"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Vignette and gradient overlays for crisp typography readability */}
      <div
        className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent'
            : 'bg-gradient-to-t from-[#fcfcfc] via-[#fcfcfc]/80 to-[#fcfcfc]/30'
        }`}
        style={{ opacity: overlayOpacity }}
      />

      {/* Subtle fine grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]"
      />
    </div>
  );
};
