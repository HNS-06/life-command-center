import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
    Bell, 
    CreditCard, 
    ShieldCheck, 
    Settings, 
    CheckCircle2, 
    FileText, 
    ArrowRight,
    Zap,
    X,
    Eye,
    Trash2
} from 'lucide-react';
import { Page, AppNotification } from '../types';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsProps {
  onNavigate: (page: Page) => void;
}

const NotificationIcon = ({ name, color }: { name: string, color: string }) => {
    const className = `text-${color} w-6 h-6`;
    switch (name) {
        case 'banknote': return <CreditCard className={className} />;
        case 'shield-check': return <ShieldCheck className={className} />;
        case 'settings': return <Settings className={className} />;
        case 'task_alt': return <CheckCircle2 className={className} />;
        case 'description': return <FileText className={className} />;
        default: return <Bell className={className} />;
    }
};

export const NotificationsPage: React.FC<NotificationsProps> = ({ onNavigate }) => {
  const { 
    notifications, 
    markNotificationRead, 
    dismissNotification, 
    clearAllNotifications 
  } = useApp();

  const urgent = notifications.filter(n => n.type === 'urgent');
  const system = notifications.filter(n => n.type === 'system' || n.type === 'update');

  const executeAction = (n: AppNotification) => {
    markNotificationRead(n.id);
    const msg = (n.title + ' ' + n.message).toLowerCase();
    
    if (msg.includes('bill') || msg.includes('obligation') || msg.includes('payment')) {
      onNavigate(Page.HOME);
    } else if (msg.includes('task') || msg.includes('objective')) {
      onNavigate(Page.TASKS);
    } else if (msg.includes('habit') || msg.includes('momentum')) {
      onNavigate(Page.HABITS);
    } else if (msg.includes('vault') || msg.includes('document')) {
      onNavigate(Page.DOCS);
    } else {
      onNavigate(Page.HOME);
    }
  };

  return (
    <div className="space-y-16 pb-40">
      <div className="flex justify-between items-end px-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-primary tracking-[0.5em] mb-4 block">Event Horizon Logger</span>
          <h2 className="text-5xl font-black italic serif text-on-surface leading-none mb-4">System Pulse</h2>
          <p className="text-sm font-medium text-on-surface-variant/40 tracking-wide max-w-md">Cognitive interrupt stream. Actions required to maintain system equilibrium.</p>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={clearAllNotifications}
            className="text-[10px] font-black text-error border border-error/10 hover:bg-error hover:text-white px-6 py-2.5 rounded-full transition-all uppercase tracking-widest"
          >
            Clear Log
          </button>
        )}
      </div>

      {/* Urgent Alerts */}
      <section>
        <div className="flex items-center gap-4 mb-10 px-2">
          {urgent.length > 0 && <div className="w-2.5 h-2.5 rounded-full bg-error animate-ping" />}
          <h3 className="text-[10px] font-black uppercase text-error tracking-[0.5em]">Urgent Interrupts</h3>
        </div>
        <div className="space-y-6">
          {urgent.map(n => (
            <GlassCard 
              key={n.id} 
              onClick={() => markNotificationRead(n.id)}
              className={`p-10 rounded-[2.5rem] group border-white/10 relative overflow-hidden accent-glow ${!n.read ? 'border-l-4 border-l-error' : 'opacity-65'}`}
            >
               <div className="absolute right-6 top-6 p-2 rounded-full hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10" onClick={(e) => {
                 e.stopPropagation();
                 dismissNotification(n.id);
               }}>
                 <X size={16} className="text-on-surface-variant" />
               </div>
               <div className="flex gap-10 items-start">
                  <div className="w-20 h-20 rounded-2xl bg-error/10 flex items-center justify-center flex-shrink-0 border border-error/20">
                    <NotificationIcon name={n.icon} color="error" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                       <h4 className="text-3xl serif italic text-on-surface leading-tight">{n.title}</h4>
                       <span className="text-[10px] font-black text-on-surface-variant/40 tracking-[0.3em]">{n.time}</span>
                    </div>
                    <p className="text-sm font-medium text-on-surface-variant/40 mb-10 leading-relaxed max-w-xl">{n.message}</p>
                    <div className="flex gap-6">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            executeAction(n);
                          }}
                          className="bg-on-surface text-background font-bold text-[10px] uppercase tracking-[0.3em] px-10 py-4 rounded-full active:scale-95 transition-all shadow-2xl hover:bg-primary hover:text-black"
                        >
                          Execute Action
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(n.id);
                          }}
                          className="bg-white/5 border border-white/10 text-on-surface font-bold text-[10px] uppercase tracking-[0.3em] px-10 py-4 rounded-full hover:bg-white/10 active:scale-95 transition-all"
                        >
                          Dismiss
                        </button>
                    </div>
                  </div>
               </div>
            </GlassCard>
          ))}
          {urgent.length === 0 && (
            <div className="text-center py-10 border border-white/5 rounded-3xl bg-white/[0.01] opacity-40 text-xs font-mono">
              NO URGENT COGNITIVE INTERRUPTS REGISTERED
            </div>
          )}
        </div>
      </section>

      {/* System Alerts */}
      <section>
        <div className="flex items-center gap-4 mb-10 px-2">
          <h3 className="text-[10px] font-black uppercase text-primary tracking-[0.5em]">System Archive</h3>
        </div>
        <div className="space-y-6">
          {system.map(n => (
            <GlassCard 
              key={n.id} 
              onClick={() => markNotificationRead(n.id)}
              className={`p-10 rounded-[2.5rem] flex gap-10 items-start transition-all border-white/5 relative group ${!n.read ? 'opacity-100 accent-glow border-primary/20' : 'opacity-40 hover:opacity-75'}`}
            >
                <div className="absolute right-6 top-6 p-2 rounded-full hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  dismissNotification(n.id);
                }}>
                  <X size={16} className="text-on-surface-variant" />
                </div>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 border ${!n.read ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/5 text-on-surface-variant/40'}`}>
                    <NotificationIcon name={n.icon} color={!n.read ? 'primary' : 'on-surface-variant/40'} />
                </div>
                <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                       <h4 className="text-2xl serif italic text-on-surface leading-tight">{n.title}</h4>
                       <span className="text-[10px] font-black text-on-surface-variant/40 tracking-[0.3em]">{n.time}</span>
                    </div>
                    <p className="text-sm font-medium text-on-surface-variant/40 mb-8 leading-relaxed max-w-xl">{n.message}</p>
                    <div className="flex gap-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          executeAction(n);
                        }}
                        className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] flex items-center gap-4 hover:underline"
                      >
                        Navigate Node <ArrowRight size={12} />
                      </button>
                    </div>
                </div>
                {!n.read && <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_#38bdf8] mt-4 animate-pulse" />}
            </GlassCard>
          ))}
          {system.length === 0 && (
            <div className="text-center py-10 border border-white/5 rounded-3xl bg-white/[0.01] opacity-40 text-xs font-mono">
              SYSTEM ARCHIVE LOG IS EMPTY
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
