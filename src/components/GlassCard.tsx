import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'primary' | 'secondary' | 'tertiary' | 'error';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', glow, onClick }) => {
  const glowClass = glow ? 'accent-glow' : '';
  
  return (
    <div 
      className={`glass-card rounded-[2rem] p-8 transition-all duration-500 ease-out border-white/10 ${glowClass} ${className} ${onClick ? 'cursor-pointer hover:bg-white/10 active:scale-[0.98]' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
