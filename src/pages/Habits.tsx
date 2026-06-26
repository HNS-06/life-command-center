import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Brain, Droplets, User, Zap, Star, Award, Plus, Trophy, X } from 'lucide-react';
import { Page, Habit } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

interface HabitsProps {
  onNavigate: (page: Page) => void;
}

const HabitIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'Deep Work': return <Brain size={24} />;
    case 'Hydrate': return <Droplets size={24} />;
    case 'Meditation': return <User size={24} />;
    default: return <Zap size={24} />;
  }
};

export const Habits: React.FC<HabitsProps> = ({ onNavigate }) => {
  const { habits, logHabitProgress, addHabit, streakCount } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    goal: '',
    unit: 'times',
    color: 'primary'
  });

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.name || !newHabit.goal) return;

    addHabit({
      name: newHabit.name,
      description: newHabit.description || 'System Momentum Vector',
      goal: parseFloat(newHabit.goal),
      unit: newHabit.unit,
      color: newHabit.color
    });

    setNewHabit({
      name: '',
      description: '',
      goal: '',
      unit: 'times',
      color: 'primary'
    });
    setIsAddModalOpen(false);
  };

  const getIncrementValue = (unit: string) => {
    if (unit === 'm') return 15;
    if (unit === 'L') return 0.5;
    return 1;
  };

  // Calculate composite momentum completion
  const averageCompletion = habits.length > 0 
    ? Math.round(habits.reduce((acc, h) => acc + Math.min((h.current / h.goal) * 100, 100), 0) / habits.length)
    : 0;

  return (
    <div className="space-y-12 pb-40">
      {/* Hero Streak Section */}
      <section className="flex flex-col">
        <span className="text-[10px] font-black uppercase text-primary tracking-[0.5em] mb-4">Neural Plasticity Monitor</span>
        <GlassCard className="p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 accent-glow border-white/20 rounded-[3rem]">
          {/* Background Glows for celebration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />

          <div className="z-10 flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
              <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                <Trophy size={12} />
                Elite Performance
              </div>
            </div>
            <h2 className="text-7xl font-black italic serif text-on-surface leading-[0.9] mb-4">
              Momentum <br/><span className="text-primary">Continuum</span>
            </h2>
            <p className="text-on-surface-variant font-medium opacity-60 leading-relaxed text-sm mb-8 max-w-sm">
              System validation confirms active chain integrity. Your neural pathways are thickening. {averageCompletion}% optimization reached.
            </p>
            
            <div className="flex gap-4 justify-center md:justify-start">
              {Array.from({ length: Math.min(streakCount, 7) }).map((_, i) => (
                 <motion.div 
                  key={i} 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_#38bdf8]" 
                 />
              ))}
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            </div>
          </div>

          <div className="relative w-64 h-64 flex items-center justify-center">
            <motion.div 
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-white/[0.03]" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeWidth="20" />
                <circle 
                  className="text-primary transition-all duration-1000 ease-out" 
                  cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" 
                  strokeDasharray="691.15" 
                  strokeDashoffset={691.15 - (691.15 * averageCompletion) / 100} 
                  strokeWidth="20" 
                  strokeLinecap="butt"
                />
              </svg>
            </motion.div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black italic serif text-primary leading-none">{averageCompletion}%</span>
              <span className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em] mt-3">Peak Cap</span>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Momentum History Grid */}
      <section>
        <div className="mb-10 px-2">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2 block">Neural Chain Integrity</span>
          <h3 className="text-4xl serif italic text-on-surface">30-Day Momentum</h3>
        </div>
        
        <GlassCard className="p-10 rounded-[3rem] border-white/5">
          <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 gap-3">
            {Array.from({ length: 30 }).map((_, i) => {
              const active = i < Math.min(24 + streakCount - 12, 29); // Simulated active based on streak
              const current = i === Math.min(24 + streakCount - 12, 29);
              const streak = i >= Math.max(0, Math.min(24 + streakCount - 12, 29) - streakCount) && i <= Math.min(24 + streakCount - 12, 29);
              
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className={`w-full aspect-square rounded-lg border transition-all duration-500 ${
                      active 
                        ? streak 
                          ? 'bg-primary border-primary shadow-[0_0_15px_#38bdf8] scale-105' 
                          : 'bg-primary/20 border-primary/30'
                        : current
                          ? 'bg-transparent border-primary border-dashed animate-pulse'
                          : 'bg-white/[0.02] border-white/5'
                    }`}
                  />
                  <span className="text-[8px] font-black text-on-surface-variant/20 uppercase tracking-tighter">{i + 1}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap gap-8 justify-center sm:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Active Vector</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded bg-primary shadow-[0_0_10px_#38bdf8]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Streak Node</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded bg-white/[0.02] border border-white/5" />
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/20">Inactive Archive</span>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Active Habits */}
      <section>
        <div className="flex justify-between items-end mb-10 px-2">
          <div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2 block">Behavioral Architect</span>
            <h3 className="text-4xl serif italic text-on-surface">Active Vectors</h3>
          </div>
        </div>

        <div className="grid gap-6">
          {habits.map(habit => {
            const inc = getIncrementValue(habit.unit);
            const isCompleted = habit.current >= habit.goal;
            
            return (
              <GlassCard key={habit.id} className={`p-10 rounded-[2.5rem] transition-all border-white/5 group hover:border-primary/20`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-on-surface bg-white/[0.03] border border-white/10 group-hover:bg-primary group-hover:text-black transition-all duration-500`}>
                      <HabitIcon name={habit.name} />
                    </div>
                    <div>
                      <h4 className="text-2xl serif italic text-on-surface">{habit.name}</h4>
                      <p className="text-sm font-medium text-on-surface-variant/40">{habit.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-bold uppercase tracking-widest">
                          Streak: {habit.streak}d
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className={`text-2xl font-black italic serif text-primary`}>
                      {habit.current} / {habit.goal} {habit.unit}
                    </span>
                    <button
                      onClick={() => logHabitProgress(habit.id, inc)}
                      disabled={isCompleted}
                      className={`mt-3 px-6 py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-[0.15em] transition-all duration-300 active:scale-95 border ${
                        isCompleted 
                          ? 'bg-primary/10 border-primary/20 text-primary opacity-60 cursor-default' 
                          : 'bg-white/5 border-white/10 hover:bg-primary hover:text-black hover:border-primary'
                      }`}
                    >
                      {isCompleted ? 'Target Achieved' : `Log +${inc}${habit.unit}`}
                    </button>
                  </div>
                </div>
                <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-primary transition-all duration-1000 group-hover:shadow-[0_0_20px_#38bdf8]`}
                    style={{ width: `${Math.min((habit.current / habit.goal) * 100, 100)}%` }}
                  />
                </div>
              </GlassCard>
            );
          })}

          {habits.length === 0 && (
            <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-[2.5rem]">
              <span className="text-[10px] font-mono tracking-widest text-primary uppercase block mb-3">No Momentum</span>
              <p className="text-xl serif italic text-on-surface-variant">Setup habits to begin tracking neural adaptation.</p>
            </div>
          )}
        </div>
      </section>

      {/* Optimization Tip */}
      <GlassCard className="p-8 border-l-4 border-l-secondary bg-secondary/[0.02]">
        <div className="flex items-center gap-4 mb-4">
          <Zap size={20} className="text-secondary fill-secondary/20" />
          <h4 className="font-mono text-[11px] font-black uppercase tracking-[0.3em]">OPTIMIZATION TIP</h4>
        </div>
        <p className="text-[15px] leading-relaxed text-on-surface-variant font-medium">
          Your peak performance window is 08:00 - 11:00. Schedule "Deep Work" then for <span className="text-secondary font-bold text-shadow-sm">2.4x</span> better output.
        </p>
      </GlassCard>

      {/* Milestones */}
      <GlassCard className="p-8">
        <h4 className="font-mono text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-8">UPCOMING MILESTONES</h4>
        <div className="space-y-8">
          <div className="flex gap-6 items-center">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
              <Award className="text-tertiary w-7 h-7" />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-end mb-2.5">
                <p className="text-[16px] font-bold tracking-tight">10 Day Streak</p>
                <p className="text-[11px] font-mono text-outline font-bold opacity-60">3 days left</p>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5">
                <div className="bg-tertiary h-full w-[70%] rounded-full shadow-[0_0_10px_rgba(255,185,95,0.4)]" />
              </div>
            </div>
          </div>

          <div className="flex gap-6 items-center">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
              <Star className="text-primary w-7 h-7" />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-end mb-2.5">
                <p className="text-[16px] font-bold tracking-tight">Flow Master</p>
                <p className="text-[11px] font-mono text-outline font-bold opacity-60">{averageCompletion}% complete</p>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5">
                <div className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(192,193,255,0.4)]" style={{ width: `${averageCompletion}%` }} />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* FAB - Add Habit */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-36 right-10 w-20 h-20 bg-primary text-black rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all z-50 border-4 border-background accent-glow hover:scale-105"
      >
        <Plus size={36} strokeWidth={1.5} />
      </button>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-background/90 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background border border-white/10 rounded-[3rem] p-12 max-w-md w-full shadow-2xl relative overflow-hidden accent-glow"
            >
              <div className="absolute top-0 right-0 p-8">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-8">
                <span className="text-[10px] font-black uppercase text-primary tracking-[0.5em] mb-4 block">Behavioral Registry</span>
                <h3 className="text-4xl serif italic text-on-surface leading-tight">Forging Habit</h3>
              </div>

              <form onSubmit={handleCreateHabit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Vector Name</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                    placeholder="e.g. Deep Work, Meditation"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Diagnostic Description</label>
                  <input 
                    type="text"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                    placeholder="e.g. Focus work session"
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Goal Target</label>
                    <input 
                      type="number"
                      step="0.1"
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                      placeholder="e.g. 120, 3.0"
                      value={newHabit.goal}
                      onChange={(e) => setNewHabit({ ...newHabit, goal: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Measurement Unit</label>
                    <input 
                      type="text"
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                      placeholder="e.g. m (mins), L (liters), times"
                      value={newHabit.unit}
                      onChange={(e) => setNewHabit({ ...newHabit, unit: e.target.value })}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-6 bg-primary text-black rounded-full font-bold uppercase tracking-[0.3em] text-[12px] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                >
                  Initiate Forge
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
