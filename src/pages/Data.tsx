import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { LineChart, Activity, ShieldCheck, Banknote, Clock, Zap, AlertTriangle, Sparkles, X } from 'lucide-react';
import { Page } from '../types';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

interface DataProps {
  onNavigate: (page: Page) => void;
}

export const DataInsights: React.FC<DataProps> = ({ onNavigate }) => {
  const { bills, tasks, habits, triggerNeuralAudit, isLoadingAI } = useApp();
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditText, setAuditText] = useState('');

  // Computations
  const paidBillsCount = bills.filter(b => b.status === 'paid').length;
  const totalBillsCount = bills.length;
  const billScore = totalBillsCount > 0 ? (paidBillsCount / totalBillsCount) * 100 : 100;
  
  const completedTasksCount = tasks.filter(t => t.completion === 100).length;
  const totalTasksCount = tasks.length;
  const taskScore = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 100;

  const habitCompletion = habits.length > 0 
    ? habits.reduce((acc, h) => acc + Math.min((h.current / h.goal) * 100, 100), 0) / habits.length
    : 100;

  // Composite Life Score
  const lifeScore = Math.round((billScore * 0.25) + (taskScore * 0.35) + (habitCompletion * 0.40));

  // Wellness metrics
  const recoveryState = Math.round(habitCompletion);
  const openHighEnergyTasks = tasks.filter(t => t.completion < 100 && t.energy === 'high').length;
  const neuralStrain = Math.min(15 + openHighEnergyTasks * 18, 100);

  // Financial Metrics
  const unpaidObligations = bills.filter(b => b.status !== 'paid').reduce((sum, b) => sum + b.amount, 0);
  const netAssets = 15000 - unpaidObligations;

  const runAudit = async () => {
    setIsAuditModalOpen(true);
    setAuditText('Analyzing life vectors, cross-referencing task queues, and auditing bills...');
    try {
      const result = await triggerNeuralAudit();
      setAuditText(result);
    } catch (err: any) {
      setAuditText(`Synaptic connection error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-12 pb-40">
       {/* Page Header Info */}
       <div className="flex justify-between items-center px-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-primary tracking-[0.5em] mb-4">Central Intelligence Cluster</span>
            <h2 className="text-4xl font-black italic serif text-on-surface">System Analytics</h2>
          </div>
          <div className="text-right">
             <div className="text-6xl font-black italic serif text-primary leading-none tracking-tighter shadow-primary/20">{lifeScore}</div>
             <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em] mt-3">Life Score</p>
          </div>
       </div>

      {/* Main Productivity Chart */}
      <GlassCard className="relative overflow-hidden accent-glow p-12 rounded-[3rem] border-white/10">
        <div className="flex justify-between items-start mb-12">
          <div className="max-w-[70%]">
            <h2 className="text-3xl serif italic text-on-surface mb-2">Performance Vectors</h2>
            <p className="text-sm font-medium text-on-surface-variant/40 tracking-wide">Composite output cluster • v.4.0.2</p>
          </div>
          <button 
            onClick={runAudit}
            className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            <Sparkles size={14} />
            Neural Audit
          </button>
        </div>

        <div className="h-44 w-full relative group transition-all duration-700">
          <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path 
              d="M0,150 Q100,120 200,160 T400,80 T600,110 T800,40 T1000,60 L1000,200 L0,200 Z" 
              fill="url(#lineGradient)" 
            />
            <path 
              d="M0,150 Q100,120 200,160 T400,80 T600,110 T800,40 T1000,60" 
              fill="none" 
              stroke="#38bdf8" 
              strokeWidth="6" 
              strokeLinecap="butt" 
            />
            <circle cx="800" cy="40" r="10" fill="#38bdf8" className="animate-pulse shadow-[0_0_30px_#38bdf8]" />
          </svg>
        </div>

        <div className="flex justify-between font-black text-on-surface-variant/20 text-[9px] pt-8 border-t border-white/5 tracking-[0.5em] uppercase">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </GlassCard>

      {/* Wellness Balance */}
      <GlassCard className="relative overflow-hidden p-12 rounded-[3.5rem] border-white/10 accent-glow">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl serif italic text-on-surface mb-2">Cognitive Load</h2>
            <p className="text-sm font-medium text-on-surface-variant/40 tracking-wide">Equilibrium Diagnostics</p>
          </div>
          <Zap size={32} className="text-primary" />
        </div>

        <div className="space-y-12">
          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.4em]">
              <span className="text-on-surface-variant/40">Recovery State</span>
              <span className="text-primary">{recoveryState}%</span>
            </div>
            <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full shadow-[0_0_20px_#38bdf8] transition-all duration-1000"
                style={{ width: `${recoveryState}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.4em]">
              <span className="text-on-surface-variant/40">Neural Strain</span>
              <span className="text-error">{neuralStrain}%</span>
            </div>
            <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
              <div 
                className="h-full bg-error rounded-full transition-all duration-1000"
                style={{ width: `${neuralStrain}%` }}
              ></div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Financial Health */}
      <GlassCard className="border-white/5 p-12 rounded-[3.5rem] accent-glow">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl serif italic text-on-surface mb-2">Liquid Flux</h2>
            <p className="text-sm font-medium text-on-surface-variant/40 tracking-wide">Economic Integrity Status</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black italic serif text-primary tracking-tighter">${netAssets.toFixed(2)}</div>
            <div className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em] mt-3">Net Asset Velocity</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 flex flex-col gap-4">
            <div className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em]">Unpaid Obligations</div>
            <div className="text-2xl font-black italic serif text-on-surface">${unpaidObligations.toFixed(2)}</div>
          </div>
          <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 flex flex-col gap-4">
            <div className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em]">Reserves Efficiency</div>
            <div className="text-2xl font-black italic serif text-primary">{Math.round((netAssets / 15000) * 100)}%</div>
          </div>
        </div>
      </GlassCard>

      {/* Neural Audit Dialog */}
      <AnimatePresence>
        {isAuditModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-background/90 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background border border-white/10 rounded-[3rem] p-12 max-w-lg w-full shadow-2xl relative overflow-y-auto max-h-[85vh] no-scrollbar accent-glow"
            >
              <div className="absolute top-0 right-0 p-8">
                <button 
                  onClick={() => setIsAuditModalOpen(false)}
                  className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-8">
                <span className="text-[10px] font-black uppercase text-primary tracking-[0.5em] mb-4 block">Central Intelligence Core</span>
                <h3 className="text-4xl serif italic text-on-surface leading-tight">Neural Audit</h3>
                <p className="text-[10px] font-mono tracking-widest text-primary uppercase mt-1">Decrypted Lifespan Diagnostics</p>
              </div>

              <div className="prose prose-invert max-w-none text-on-surface-variant font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-[45vh] overflow-y-auto pr-2 no-scrollbar border border-white/5 p-6 rounded-2xl bg-white/[0.01]">
                {auditText}
              </div>
              
              <button 
                onClick={() => setIsAuditModalOpen(false)}
                className="w-full py-6 bg-primary text-black rounded-full font-bold uppercase tracking-[0.3em] text-[12px] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-8"
              >
                Close Audit Link
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
