import React from 'react';

interface ImmoWinLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'iconOnly';
  lightMode?: boolean;
}

export const ImmoWinLogo: React.FC<ImmoWinLogoProps> = ({
  size = 'md',
  variant = 'full',
  lightMode = false
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Icon Badge */}
      <div
        className={`${iconDimensions[size]} relative rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-0.5 shadow-lg shadow-emerald-950/20 group-hover:scale-105 transition-all duration-300 flex items-center justify-center overflow-hidden border border-emerald-500/30`}
      >
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-amber-400/10 to-transparent opacity-80" />
        
        {/* Custom Architectural Villa/Crown Key SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-3/4 h-3/4 relative z-10 drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Ring / Crest */}
          <circle cx="50" cy="50" r="44" stroke="url(#goldGradient)" strokeWidth="3" strokeDasharray="4 2" opacity="0.6" />
          
          {/* Architectural Villa Roof */}
          <path
            d="M 50 16 L 82 40 L 74 40 L 74 78 C 74 82 70 85 66 85 L 34 85 C 30 85 26 82 26 78 L 26 40 L 18 40 Z"
            fill="url(#emeraldGradient)"
            stroke="url(#goldGradient)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Golden Keyhole / Door Feature */}
          <path
            d="M 43 85 L 43 62 C 43 58 46 55 50 55 C 54 55 57 58 57 62 L 57 85 Z"
            fill="url(#goldGradient)"
          />

          {/* Crown Peak / Star Accent */}
          <polygon
            points="50,22 53,30 61,30 54,35 57,43 50,38 43,43 46,35 39,30 47,30"
            fill="#F59E0B"
            className="animate-pulse"
          />

          {/* Window / Pillars */}
          <rect x="34" y="46" width="9" height="11" rx="2" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
          <rect x="57" y="46" width="9" height="11" rx="2" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />

          <defs>
            <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>

            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Text Brand (If variant === 'full') */}
      {variant === 'full' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`${textSizes[size]} font-black tracking-tight font-outfit ${
                lightMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Immo<span className="text-emerald-600 bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">Win</span>
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-black bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-md border border-emerald-500/20 uppercase tracking-widest">
              DZD 🇩🇿
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium tracking-wide">
            Immobilier & Estimation en Algérie
          </span>
        </div>
      )}
    </div>
  );
};
