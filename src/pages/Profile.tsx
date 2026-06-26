import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { User, Shield, Star, Award, Zap, ChevronRight, Settings, LogOut, ArrowLeft, MoreHorizontal, Fingerprint, Edit3, Check, Key, Download, Upload } from 'lucide-react';
import { Page } from '../types';
import { useApp } from '../context/AppContext';

interface ProfileProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfileProps> = ({ onNavigate, onLogout }) => {
  const { 
    operativeName, 
    streakCount, 
    missionsDone, 
    geminiKey, 
    updateProfile,
    exportDatabase
  } = useApp();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(operativeName);
  
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [keyVal, setKeyVal] = useState(geminiKey);

  const handleSaveName = () => {
    updateProfile(nameVal, geminiKey);
    setIsEditingName(false);
  };

  const handleSaveKey = () => {
    updateProfile(operativeName, keyVal);
    setIsEditingKey(false);
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Back button and title */}
      <div className="flex items-center justify-between mb-2">
         <div className="flex items-center gap-6">
            <button 
                onClick={() => onNavigate(Page.HOME)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-primary active:scale-90 transition-all border border-white/5"
            >
              <ArrowLeft size={22} />
            </button>
            <h2 className="text-[32px] font-extrabold tracking-tighter text-primary">Operative Profile</h2>
         </div>
      </div>

      {/* Profile Header */}
      <section className="flex flex-col items-center pt-8">
        <div className="relative mb-8">
          <div className="w-36 h-36 rounded-full bg-surface flex items-center justify-center border-2 border-primary/20 p-2 overflow-hidden glow-primary ring-4 ring-background">
             <img 
               src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop" 
               className="w-full h-full object-cover rounded-full"
               alt="Operator Profile"
             />
          </div>
          <div className="absolute bottom-2 right-2 w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center shadow-lg transform rotate-3 border-2 border-background">
            <Zap size={20} fill="currentColor" />
          </div>
        </div>
        
        <div className="text-center mb-10 w-full max-w-sm">
          {isEditingName ? (
            <div className="flex gap-2 justify-center items-center">
              <input 
                type="text" 
                className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-center text-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                value={nameVal}
                onChange={(e) => setNameVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              />
              <button 
                onClick={handleSaveName}
                className="p-3 bg-primary text-black rounded-xl hover:scale-105 transition-all"
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div className="flex gap-3 justify-center items-center">
              <h1 className="text-[32px] font-extrabold tracking-tight text-on-surface">Major {operativeName}</h1>
              <button 
                onClick={() => setIsEditingName(true)}
                className="text-on-surface-variant hover:text-primary transition-colors"
                title="Edit Name"
              >
                <Edit3 size={16} />
              </button>
            </div>
          )}
          <p className="font-mono text-[11px] font-black uppercase text-on-surface-variant/40 tracking-[0.4em] mt-2">System Administrator • Level 42</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
           <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/5">
              <p className="font-mono text-[24px] font-black text-secondary leading-none">{missionsDone}</p>
              <p className="font-mono text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest mt-2">MISSIONS DONE</p>
           </div>
           <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/5">
              <p className="font-mono text-[24px] font-black text-primary leading-none">{streakCount}d</p>
              <p className="font-mono text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest mt-2">ACTIVE STREAK</p>
           </div>
        </div>
      </section>

      {/* AI Key Configuration Card */}
      <section className="space-y-4">
        <h3 className="font-mono text-[11px] font-black uppercase text-on-surface-variant/40 tracking-[0.3em] ml-2">Synaptic Key Matrix</h3>
        <GlassCard className="p-8 border-white/5">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                <Key size={28} />
              </div>
              <div className="flex-1">
                <h4 className="text-[20px] font-bold tracking-tight text-on-surface">Gemini API Connection</h4>
                <p className="text-[14px] text-on-surface-variant opacity-60 font-medium">Powering Neural Advisor and Vault decryption filters</p>
              </div>
            </div>

            {isEditingKey ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="password" 
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Paste Gemini API Key..."
                  value={keyVal}
                  onChange={(e) => setKeyVal(e.target.value)}
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleSaveKey}
                    className="px-6 py-4 bg-primary text-black font-bold uppercase tracking-wider text-[10px] rounded-2xl hover:scale-105 transition-all flex items-center gap-2 shrink-0"
                  >
                    <Check size={14} /> Save
                  </button>
                  <button 
                    onClick={() => {
                      setKeyVal(geminiKey);
                      setIsEditingKey(false);
                    }}
                    className="px-6 py-4 bg-white/5 border border-white/10 text-on-surface font-bold uppercase tracking-wider text-[10px] rounded-2xl hover:bg-white/10 transition-all shrink-0"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <div className="font-mono text-xs opacity-65 tracking-wider truncate max-w-[200px] sm:max-w-xs">
                  {geminiKey ? '••••••••••••••••' + geminiKey.slice(-6) : 'KEY NOT REGISTERED'}
                </div>
                <button 
                  onClick={() => setIsEditingKey(true)}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-primary font-bold uppercase tracking-wider text-[9px] rounded-xl hover:bg-primary hover:text-black hover:border-primary transition-all"
                >
                  Configure
                </button>
              </div>
            )}
          </div>
        </GlassCard>
      </section>

      {/* Account Settings List */}
      <section className="space-y-4">
        <h3 className="font-mono text-[11px] font-black uppercase text-on-surface-variant/40 tracking-[0.3em] ml-2">System Config</h3>
        <div className="grid gap-3">
          <AccountItem 
            icon={Shield} 
            title="Privacy & Security" 
            desc="Manage encrypted vault settings" 
            color="primary"
          />
          <AccountItem 
            icon={Fingerprint} 
            title="Biometric Setup" 
            desc="Face ID & Fingerprint authorization" 
            color="secondary"
          />
          <AccountItem 
            icon={Award} 
            title="Achievements" 
            desc="You have 3 unclaimed milestones" 
            color="tertiary"
          />
          <AccountItem 
            icon={Settings} 
            title="Application Settings" 
            desc="Control UX and performance clusters" 
            color="outline"
          />
        </div>
      </section>

      {/* Database Maintenance */}
      <section className="space-y-4">
        <h3 className="font-mono text-[11px] font-black uppercase text-on-surface-variant/40 tracking-[0.3em] ml-2">Database Command</h3>
        <GlassCard className="p-8 border-white/5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="text-[20px] font-bold tracking-tight text-on-surface">Offline Backup File</h4>
              <p className="text-[14px] text-on-surface-variant opacity-60 font-medium">Export or restore your active data metrics</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={exportDatabase}
                className="flex-1 sm:flex-initial px-6 py-3 bg-white/5 border border-white/10 text-primary font-bold uppercase tracking-wider text-[9px] rounded-xl hover:bg-primary hover:text-black hover:border-primary transition-all flex items-center justify-center gap-1.5"
              >
                <Download size={12} /> Export
              </button>
              <button 
                onClick={() => onNavigate(Page.SYNCED)}
                className="flex-1 sm:flex-initial px-6 py-3 bg-white/5 border border-white/10 text-primary font-bold uppercase tracking-wider text-[9px] rounded-xl hover:bg-primary hover:text-black hover:border-primary transition-all flex items-center justify-center gap-1.5"
              >
                <Upload size={12} /> Restore
              </button>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4">
        <h3 className="font-mono text-[11px] font-black uppercase text-on-surface-variant/40 tracking-[0.3em] ml-2">Session Control</h3>
        <div className="grid gap-3">
          <button 
             onClick={onLogout}
             className="w-full flex items-center justify-between p-8 rounded-3xl bg-error/[0.03] border border-error/10 hover:bg-error/10 transition-all group active:scale-[0.99]"
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center text-error border border-error/20">
                <LogOut size={28} />
              </div>
              <div className="text-left">
                <h4 className="text-[20px] font-bold tracking-tight text-error mb-1">Terminate Session</h4>
                <p className="text-[14px] text-error opacity-60 font-medium">Log out of the command center</p>
              </div>
            </div>
            <ChevronRight size={24} className="text-error opacity-40 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      <div className="text-center py-8 opacity-20">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.5em]">Life Command Center v4.2.0 • Build-6819</p>
      </div>
    </div>
  );
};

const AccountItem = ({ icon: Icon, title, desc, color }: any) => {
  return (
    <GlassCard className="p-8 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group border-white/5">
      <div className="flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
            color === 'primary' ? 'bg-primary/10 border-primary/20 text-primary' : 
            color === 'secondary' ? 'bg-secondary/10 border-secondary/20 text-secondary' : 
            color === 'tertiary' ? 'bg-tertiary/10 border-tertiary/20 text-tertiary' :
            'bg-white/5 border-white/5 text-outline'
        }`}>
          <Icon size={28} />
        </div>
        <div>
          <h4 className="text-[20px] font-bold tracking-tight text-on-surface mb-1">{title}</h4>
          <p className="text-[14px] text-on-surface-variant opacity-60 font-medium">{desc}</p>
        </div>
      </div>
      <ChevronRight size={24} className="text-outline-variant opacity-40 group-hover:translate-x-2 transition-transform" />
    </GlassCard>
  );
};
