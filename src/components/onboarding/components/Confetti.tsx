import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({ trigger, onComplete }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger && !isAnimating) {
      setIsAnimating(true);
      
      // Create confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#FFD700', '#FF6B6B', '#4ECDC4'][Math.floor(Math.random() * 6)],
        delay: Math.random() * 3
      }));
      
      setParticles(newParticles);
      
      // Clear animation after 4 seconds
      const timeout = setTimeout(() => {
        setParticles([]);
        setIsAnimating(false);
        onComplete?.();
      }, 4000);
      
      return () => clearTimeout(timeout);
    }
  }, [trigger, isAnimating, onComplete]);

  if (!isAnimating) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full animate-bounce"
          style={{
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '3s',
            animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        />
      ))}
    </div>
  );
};

// Reduced motion fallback component
export const ReducedMotionCelebration: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="flex justify-center mb-4">
      <div className="bg-green-100 text-green-800 p-4 rounded-full">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};