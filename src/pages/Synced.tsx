import React, { useState, useRef } from 'react';
import { CheckCircle2, ArrowRight, Shield, RefreshCw, Download, Upload, Trash2, X } from 'lucide-react';
import { Page } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

interface SyncedProps {
  onNavigate: (page: Page) => void;
}

export const SyncedPage: React.FC<SyncedProps> = ({ onNavigate }) => {
  const { 
    exportDatabase, 
    importDatabase, 
    resetDatabase, 
    triggerServerSync,
    operativeName
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(true);
  const [syncProgress, setSyncProgress] = useState(100);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncDone(false);
    setSyncProgress(0);

    // Increment progress simulated
    const interval = setInterval(() => {
      setSyncProgress(p => {
        if (p >= 95) {
          clearInterval(interval);
          return 95;
        }
        return p + 5;
      });
    }, 120);

    try {
      await triggerServerSync();
      setSyncProgress(100);
      setSyncDone(true);
    } catch (e) {
      console.error(e);
    } finally {
      clearInterval(interval);
      setIsSyncing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const success = importDatabase(text);
      if (success) {
        alert('Nexus Core database successfully restored from backup file!');
      } else {
        alert('CRITICAL FAILURE: Invalid database backup file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleWipeDatabase = () => {
    resetDatabase();
    setIsResetConfirmOpen(false);
    alert('Factory reset completed. Database memory purged.');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary/5 blur-[120px] rounded-full sm:w-2/3 sm:h-2/3 m-auto" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center text-center z-10 w-full max-w-md"
      >
        <div className="relative mb-10">
           <div className="w-40 h-40 rounded-full border-4 border-secondary/20 flex items-center justify-center relative bg-white/[0.01]">
              {isSyncing ? (
                <div className="flex flex-col items-center justify-center">
                  <RefreshCw size={60} className="text-secondary animate-spin" />
                  <span className="text-[12px] font-mono text-secondary mt-3 font-bold">{syncProgress}%</span>
                </div>
              ) : (
                <CheckCircle2 size={100} className="text-secondary shadow-[0_0_30px_rgba(79,219,200,0.5)]" />
              )}
              {isSyncing && (
                <div className="absolute inset-0 rounded-full border-4 border-secondary animate-ping opacity-20" />
              )}
           </div>
        </div>

        <h1 className="text-[42px] font-extrabold tracking-tighter text-on-surface mb-2 leading-none">
          {isSyncing ? 'Synchronizing Core' : 'Command Node Synced'}
        </h1>
        <p className="text-on-surface-variant text-[16px] font-medium opacity-70 leading-relaxed mb-8 max-w-sm">
          {isSyncing 
            ? 'Accessing encrypted tunnel and uploading active local parameters...' 
            : `System database is optimized, Operative ${operativeName}. Local blocks match secure archives.`}
        </p>

        {/* Sync details dashboard */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
                <p className="font-mono text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">DATA INTEGRITY</p>
                <p className="font-mono text-[16px] font-bold text-secondary tracking-tight">VERIFIED</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
                <p className="font-mono text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">ENTROPY LEVEL</p>
                <p className="font-mono text-[16px] font-bold text-secondary tracking-tight">0.002%</p>
            </div>
        </div>

        {/* Real Data Actions Panel */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 w-full mb-8 space-y-4 text-left">
          <span className="text-[9px] font-black uppercase text-primary tracking-[0.3em] ml-2 block">Database Operations</span>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={exportDatabase}
              className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 hover:border-primary hover:text-black hover:bg-primary rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all"
            >
              <Download size={14} />
              Backup
            </button>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 hover:border-primary hover:text-black hover:bg-primary rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all"
            >
              <Upload size={14} />
              Restore
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json"
              onChange={handleFileChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 hover:border-secondary hover:text-black hover:bg-secondary rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all disabled:opacity-30"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              Sync Core
            </button>
            <button 
              onClick={() => setIsResetConfirmOpen(true)}
              className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 hover:border-error hover:text-white hover:bg-error rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all"
            >
              <Trash2 size={14} />
              Wipe
            </button>
          </div>
        </div>

        {/* Return Button */}
        <button 
          onClick={() => onNavigate(Page.HOME)}
          disabled={isSyncing}
          className="group w-full py-6 bg-secondary text-on-secondary rounded-2xl font-mono text-[14px] font-black uppercase tracking-[0.2em] shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-30"
        >
          Return to Deck
          <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </button>

        <div className="mt-10 flex items-center gap-3 opacity-30">
            <Shield size={16} />
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest">End-to-End Encrypted Tunnel</span>
        </div>
      </motion.div>

      {/* Wipe Confirmation Modal */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[140] flex items-center justify-center p-6 bg-background/90 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background border border-white/10 rounded-[3rem] p-12 max-w-md w-full shadow-2xl text-center accent-glow"
            >
              <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-8 border border-error/20">
                <Trash2 size={40} className="text-error" />
              </div>
              
              <h3 className="text-3xl serif italic text-on-surface mb-4 leading-tight">Wipe Lifespan Memory</h3>
              <p className="text-on-surface-variant text-sm font-medium opacity-60 mb-10 mx-auto max-w-[280px]">
                This will completely delete your local databases, active tasks, streaks, and custom API keys. This action is irreversible.
              </p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleWipeDatabase}
                  className="w-full py-6 bg-error text-white rounded-full font-bold uppercase tracking-[0.3em] text-[12px] shadow-2xl hover:scale-[1.02] transition-all"
                >
                  Factory Purge Core
                </button>
                <button 
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="w-full py-6 bg-white/5 text-on-surface rounded-full font-bold uppercase tracking-[0.3em] text-[12px] hover:bg-white/10 transition-all"
                >
                  Cancel Purge
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
