import React from 'react';
import { ArrowRight, Shield, Zap } from 'lucide-react';
import { Page } from '../types';
import { motion } from 'motion/react';

interface LandingProps {
  onInitialize: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onInitialize }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <header className="w-full flex justify-end px-10 py-8 z-50">
        <button 
          onClick={onInitialize}
          className="text-on-surface-variant font-mono text-[12px] uppercase tracking-[0.3em] hover:text-primary transition-colors"
        >
          Skip
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-10 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-[400px] aspect-square flex items-center justify-center mb-16"
        >
          <div className="glass-card w-full h-full rounded-2xl flex items-center justify-center relative overflow-hidden glow-primary">
            <img 
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
              src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop"
              alt="System Core"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border border-primary/20 rounded-full animate-pulse flex items-center justify-center bg-primary/5 backdrop-blur-xl">
                 <Shield className="text-primary w-12 h-12" />
              </div>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 glass-card px-4 py-2 rounded-lg flex items-center gap-3">
            <Shield className="text-secondary w-4 h-4" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface">Vault Active</span>
          </div>
          <div className="absolute bottom-8 -left-8 glass-card px-4 py-2 rounded-lg flex items-center gap-3">
            <Zap className="text-tertiary w-4 h-4 fill-tertiary/20" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface">Latency: 0.02ms</span>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4, duration: 0.6 }}
           className="flex flex-col"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-black">Life Command Node</span>
          <h1 className="text-7xl font-black italic serif leading-[0.9] text-on-surface mb-6">
            Master your <br/><span className="text-primary">Life Architecture</span>
          </h1>
          <p className="font-sans text-on-surface-variant max-w-sm mx-auto leading-relaxed text-sm opacity-60">
            Architectural overhaul of your personal data layers. Low latency. Spectral clarity.
          </p>
        </motion.div>
      </main>

      <footer className="w-full px-10 py-16 flex flex-col items-center gap-12">
        <button 
          onClick={onInitialize}
          className="group relative w-full max-w-sm overflow-hidden bg-on-surface text-background py-6 rounded-full font-bold uppercase tracking-[0.3em] text-[12px] transition-all hover:scale-[1.05] active:scale-95 shadow-2xl accent-glow"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Initiate Pulse
            <ArrowRight size={18} />
          </span>
        </button>

        <div className="flex items-center gap-12 opacity-30 text-[10px] font-bold tracking-[0.4em] uppercase">
          <span>Secure</span>
          <span>Private</span>
          <span>Encrypted</span>
        </div>
      </footer>
    </div>
  );
};
