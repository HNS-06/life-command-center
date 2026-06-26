import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  Search as SearchIcon, 
  Mic, 
  ArrowLeft, 
  User, 
  Bolt, 
  FileText, 
  Activity, 
  CreditCard, 
  ListTodo, 
  ChevronRight, 
  Sparkles, 
  X,
  Zap
} from 'lucide-react';
import { Page } from '../types';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

interface SearchPageProps {
  onNavigate: (page: Page) => void;
}

interface SearchResult {
  id: string;
  type: 'Task' | 'Bill' | 'Habit' | 'Doc';
  title: string;
  desc: string;
  time: string;
  icon: any;
  targetPage: Page;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onNavigate }) => {
  const { tasks, bills, habits, docs, queryAICore, isLoadingAI } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  
  // AI Synthesis Panel
  const [isAISynthesisOpen, setIsAISynthesisOpen] = useState(false);
  const [aiReply, setAiReply] = useState('');

  const handleAISynthesis = async () => {
    if (!searchQuery.trim()) return;
    setIsAISynthesisOpen(true);
    setAiReply('Synthesizing metrics and database indices across all secure channels...');
    
    try {
      const reply = await queryAICore(searchQuery);
      setAiReply(reply);
    } catch (err: any) {
      setAiReply(`Tactical network error: ${err.message}`);
    }
  };

  // Compile all search items
  const allItems: SearchResult[] = [
    ...tasks.map(t => ({
      id: t.id,
      type: 'Task' as const,
      title: t.title,
      desc: `${t.category} • Energy: ${t.energy} • Completion: ${t.completion}%`,
      time: t.dueDate ? `Due ${t.dueDate}` : 'No date',
      icon: ListTodo,
      targetPage: Page.TASKS
    })),
    ...bills.map(b => ({
      id: b.id,
      type: 'Bill' as const,
      title: b.name,
      desc: `${b.category} • description: ${b.description} • status: ${b.status}`,
      time: `$${b.amount.toFixed(2)}`,
      icon: CreditCard,
      targetPage: Page.HOME
    })),
    ...habits.map(h => ({
      id: h.id,
      type: 'Habit' as const,
      title: h.name,
      desc: `${h.description} • Streak: ${h.streak}d`,
      time: `${h.current}/${h.goal} ${h.unit}`,
      icon: Zap,
      targetPage: Page.HABITS
    })),
    ...docs.map(d => ({
      id: d.id,
      type: 'Doc' as const,
      title: d.name,
      desc: `${d.category} • Status: ${d.status}`,
      time: d.updatedAt,
      icon: FileText,
      targetPage: d.targetPage || Page.DOCS
    }))
  ];

  // Filter search items
  const filteredResults = allItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTag === 'All') return matchesSearch;
    return matchesSearch && item.type.toLowerCase() === activeTag.slice(0, -1).toLowerCase(); // 'Bills' -> 'bill'
  });

  return (
    <div className="space-y-12 pb-40">
      <div className="flex items-center gap-8 px-2">
        <button 
           onClick={() => onNavigate(Page.HOME)}
           className="w-12 h-12 flex items-center justify-center rounded-full bg-white/[0.03] text-primary border border-white/10 hover:bg-primary hover:text-black transition-all"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-primary tracking-[0.5em] mb-2">Omnipresent Filter</span>
          <h2 className="text-4xl font-black italic serif text-on-surface leading-none">Global Search</h2>
        </div>
      </div>

      {/* Query Bar */}
      <section>
        <div className="glass-card rounded-[2.5rem] flex items-center px-10 py-8 transition-all duration-500 accent-glow border-white/20">
          <SearchIcon className="text-on-surface-variant/40 w-6 h-6 mr-6" />
          <input 
            autoFocus 
            type="text" 
            placeholder="Query your lifespan..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 w-full text-on-surface serif italic text-3xl placeholder:opacity-20 translate-y-0.5"
          />
          {searchQuery.trim().length > 0 && (
            <button 
              onClick={handleAISynthesis}
              className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-md ml-4"
              title="Query AI Core"
            >
              <Sparkles size={14} />
              AI Core
            </button>
          )}
        </div>
      </section>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-4 px-2">
        {['All', 'Bills', 'Tasks', 'Docs', 'Habits'].map(tag => (
          <button 
            key={tag} 
            onClick={() => setActiveTag(tag)}
            className={`px-10 py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] transition-all border ${
              activeTag === tag 
                ? 'bg-on-surface text-background border-on-surface shadow-2xl' 
                : 'bg-white/[0.03] text-on-surface-variant border-white/5 hover:border-white/20'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Suggested Section */}
        <div className="md:col-span-4 space-y-8">
          <div className="flex items-center gap-2 text-on-surface/40 font-black uppercase tracking-[0.4em] text-[10px] mb-2 px-2">
            <div className="w-1.5 h-1.5 rounded-full bg-on-surface/20" />
            Suggested Vectors
          </div>
          <GlassCard className="p-10 space-y-12 rounded-[2.5rem] border-white/10 accent-glow">
            {bills.filter(b => b.status === 'urgent').map(b => (
              <div 
                key={b.id} 
                onClick={() => onNavigate(Page.HOME)}
                className="flex items-center gap-8 group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center text-on-surface border border-white/10 group-hover:bg-primary group-hover:text-black transition-all">
                  <CreditCard size={24} />
                </div>
                <div className="flex flex-col">
                  <p className="text-xl serif italic text-on-surface">{b.name}</p>
                  <p className="text-[10px] font-black uppercase text-error tracking-widest mt-1">Status: Urgent</p>
                </div>
              </div>
            ))}
            {tasks.filter(t => t.priority === 'critical' && t.completion < 100).map(t => (
              <div 
                key={t.id} 
                onClick={() => onNavigate(Page.TASKS)}
                className="flex items-center gap-8 group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center text-on-surface border border-white/10 group-hover:bg-primary group-hover:text-black transition-all">
                  <ListTodo size={24} />
                </div>
                <div className="flex flex-col">
                  <p className="text-xl serif italic text-on-surface truncate max-w-[120px]">{t.title}</p>
                  <p className="text-[10px] font-black uppercase text-primary tracking-widest mt-1">Strategic Path</p>
                </div>
              </div>
            ))}
            {bills.filter(b => b.status === 'urgent').length === 0 && tasks.filter(t => t.priority === 'critical' && t.completion < 100).length === 0 && (
              <div className="text-center opacity-40 font-mono text-xs">No threats detected</div>
            )}
          </GlassCard>
        </div>

        {/* Results list */}
        <div className="md:col-span-8 space-y-8">
          <div className="flex items-center gap-2 text-on-surface/40 font-black uppercase tracking-[0.4em] text-[10px] mb-2 px-2">
            <div className="w-1.5 h-1.5 rounded-full bg-on-surface/20" />
            Query Matches ({filteredResults.length})
          </div>
          <div className="grid gap-6">
             {filteredResults.map(item => (
               <ResultItem 
                 key={`${item.type}-${item.id}`}
                 icon={item.icon} 
                 type={item.type} 
                 title={item.title} 
                 desc={item.desc} 
                 time={item.time} 
                 onClick={() => onNavigate(item.targetPage)}
               />
             ))}
             {filteredResults.length === 0 && (
               <div className="text-center py-16 bg-white/[0.01] border border-white/5 rounded-[2.5rem] opacity-50">
                 <p className="font-mono text-xs text-on-surface-variant">NO MATRIX MATCHES FOUND</p>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* AI Search Synthesis Modal */}
      <AnimatePresence>
        {isAISynthesisOpen && (
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
                  onClick={() => setIsAISynthesisOpen(false)}
                  className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-8">
                <span className="text-[10px] font-black uppercase text-primary tracking-[0.5em] mb-4 block">AI Core Tactical Synthesis</span>
                <h3 className="text-2xl serif italic text-on-surface leading-tight">Query: "{searchQuery}"</h3>
              </div>

              <div className="prose prose-invert max-w-none text-on-surface-variant font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-[45vh] overflow-y-auto pr-2 no-scrollbar border border-white/5 p-6 rounded-2xl bg-white/[0.01]">
                {aiReply}
              </div>
              
              <button 
                onClick={() => setIsAISynthesisOpen(false)}
                className="w-full py-6 bg-primary text-black rounded-full font-bold uppercase tracking-[0.3em] text-[12px] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-8"
              >
                End Session
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResultItem = ({ icon: Icon, type, title, desc, time, onClick }: any) => {
  return (
    <GlassCard 
      onClick={onClick}
      className={`p-10 rounded-[2.5rem] flex items-center justify-between hover:border-primary/20 transition-all cursor-pointer group border border-white/5`}
    >
      <div className="flex items-center gap-10">
        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 group-hover:bg-primary group-hover:text-black transition-all`}>
          <Icon size={24} />
        </div>
        <div>
          <div className="flex flex-col mb-1">
            <span className={`text-[9px] font-black uppercase text-primary tracking-[0.4em] mb-1`}>{type}</span>
            <h3 className="text-2xl serif italic text-on-surface leading-tight">{title}</h3>
          </div>
          <p className="text-sm font-medium text-on-surface-variant/40 tracking-wide truncate max-w-[200px] sm:max-w-xs">{desc}</p>
        </div>
      </div>
      <div className="text-on-surface-variant/40 font-bold text-[10px] tracking-[0.3em] uppercase hidden sm:block">
        {time}
      </div>
    </GlassCard>
  );
};
