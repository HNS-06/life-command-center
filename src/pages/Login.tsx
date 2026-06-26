import React from 'react';
import { Mail, Lock, Eye, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-6">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]"></div>

      <header className="fixed top-0 left-0 w-full flex justify-center py-12 z-10">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-black italic serif text-primary tracking-tighter mb-1">
            Authorization
          </h1>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.5em] opacity-40">
            Nexus Protocol v.4.0
          </p>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-[440px] p-10 md:p-12 rounded-[2.5rem] accent-glow z-20 border-white/20"
      >
        <div className="mb-12">
          <h2 className="text-[32px] serif leading-tight text-on-surface mb-2 italic">Welcome back, <br/><span className="text-primary not-italic font-sans font-black uppercase tracking-tight text-2xl">Operator</span></h2>
          <p className="text-on-surface-variant text-sm font-medium opacity-60">Validate identity to unlock secure vectors.</p>
        </div>

        <form 
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
          }}
        >
          <div className="space-y-3">
            <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">Identity Vector</label>
            <div className="relative flex items-center bg-white/[0.02] border border-white/10 rounded-2xl focus-within:border-primary/50 transition-all group">
              <Mail className="absolute left-5 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
              <input 
                type="email"
                defaultValue="operative@nexus.io"
                className="w-full bg-transparent border-none py-5 pl-14 pr-5 text-on-surface focus:ring-0 font-sans font-semibold placeholder:opacity-30"
                placeholder="operative@nexus.io"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Cipher Key</label>
            </div>
            <div className="relative flex items-center bg-white/[0.02] border border-white/10 rounded-2xl focus-within:border-primary/50 transition-all group">
              <Lock className="absolute left-5 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
              <input 
                type="password"
                defaultValue="••••••••••••"
                className="w-full bg-transparent border-none py-5 pl-14 pr-14 text-on-surface focus:ring-0 font-sans font-semibold"
                placeholder="••••••••••••"
              />
              <Eye className="absolute right-5 w-5 h-5 text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors" />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-6 bg-on-surface text-background font-bold uppercase tracking-[0.3em] text-[12px] rounded-full hover:scale-[1.05] active:scale-[0.95] transition-all shadow-2xl accent-glow mt-4"
          >
            Access Vault
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="font-sans text-[14px] text-on-surface-variant">
            New operative? 
            <button className="text-secondary font-bold hover:underline underline-offset-4 ml-1">Create Account</button>
          </p>
        </div>
      </motion.div>

      <div className="mt-8 flex justify-between items-center w-full max-w-[440px] px-4 opacity-40">
        <div className="flex items-center space-x-2">
          <Shield size={14} className="text-on-surface" />
          <span className="font-mono text-[10px] uppercase tracking-widest">AES-256 ENCRYPTED</span>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest">v4.0.2-ALPHA</div>
      </div>

      <div className="fixed top-[15%] left-0 w-full h-[1px] bg-secondary/20 pointer-events-none shadow-[0_0_10px_#4fdbc8]"></div>
    </div>
  );
};
