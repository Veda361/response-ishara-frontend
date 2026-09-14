import React, { useEffect, useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SandTransitionImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  transitionKey?: string | number;
}

export const SandTransitionImage: React.FC<SandTransitionImageProps> = ({
  src,
  alt,
  className = '',
  imageClassName = '',
  transitionKey,
}) => {
  const filterId = useId().replace(/:/g, '');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* SVG filter definition for displacement/turbulence dissolve */}
      {!prefersReducedMotion && (
        <svg className="absolute h-0 w-0 pointer-events-none" aria-hidden="true">
          <defs>
            <filter id={`sand-filter-${filterId}`} x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.04"
                numOctaves="3"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="14"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={transitionKey || src}
          initial={{
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 0.96,
            filter: prefersReducedMotion ? 'none' : `url(#sand-filter-${filterId}) blur(4px)`,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: 'none',
          }}
          exit={{
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 1.04,
            filter: prefersReducedMotion ? 'none' : `url(#sand-filter-${filterId}) blur(6px)`,
          }}
          transition={{
            duration: prefersReducedMotion ? 0.2 : 0.75,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="h-full w-full flex items-center justify-center"
        >
          <img
            src={src}
            alt={alt}
            className={`max-h-full max-w-full object-contain select-none pointer-events-none ${imageClassName}`}
            loading="lazy"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
