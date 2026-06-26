import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { AlertTriangle, Cloud, PlaySquare, Wifi, Palette, Dumbbell, ChevronRight, Zap, Plus, X } from 'lucide-react';
import { Page, Bill } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const BillIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'cloud': return <Cloud size={20} />;
    case 'play-square': return <PlaySquare size={20} />;
    case 'wifi': return <Wifi size={20} />;
    case 'palette': return <Palette size={20} />;
    case 'dumbbell': return <Dumbbell size={20} />;
    default: return <Zap size={20} />;
  }
};

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { bills, resolveBill, addBill } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBill, setNewBill] = useState({
    name: '',
    description: '',
    amount: '',
    dueDate: '',
    icon: 'banknote',
    category: 'Utilities'
  });

  const unpaidBills = bills.filter(b => b.status !== 'paid');
  
  // Calculate total amount for unpaid bills
  const totalUnpaid = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

  // Group unpaid bills
  const dueToday = unpaidBills.filter(b => b.dueDate.toLowerCase() === 'today' || b.status === 'urgent');
  const thisWeek = unpaidBills.filter(b => b.dueDate.toLowerCase().includes('day') && b.status !== 'urgent');
  const later = unpaidBills.filter(b => !dueToday.includes(b) && !thisWeek.includes(b));

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBill.name || !newBill.amount || !newBill.dueDate) return;

    addBill({
      name: newBill.name,
      description: newBill.description || 'System Obligation',
      amount: parseFloat(newBill.amount),
      dueDate: newBill.dueDate,
      icon: newBill.icon,
      category: newBill.category
    });

    setNewBill({
      name: '',
      description: '',
      amount: '',
      dueDate: '',
      icon: 'banknote',
      category: 'Utilities'
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-10 pb-32">
      {/* Summary Header */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="flex flex-col justify-center py-8">
          <span className="font-mono text-[11px] font-bold uppercase text-on-surface-variant/40 mb-1 tracking-widest">Active Unpaid Obligations</span>
          <div className="flex items-baseline gap-2">
            <span className="text-[36px] font-bold text-primary tracking-tighter leading-none">${totalUnpaid.toFixed(2)}</span>
            <span className="font-mono text-[13px] text-secondary font-semibold">{unpaidBills.length} items</span>
          </div>
        </GlassCard>
        
        <GlassCard glow="error" className="border-error/20 bg-error/5 flex flex-col justify-center py-8 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-error" />
            <span className="font-mono text-[11px] font-bold uppercase text-error tracking-widest">Waste Detection Core</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[36px] font-bold text-error tracking-tighter leading-none">
              ${bills.filter(b => b.category === 'Entertainment' && b.status !== 'paid').reduce((sum, b) => sum + b.amount, 0).toFixed(2)}
            </span>
            <span className="font-sans text-[14px] text-on-surface-variant opacity-70">
              {bills.filter(b => b.category === 'Entertainment' && b.status !== 'paid').length} entertainment vectors
            </span>
          </div>
        </GlassCard>
      </section>

      {/* Bills List */}
      <div className="space-y-16">
        {/* Due Today */}
        {dueToday.length > 0 && (
          <section>
            <div className="flex flex-col mb-8">
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Critical Phase
              </div>
              <h2 className="text-4xl italic serif text-on-surface">Due Today</h2>
            </div>
            <div className="grid gap-6">
              {dueToday.map(bill => (
                <BillItem key={bill.id} bill={bill} onResolve={resolveBill} />
              ))}
            </div>
          </section>
        )}

        {/* This Week */}
        {thisWeek.length > 0 && (
          <section>
            <div className="flex flex-col mb-8">
              <div className="flex items-center gap-2 text-on-surface/40 font-black uppercase tracking-[0.4em] text-[10px] mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-on-surface/20" />
                Upcoming Vectors
              </div>
              <h2 className="text-4xl italic serif text-on-surface">This Week</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {thisWeek.map(bill => (
                <BillItem key={bill.id} bill={bill} onResolve={resolveBill} />
              ))}
            </div>
          </section>
        )}

        {/* Later */}
        {later.length > 0 && (
          <section>
            <div className="flex flex-col mb-8">
              <div className="flex items-center gap-2 text-on-surface/40 font-black uppercase tracking-[0.4em] text-[10px] mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-on-surface/20" />
                Distant Horizon
              </div>
              <h2 className="text-4xl italic serif text-on-surface">Later</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {later.map(bill => (
                <BillItem key={bill.id} bill={bill} onResolve={resolveBill} />
              ))}
            </div>
          </section>
        )}

        {unpaidBills.length === 0 && (
          <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-[2.5rem]">
            <span className="text-[10px] font-mono tracking-widest text-primary uppercase block mb-3">All Clear</span>
            <p className="text-xl serif italic text-on-surface-variant">No outstanding obligations logged.</p>
          </div>
        )}
      </div>

      {/* FAB - Add Obligation */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-36 right-10 w-20 h-20 bg-primary text-black rounded-full shadow-[0_20px_50px_rgba(102,252,241,0.3)] flex items-center justify-center active:scale-90 transition-all z-50 border-4 border-background hover:scale-105"
      >
        <Plus size={32} />
      </button>

      {/* Add Bill Modal */}
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
                <span className="text-[10px] font-black uppercase text-primary tracking-[0.5em] mb-4 block">Capital Ledger</span>
                <h3 className="text-4xl serif italic text-on-surface leading-tight">Log Obligation</h3>
              </div>

              <form onSubmit={handleCreateBill} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Credential Name</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                    placeholder="e.g. AWS Cloud, Netflix"
                    value={newBill.name}
                    onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Vector Description</label>
                  <input 
                    type="text"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                    placeholder="e.g. Monthly server fees"
                    value={newBill.description}
                    onChange={(e) => setNewBill({ ...newBill, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Liquid Amount</label>
                    <input 
                      type="number"
                      step="0.01"
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                      placeholder="0.00"
                      value={newBill.amount}
                      onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Due Schedule</label>
                    <input 
                      type="text"
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                      placeholder="e.g. Today, Oct 15"
                      value={newBill.dueDate}
                      onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Icon Class</label>
                    <select 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 [color-scheme:dark]"
                      value={newBill.icon}
                      onChange={(e) => setNewBill({ ...newBill, icon: e.target.value })}
                    >
                      <option value="cloud">Cloud Infrastructure</option>
                      <option value="play-square">Streaming</option>
                      <option value="wifi">Broadband</option>
                      <option value="palette">Design</option>
                      <option value="dumbbell">Fitness/Gym</option>
                      <option value="banknote">Other Utilities</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 ml-4">Category Vector</label>
                    <select 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 [color-scheme:dark]"
                      value={newBill.category}
                      onChange={(e) => setNewBill({ ...newBill, category: e.target.value })}
                    >
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Design">Design</option>
                      <option value="Health">Health</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-6 bg-primary text-black rounded-full font-bold uppercase tracking-[0.3em] text-[12px] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                >
                  Confirm Obligation
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BillItem: React.FC<{ bill: Bill; onResolve: (id: string) => void }> = ({ bill, onResolve }) => {
  const isUrgent = bill.status === 'urgent';
  
  return (
    <GlassCard 
      glow={isUrgent ? 'error' : undefined}
      className={`p-10 rounded-[2.5rem] relative overflow-hidden group border-white/5 hover:border-white/20 transition-all duration-700`}
    >
      <div className="flex justify-between items-start mb-10">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/10 group-hover:bg-primary/20 transition-colors">
          <BillIcon name={bill.icon} />
        </div>
        <div className="flex flex-col items-end">
          {isUrgent && (
            <span className="text-[10px] font-black text-error uppercase tracking-[0.3em] mb-2">Urgent Threat</span>
          )}
          <span className={`text-sm font-bold tracking-tight opacity-40 uppercase`}>
            {bill.dueDate}
          </span>
        </div>
      </div>
      
      <div className="mb-10">
        <h3 className="text-3xl serif italic mb-2 text-on-surface">{bill.name}</h3>
        <p className="text-sm font-medium text-on-surface-variant/60 tracking-wide">{bill.description}</p>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Liquid Capital</p>
          <p className="text-4xl font-black italic tracking-tighter serif">${bill.amount.toFixed(2)}</p>
        </div>
        <button 
          onClick={() => onResolve(bill.id)}
          className={`px-10 py-4 rounded-full font-bold text-[12px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl ${
            isUrgent 
              ? 'bg-error text-white' 
              : 'bg-on-surface text-background hover:bg-primary hover:text-black'
          }`}
        >
          Resolve
        </button>
      </div>
    </GlassCard>
  );
};

