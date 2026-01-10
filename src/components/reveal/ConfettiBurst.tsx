import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  rotation: number;
  size: number;
}

interface ConfettiBurstProps {
  active: boolean;
  duration?: number;
}

const GOLD_COLORS = [
  'hsl(45, 90%, 55%)',   // Gold
  'hsl(45, 80%, 70%)',   // Light gold
  'hsl(40, 85%, 40%)',   // Dark gold
  'hsl(45, 30%, 85%)',   // Cream
  'hsl(30, 60%, 35%)',   // Bronze
];

const ConfettiBurst = ({ active, duration = 5000 }: ConfettiBurstProps) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) {
      setConfetti([]);
      return;
    }

    const pieces: ConfettiPiece[] = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1000,
      duration: 3000 + Math.random() * 2000,
      color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
      rotation: Math.random() * 360,
      size: 8 + Math.random() * 8,
    }));

    setConfetti(pieces);

    const timeout = setTimeout(() => {
      setConfetti([]);
    }, duration);

    return () => clearTimeout(timeout);
  }, [active, duration]);

  if (!active || confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            width: piece.size,
            height: piece.size * 0.6,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${piece.delay}ms`,
            animationDuration: `${piece.duration}ms`,
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiBurst;
