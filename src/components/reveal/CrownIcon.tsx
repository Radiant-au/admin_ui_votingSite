interface CrownIconProps {
  variant: 'king' | 'queen' | 'prince' | 'princess';
  className?: string;
  animated?: boolean;
}

const CrownIcon = ({ variant, className = '', animated = false }: CrownIconProps) => {
  const baseClasses = `${className} ${animated ? 'animate-crown-bounce' : ''}`;
  
  if (variant === 'king' || variant === 'prince') {
    // Crown for King/Prince
    return (
      <svg 
        viewBox="0 0 64 64" 
        className={baseClasses}
        fill="none"
      >
        <defs>
          <linearGradient id={`crown-gradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(45, 80%, 65%)" />
            <stop offset="50%" stopColor="hsl(45, 90%, 55%)" />
            <stop offset="100%" stopColor="hsl(40, 85%, 40%)" />
          </linearGradient>
        </defs>
        <path
          d="M8 48L12 24L24 32L32 16L40 32L52 24L56 48H8Z"
          fill={`url(#crown-gradient-${variant})`}
          stroke="hsl(45, 80%, 70%)"
          strokeWidth="2"
        />
        <circle cx="32" cy="16" r="4" fill="hsl(45, 80%, 70%)" />
        <circle cx="12" cy="24" r="3" fill="hsl(45, 80%, 70%)" />
        <circle cx="52" cy="24" r="3" fill="hsl(45, 80%, 70%)" />
        <rect x="8" y="48" width="48" height="8" rx="2" fill={`url(#crown-gradient-${variant})`} stroke="hsl(45, 80%, 70%)" strokeWidth="1" />
      </svg>
    );
  }

  // Tiara for Queen/Princess
  return (
    <svg 
      viewBox="0 0 64 64" 
      className={baseClasses}
      fill="none"
    >
      <defs>
        <linearGradient id={`tiara-gradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(45, 80%, 65%)" />
          <stop offset="50%" stopColor="hsl(45, 90%, 55%)" />
          <stop offset="100%" stopColor="hsl(40, 85%, 40%)" />
        </linearGradient>
      </defs>
      <path
        d="M8 44C8 44 16 28 24 32C28 34 30 20 32 16C34 20 36 34 40 32C48 28 56 44 56 44"
        stroke={`url(#tiara-gradient-${variant})`}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="32" cy="16" r="5" fill="hsl(45, 80%, 70%)" />
      <circle cx="20" cy="30" r="3" fill="hsl(45, 80%, 70%)" />
      <circle cx="44" cy="30" r="3" fill="hsl(45, 80%, 70%)" />
      <ellipse cx="32" cy="46" rx="26" ry="6" fill={`url(#tiara-gradient-${variant})`} opacity="0.8" />
    </svg>
  );
};

export default CrownIcon;
