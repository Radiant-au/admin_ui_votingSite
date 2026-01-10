import { useEffect, useState } from 'react';

interface LightRaysProps {
  active: boolean;
}

const LightRays = ({ active }: LightRaysProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      const timeout = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [active]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Central glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vh] animate-light-ray"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(45 90% 55% / 0.4) 0%, transparent 50%)',
        }}
      />
      
      {/* Light rays */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 origin-bottom animate-light-ray"
          style={{
            width: '4px',
            height: '100vh',
            background: `linear-gradient(to top, hsl(45 90% 55% / 0.6), transparent)`,
            transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
            animationDelay: `${i * 50}ms`,
          }}
        />
      ))}
    </div>
  );
};

export default LightRays;
