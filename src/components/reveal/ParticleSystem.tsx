import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
}

interface ParticleSystemProps {
  intensity?: 'ambient' | 'celebration';
  active?: boolean;
}

const ParticleSystem = ({ intensity = 'ambient', active = true }: ParticleSystemProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particleCount = intensity === 'celebration' ? 150 : 50;
    
    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * (intensity === 'celebration' ? 4 : 2) + 1,
      speedX: (Math.random() - 0.5) * (intensity === 'celebration' ? 3 : 0.5),
      speedY: intensity === 'celebration' 
        ? Math.random() * 2 + 1 
        : (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      hue: 45 + Math.random() * 10, // Gold hue range
    });

    particlesRef.current = Array.from({ length: particleCount }, createParticle);

    const animate = () => {
      if (!active) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) {
          if (intensity === 'celebration') {
            particlesRef.current[index] = createParticle();
            particlesRef.current[index].y = -10;
          } else {
            particle.y = 0;
          }
        }

        // Shimmer effect
        const shimmer = Math.sin(Date.now() * 0.002 + index) * 0.3 + 0.7;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 90%, 55%, ${particle.opacity * shimmer})`;
        ctx.fill();

        // Add glow for celebration mode
        if (intensity === 'celebration') {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${particle.hue}, 90%, 55%, ${particle.opacity * 0.2})`;
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [intensity, active]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: active ? 1 : 0.3, transition: 'opacity 1s ease' }}
    />
  );
};

export default ParticleSystem;
